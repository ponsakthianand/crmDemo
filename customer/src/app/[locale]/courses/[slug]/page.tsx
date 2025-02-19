import { Metadata } from "next";
import axios from "axios";
import { stripHtmlTags } from "@/global";
import CoursePage from "./coursePage";

export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = params;

  let course;

  try {
    // Replace the URL with your actual API endpoint
    const response = await axios.get(`${process.env.NEXTAUTH_URL}/api/pages/courses/${slug}`);
    course = response.data;
  } catch (error) {
    console.error("Error fetching service data:", error);
  }

  const description = stripHtmlTags(course?.description) || "Request a service from our offerings."

  return {
    title: course?.title || "Book our Services",
    description: description,
    openGraph: {
      title: course?.title || "Book our Services",
      description: description,
      type: "website",
      images: [
        {
          url: course?.image[0] || "https://e5osher1gwoyuako.public.blob.vercel-storage.com/webapp/static/image-not-found-nKKKH17xDpgwzZmkAqDMk8fvUqa7qi.png",
          width: 1200,
          height: 630,
          alt: "Default Image",
        },
      ]
    },
  };
}

export default function Page({ params }) {
  return <CoursePage params={params} />;
}