"use client"

import { useState, useEffect } from "react"
import QuestionList from "./QuestionList"
import Link from "next/link"
import type { PaginatedQuestionsProps, Question } from "@/src/types/qa"

export default function PaginatedQuestions({
  initialQuestions,
  totalPages,
  currentPage,
  baseUrl,
}: PaginatedQuestionsProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)

  useEffect(() => {
    setQuestions(initialQuestions)
  }, [initialQuestions])

  return (
    <div>
      <QuestionList questions={questions} />
      <div className="mt-4 flex justify-between">
        {currentPage > 1 && (
          <Link href={`${baseUrl}page=${currentPage - 1}`} className="bg-blue-500 text-white px-4 py-2 rounded">
            Previous
          </Link>
        )}
        {currentPage < totalPages && (
          <Link href={`${baseUrl}page=${currentPage + 1}`} className="bg-blue-500 text-white px-4 py-2 rounded">
            Next
          </Link>
        )}
      </div>
    </div>
  )
}

