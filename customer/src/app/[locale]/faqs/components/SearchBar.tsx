"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search } from "lucide-react"
import { Card, CardContent } from "@/registry/new-york/ui/card"
import { Button } from "@/registry/new-york/ui/button"
import { Input } from "@/registry/new-york/ui/input"

interface SearchResult {
  questions: Array<{ _id: string; kelviId: string; question: string }>
  categories: string[]
  tags: string[]
}

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()
  const searchContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length > 2) {
        const response = await fetch(`/api/questions/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setResults(data)
      } else {
        setResults(null)
      }
    }

    const debounce = setTimeout(() => {
      fetchResults()
    }, 300)

    return () => clearTimeout(debounce)
  }, [query])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/faqs/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <div ref={searchContainerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search questions, categories, or tags..."
          className="w-full block text-base h-12"
        />
        {results && (isFocused || query.length > 2) && (
          <Card className="absolute z-10 w-full mt-1">
            <CardContent className="p-2">
              {results.questions.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2">Questions</h3>
                  <ul className="space-y-1">
                    {results.questions.map((q) => (
                      <li key={q._id.toString()}>
                        <Link href={`/faqs/${q.kelviId}`} className="hover:underline text-sm">
                          {q.question}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {results.categories.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2">Categories</h3>
                  <ul className="space-y-1">
                    {results.categories.map((category) => (
                      <li key={category}>
                        <Link
                          href={`/faqs/category/${encodeURIComponent(category)}`}
                          className="hover:underline text-sm"
                        >
                          {category}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {results.tags.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2">Tags</h3>
                  <ul className="space-y-1">
                    {results.tags.map((tag) => (
                      <li key={tag}>
                        <Link href={`/faqs/tag/${encodeURIComponent(tag)}`} className="hover:underline text-sm">
                          {tag}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Button type="submit" variant="outline" className="w-full mt-2">
                View all results
              </Button>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  )
}



{/* <form onSubmit={handleSubmit} className="relative w-full">
  <div className="relative z-10 flex gap-x-3 bg-white border rounded-lg shadow-lg shadow-gray-100 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-gray-900/20">
    <div className="w-full">
      <label htmlFor="hs-search-article-1" className="block text-sm text-gray-700 font-medium dark:text-white"><span className="sr-only">Search article</span></label>
      <input type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search questions..." className="py-2.5 px-4 block w-full border-transparent rounded-lg focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" />
    </div>
    <Link className="size-[50px] inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-l-none rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" href="#">
      <Search />
    </Link>
  </div>
  {query.length > 2 && (
    <div className="absolute z-10 w-full bg-white border rounded text-sm shadow-2xl mt-[-1px] min-h-16">
      {results?.questions?.length > 0 && (
        <div className="p-2">
          <h3 className="font-semibold">Questions</h3>
          <ul>
            {results?.questions?.slice(0, 3).map((q) => (
              <li key={q._id} className="py-1">
                <Link href={`/faqs/${q._id}`} className="hover:underline">
                  {q.question}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {results?.categories?.length > 0 && (
        <div className="p-2 border-t">
          <h3 className="font-semibold">Categories</h3>
          <ul>
            {results?.categories?.slice(0, 3).map((category) => (
              <li key={category} className="py-1">
                <Link href={`/faqs/category/${encodeURIComponent(category)}`} className="hover:underline">
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {results?.tags?.length > 0 && (
        <div className="p-2 border-t">
          <h3 className="font-semibold">Tags</h3>
          <ul>
            {results?.tags?.slice(0, 3).map((tag) => (
              <li key={tag} className="py-1">
                <Link href={`/faqs/tag/${encodeURIComponent(tag)}`} className="hover:underline">
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="p-2 border-t">
        <Link
          href={`/faqs/search?q=${encodeURIComponent(query)}`}
          className="block text-center hover:underline text-sm"
        >
          View all results
        </Link>
      </div>
    </div>
  )}
   {results?.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded text-sm shadow-2xl mt-[-1px] min-h-16">
          {results?.map((suggestion) => (
            <li key={suggestion._id} className="p-2 hover:bg-gray-100 cursor-pointer">
              <Link href={`/questions/${suggestion._id}`}>{suggestion.question}</Link>
            </li>
          ))}
        </ul>
      )} 
</form> */}