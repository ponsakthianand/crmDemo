import { notFound } from "next/navigation"
import { ObjectId } from "mongodb"
import clientPromise from '@/app/lib/mongodbConfig'
import TaskDetailView from "../components/TaskDetailView";
import PageContainer from "@/components/layout/page-container";

export default async function TaskPage({ params }: { params: { id: string } }) {
  const client = await clientPromise
  const collection = client.db("taskmanager").collection("tasks")

  let task
  try {
    task = await collection.findOne({ _id: new ObjectId(params.id) })
  } catch (error) {
    console.error("Error fetching task:", error)
  }

  if (!task) {
    notFound()
  }


  // Convert ObjectId to string and dates to ISO strings
  const serializedTask = {
    ...task,
    _id: task._id.toString(),
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    dueDate: task.dueDate ? task.dueDate.toISOString() : undefined,
    title: task.title,
    completed: task.completed,
    category: task.category,
    priority: task.priority,
    department: task.department,
  }

  return <PageContainer scrollable={true}><TaskDetailView task={serializedTask} /></PageContainer>
}

