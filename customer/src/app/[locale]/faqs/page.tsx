import clientPromise from "@/src/app/lib/mongodbConfig"
import QuestionList from "./components/QuestionList"
import SearchBar from "./components/SearchBar"
import CategoryList from "./components/CategoryList"
import Link from "next/link"
import { Category } from "@/src/types/qa"

async function getQuestions(page = 1, limit = 10) {
  const client = await clientPromise
  const db = client.db("qa_database")

  const total = await db.collection("questions").countDocuments({ approved: true })
  const questions = await db
    .collection("questions")
    .find({ approved: true })
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

async function getCategories() {
  const client = await clientPromise;
  const db = client.db("qa_database");

  // Get distinct vagaiId values from questions collection
  const availableCategories = await db.collection("questions").distinct("category");

  // Fetch categories that match the availableCategories list
  const categories = await db.collection("categories")
    .find({ vagaiId: { $in: availableCategories.map(id => id) } })
    .toArray();

  return categories as any;
}


export default async function Home({ searchParams }) {
  const page = Number.parseInt(searchParams.page || "1")
  const { questions, totalPages, currentPage } = await getQuestions(page)
  const categories = await getCategories()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions (FAQs)</h1>
      <div className="flex justify-between items-center mb-4 gap-4">
        <SearchBar />
        <Link href="/faqs/ask" className="bg-primary-800 flex justify-center items-center w-[55px] md:w-[185px] text-white px-4 py-2 rounded transition-all duration-300 hover:bg-primary-900">
          Ask <span className="hidden md:visible">a Question</span>
        </Link>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-3/4">
          <QuestionList questions={questions as any} />
          <div className="mt-4 flex justify-between">
            {currentPage > 1 && (
              <Link href={`/faqs/?page=${currentPage - 1}`} className="bg-blue-500 text-white px-4 py-2 rounded">
                Previous
              </Link>
            )}
            {currentPage < totalPages && (
              <Link href={`/faqs/?page=${currentPage + 1}`} className="bg-blue-500 text-white px-4 py-2 rounded">
                Next
              </Link>
            )}
          </div>
        </div>
        <div className="md:w-1/4">
          <CategoryList categories={categories} />
        </div>
      </div>
    </div>
  )
}

