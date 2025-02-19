"use client"

import React, { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/new-york/ui/table"
import { Input } from "@/registry/new-york/ui/input"
import { Button } from "@/registry/new-york/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/new-york/ui/select"
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
} from "@/registry/new-york/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/registry/new-york/ui/label"
import { Textarea } from "@/registry/new-york/ui/textarea"
import { Trash2, Plus, Loader2, Eye, RefreshCw } from "lucide-react"
import type { Question } from "@/types/question"
import type { Category } from "@/types/question"
import Link from "next/link"
import PageContainer from "@/components/layout/page-container"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/registry/new-york/ui/tooltip"
import { useSession } from "next-auth/react"
import { useAppSelector } from "@/app/store/hooks"

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const accessToken = useAppSelector((state) => state.authToken);
  const [allQuestions, setAllQuestions] = useState<Question[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    askedByName: "",
    askedByPhone: "",
    category: "",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    accessToken?.access_token?.length && fetchQuestions()
  }, [accessToken])

  useEffect(() => {
    filterAndSortQuestions()
  }, [search, category, sortBy, sortOrder, allQuestions])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/questions/categories", {
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
      }
    }

    fetchCategories()
  }, [])

  const fetchQuestions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/questions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`
        }
      })
      const data = await response.json()
      setAllQuestions(data.questions)
      setTotalQuestions(data.questions.length)
      setTotalPages(Math.ceil(data.questions.length / 15))
      setCurrentPage(1)
    } catch (error) {
      console.error("Error fetching questions:", error)
    } finally {
      setIsLoading(false)
    }
  }


  const filterAndSortQuestions = () => {
    let filtered = [...allQuestions]

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (q) =>
          (q.question?.toLowerCase().includes(searchLower) ?? false) ||
          (q.askedByName?.toLowerCase().includes(searchLower) ?? false) ||
          (q.askedByPhone?.includes(search) ?? false),
      )
    }

    if (category && category !== "all") {
      filtered = filtered.filter((q) => (q.category === category))
    }

    filtered.sort((a, b) => {
      if (sortBy === "createdAt") {
        const dateA = new Date(a.createdAt ?? 0).getTime()
        const dateB = new Date(b.createdAt ?? 0).getTime()
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA
      }
      return 0
    })

    setFilteredQuestions(filtered)
    setTotalQuestions(filtered.length)
    setTotalPages(Math.ceil(filtered.length / 15))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    filterAndSortQuestions()
  }

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  const handleDeleteQuestion = async (id: string) => {
    try {
      const response = await fetch(`/api/questions/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`
        }
      })
      if (response.ok) {
        await fetchQuestions()
      } else {
        console.error("Failed to delete question")
      }
    } catch (error) {
      console.error("Error deleting question:", error)
    }
  }

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`
        },
        body: JSON.stringify(newQuestion),
      })
      if (response.ok) {
        await fetchQuestions()
        setIsDialogOpen(false)
        setNewQuestion({ question: "", askedByName: "", askedByPhone: "", category: "" })
      } else {
        console.error("Failed to add question")
      }
    } catch (error) {
      console.error("Error adding question:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const paginatedQuestions = filteredQuestions.slice((currentPage - 1) * 15, currentPage * 15)

  return (
    <PageContainer scrollable={true}>
      <div className="h-full px-8 flex-1 flex-col md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div className="flex items-center space-x-2">
            <div className="">
              <h2 className="text-2xl font-bold tracking-tight">FAQs</h2>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Select value={category} onValueChange={setCategory} defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" defaultChecked>All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id.toString()} value={cat._id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit">Search</Button>
            </form>
          </div>
          <div className='flex items-center justify-between'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='cursor-pointer mr-5 hover:animate-spin hover:text-green-700' onClick={(e) => fetchQuestions()}><RefreshCw /></div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reload Questions</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add New Question
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Question</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new question. The question field is required.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddQuestion}>
                  <div className="">
                    <Label htmlFor="question" className="text-right">
                      Question
                    </Label>
                    <Textarea
                      id="question"
                      className="col-span-3"
                      required
                      value={newQuestion.question}
                      onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="mt-2" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add Question"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Button asChild className="ml-2">
              <Link href="/dashboard/questions/categories">
                <Plus className="mr-2 h-4 w-4" /> Manage Categories
              </Link>
            </Button>
          </div>
        </div>

        <div>
          <Table className="mt-5 border">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-gray-700">Question</TableHead>
                <TableHead className="text-gray-700">Asked By</TableHead>
                <TableHead className="text-gray-700">Category</TableHead>
                <TableHead className="text-gray-700">
                  <button onClick={handleSort}>
                    Created At {sortBy === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                </TableHead>
                <TableHead className="text-gray-700">Status</TableHead>
                <TableHead className="text-gray-700">Created By</TableHead>
                <TableHead className="text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : paginatedQuestions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No questions found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedQuestions.map((question) => (
                  <React.Fragment key={question.kelviId.toString()}>
                    <TableRow>
                      <TableCell>
                        <Link href={`/dashboard/questions/${question.kelviId.toString()}/answers`} className="hover:underline">
                          {question.question?.split(" ").slice(0, 10).join(" ")}
                          {question.question && question.question.split(" ").length > 15 ? "..." : ""}
                        </Link>
                        <p className="text-xs text-gray-400">{question.kelviId}</p>
                      </TableCell>
                      <TableCell>{question.askedByName}</TableCell>
                      <TableCell>
                        {question.category
                          ? categories.find((cat) => cat._id?.toString() === question.category)?.name
                          : "Uncategorized"}
                      </TableCell>
                      <TableCell>
                        {question.createdAt ? new Date(question.createdAt).toLocaleDateString() : "N/A"}
                      </TableCell>
                      <TableCell>
                        {question?.rejectedById?.length ?
                          <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-500">Rejected</span> :
                          question.approved ?
                            <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-500">Approved</span> :
                            <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-500">Pending</span>}
                      </TableCell>
                      <TableCell>{question.createdByName || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <div className="flex items-center space-x-2 cursor-pointer">
                                <Trash2 className="h-4 w-4 opacity-70 hover:text-red-500" />
                              </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the question and remove it
                                  from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteQuestion(question.kelviId.toString())}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center mt-5">
            <div>Total Questions: {totalQuestions}</div>
            <div className="flex gap-2">
              <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                Previous
              </Button>
              <span className="py-2 px-4 border rounded text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>

      </div>
    </PageContainer>
  )
}

