"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Bold, CalendarIcon, Clock, Italic, List } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Priority, TaskStatus } from "@/app/api/tasks/route"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/registry/new-york/ui/command"
import { ScrollArea } from "@/registry/new-york/ui/scroll-area"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Category, Department } from "./AddTaskForm"

interface User {
  _id: string
  name: string
  email: string
}

interface Task {
  _id: string
  title: string
  description?: string
  completed: boolean
  category: string
  priority: Priority
  status: TaskStatus
  dueDate?: Date
  updatedAt?: Date
  assignee?: string
  reporter?: string
  estimatedTime?: string
  tags?: string[]
  department: string
}

interface EditTaskModalProps {
  task: Task
  isOpen: boolean
  onClose: () => void
  onTaskUpdated: (updatedTask: Task) => void,
  token: string
}

export default function EditTaskModal({ task, isOpen, onClose, onTaskUpdated, token }: EditTaskModalProps) {
  const [title, setTitle] = useState(task.title)
  const [category, setCategory] = useState(task.category)
  const [department, setDepartment] = useState(task.department)
  const [priority, setPriority] = useState<Priority>(task.priority)
  const [dueDate, setDueDate] = useState<Date | undefined>(task.dueDate ? new Date(task.dueDate) : undefined)
  const [dueTime, setDueTime] = useState(task.dueDate ? format(new Date(task.dueDate), "HH:mm") : "12:00")
  const [categories, setCategories] = useState<Category[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [assignee, setAssignee] = useState(task.assignee || "")
  const [reporter, setReporter] = useState(task.reporter || "")
  const [estimatedTime, setEstimatedTime] = useState(task.estimatedTime || "")
  const [tags, setTags] = useState<string[]>(task.tags || [])
  const [newTag, setNewTag] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [assigneeOpen, setAssigneeOpen] = useState(false)
  const [reporterOpen, setReporterOpen] = useState(false)
  const [status, setStatus] = useState<TaskStatus>(task.status || "open")
  const { toast } = useToast()
  const [editorContent, setEditorContent] = useState(task.description || "");

  const editor = useEditor({
    extensions: [StarterKit],
    content: editorContent,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      setEditorContent(newContent);
    },
  });

  useEffect(() => {
    fetchDepartments()
    fetchUsers()
  }, [])

  useEffect(() => {
    if (!department) return
    fetchCategories()
  }, [department])

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/tasks/departments", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${token}`
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
          token: `Bearer ${token}`
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
          token: `Bearer ${token}`
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    try {
      const combinedDueDate = dueDate
        ? new Date(dueDate.setHours(Number.parseInt(dueTime.split(":")[0]), Number.parseInt(dueTime.split(":")[1])))
        : undefined

      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: task._id,
          title,
          description: editorContent,
          department,
          category,
          priority,
          status,
          dueDate: combinedDueDate,
          assignee,
          reporter,
          estimatedTime,
          tags,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update task")
      }

      const updatedTask = {
        ...task,
        title,
        description: editorContent,
        department,
        category,
        priority,
        status,
        dueDate: combinedDueDate,
        assignee,
        reporter,
        estimatedTime,
        tags,
        updatedAt: new Date(),
      }
      onTaskUpdated(updatedTask)
      onClose()
      toast({
        title: "Task updated successfully",
        description: "Your task has been updated.",
      })
    } catch (error) {
      console.error("Error updating task:", error)
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-[70%_auto] gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task title"
                  required
                />
              </div>
              <div className="space-y-2">
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
                  </div>
                  <EditorContent editor={editor} className="prose max-w-none px-3 h-[350px]" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <ScrollArea className="h-[500px]">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select value={department || undefined} onValueChange={setDepartment}>
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select a deparment" />
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
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category || undefined} onValueChange={setCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
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
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={priority} onValueChange={(value: Priority) => setPriority(value)}>
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={(value: TaskStatus) => setStatus(value)}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
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
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dueDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dueDate ? format(dueDate, "PPP") : <span>Pick a due date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignee">Assignee</Label>
                    <Popover open={assigneeOpen} onOpenChange={setAssigneeOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={assigneeOpen}
                          className="w-full justify-between"
                        >
                          {assignee ? users.find((user) => user._id === assignee)?.name : "Select assignee..."}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search users..." onValueChange={(search) => fetchUsers(search)} />
                          <CommandList>
                            <CommandEmpty>No user found.</CommandEmpty>
                            <CommandGroup>
                              {users.map((user) => (
                                <CommandItem
                                  key={user._id}
                                  onSelect={() => {
                                    setAssignee(user._id)
                                    setAssigneeOpen(false)
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
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reporter">Reporter</Label>
                    <Popover open={reporterOpen} onOpenChange={setReporterOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={reporterOpen}
                          className="w-full justify-between"
                        >
                          {reporter ? users.find((user) => user._id === reporter)?.name : "Select reporter..."}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search users..." onValueChange={(search) => fetchUsers(search)} />
                          <CommandList>
                            <CommandEmpty>No user found.</CommandEmpty>
                            <CommandGroup>
                              {users.map((user) => (
                                <CommandItem
                                  key={user._id}
                                  onSelect={() => {
                                    setReporter(user._id)
                                    setReporterOpen(false)
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
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedTime">Estimated Time</Label>
                    <Input
                      id="estimatedTime"
                      type="text"
                      value={estimatedTime}
                      onChange={(e) => setEstimatedTime(e.target.value)}
                      placeholder="e.g., 2h 30m"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-sm">
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-4 w-4 p-0"
                            onClick={() => removeTag(tag)}
                          >
                            ×
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        id="tags"
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        className="flex-grow"
                      />
                      <Button type="button" onClick={addTag}>
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full mt-6">
            {isSubmitting ? "Updating..." : "Update Task"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

