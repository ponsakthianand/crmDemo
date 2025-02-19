import { Metadata } from "next";
import { getCategoryDetails } from "./servicesContent";
import ServiceRequestForm from "./servicesForm";

export async function generateMetadata({ params }): Promise<Metadata> {
  const { serviceId } = params;
  const category = getCategoryDetails(serviceId);

  return {
    title: category?.title || "Service Request",
    description: category?.description || "Request a service from our offerings.",
    openGraph: {
      title: category?.title || "Service Request",
      description: category?.description || "Request a service from our offerings.",
      type: "website",
      images: [
        {
          url: `${category?.image || "https://e5osher1gwoyuako.public.blob.vercel-storage.com/webapp/static/image-not-found-nKKKH17xDpgwzZmkAqDMk8fvUqa7qi.png"}`,
          width: 1200,
          height: 630,
          alt: "Default Image",
        },
      ]
    },
  };
}

export default function Page({ params }) {
  return <ServiceRequestForm params={params} />;
}