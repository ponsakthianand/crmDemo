
import Link from "next/link"
import SearchBar from "../components/SearchBar"
import QuestionList from "../components/QuestionList"
import { dbConnect } from "@/src/app/lib/dbConnect"
import { Breadcrumbs } from "../breadcrumbs/breadcrumbs"

async function searchQuestions(query: string, page = 1, limit = 10) {
  const { db } = await dbConnect()

  const total = await db.collection("questions").countDocuments({
    $and: [
      { approved: true },
      {
        $or: [
          { question: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
          { tags: { $regex: query, $options: "i" } },
          { answers: { $elemMatch: { content: { $regex: query, $options: "i" } } } },
        ],
      },
    ],
  })

  const questions = await db
    .collection("questions")
    .find({
      $and: [
        { approved: true },
        {
          $or: [
            { question: { $regex: query, $options: "i" } },
            { category: { $regex: query, $options: "i" } },
            { tags: { $regex: query, $options: "i" } },
            { answers: { $elemMatch: { content: { $regex: query, $options: "i" } } } },
          ],
        },
      ],
    })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray()

  return {
    questions,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  }
}

export default async function SearchPage({ searchParams }) {
  const query = searchParams.q || ""
  const page = Number.parseInt(searchParams.page || "1")
  const { questions, totalPages, currentPage } = await searchQuestions(query, page)

  return (
    <div className="container mx-auto p-4">
      <Breadcrumbs lastValue={'Search'} />
      <h1 className="text-3xl font-bold mb-4">Search Results for "{query}"</h1>
      <div className="mb-4">
        <SearchBar />
      </div>
      <div className="mb-4">
        <QuestionList questions={questions as any} />
      </div>
      <div className="flex justify-between">
        {currentPage > 1 && (
          <Link
            href={`/search?q=${encodeURIComponent(query)}&page=${currentPage - 1}`}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Previous
          </Link>
        )}
        {currentPage < totalPages && (
          <Link
            href={`/search?q=${encodeURIComponent(query)}&page=${currentPage + 1}`}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  )
}

