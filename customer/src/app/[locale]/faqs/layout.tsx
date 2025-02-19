import { ThemeProvider } from '@/src/app/common/components/ThemeProvider'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'FAQs - RxT - A Financial Health Clinic',
    description: 'RxT is your one-stop financial health clinic offering expert guidance on loans, insurance, tax consultations, and investment planning. Achieve your financial goals with personalized solutions tailored to your needs.',
    icons: 'https://e5osher1gwoyuako.public.blob.vercel-storage.com/branding/favicon-Bt1qE6Apr3QkKgqftJ4uLAahqci1ia.ico',
    openGraph: {
      title: 'RxT - A Financial Health Clinic',
      description: 'RxT is your one-stop financial health clinic offering expert guidance on loans, insurance, tax consultations, and investment planning. Achieve your financial goals with personalized solutions tailored to your needs.',
      type: "website",
      images: [
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="max-w-[85rem] px-4 py-24 sm:px-6 lg:px-8 lg:py-28 mx-auto">{children}</div>
  )
}
