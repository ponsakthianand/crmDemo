'use client'
import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Question } from "@/src/types/qa"

interface QuestionsContextType {
  questions: Question[]
  totalPages: number
  currentPage: number
  isLoading: boolean
  error: string | null
  fetchQuestions: (page?: number, limit?: number, category?: string, tag?: string) => Promise<void>
  searchQuestions: (query: string) => Promise<{ questions: Question[]; categories: string[]; tags: string[] }>
}

const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined)

export function useQuestions() {
  const context = useContext(QuestionsContext)
  if (context === undefined) {
    throw new Error("useQuestions must be used within a QuestionsProvider")
  }
  return context
}

export function QuestionsProvider({ children }: { children: React.ReactNode }) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchQuestions = async (page = 1, limit = 10, category?: string, tag?: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const queryParams = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
      if (category) queryParams.append("category", category)
      if (tag) queryParams.append("tag", tag)

      const response = await fetch(`/api/questions?${queryParams}`)
      if (!response.ok) throw new Error("Failed to fetch questions")
      const data = await response.json()
      setQuestions(data.questions)
      setTotalPages(data.totalPages)
      setCurrentPage(data.currentPage)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const searchQuestions = async (query: string) => {
    try {
      const response = await fetch(`/api/questions/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error("Failed to search questions")
      return await response.json()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      return { questions: [], categories: [], tags: [] }
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions]) // Added fetchQuestions to the dependency array

  return (
    <QuestionsContext.Provider
      value={{ questions, totalPages, currentPage, isLoading, error, fetchQuestions, searchQuestions }}
    >
      {children}
    </QuestionsContext.Provider>
  )
}

