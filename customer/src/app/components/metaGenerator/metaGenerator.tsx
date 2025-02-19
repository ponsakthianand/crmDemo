import { Metadata } from "next";

export async function generateMetadata(title: string, description?: string, images?: string[], keywords?: string): Promise<Metadata> {
  return {
    title: title || 'RxT - A Financial Health Clinic',
    description: description || 'RxT is your one-stop financial health clinic offering expert guidance on loans, insurance, tax consultations, and investment planning. Achieve your financial goals with personalized solutions tailored to your needs.',
    icons: 'https://e5osher1gwoyuako.public.blob.vercel-storage.com/branding/favicon-Bt1qE6Apr3QkKgqftJ4uLAahqci1ia.ico',
    keywords: keywords || 'loans, insurance, tax consultations, investment planning',
    openGraph: {
      title: title || 'RxT - A Financial Health Clinic',
      description: description || 'RxT is your one-stop financial health clinic offering expert guidance on loans, insurance, tax consultations, and investment planning. Achieve your financial goals with personalized solutions tailored to your needs.',
      type: "website",
      images: images || [
        {
          url: "https://e5osher1gwoyuako.public.blob.vercel-storage.com/webapp/static/image-not-found-nKKKH17xDpgwzZmkAqDMk8fvUqa7qi.png",
          width: 1200,
          height: 630,
          alt: "Default Image",
        },
      ]
    },
  };
} 