import clientPromise from "@/src/app/lib/mongodbConfig"
import Link from "next/link"
import { Breadcrumbs } from "../breadcrumbs/breadcrumbs"

async function getCategoriesAndTags() {
  const client = await clientPromise
  const db = client.db("qa_database")

  const categories = await db.collection("questions").distinct("category")
  const tags = await db.collection("questions").distinct("tags")

  return { categories, tags }
}

export default async function BrowsePage() {
  const { categories, tags } = await getCategoriesAndTags()

  return (
    <div className="container mx-auto p-4">
      <Breadcrumbs lastValue={'Browse'} />
      <h1 className="text-3xl font-bold mb-4">Browse Questions</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Categories</h2>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category}>
                <Link href={`/faqs/category/${encodeURIComponent(category)}`} className="text-blue-500 hover:underline">
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/faqs/tag/${encodeURIComponent(tag)}`}
                className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

