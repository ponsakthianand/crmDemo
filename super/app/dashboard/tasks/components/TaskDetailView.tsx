"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowLeft, X, Check, Bold, Italic, List, Link, ImageIcon, Trash2, ChevronDown } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import type { Priority } from "@/app/api/tasks/route"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { put } from "@vercel/blob"
import ImageViewModal from "./ImageViewModal"
import Image from "next/image"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList, CommandInput } from "@/registry/new-york/ui/command"
import { Comments } from "./Comments"
import { useSession } from "next-auth/react"
import { useAppSelector } from "@/app/store/hooks"
import debounce from "lodash.debounce";
import GalleryUpload from "./GalleryUpload"
import { Category, Department } from "./AddTaskForm"
import { deleteImage } from "../actions/deleteImage"

type Task = {
  _id: string
  title: string | null
  description?: string
  completed: boolean
  category: string
  priority: Priority
  dueDate?: string
  createdAt: string
  updatedAt: string
  assignee?: string
  reporter?: string
  estimatedTime?: string
  tags?: string[]
  status?: "open" | "in_progress" | "in_review" | "done" | "cancelled"
  images?: Image[]
  department: string
}

interface User {
  _id: string
  name: string
  email: string
}

interface Comment {
  _id: string
  taskId: string
  userId: string
  userName: string
  content: string
  createdAt: string
}

export interface Image {
  taskId: string
  url: string
  createdAt: string
  _id: string
}

export default function TaskDetailView({ task: initialTask }: { task: Task }) {
  const { data: session, status } = useSession()
  const accessToken = useAppSelector((state) => state.authToken);
  const [task, setTask] = useState(initialTask)
  const [department, setDepartment] = useState(task?.department || '')
  const [categories, setCategories] = useState<Category[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [newTag, setNewTag] = useState("")
  const [editingField, setEditingField] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [assigneeOpen, setAssigneeOpen] = useState(false)
  const [reporterOpen, setReporterOpen] = useState(false)
  const [userSearch, setUserSearch] = useState("")
  const [comments, setComments] = useState<Comment[]>([])
  const [images, setImages] = useState<Image[]>(task?.images || [])
  const [editorContent, setEditorContent] = useState(task.description || "");

  const editor = useEditor({
    extensions: [StarterKit],
    content: editorContent,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      setEditorContent(newContent);
      debouncedUpdate("description", newContent);
    },
  });

  useEffect(() => {
    if (!accessToken?.access_token) return
    fetchDepartments()
    fetchUsers()
    fetchComments()
  }, [accessToken])

  useEffect(() => {
    if (!accessToken?.access_token) return
    if (!department) return
    fetchCategories()
  }, [department, accessToken])

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

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/tasks/categories?dep=${department}`, {
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

  const handleToggleComplete = async () => {
    try {
      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`
        },
        body: JSON.stringify({ id: task._id, completed: !task.completed }),
      })
      if (!response.ok) {
        throw new Error("Failed to update task")
      }
      setTask({ ...task, completed: !task.completed })
      toast({
        title: "Task updated",
        description: `Task marked as ${!task.completed ? "completed" : "active"}.`,
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

  const handleFieldUpdate = async (field: string, value: any) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`
        },
        body: JSON.stringify({
          id: task._id,
          [field]: value,
        }),
      })
      if (!response.ok) {
        throw new Error("Failed to update task")
      }
      setTask({ ...task, [field]: value })
      setEditingField(null)
      toast({
        title: "Task updated",
        description: `${field.charAt(0).toUpperCase() + field.slice(1)} has been updated.`,
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

  const debouncedUpdate = useCallback(
    debounce(async (field: string, value: any) => {
      try {
        const response = await fetch("/api/tasks", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${accessToken?.access_token}`
          },
          body: JSON.stringify({
            id: task._id,
            [field]: value,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update task");
        }

        setTask({ ...task, [field]: value });
        toast({
          title: "Task updated",
          description: `${field.charAt(0).toUpperCase() + field.slice(1)} has been updated.`,
        });
      } catch (error) {
        console.error("Error updating task:", error);
        toast({
          title: "Error",
          description: "Failed to update task. Please try again.",
          variant: "destructive",
        });
      }
    }, 1000), // Adjust debounce time (e.g., 1000ms = 1s)
    [task, accessToken]
  );

  const handleAddTag = () => {
    if (newTag.trim()) {
      const updatedTags = [...(task.tags || []), newTag.trim()]
      handleFieldUpdate("tags", updatedTags)
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = task.tags?.filter((tag) => tag !== tagToRemove) || []
    handleFieldUpdate("tags", updatedTags)
  }

  const renderEditableField = (field: string, value: string, inputType: "input" | "textarea" | "user" = "input") => {
    const isEditing = editingField === field
    // const currentUser =
    //   field === "assignee" ? users.find((u) => u._id === task.assignee) : users.find((u) => u._id === task.reporter)

    if (inputType === "user") {
      const isOpen = field === "assignee" ? assigneeOpen : reporterOpen
      const setOpen = field === "assignee" ? setAssigneeOpen : setReporterOpen

      const userFiled = field === "assignee" ? "assignee" : "reporter"

      return (
        <Popover open={isOpen} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={assigneeOpen}
              className="w-full justify-between"
            >
              {task[userFiled] ? users.find((user) => user._id === task[userFiled])?.name : "Select assignee..."}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput
                placeholder={`Search ${field}...`}
                onValueChange={(search) => {
                  setUserSearch(search)
                  fetchUsers(search)
                }}
              />
              <CommandList>
                <CommandEmpty>No user found.</CommandEmpty>
                <CommandGroup>
                  {users.map((user) => (
                    <CommandItem
                      key={user._id}
                      onSelect={() => {
                        handleFieldUpdate(field, user._id)
                        setOpen(false)
                      }}
                    >
                      {user.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )
    }

    return (
      <div className="relative">
        {isEditing ? (
          <>
            <Input
              value={value}
              onChange={(e) => setTask({ ...task, [field]: e.target.value })}
              className={`${field === 'estimatedTime' ? 'text-sm' : 'text-xl font-medium min-h-[2.9rem]'} px-3 py-2 pr-16`}
              autoFocus
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex space-x-1">
              <Button size="icon" variant="ghost" onClick={() => handleFieldUpdate(field, task[field as keyof Task])}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => setEditingField(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div
            className={`min-h-[2.5rem] flex items-center px-3 py-2 rounded-md border border-transparent hover:bg-accent hover:text-accent-foreground cursor-pointer ${field === 'estimatedTime' ? 'text-sm' : 'text-xl font-medium'}`}
            onClick={() => setEditingField(field)}
          >
            {value || `Add ${field}`}
          </div>
        )}
      </div>
    )
  }

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setIsImageModalOpen(true)
  }

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/tasks/comments?taskId=${task._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`
        }
      })
      if (!response.ok) {
        throw new Error("Failed to fetch comments")
      }
      const data = await response.json()
      setComments(data)
    } catch (error) {
      console.error("Error fetching comments:", error)
      toast({
        title: "Error",
        description: "Failed to load comments. Please try again later.",
        variant: "destructive",
      })
    }
  }, [task._id, toast, accessToken])

  const getUploadedImages = async (newImages: Image[]) => {
    setImages((prevImages) => [...prevImages, ...newImages])
  }

  const onImageDelete = (imageId: string) => {
    setImages((prevImages) => prevImages.filter((img) => img._id !== imageId));
  };

  const handleDelete = async (imageID: string) => {
    const result = await deleteImage(imageID, task._id)
    if (result.success) {
      onImageDelete(imageID)
    } else {
      console.error("Failed to delete image:", result.error)
      // You might want to show an error message to the user here
    }
  }

  return (
    <div className="container mx-auto p-4 pt-0">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tasks
        </Button>
        <Button onClick={handleToggleComplete} variant={task.completed ? "outline" : "default"}>{task.completed ? "Reopen" : "Mark as Completed"}</Button>
      </div>
      <div className="bg-card rounded-lg border p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-[75%_auto] gap-6">
          <div className="space-y-4">
            <div className="flex-1 mr-4 text-lg font-medium">{renderEditableField("title", task.title || "", "input")}</div>
            <div>
              <Label htmlFor="description">Description</Label>
              <div className="border rounded-md overflow-hidden">
                <div className="mb-2 flex gap-2 flex-wrap bg-slate-100 px-2 py-1 border-b-[1px]">
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={editor?.isActive("bold") ? "bg-accent" : ""}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={editor?.isActive("italic") ? "bg-accent" : ""}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={editor?.isActive("bulletList") ? "bg-accent" : ""}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  {/* <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => {
                      const url = window.prompt("Enter the URL")
                      if (url) {
                        editor?.chain().focus().setLink({ href: url }).run()
                      }
                    }}
                    className={editor?.isActive("link") ? "bg-accent" : ""}
                  >
                    <Link className="h-4 w-4" />
                  </Button> */}
                </div>
                <EditorContent editor={editor} className="prose max-w-none px-3" />
              </div>
            </div>
            <div>
              <Label>Attached Image</Label>
              <div className="mt-2 space-y-2">
                <GalleryUpload taskId={task?._id} onSavedImagesChange={getUploadedImages} />
                {images && (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {
                      images.map((image) => (
                        <div className="border rounded-lg p-4 space-y-2 relative">
                          <Image src={image.url} alt="Saved image" width={200} height={200} className=" h-auto" onClick={() => openImageModal(image.url)} key={image.url} />
                          <div
                            onClick={() => handleDelete(image._id)}
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors absolute top-2 right-2 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4 opacity-70" />
                          </div>
                        </div>
                        // <div className="relative w-full h-48 cursor-pointer">
                        //   <Image
                        //     src={image.url}
                        //     alt="Task image"
                        //     layout="fill"
                        //     objectFit="contain"
                        //   />
                        // </div>
                      ))
                    }
                  </div>
                )}
              </div>
            </div>
            <div className="mt-8">
              <Comments taskId={task._id} initialComments={comments} onCommentAdded={fetchComments} token={accessToken?.access_token || ""} />
            </div>
            <ImageViewModal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} imageUrl={selectedImage} />
          </div>
          <div className="space-y-4">
            <div className="gap-2 space-y-4">
              <div>
                <Label htmlFor="department">Department</Label>
                <Select value={task.department || undefined} onValueChange={(value) => handleFieldUpdate("department", value)}>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dep) => (
                      <SelectItem key={dep.name} value={dep._id}>
                        {dep.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={task.category || undefined} onValueChange={(value) => handleFieldUpdate("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.name} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={task.priority} onValueChange={(value: Priority) => handleFieldUpdate("priority", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={task.status || "open"} onValueChange={(value) => handleFieldUpdate("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm">
                <Label htmlFor="dueDate">Due Date</Label>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[220px] justify-start text-left font-normal",
                          !task.dueDate && "text-muted-foreground w-full",
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {task.dueDate ? format(new Date(task.dueDate), "PPP") : <span>Set due date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={task.dueDate ? new Date(task.dueDate) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            handleFieldUpdate("dueDate", date.toISOString())
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {task.dueDate && (
                    <Button variant="ghost" size="icon" onClick={() => handleFieldUpdate("dueDate", null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="assignee">Assignee</Label>
                {renderEditableField("assignee", task.assignee || "", "user")}
              </div>
              <div>
                <Label htmlFor="assignee">Reporter</Label>
                {renderEditableField("reporter", task.reporter || "", "user")}
              </div>
              <div>
                <Label htmlFor="estimatedTime">Estimated Time</Label>
                {renderEditableField("estimatedTime", task.estimatedTime || "", "input")}
              </div>
              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {task.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-sm">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="text"
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-grow"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                  <Button onClick={handleAddTag}>Add</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center text-muted-foreground mt-3 text-sm mb-20">
        <p>Created: {format(new Date(task.createdAt), "PPpp")}</p>
        <p>Last Updated: {format(new Date(task.updatedAt), "PPpp")}</p>
      </div>
    </div>
  )
}

