"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Plus, Pencil, Trash2, ArrowBigLeftDash } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Category } from "@/types/question"
import PageContainer from "@/components/layout/page-container"
import { useSession } from "next-auth/react"
import { useAppSelector } from "@/app/store/hooks"

export default function CategoryManagement() {
  const { data: session, status } = useSession()
  const accessToken = useAppSelector((state) => state.authToken);
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    accessToken?.access_token?.length && fetchCategories()
  }, [accessToken])

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/questions/categories",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${accessToken?.access_token}`
          }
        })
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      } else {
        console.error("Failed to fetch categories")
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/questions/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`
        },
        body: JSON.stringify({ name: newCategoryName }),
      })
      if (response.ok) {
        await fetchCategories()
        setNewCategoryName("")
      } else {
        console.error("Failed to create category")
      }
    } catch (error) {
      console.error("Error creating category:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory) return
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/questions/categories/${editingCategory.vagaiId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`
        },
        body: JSON.stringify({ name: editingCategory.name }),
      })
      if (response.ok) {
        await fetchCategories()
        setEditingCategory(null)
      } else {
        console.error("Failed to edit category")
      }
    } catch (error) {
      console.error("Error editing category:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/questions/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`
        },
      })
      if (response.ok) {
        await fetchCategories()
      } else {
        console.error("Failed to delete category")
      }
    } catch (error) {
      console.error("Error deleting category:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <PageContainer scrollable={true}>
      <div className="h-full px-8 flex-1 flex-col md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => router.push("/dashboard/questions")} className="mr-2">
              <ArrowBigLeftDash />
            </Button>
            <h2 className="text-2xl font-bold tracking-tight">Category Management</h2>
          </div>
          <div className='flex items-center justify-between'>
            <form onSubmit={handleCreateCategory} className="flex items-center space-x-2 mb-4">
              <Input
                type="text"
                placeholder="New category name"
                value={newCategoryName} className="w-80"
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
              />
              <Button type="submit" disabled={isSubmitting} className="w-[180px]">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Category
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        <div>
          <Table className="w-full border rounded">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="w-full">Category Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category._id as string}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setEditingCategory(category)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                            <DialogDescription>Edit the category name below.</DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleEditCategory}>
                            <Input
                              type="text"
                              value={editingCategory?.name || ""}
                              onChange={(e) =>
                                setEditingCategory(
                                  editingCategory ? { ...editingCategory, name: e.target.value } : null,
                                )
                              }
                              className="my-4"
                              required
                            />
                            <DialogFooter>
                              <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : "Save Changes"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the category.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteCategory(category.vagaiId as string)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

      </div>
    </PageContainer>
  )
}

