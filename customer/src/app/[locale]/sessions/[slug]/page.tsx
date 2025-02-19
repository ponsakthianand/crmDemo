import { Metadata } from "next";
import { EventPage } from "./eventsPage";
import axios from "axios";
import { stripHtmlTags } from "@/global";

export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = params;

  let event;

  try {
    // Replace the URL with your actual API endpoint
    const response = await axios.get(`${process.env.NEXTAUTH_URL}/api/pages/events/${slug}`);
    event = response.data;
  } catch (error) {
    console.error("Error fetching service data:", error);
  }

  const description = stripHtmlTags(event.description) || "Request a service from our offerings."

  return {
    title: event.title || "Book our Services",
    description: description,
    openGraph: {
      title: event.title || "Book our Services",
      description: description,
      type: "website",
      images: [
        {
          url: event.image[0] || "https://e5osher1gwoyuako.public.blob.vercel-storage.com/webapp/static/image-not-found-nKKKH17xDpgwzZmkAqDMk8fvUqa7qi.png",
          width: 1200,
          height: 630,
          alt: "Default Image",
        },
      ]
    },
  };
}

export default function Page({ params }) {
  return <EventPage params={params} />;
}