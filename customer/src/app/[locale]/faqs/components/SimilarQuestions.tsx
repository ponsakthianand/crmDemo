import Link from "next/link"
import type { SimilarQuestionsProps } from "@/src/types/qa"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SimilarQuestions({ questions }: SimilarQuestionsProps) {
  if (questions.length === 0) {
    return null
  }

  return (
    <Card className="bg-gray-50">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Similar Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {questions?.map((q) => (
            <li key={q?._id}>
              <Link href={`/faqs/${q?.kelviId}`} className="flex gap-x-3 text-base hover:underline mb-3">
                <span className="size-5 flex justify-center items-center rounded-full bg-teal-50 text-teal-500 dark:bg-teal-800/30 dark:text-teal-500">
                  <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span className="text-gray-600 dark:text-white">
                  {q?.question}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
