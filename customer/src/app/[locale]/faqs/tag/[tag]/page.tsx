import clientPromise from "@/src/app/lib/mongodbConfig"
import PaginatedQuestions from "@/src/app/[locale]/faqs/components/PaginatedQuestions"
import SearchBar from "@/src/app/[locale]/faqs/components/SearchBar"
import CategoryList from "@/src/app/[locale]/faqs/components/CategoryList"
import Link from "next/link"
import { toUrlFriendly } from "@/global"
import { Breadcrumbs } from "../../breadcrumbs/breadcrumbs"

async function getTagQuestions(tag: string, page = 1, limit = 10) {
  const client = await clientPromise
  const db = client.db("qa_database")

  const total = await db.collection("questions").countDocuments({ approved: true, tags: tag })
  const questions = await db
    .collection("questions")
    .find({ approved: true, tags: tag })
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
  const client = await clientPromise
  const db = client.db("qa_database")

  const categories = await db.collection("questions").distinct("category")
  return categories
}

export default async function TagPage({ params, searchParams }) {
  const tag = decodeURIComponent(params.tag).replace(/-/g, " ")
  const page = Number.parseInt(searchParams.page || "1")
  const { questions, totalPages, currentPage } = await getTagQuestions(tag, page)
  const categories = await getCategories()

  return (
    <div className="container mx-auto p-4">
      <Breadcrumbs lastValue={tag} />
      <h1 className="text-3xl font-bold mb-4">Questions tagged with {tag}</h1>
      <div className="flex justify-between items-center mb-4 gap-4">
        <SearchBar />
        <Link href="/faqs/ask" className="bg-primary-800 flex justify-center items-center w-[55px] md:w-[185px] text-white px-4 py-2 rounded transition-all duration-300 hover:bg-primary-900">
          Ask <span className="hidden md:visible">a Question</span>
        </Link>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-3/4">
          <PaginatedQuestions
            initialQuestions={questions as any}
            totalPages={totalPages}
            currentPage={currentPage}
            baseUrl={`/faqs/tag/${toUrlFriendly(tag)}?`}
          />
        </div>
        <div className="md:w-1/4">
          <CategoryList categories={categories} />
        </div>
      </div>
    </div>
  )
}

