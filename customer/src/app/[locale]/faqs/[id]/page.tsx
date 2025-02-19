import clientPromise from "@/src/app/lib/mongodbConfig"
import type { Question } from "@/src/types/qa"
import Link from "next/link"
import { ObjectId } from "mongodb"
import { dateToLocalDateYear, dateToLocalTimeDateYear, stripHtmlTags, toUrlFriendly } from "@/global"
import { Breadcrumbs } from "../breadcrumbs/breadcrumbs"
import DOMPurify from "dompurify";
import { generateMetadata } from "@/src/app/components/metaGenerator/metaGenerator"
import GetCategory from "../category/getCategory"

async function getQuestion(id: string): Promise<Question | null> {
  const client = await clientPromise
  const db = client.db("qa_database")

  let query
  if (ObjectId.isValid(id)) {
    query = { _id: new ObjectId(id) }
  } else {
    query = { kelviId: id }
  }

  const question = await db.collection("questions").findOne(query);

  if (question?.answers && Array.isArray(question.answers)) {
    question.answers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  return question as Question | null
}

export default async function QuestionDetail({ params }: { params: { id: string } }) {
  const question = await getQuestion(params.id)

  if (!question) {
    return <div>Question not found</div>
  }

  if (question) {
    const title = question.question
    const description = stripHtmlTags(question.answers?.[0]?.content || question.question)
    const keywords = question.tags?.join(', ')
    generateMetadata(title, description, null, keywords)
  }

  return (
    <div className="container mx-auto p-4 !font-[unset]">
      <Breadcrumbs lastValue={question.kelviId} />
      <h1 className="text-xl md:text-2xl font-semibold !font-[unset]">{question.question}</h1>
      <div className="text-sm text-gray-600 flex items-center justify-start">
        <GetCategory vagaiId={question.category} />&nbsp;
        <p className="text-sm text-gray-600">{question?.createdBy === 'admin' ? 'Admin created' : `${question.askedByName} asked`} on {dateToLocalDateYear(question.createdAt as string)}</p>
      </div>

      <div className="bg-white mb-6">
        {question.isDuplicate && (
          <div className="mt-4 p-3 bg-secondary-100 rounded-md">
            <p className="text-secondary-700">A similar question was answered in <Link className="underline hover:text-primary-800" href={`/faqs/${question.duplicateOf}`}>{question.duplicateOf}</Link>. Please refer to it for the information you need.</p>
          </div>
        )}
        {!question.approved && (
          <div className="mt-4 p-3 bg-red-100 rounded-md">
            <p className="text-red-700">This question is pending approval.</p>
          </div>
        )}
        {/* {question.rejectionReason && (
          <div className="mt-4 p-3 bg-red-100 rounded-md">
            <p className="text-red-700">Rejection reason: {question.rejectionReason}</p>
          </div>
        )} */}
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">Answers</h2>
      {question.answers && question.answers.length > 0 ? (
        question.answers.every(answer => answer.isHidden) ? (
          <p>No answers yet.</p>
        ) : (
          question.answers.map((answer) =>
            !answer.isHidden && answer?.content && (
              <div
                key={answer._id.toString()}
                className={`bg-gray-100 p-4 rounded mb-4 text-base ${answer.isBlurred ? 'opacity-40' : ''}`}
              >
                <div dangerouslySetInnerHTML={{ __html: answer?.content }} />
                <p className="text-sm text-gray-600 mt-2">
                  Answered by: Admin on {dateToLocalTimeDateYear(answer.createdAt.toString())}
                </p>
              </div>
            )
          )
        )
      ) : (
        <p>No answers yet.</p>
      )}


      {
        question?.relatedQuestions?.length ? <div>
          <h2 className="text-xl font-semibold mt-8 mb-4">Related Questions</h2>
          <ul>
            {question.relatedQuestions?.map((relatedQuestion) => (
              <li key={relatedQuestion?._id}>
                <Link href={`/faqs/${relatedQuestion?.kelviId}`} className="flex gap-x-3 text-base hover:underline mb-3">
                  <span className="size-5 flex justify-center items-center rounded-full bg-teal-50 text-teal-500 dark:bg-teal-800/30 dark:text-teal-500">
                    <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span className="text-gray-600 dark:text-white">
                    {relatedQuestion?.question}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div> : <></>
      }


      {
        question.tags?.length ? <div><h2 className="text-xl font-semibold mt-8 mb-4">Tags</h2>
          <ul className="flex flex-wrap gap-2">
            {question.tags.map((tag) => (
              <li key={tag} className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-white hover:bg-gray-200"><Link href={`/faqs/tag/${tag}`}>{tag}</Link></li>
            ))}
          </ul>
        </div> : <></>
      }

    </div>
  )
}

