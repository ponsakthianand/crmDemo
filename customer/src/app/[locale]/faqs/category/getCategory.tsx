'use client'
import { Category } from "@/src/types/qa";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function GetCategory({ vagaiId }) {
  const [category, setCategory] = useState<Category>();

  const fetchCategory = async () => {
    const response = await fetch(`/api/questions/categories?cat=${vagaiId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    if (response.ok) {
      const data = await response.json()
      setCategory(data)
    }
  };

  useEffect(() => {
    if (vagaiId) {
      fetchCategory();
    }
  }, [vagaiId]);

  return (
    <>
      {category && (<>
        <Link href={`/faqs/category/${category.slug}`} className="hover:underline">
          {category.name}
        </Link> &nbsp;
        {` · `}
      </>)}
    </>
  )
}

