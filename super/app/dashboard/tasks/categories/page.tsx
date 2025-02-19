import type { Metadata } from "next"
import CategoryList from "../components/CategoryList"

export const metadata: Metadata = {
  title: "Categories | Task Management System",
  description: "Manage your task categories",
}

export default function CategoriesPage() {
  return (
    <div className="h-full flex-1 flex-col px-8 md:flex">
      <CategoryList />
    </div>
  )
}

