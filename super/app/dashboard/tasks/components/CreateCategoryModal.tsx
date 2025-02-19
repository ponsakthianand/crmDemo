"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Department } from "@/app/api/tasks/departments/route"

interface User {
  _id: string
  name: string
  email: string
}

interface CreateCategoryModalProps {
  onCategoryCreated: () => void
  departments: Department[]
  users?: User[]
  token?: string
}

export default function CreateCategoryModal({
  onCategoryCreated,
  departments,
  users,
  token
}: CreateCategoryModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newCategory, setNewCategory] = useState({
    name: "",
    departmentId: "",
    owner: "",
    assignee: "",
    description: "",
    color: "#000000",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const { toast } = useToast()

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsOpen(false)
      setFormErrors({})
    }
  }

  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errors: { [key: string]: string } = {}

    if (!newCategory.name.trim()) {
      errors.name = "Name is required"
    }
    if (!newCategory.departmentId) {
      errors.departmentId = "Department is required"
    }
    // if (!newCategory.owner) {
    //   errors.owner = "Owner is required"
    // }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/tasks/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${token}`,
        },
        body: JSON.stringify(newCategory),
      })

      if (!response.ok) {
        throw new Error("Failed to add category")
      }

      setNewCategory({
        name: "",
        departmentId: "",
        owner: "",
        assignee: "",
        description: "",
        color: "#000000",
      })
      setIsOpen(false)
      onCategoryCreated()
      toast({
        title: "Category added successfully",
        description: "Your new category has been created.",
      })
    } catch (error) {
      console.error("Error adding category:", error)
      toast({
        title: "Error",
        description: "Failed to add category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)} variant="default">
          Create New Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              placeholder="New category name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={newCategory.departmentId}
              onValueChange={(value) => setNewCategory({ ...newCategory, departmentId: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((department) => (
                  <SelectItem key={department._id} value={department._id}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* {setFormErrors["departmentId"] && <FormMessage>{setFormErrors["departmentId"]}</FormMessage>} */}
          </div>
          <div className="space-y-2">
            <Label htmlFor="owner">Owner</Label>
            <Select
              value={newCategory.owner}
              onValueChange={(value) => setNewCategory({ ...newCategory, owner: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select owner" />
              </SelectTrigger>
              <SelectContent>
                {users?.map((user) => (
                  <SelectItem key={user._id} value={user._id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignee">Assignee</Label>
            <Select
              value={newCategory.assignee}
              onValueChange={(value) => setNewCategory({ ...newCategory, assignee: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {users?.map((user) => (
                  <SelectItem key={user._id} value={user._id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              placeholder="Category description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="color"
                type="color"
                value={newCategory.color}
                onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                className="w-12 h-12 p-1"
              />
              <Input
                type="text"
                value={newCategory.color}
                onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                placeholder="#000000"
                className="flex-grow"
              />
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Adding..." : "Add Category"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

