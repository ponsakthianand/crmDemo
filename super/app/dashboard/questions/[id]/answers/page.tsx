"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/registry/new-york/ui/button"
import { Textarea } from "@/registry/new-york/ui/textarea"
import { Input } from "@/registry/new-york/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/registry/new-york/ui/card"
import { Loader2, Plus, Trash2, Eye, EyeOff, X, Copy, Search, ArrowRight, Link, Unlink, Pencil, ArrowLeft, ArrowBigLeftDash, CircleDashed } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/new-york/ui/select"
import { Badge } from "@/registry/new-york/ui/badge"
import type { Question, Answer, Category } from "@/types/question"
import PageContainer from "@/components/layout/page-container"
import { Label } from "@/registry/new-york/ui/label"
import Editor from 'react-simple-wysiwyg';
import { stripHtmlTags } from "@/global"
import { useSession } from "next-auth/react"
import { useAppSelector } from "@/app/store/hooks"

export default function AnswersPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const accessToken = useAppSelector((state) => state.authToken);
  const router = useRouter()
  const [question, setQuestion] = useState<Question | null>(null)
  const [originalQuestion, setOriginalQuestion] = useState<Question | null>(null)
  const [newAnswer, setNewAnswer] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [duplicateSearchQuery, setDuplicateSearchQuery] = useState("")
  const [duplicateSearchResults, setDuplicateSearchResults] = useState<Question[]>([])
  const [selectedDuplicateQuestion, setSelectedDuplicateQuestion] = useState<Question | null>(null)
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false)
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false)
  const [isRejected, setIsRejected] = useState(false)
  const [isDuplicate, setIsDuplicate] = useState(false)
  const [relatedQuestions, setRelatedQuestions] = useState<Question[]>([])
  const [relatedSearchQuery, setRelatedSearchQuery] = useState("")
  const [relatedSearchResults, setRelatedSearchResults] = useState<Question[]>([])
  const [isRelatedDialogOpen, setIsRelatedDialogOpen] = useState(false)
  const [category, setCategory] = useState(question?.category || "uncategorized")
  const [tags, setTags] = useState<string[]>(question?.tags || [])
  const [newTag, setNewTag] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [isEditingQuestion, setIsEditingQuestion] = useState(false)
  const [editedQuestion, setEditedQuestion] = useState(question?.editedQuestion || question?.question || "")
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null)
  const [editedAnswerContent, setEditedAnswerContent] = useState("")

  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        const response = await fetch(`/api/questions/${params.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: `Bearer ${accessToken?.access_token}`
            }
          }
        )
        if (response.ok) {
          const data = await response.json()
          setQuestion(data.question)
          setIsRejected(!!data.question?.rejectionReason)
          setIsDuplicate(!!data.question?.isDuplicate)
          setRelatedQuestions(data.question?.relatedQuestions || [])
          setCategory(data.question?.category || "uncategorized")
          setTags(data.question?.tags || [])
          setEditedQuestion(data.question?.editedQuestion || data.question?.question || "")

          if (data.question?.isDuplicate && data.question?.duplicateOf) {
            const originalResponse = await fetch(`/api/questions/${data.question.duplicateOf}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  token: `Bearer ${accessToken?.access_token}`
                }
              })
            if (originalResponse.ok) {
              const originalData = await originalResponse.json()
              setOriginalQuestion(originalData.question)
            }
          }
        } else {
          console.error("Failed to fetch question")
        }
      } catch (error) {
        console.error("Error fetching question:", error)
      } finally {
        setIsLoading(false)
      }
    }

    accessToken?.access_token?.length && fetchQuestionData()
  }, [params.id, accessToken])

  useEffect(() => {
    const fetchCategories = async () => {
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
      }
    }

    accessToken?.access_token?.length && fetchCategories()
  }, [accessToken])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/questions/${params.id}/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`
        },
        body: JSON.stringify({
          content: newAnswer,
          category: category === "uncategorized" ? null : category,
          tags,
        }),
      })

      if (response.ok) {
        const updatedQuestion = await response.json()
        setQuestion(updatedQuestion.question)
        setNewAnswer("")
        setCategory(updatedQuestion.question?.category || "uncategorized")
        setTags(updatedQuestion.question?.tags || [])
      } else {
        console.error("Failed to add answer")
      }
    } catch (error) {
      console.error("Error adding answer:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAnswer = async (answerId: string) => {
    try {
      const response = await fetch(`/api/questions/${params.id}/answers/${answerId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`
        },
      })
      if (response.ok) {
        const updatedQuestion = await response.json()
        setQuestion(updatedQuestion.question)
      } else {
        console.error("Failed to delete answer")
      }
    } catch (error) {
      console.error("Error deleting answer:", error)
    }
  }

  const handleToggleAnswerBlur = async (answerId: string, isBlurred: boolean) => {
    try {
      const response = await fetch(`/api/questions/${params.id}/answers/${answerId}/blur`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`
        },
        body: JSON.stringify({ isBlurred: !isBlurred }),
      })
      if (response.ok) {
        const updatedQuestion = await response.json()
        setQuestion(updatedQuestion.question)
      } else {
        console.error("Failed to toggle answer blur")
      }
    } catch (error) {
      console.error("Error toggling answer blur:", error)
    }
  }

  const handleToggleAnswerHide = async (answerId: string, isHidden: boolean) => {
    try {
      const response = await fetch(`/api/questions/${params.id}/answers/${answerId}/hide`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`
        },
        body: JSON.stringify({ isHidden: !isHidden }),
      })
      if (response.ok) {
        const updatedQuestion = await response.json()
        setQuestion(updatedQuestion.question)
      } else {
        console.error("Failed to toggle answer hide")
      }
    } catch (error) {
      console.error("Error toggling answer hide:", error)
    }
  }

  const handleRejectQuestion = async () => {
    try {
      const response = await fetch(`/api/questions/${params.id}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`
        },
        body: JSON.stringify({ rejectionReason }),
      })
      if (response.ok) {
        const updatedQuestion = await response.json()
        setQuestion(updatedQuestion.question)
        setIsRejected(true)
        setIsRejectionDialogOpen(false)
        setRejectionReason("")
      } else {
        console.error("Failed to reject question")
      }
    } catch (error) {
      console.error("Error rejecting question:", error)
    }
  }

  const handleSearchDuplicates = async () => {
    try {
      const response = await fetch(`/api/questions/search?q=${encodeURIComponent(duplicateSearchQuery)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${accessToken?.access_token}`
          }
        })
      if (response.ok) {
        const data = await response.json()
        setDuplicateSearchResults(data.questions)
      } else {
        console.error("Failed to search for duplicate questions")
      }
    } catch (error) {
      console.error("Error searching for duplicate questions:", error)
    }
  }

  const handleMarkAsDuplicate = async () => {
    if (!selectedDuplicateQuestion) return

    try {
      const response = await fetch(`/api/questions/${params.id}/duplicate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`
        },
        body: JSON.stringify({ isDuplicate: true, duplicateOf: selectedDuplicateQuestion.kelviId }),
      })
      if (response.ok) {
        const updatedQuestion = await response.json()
        setQuestion(updatedQuestion.question)
        setOriginalQuestion(selectedDuplicateQuestion)
        setIsDuplicate(true)
        setIsDuplicateDialogOpen(false)
        setSelectedDuplicateQuestion(null)
        setDuplicateSearchQuery("")
        setDuplicateSearchResults([])
      } else {
        console.error("Failed to mark question as duplicate")
      }
    } catch (error) {
      console.error("Error marking question as duplicate:", error)
    }
  }

  const handleUndoRejection = async () => {
    try {
      const response = await fetch(`/api/questions/${params.id}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`
        },
        body: JSON.stringify({ rejectionReason: null }),
      })
      if (response.ok) {
        const updatedQuestion = await response.json()
        setQuestion(updatedQuestion.question)
        setIsRejected(false)
      } else {
        console.error("Failed to undo rejection")
      }
    } catch (error) {
      console.error("Error undoing rejection:", error)
    }
  }

  const handleUndoDuplicate = async () => {
    try {
      const response = await fetch(`/api/questions/${params.id}/duplicate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`
        },
        body: JSON.stringify({ isDuplicate: false, duplicateOf: null }),
      })
      if (response.ok) {
        const updatedQuestion = await response.json()
        setQuestion(updatedQuestion.question)
        setIsDuplicate(false)
        setOriginalQuestion(null)
      } else {
        console.error("Failed to undo duplicate marking")
      }
    } catch (error) {
      console.error("Error undoing duplicate marking:", error)
    }
  }

  const handleSearchRelated = async () => {
    try {
      const response = await fetch(`/api/questions/search?q=${encodeURIComponent(relatedSearchQuery)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${accessToken?.access_token}`
          }
        })
      if (response.ok) {
        const data = await response.json()
        setRelatedSearchResults(data.questions)
      } else {
        console.error("Failed to search for related questions")
      }
    } catch (error) {
      console.error("Error searching for related questions:", error)
    }
  }

  const handleAddRelatedQuestion = async (relatedQuestion: Question) => {
    try {
      const response = await fetch(`/api/questions/${params.id}/related`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`
        },
        body: JSON.stringify({ relatedQuestionId: relatedQuestion.kelviId }),
      })
      if (response.ok) {
        const updatedQuestion = await response.json()
        setQuestion(updatedQuestion.question)
        setRelatedQuestions([...relatedQuestions, relatedQuestion])
      } else {
        console.error("Failed to add related question")
      }
    } catch (error) {
      console.error("Error adding related question:", error)
    }
  }

  const handleRemoveRelatedQuestion = async (relatedQuestionId: string) => {
    try {
      const response = await fetch(`/api/questions/${params.id}/related/${relatedQuestionId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`
        },
      })
      if (response.ok) {
        const updatedQuestion = await response.json()
        setQuestion(updatedQuestion.question)
        setRelatedQuestions(relatedQuestions.filter((q) => q.kelviId !== relatedQuestionId))
      } else {
        console.error("Failed to remove related question")
      }
    } catch (error) {
      console.error("Error removing related question:", error)
    }
  }

  const handleUpdateQuestion = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/questions/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`
        },
        body: JSON.stringify({ editedQuestion }),
      })
      if (response.ok) {
        const updatedQuestion = await response.json()
        setQuestion(updatedQuestion.question)
        setIsEditingQuestion(false)
      } else {
        console.error("Failed to update question")
      }
    } catch (error) {
      console.error("Error updating question:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," && newTag.trim() !== "") {
      e.preventDefault()
      const tagToAdd = newTag.trim()
      if (!tags.includes(tagToAdd)) {
        setTags([...tags, tagToAdd])
      }
      setNewTag("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && newTag === "" && tags.length > 0) {
      e.preventDefault()
      const lastTag = tags[tags.length - 1]
      handleRemoveTag(lastTag)
    } else {
      handleAddTag(e)
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleEditAnswer = (answerId: string, content: string) => {
    setEditingAnswerId(answerId)
    setEditedAnswerContent(content)
  }

  const handleUpdateAnswer = async () => {
    if (!editingAnswerId) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/questions/${params.id}/answers/${editingAnswerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken?.access_token}`
        },
        body: JSON.stringify({ content: editedAnswerContent }),
      })
      if (response.ok) {
        const updatedQuestion = await response.json()
        setQuestion(updatedQuestion.question)
        setEditingAnswerId(null)
        setEditedAnswerContent("")
      } else {
        console.error("Failed to update answer")
      }
    } catch (error) {
      console.error("Error updating answer:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!question) {
    return <PageContainer scrollable={true}>
      <div className="h-full px-8 flex-1 flex-col md:flex">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => router.push("/dashboard/questions")} className="mr-2">
              <ArrowBigLeftDash />
            </Button>
            <h2 className="text-2xl font-bold tracking-tight">
              {params.id}
            </h2>
          </div>
        </div>
        <div className='flex items-center justify-between w-full py-10'>
          Question not found
        </div>
      </div>
    </PageContainer>
  }

  return (
    <PageContainer scrollable={true}>
      <div className="h-full px-8 flex-1 flex-col md:flex">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => router.push("/dashboard/questions")} className="mr-2">
              <ArrowBigLeftDash />
            </Button>
            <h2 className="text-2xl font-bold tracking-tight">
              {params.id}
            </h2>
          </div>
          <div className='flex items-center justify-between'>
            <div className="flex justify-end space-x-2">
              {isRejected ? (
                <Button onClick={handleUndoRejection} variant="outline">
                  <X className="mr-2 h-4 w-4" />
                  Undo Rejection
                </Button>
              ) : (
                <Dialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <X className="mr-2 h-4 w-4" />
                      Reject Question
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reject Question</DialogTitle>
                      <DialogDescription>Please provide a reason for rejecting this question.</DialogDescription>
                    </DialogHeader>
                    <Textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Enter rejection reason..."
                      className="mt-4"
                    />
                    <DialogFooter>
                      <Button onClick={handleRejectQuestion}>Submit Rejection</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              {isDuplicate ? (
                <Button onClick={handleUndoDuplicate} variant="outline">
                  <Copy className="mr-2 h-4 w-4" />
                  Undo Duplicate Marking
                </Button>
              ) : (
                <Dialog open={isDuplicateDialogOpen} onOpenChange={setIsDuplicateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary">
                      <Copy className="mr-2 h-4 w-4" />
                      Mark as Duplicate
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Mark as Duplicate</DialogTitle>
                      <DialogDescription>Search for the original question to mark this as a duplicate.</DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={duplicateSearchQuery}
                        onChange={(e) => setDuplicateSearchQuery(e.target.value)}
                        placeholder="Search for original question..."
                        className="flex-grow"
                      />
                      <Button onClick={handleSearchDuplicates}>
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                    {duplicateSearchResults.length > 0 && (
                      <div className="mt-4 max-h-60 overflow-y-auto">
                        {duplicateSearchResults.map((q) => (
                          <div
                            key={q.kelviId}
                            className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedDuplicateQuestion?.kelviId === q.kelviId ? "bg-blue-100" : ""
                              }`}
                            onClick={() => setSelectedDuplicateQuestion(q)}
                          >
                            {q.question}
                          </div>
                        ))}
                      </div>
                    )}
                    <DialogFooter>
                      <Button onClick={handleMarkAsDuplicate} disabled={!selectedDuplicateQuestion}>
                        Mark as Duplicate
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              <Dialog open={isRelatedDialogOpen} onOpenChange={setIsRelatedDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Link className="mr-2 h-4 w-4" />
                    Add Related Questions
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Related Questions</DialogTitle>
                    <DialogDescription>Search for and add related questions.</DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={relatedSearchQuery}
                      onChange={(e) => setRelatedSearchQuery(e.target.value)}
                      placeholder="Search for related questions..."
                      className="flex-grow"
                    />
                    <Button onClick={handleSearchRelated}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  {relatedSearchResults.length > 0 && (
                    <div className="mt-4 max-h-60 overflow-y-auto">
                      {relatedSearchResults.map((q) => (
                        <div
                          key={q.kelviId}
                          className="p-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                        >
                          <span>{q.question}</span>
                          <Button
                            size="sm"
                            onClick={() => handleAddRelatedQuestion(q)}
                            disabled={relatedQuestions.some((rq) => rq.kelviId === q.kelviId)}
                          >
                            Add
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="w-full">
          {isEditingQuestion ? (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <Label htmlFor={'description'}>Update Question</Label>
              <Textarea
                value={editedQuestion}
                onChange={(e) => setEditedQuestion(e.target.value)}
                className="flex-grow bg-white"
              />
              <div className="flex items-center justify-end space-x-2 mt-2">
                <Button variant="outline" onClick={() => setIsEditingQuestion(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateQuestion} disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Save"}
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <p className="font-semibold">{question.editedQuestion || question.question}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <p className="text-sm mt-2 cursor-pointer text-red-500" onClick={() => setIsEditingQuestion(true)}>Edit</p>
                  {question.editedQuestion && (
                    <p className="text-sm text-gray-500 mt-2">
                      {` · `}Edited by {question.editedBy} on {new Date(question.editedAt!).toLocaleString()}
                    </p>
                  )}
                  {question.isDuplicate && originalQuestion && (
                    <p className="text-sm text-gray-500 mt-2 cursor-pointer" title={question.originalQuestion} onClick={() => router.push(`/dashboard/questions/${originalQuestion?.kelviId}/answers`)}>{` · `}View original</p>
                  )}
                  {
                    question?.updatedById && (
                      <p className="text-sm text-gray-500 mt-2">
                        {` · `}last update by {question.updatedBy} on {new Date(question.updatedAt!).toLocaleString()}
                      </p>
                    )
                  }
                </div>
              </div>

            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="mt-2">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 my-4">
            <div className="lg:col-span-7">
              <div className='w-full'>
                <Label htmlFor={'description'}>Answer</Label>
                <Editor name="description" className="h-80 overflow-y-scroll p-5" value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} />
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="p-4 rounded border bg-gray-50 flex-1 h-[380px]">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category">
                      Category
                    </Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger id="category" className="bg-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="uncategorized">Uncategorized</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.name} value={cat?.vagaiId}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="relative">
                    <Label htmlFor="tags">
                      Tags
                    </Label>
                    <div className="flex flex-wrap items-center gap-2 p-2 border rounded-md focus-within:ring-2 focus-within:ring-green-500 bg-white">
                      {tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="px-2 py-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-xs text-gray-500 hover:text-gray-700"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                      <input
                        type="text"
                        id="tags"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-grow outline-none bg-white"
                        placeholder={tags.length === 0 ? "Add tags..." : ""}
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <Button type="submit" disabled={isSubmitting} className="mt-3 w-full">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {question.answers && question.answers.length > 0 && (
          <div className="mb-4 p-4 bg-gray-50 border rounded-lg">
            <h3 className="text-base font-semibold mb-2">Previous Answers:</h3>
            {question.answers.map((answer: Answer) => (
              <div key={answer._id} className="mb-2 last:mb-0 border-b-[1px] last:border-none pb-2 last:pb-0 text-sm">
                {editingAnswerId === answer._id ? (
                  <div className="space-y-2">
                    <Editor name="description" className="bg-white h-80 overflow-y-scroll p-5" value={editedAnswerContent} onChange={(e) => setEditedAnswerContent(e.target.value)} />
                    <div className="flex justify-end space-x-2">
                      <Button onClick={handleUpdateAnswer} disabled={isSubmitting}>
                        {isSubmitting ? "Updating..." : "Save"}
                      </Button>
                      <Button variant="outline" onClick={() => setEditingAnswerId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center mb-2 last:mb-0 text-sm">
                    <div className={answer.isBlurred ? "blur-sm" : ""}>
                      <span className={`${answer.isHidden ? "line-through" : ""}`}>
                        {stripHtmlTags(answer.content)?.split(" ").slice(0, 15).join(" ")}
                        {stripHtmlTags(answer.content) && stripHtmlTags(answer.content).split(" ").length > 15 ? "..." : ""}
                      </span>
                    </div>
                    <div className="flex justify-center items-center space-x-2">
                      <Button variant={'ghost'} size="sm" onClick={() => handleEditAnswer(answer._id, answer.content)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant={'ghost'} size="sm" onClick={() => handleToggleAnswerBlur(answer._id, answer.isBlurred)} disabled={answer.isHidden}>
                        {answer.isBlurred ? <Eye className="h-4 w-4 mr-2" /> : <CircleDashed className="h-4 w-4 mr-2" />}
                        {answer.isBlurred ? "Unblur" : "Blur"}
                      </Button>
                      <Button variant={'ghost'} size="sm" onClick={() => handleToggleAnswerHide(answer._id, answer.isHidden)}>
                        {answer.isHidden ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                        {answer.isHidden ? "Unhide" : "Hide"}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant={'ghost'} size="sm">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the answer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteAnswer(answer._id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {relatedQuestions.length > 0 && (
          <div className="mb-4 p-4 bg-gray-50 border rounded-lg">
            <h3 className="text-base font-semibold mb-2">Related Questions:</h3>
            {relatedQuestions.map((q) => (
              <div key={q.kelviId} className="flex justify-between items-center mb-2 last:mb-0 text-sm">
                <span>
                  {q.question?.split(" ").slice(0, 15).join(" ")}
                  {q.question && q.question.split(" ").length > 15 ? "..." : ""}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemoveRelatedQuestion(q.kelviId ?? "")}
                >
                  <Unlink className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  )
}

