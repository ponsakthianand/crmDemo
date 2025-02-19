import Link from "next/link"
import type { CategoryListProps } from "@/src/types/qa"


export default function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="bg-white p-4 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category._id} className="!m-0">
            <Link href={`/faqs/category/${category.slug}`} className="text-primary-800 text-base hover:underline">
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

