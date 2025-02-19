"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function QuestionForm() {
  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [question, setQuestion] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage("")

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phoneNumber, question, category, tags: tags.split(",").map((tag) => tag.trim()) }),
      })

      if (response.ok) {
        setMessage("Your question has been submitted and will be visible once approved.")
        setName("")
        setPhoneNumber("")
        setQuestion("")
        setCategory("")
        setTags("")
        router.refresh()
      } else {
        setMessage("Failed to submit question. Please try again.")
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.")
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your Name"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Phone Number"
        required
        className="w-full p-2 border rounded"
      />
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Your Question"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma-separated)"
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full p-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
      >
        {isSubmitting ? "Submitting..." : "Submit Question"}
      </button>
      {message && <p className="text-center text-green-600">{message}</p>}
    </form>
  )
}

