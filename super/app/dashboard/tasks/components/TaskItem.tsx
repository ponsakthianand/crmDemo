"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Calendar, Edit, Tag, MoreHorizontal, Images } from "lucide-react"
import { format } from "date-fns"
import type { Priority, TaskStatus } from "@/app/api/tasks/route"
import EditTaskModal from "./EditTaskModal"
import DeleteConfirmationDialog from "./DeleteConfirmationDialog"
import Link from "next/link"
import Avatar from "@/components/avatar-initials"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/registry/new-york/ui/dropdown-menu"
import { Department, User } from "./AddTaskForm"
import { useRouter } from "next/navigation"
import { hexToRgba, rgbaColor } from "@/global"

export interface Image {
  taskId: string
  url: string
  createdAt: string
  _id: string
}

type TaskItemProps = {
  task: {
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
    images?: Image[];
  }
  onDelete: (id: string) => void
  onToggleComplete: (id: string, completed: boolean) => void
  onTaskUpdated: () => void,
  token: string
  users: User[]
  departments: Department[]
}

export default function TaskItem({ task, onDelete, onToggleComplete, onTaskUpdated, token, users, departments }: TaskItemProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const router = useRouter()

  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  }

  const statusColors = {
    open: "bg-blue-100 text-blue-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    in_review: "bg-purple-100 text-purple-800",
    done: "bg-green-100 text-green-800",
    cancelled: "bg-gray-100 text-gray-800",
  }

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    onDelete(task._id)
    setIsDeleteDialogOpen(false)
  }

  const handleFieldUpdate = async (value: any) => {
    switch (value) {
      case "edit":
        setIsEditModalOpen(true)
        break
      case "delete":
        handleDeleteClick()
        break
    }
  }
  const handleCompleteFieldUpdate = async (value: any) => {
    switch (value) {
      case "completed":
      case "active":
        onToggleComplete(task._id, task.completed)
    }
  }

  const getUserName = (userId: string) => {
    const user = users?.find((u) => u._id === userId)
    return user ? user.name : "Unknown User"
  }

  const getDepartmentName = (departmentId: string) => {
    const dep = departments?.find((d) => d._id === departmentId);
    return dep
      ? {
        name: dep.name,
        style: { color: dep.color, backgroundColor: hexToRgba(dep.color, 0.1) }, // ✅ For dynamic colors
      }
      : {
        name: "Unknown Department",
        style: { color: "#4b5563", borderColor: "#6b7280" }, // Gray colors
      };
  };

  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b-[1px] hover:bg-gray-50">
      <div className="flex items-start gap-3 flex-1">
        <div className="flex items-center gap-2 w-full justify-between">
          <div onClick={() => handleFieldUpdate('edit')} className="hover:underline cursor-pointer w-[700px] truncate overflow-hidden">
            <span className={`font-medium text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
              {task.title || "Untitled Task"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {task.dueDate && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground mr-2">
                <Calendar className="h-3 w-3" />
                Due {format(new Date(task.dueDate), "MMM d, yyyy")}
              </span>
            )}
            {task.department &&
              <span className={`inline-flex items-center gap-x-1.5 py-1 px-2 rounded text-xs font-medium`} style={getDepartmentName(task.department)?.style}>
                {getDepartmentName(task.department)?.name}
              </span>
            }

            <span className={`inline-flex items-center gap-x-1.5 py-1 px-2 rounded text-xs font-medium ${priorityColors[task.priority]}`}>{task.priority}</span>
            {task.status && (<Link href={`/dashboard/tasks/${task._id}`}><span className={`inline-flex items-center gap-x-1.5 py-1 px-2 rounded text-xs font-medium ${statusColors[task.status]}`}>{task.status.replace("_", " ")}</span></Link>
            )}

            {task?.images?.length ?
              <Link href={`/dashboard/tasks/${task._id}`}>
                <span className="inline-flex items-center gap-x-1.5 py-1 px-2 text-xs font-medium bg-gray-100 text-gray-800 rounded-md dark:bg-neutral-500/20 dark:text-neutral-400 hover:bg-gray-200 cursor-pointer">
                  <Images className="w-4 h-4" /> {`${task.images.length} attachment${task.images.length > 1 ? "s" : ""}`}
                </span>
              </Link>
              : <></>}
          </div>

        </div>
      </div>
      <div className="flex items-center gap-2">

        {task.assignee && <Avatar name={getUserName(task.assignee)} userId={task.assignee} className="!w-8 !h-8" />}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className='w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={() => handleCompleteFieldUpdate(task.completed ? "completed" : "active")}>{task.completed ? "Reopen" : "Completed"}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/tasks/${task._id}`)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='focus:bg-red-500 focus:text-white block' onSelect={(e) => e.preventDefault()} onClick={() => handleFieldUpdate('delete')}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <EditTaskModal
        task={task}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onTaskUpdated={onTaskUpdated}
        token={token}
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={task?.title || "Untitled Task"}
        description="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div >
  )
}

