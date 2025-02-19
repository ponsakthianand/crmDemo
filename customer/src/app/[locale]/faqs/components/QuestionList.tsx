'use client'
import type { QuestionListProps } from "@/src/types/qa"
import { dateToLocalDateYear, toUrlFriendly } from "@/global"
import { useRouter } from "next/navigation"
import GetCategory from "../category/getCategory"

export default function QuestionList({ questions }: QuestionListProps) {
  const router = useRouter()
  return (
    <div className="space-y-2">
      {questions?.length ? questions.map((question) => (
        <div key={question.kelviId} className="">
          <div className="py-3 first:pt-0 last:pb-0">
            <div onClick={() => router.push(`/faqs/${question.kelviId}`)} className="group hover:cursor-pointer flex flex-col bg-white focus:outline-none transition dark:bg-neutral-900 dark:border-neutral-800">
              <div className="py-2 md:py-2">
                <div className="flex gap-x-5">
                  <div className="grow">
                    <h3 className="group-hover:text-primary-800 !font-[unset] font-semibold text-gray-800 dark:group-hover:text-neutral-400 dark:text-neutral-200">
                      {question.question}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-neutral-500">
                      <GetCategory vagaiId={question.category} />
                      {question?.createdBy === 'admin' ? 'admin created' : `${question.askedByName} asked`} on {dateToLocalDateYear(question.createdAt as string)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )) : <div>No questions found</div>
      }
    </div>
  )
}

