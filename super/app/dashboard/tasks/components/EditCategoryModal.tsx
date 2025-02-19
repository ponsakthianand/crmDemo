"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Category } from "@/app/api/tasks/categories/route"
import type { Department } from "@/app/api/tasks/departments/route"

interface User {
  _id: string
  name: string
  email: string
}

interface EditCategoryModalProps {
  category: Category
  isOpen: boolean
  onClose: () => void
  onCategoryUpdated: () => void
  departments: Department[]
  users?: User[]
  setFormErrors?: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
  token?: string
}

export default function EditCategoryModal({
  category,
  isOpen,
  onClose,
  onCategoryUpdated,
  departments,
  users,
  setFormErrors,
  token
}: EditCategoryModalProps) {
  const [name, setName] = useState(category.name)
  const [departmentId, setDepartmentId] = useState(category.departmentId)
  const [owner, setOwner] = useState(category.owner)
  const [assignee, setAssignee] = useState(category.assignee || "")
  const [description, setDescription] = useState(category.description || "")
  const [color, setColor] = useState(category.color || "#000000")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setName(category.name)
    setDepartmentId(category.departmentId)
    setOwner(category.owner)
    setAssignee(category.assignee || "")
    setDescription(category.description || "")
    setColor(category.color || "#000000")
  }, [category])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errors: { [key: string]: string } = {}

    if (!name.trim()) {
      errors.name = "Name is required"
    }
    if (!departmentId) {
      errors.departmentId = "Department is required"
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors && setFormErrors(errors)
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/tasks/categories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: category._id,
          name,
          departmentId,
          owner,
          assignee: assignee || undefined,
          description: description || undefined,
          color: color || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update category")
      }

      onCategoryUpdated()
      onClose()
      toast({
        title: "Category updated successfully",
        description: "Your category has been updated.",
      })
    } catch (error) {
      console.error("Error updating category:", error)
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select value={departmentId} onValueChange={setDepartmentId} required>
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
          </div>
          <div className="space-y-2">
            <Label htmlFor="owner">Owner</Label>
            <Select value={owner} onValueChange={setOwner}>
              <SelectTrigger>
                <SelectValue placeholder="Select owner" />
              </SelectTrigger>
              <SelectContent>
                {users && users.map((user) => (
                  <SelectItem key={user._id} value={user._id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignee">Assignee</Label>
            <Select value={assignee} onValueChange={setAssignee}>
              <SelectTrigger>
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {users && users.map((user) => (
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Category description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-12 p-1"
              />
              <Input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#000000"
                className="flex-grow"
              />
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Updating..." : "Update Category"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

