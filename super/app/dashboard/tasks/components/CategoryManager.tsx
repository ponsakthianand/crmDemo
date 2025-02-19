"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import CreateCategoryModal from "./CreateCategoryModal"
import type { Category } from "@/app/api/tasks/categories/route"
import type { Department } from "@/app/api/tasks/departments/route"
import { useSession } from "next-auth/react"
import { useAppSelector } from "@/app/store/hooks"

interface User {
  _id: string
  name: string
  email: string
}

export default function CategoryManager() {
  const { data: session, status } = useSession()
  const accessToken = useAppSelector((state) => state.authToken);
  const [categories, setCategories] = useState<Category[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [users, setUsers] = useState<User[]>([])
  const { toast } = useToast()

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
      const response = await fetch("/api/users")
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
    fetchCategories()
    fetchDepartments()
    fetchUsers()
  }, [accessToken])

  return <CreateCategoryModal
    onCategoryCreated={fetchCategories}
    departments={departments}
    users={users}
  />
}

