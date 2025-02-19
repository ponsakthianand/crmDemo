"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import TaskItem from "./TaskItem"
import { Loader2, MoreHorizontal } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Priority, TaskStatus } from "@/app/api/tasks/route"
import { useSession } from "next-auth/react"
import { useAppDispatch, useAppSelector } from "@/app/store/hooks"
import PageContainer from "@/components/layout/page-container"
import CreateTaskModal from "./CreateTaskModal"
import { Assignee, Category, Department, User } from "./AddTaskForm"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/registry/new-york/ui/dropdown-menu"
import { Button } from "@/registry/new-york/ui/button"
import { useRouter } from "next/navigation"

type Task = {
  _id: string
  title: string
  description?: string
  completed: boolean
  category: string
  priority: Priority
  status: TaskStatus
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
  assignee?: string
  reporter?: string
  estimatedTime?: string
  tags?: string[]
  department: string
}

export default function TaskList() {
  const { data: session, status } = useSession()
  const dispatch = useAppDispatch()
  const profileData = useAppSelector((state) => state.profileData);
  const currentUser = profileData?.data;
  const accessToken = useAppSelector((state) => state.authToken) as { access_token: string } | null;
  const [tasks, setTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [assignee, setAssignee] = useState<Assignee[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [assigneeFilter, setAssigneeFilter] = useState(currentUser ? currentUser._id : "all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all")
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all")
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const route = useRouter()

  const [taskListKey, setTaskListKey] = useState(0)
  const [categoryManagerKey, setCategoryManagerKey] = useState(0)
  const [users, setUsers] = useState<User[]>([])

  const handleDataUpdated = () => {
    // Force a re-render of the TaskList
    setTaskListKey((prevKey) => prevKey + 1)
    // Force a re-render of the CategoryManager
    setCategoryManagerKey((prevKey) => prevKey + 1)
    accessToken?.access_token?.length && fetchTasks()
  }

  useEffect(() => {
    if (!accessToken?.access_token) return
    fetchTasks()
    fetchDepartments()
    fetchAssignee()
    fetchUsers()
  }, [accessToken])

  const fetchUsers = async (search = "") => {
    try {
      const response = await fetch(`/api/users?search=${search}`, {
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

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`
        }
      })
      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error("Error fetching tasks:", error)
      setError("Failed to load tasks. Please try again later.")
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!accessToken?.access_token) return
    if (!departmentFilter) return
    fetchCategories()
  }, [departmentFilter, accessToken])

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

  const fetchAssignee = async () => {
    try {
      const response = await fetch("/api/tasks/assignee", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`
        }
      })
      if (!response.ok) {
        throw new Error("Failed to fetch assignee")
      }
      const data = await response.json()
      setAssignee(data)
    } catch (error) {
      console.error("Error fetching assignee:", error)
      toast({
        title: "Error",
        description: "Failed to load assignee. Please try again later.",
        variant: "destructive",
      })
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/tasks/categories?dep=${departmentFilter}`, {
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

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`
        },
        body: JSON.stringify({ id }),
      })
      if (!response.ok) {
        throw new Error("Failed to delete task")
      }
      setTasks(tasks.filter((task) => task._id !== id))
      toast({
        title: "Task deleted",
        description: "The task has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting task:", error)
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`
        },
        body: JSON.stringify({ id, completed: !completed }),
      })
      if (!response.ok) {
        throw new Error("Failed to update task")
      }
      setTasks(tasks.map((task) => (task._id === id ? { ...task, completed: !completed } : task)))
      toast({
        title: "Task updated",
        description: `Task marked as ${!completed ? "completed" : "reopen"}.`,
      })
    } catch (error) {
      console.error("Error updating task:", error)
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleTaskUpdated = () => {
    fetchTasks()
  }

  const filteredAndSortedTasks = tasks
    .filter((task) => {
      if (filter === "completed") return task.completed
      if (filter === "active") return !task.completed
      return true
    })
    .filter((task) => (assigneeFilter === "all" ? true : task.assignee === assigneeFilter))
    .filter((task) => (departmentFilter === "all" ? true : task.department === departmentFilter))
    .filter((task) => (categoryFilter === "all" ? true : task.category === categoryFilter))
    .filter((task) => (priorityFilter === "all" ? true : task.priority === priorityFilter))
    .filter((task) => (statusFilter === "all" ? true : task.status === statusFilter))
    .filter((task) => task.title?.toLowerCase().includes(search.toLowerCase()) ?? false)
    .sort((a, b) => {
      if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "")
      }
      if (sortBy === "dueDate") {
        return (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0)
      }
      if (sortBy === "priority") {
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      if (sortBy === "department") {
        return a.department.localeCompare(b.department)
      }

      if (sortBy === "category") {
        return a.category.localeCompare(b.category)
      }
      if (sortBy === "status") {
        const statusOrder = { open: 0, in_progress: 1, in_review: 2, done: 3, cancelled: 4 }
        return statusOrder[a.status] - statusOrder[b.status]
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  return (
    <div className="h-full flex-1 flex-col px-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Task Management</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className='w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => route.push('/dashboard/tasks/categories')} onSelect={(e) => e.preventDefault()}>Categories</DropdownMenuItem>
              <DropdownMenuItem onClick={() => route.push('/dashboard/tasks/departments')} onSelect={(e) => e.preventDefault()}>
                Departments
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex-1 sm:max-w-xs">
            <Input
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {/* <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select> */}
            <Select value={assigneeFilter} onValueChange={(value: Priority | "all") => setAssigneeFilter(value)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Assignee</SelectItem>
                {assignee.map((assignee: Assignee) => (
                  <SelectItem key={assignee.name} value={assignee._id}>
                    {assignee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={(value: Priority | "all") => setDepartmentFilter(value)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Departments</SelectItem>
                {departments.map((dep: Department) => (
                  <SelectItem key={dep.name} value={dep._id}>
                    {dep.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={(value: Priority | "all") => setCategoryFilter(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.name} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={(value: Priority | "all") => setPriorityFilter(value)}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            {/* <Select value={statusFilter} onValueChange={(value: TaskStatus | "all") => setStatusFilter(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="done">Done</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select> */}
            {/* <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date</SelectItem>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
        </div>
        <CreateTaskModal onTaskCreated={handleDataUpdated} token={accessToken?.access_token || ""} />
      </div>
      <div className="space-y-4 pt-3">
        <PageContainer scrollable={true}>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="">
              {filteredAndSortedTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No tasks found</div>
              ) : (
                filteredAndSortedTasks.map((task: Task) => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    onDelete={handleDelete}
                    onToggleComplete={handleToggleComplete}
                    onTaskUpdated={handleTaskUpdated}
                    token={accessToken?.access_token || ""}
                    users={users}
                    departments={departments}
                  />
                ))
              )}
            </div>
          )}
        </PageContainer>
      </div>
    </div>
  )
}

