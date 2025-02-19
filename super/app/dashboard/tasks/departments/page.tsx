import type { Metadata } from "next"
import DepartmentList from "../components/DepartmentList"

export const metadata: Metadata = {
  title: "Departments | Task Management System",
  description: "Manage your departments",
}

export default function DepartmentsPage() {
  return (
    <div className="h-full flex-1 flex-col px-8 md:flex">
      <DepartmentList />
    </div>
  )
}

