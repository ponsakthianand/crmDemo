"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DeleteConfirmationDialog from "./DeleteConfirmationDialog"
import { Badge } from "@/components/ui/badge"
import { FormMessage } from "@/components/ui/form"
import { useSession } from "next-auth/react"
import { useAppSelector } from "@/app/store/hooks"
import { useRouter } from "next/navigation"
import { dateToLocalTimeDateYear } from "@/global"

interface Department {
  _id: string
  name: string
  description?: string
  owner: string
  assignee?: string
  color?: string
  createdAt: Date
  updatedAt: Date
}

interface User {
  _id: string
  name: string
  email: string
}

export default function DepartmentList() {
  const { data: session, status } = useSession()
  const accessToken = useAppSelector((state) => state.authToken);
  const [departments, setDepartments] = useState<Department[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newDepartment, setNewDepartment] = useState<Partial<Department>>({
    name: "",
    description: "",
    color: "#000000",
  })
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null)
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!accessToken?.access_token) return
    fetchDepartments()
    fetchUsers()
  }, [accessToken])

  useEffect(() => {
    setFormErrors({})
  }, [])

  const fetchDepartments = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/tasks/departments", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`
        }
      })
      if (!response.ok) {
        throw new Error("Failed to fetch departments")
      }
      const data = await response.json()
      setDepartments(data)
    } catch (error) {
      console.error("Error fetching departments:", error)
      toast({
        title: "Error",
        description: "Failed to load departments. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`
        }
      })
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to load users. Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleAddDepartment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errors: { [key: string]: string } = {}

    if (!newDepartment.name) {
      errors.name = "Name is required"
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      const response = await fetch("/api/tasks/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`,
        },
        body: JSON.stringify(newDepartment),
      })

      if (!response.ok) {
        throw new Error("Failed to add department")
      }

      setNewDepartment({ name: "", description: "", color: "#000000" })
      setIsAddDialogOpen(false)
      setFormErrors({})
      fetchDepartments()
      toast({
        title: "Department added",
        description: "The department has been successfully added.",
      })
    } catch (error) {
      console.error("Error adding department:", error)
      toast({
        title: "Error",
        description: "Failed to add department. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditDepartment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingDepartment) return

    const errors: { [key: string]: string } = {}

    if (!editingDepartment.name) {
      errors.name = "Name is required"
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      const response = await fetch("/api/tasks/departments", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`,
        },
        body: JSON.stringify(editingDepartment),
      })

      if (!response.ok) {
        throw new Error("Failed to update department")
      }

      setIsEditDialogOpen(false)
      setFormErrors({})
      fetchDepartments()
      toast({
        title: "Department updated",
        description: "The department has been successfully updated.",
      })
    } catch (error) {
      console.error("Error updating department:", error)
      toast({
        title: "Error",
        description: "Failed to update department. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteDepartment = async () => {
    if (!departmentToDelete) return

    try {
      const response = await fetch("/api/tasks/departments", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`,
        },
        body: JSON.stringify({ id: departmentToDelete._id }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete department")
      }

      setIsDeleteDialogOpen(false)
      fetchDepartments()
      toast({
        title: "Department deleted",
        description: "The department has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting department:", error)
      toast({
        title: "Error",
        description: "Failed to delete department. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getUserName = (userId: string) => {
    const user = users.find((u) => u._id === userId)
    return user ? user.name : "Unknown User"
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row items-center sm:justify-between mb-5">
        <div className="flex items-center justify-between space-x-3">
          <h1 className="text-2xl font-bold">Departments</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Department</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Department</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddDepartment} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newDepartment.name}
                    onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                    required
                  />
                  {formErrors.name && <FormMessage>{formErrors.name}</FormMessage>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newDepartment.description}
                    onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="owner">Owner</Label>
                  <Select
                    value={newDepartment.owner}
                    onValueChange={(value) => setNewDepartment({ ...newDepartment, owner: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select owner" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.owner && <FormMessage>{formErrors.owner}</FormMessage>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Select
                    value={newDepartment.assignee}
                    onValueChange={(value) => setNewDepartment({ ...newDepartment, assignee: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="color"
                      type="color"
                      value={newDepartment.color}
                      onChange={(e) => setNewDepartment({ ...newDepartment, color: e.target.value })}
                      className="w-12 h-12 p-1"
                    />
                    <Input
                      type="text"
                      value={newDepartment.color}
                      onChange={(e) => setNewDepartment({ ...newDepartment, color: e.target.value })}
                      placeholder="#000000"
                      className="flex-grow"
                    />
                  </div>
                </div>
                <Button type="submit">Add Department</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <Button variant="ghost" onClick={() => router.push('/dashboard/tasks')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tasks
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {departments.map((department) => (
          <div key={department._id} className={`max-w-xs flex flex-col bg-white border border-t-4 shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:border-t-blue-500 dark:shadow-neutral-700/70 relative`} style={{ borderTopColor: department.color }}>
            <div className="p-4 md:p-5">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                {department.name}
              </h3>
              {department.description && <p className="mt-2 text-gray-500 dark:text-neutral-400 pt-3">{department.description}</p>}

              <p className="text-xs text-gray-500 dark:text-neutral-500 pt-3">
                {dateToLocalTimeDateYear(department.createdAt.toString())}
              </p>
              <div className="flex absolute top-2 right-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditingDepartment(department)
                    setIsEditDialogOpen(true)
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setDepartmentToDelete(department)
                    setIsDeleteDialogOpen(true)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditDepartment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editingDepartment?.name || ""}
                onChange={(e) => setEditingDepartment({ ...editingDepartment!, name: e.target.value })}
                required
              />
              {formErrors.name && <FormMessage>{formErrors.name}</FormMessage>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editingDepartment?.description || ""}
                onChange={(e) => setEditingDepartment({ ...editingDepartment!, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-owner">Owner</Label>
              <Select
                value={editingDepartment?.owner || ""}
                onValueChange={(value) => setEditingDepartment({ ...editingDepartment!, owner: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.owner && <FormMessage>{formErrors.owner}</FormMessage>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-assignee">Assignee</Label>
              <Select
                value={editingDepartment?.assignee || ""}
                onValueChange={(value) => setEditingDepartment({ ...editingDepartment!, assignee: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-color">Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="edit-color"
                  type="color"
                  value={editingDepartment?.color || "#000000"}
                  onChange={(e) => setEditingDepartment({ ...editingDepartment!, color: e.target.value })}
                  className="w-12 h-12 p-1"
                />
                <Input
                  type="text"
                  value={editingDepartment?.color || "#000000"}
                  onChange={(e) => setEditingDepartment({ ...editingDepartment!, color: e.target.value })}
                  placeholder="#000000"
                  className="flex-grow"
                />
              </div>
            </div>
            <Button type="submit">Update Department</Button>
          </form>
        </DialogContent>
      </Dialog>
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteDepartment}
        title="Delete Department"
        description="Are you sure you want to delete this department? This action cannot be undone."
      />
    </div>
  )
}

