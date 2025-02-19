"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import CreateCategoryModal from "./CreateCategoryModal"
import EditCategoryModal from "./EditCategoryModal"
import DeleteConfirmationDialog from "./DeleteConfirmationDialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Category } from "@/app/api/tasks/categories/route"
import type { Department } from "@/app/api/tasks/departments/route"
import { useSession } from "next-auth/react"
import { useAppSelector } from "@/app/store/hooks"
import { useRouter } from "next/navigation"
import { dateToLocalTimeDateYear } from "@/global"
import Avatar from "@/components/avatar-initials"

interface User {
  _id: string
  name: string
  email: string
}

export default function CategoryList() {
  const { data: session, status } = useSession()
  const accessToken = useAppSelector((state) => state.authToken) as { access_token: string } | null;
  const [categories, setCategories] = useState<Category[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/tasks/categories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`
        }
      })
      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again later.",
        variant: "destructive",
      })
    }
  }

  const fetchDepartments = async () => {
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

  useEffect(() => {
    if (!accessToken?.access_token) return
    const fetchData = async () => {
      setIsLoading(true)
      await Promise.all([fetchCategories(), fetchDepartments(), fetchUsers()])
      setIsLoading(false)
    }
    fetchData()
  }, [accessToken]) // Added empty dependency array to fix the useEffect hook

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setIsEditModalOpen(true)
  }

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return

    try {
      const response = await fetch("/api/tasks/categories", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`
        },
        body: JSON.stringify({ id: categoryToDelete._id }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete category")
      }

      fetchCategories()
      toast({
        title: "Category deleted",
        description: "The category has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setCategoryToDelete(null)
    }
  }

  const getUserName = (userId: string) => {
    const user = users.find((u) => u._id === userId)
    return user ? user.name : "Unknown User"
  }

  const getUserID = (userId: string) => {
    const user = users.find((u) => u._id === userId)
    return user ? user._id : "Unknown User"
  }

  const getDepartmentName = (departmentId: string) => {
    const department = departments.find((d) => d._id === departmentId)
    return department ? department.name : "Unknown Department"
  }

  const filteredCategories = selectedDepartment
    ? categories.filter((category) => category.departmentId === selectedDepartment)
    : categories

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row items-center sm:justify-between mb-5">
        <div className="flex items-center justify-between space-x-3">
          <h1 className="text-2xl font-bold">Categories</h1>
          <Select
            value={selectedDepartment || "all"}
            onValueChange={(value) => setSelectedDepartment(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((department) => (
                <SelectItem key={department._id} value={department._id}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <CreateCategoryModal users={users} onCategoryCreated={fetchCategories} departments={departments} token={accessToken?.access_token || ""} />
        </div>
        <Button variant="ghost" onClick={() => router.push('/dashboard/tasks')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tasks
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCategories.map((category) => (
          <div key={category._id} className={`max-w-xs flex flex-col bg-white border border-t-4 border-t-[${category.color}] shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:border-t-blue-500 dark:shadow-neutral-700/70 relative`}>
            <div className="p-4 md:p-5">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                {category.name}
              </h3>
              {category.description && <p className="mt-2 text-gray-500 dark:text-neutral-400 pt-3">{category.description}</p>}
              <div className="">
                {getDepartmentName(category.departmentId)}
              </div>

              {category.assignee && (
                <div className="shrink-0 group block mt-3">
                  <div className="flex items-center">
                    <Avatar name={getUserName(category.assignee as string)} userId={getUserID(category.assignee as string)} className="!w-8 !h-8" />
                    <div className="ms-3">
                      <h3 className="font-semibold text-sm text-gray-800 dark:text-white">{getUserName(category.assignee as string)}</h3>
                      <p className="text-sm font-medium text-gray-400 dark:text-neutral-500">Assignee</p>
                    </div>
                  </div>
                </div>
              )}

              {category.owner && (<div className="shrink-0 group block mt-3">
                <div className="flex items-center">
                  <Avatar name={getUserName(category.owner as string)} userId={getUserName(category.owner as string)} className="!w-8 !h-8" />
                  <div className="ms-3">
                    <h3 className="font-semibold text-sm text-gray-800 dark:text-white">{getUserName(category.owner as string)}</h3>
                    <p className="text-sm font-medium text-gray-400 dark:text-neutral-500">Owner</p>
                  </div>
                </div>
              </div>)}

              <p className="text-xs text-gray-500 dark:text-neutral-500 pt-3">
                {dateToLocalTimeDateYear(category.createdAt.toString())}
              </p>
              <div className="flex absolute top-2 right-2">
                <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onCategoryUpdated={fetchCategories}
          departments={departments}
          token={accessToken?.access_token || ""}
          users={users}
        />
      )}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteCategory}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
      />
    </div>
  )
}

