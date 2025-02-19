import { ThemeProvider } from '@/src/app/common/components/ThemeProvider'
import type { Metadata } from 'next'
import {
  AbstractIntlMessages,
  NextIntlClientProvider,
  useMessages
} from 'next-intl'
import { Inter, Rubik, Space_Grotesk } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import { Header } from '../common/components/Header'
import favicon from './favicon.ico'
import { Toaster } from 'sonner';
import Providers from './Provider'
import { GeistSans } from 'geist/font/sans';
import '../../../assets/fonts/fonts.css';
import 'swiper/css';
import 'swiper/css/navigation';
import './styles/vendors/menu.css';
import './styles/style.css'
import { Footer } from '../common/components/Footer'
import VisitTracker from '../common/library/VisitTracker'
import WhatsAppButton from '../common/elements/whatsAppButton'
import { InitialSession } from './initialSession'


const inter = Inter({
  subsets: ['latin'],
  variable: '--inter'
})
const rubik = Rubik({
  subsets: ['arabic'],
  variable: '--rubik'
})
const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk'
})

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'RxT - A Financial Health Clinic',
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
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = useMessages();
  return (
    <html
      data-theme="light"
      lang={locale}
      dir={locale === 'ar' || locale == 'fa' ? 'rtl' : 'ltr'}
      className={`${space_grotesk.variable} ${rubik.variable} scroll-smooth ${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <ThemeProvider
            enableSystem
            attribute='class'
            defaultTheme='light'
            themes={[
              'light',
              'dark',
              'instagram',
              'facebook',
              'discord',
              'netflix',
              'twilight',
              'reddit'
            ]}
          >
            <NextIntlClientProvider
              locale={locale}
              messages={messages as AbstractIntlMessages}
            >
              <NextTopLoader
                color="#EEBF2D"
                initialPosition={0.08}
                crawlSpeed={200}
                height={3}
                crawl={true}
                showSpinner={true}
                easing="ease"
                speed={200}
                shadow="0 0 10px #008755,0 0 5px #008755"
                template='<div class="bar" role="bar"><div class="peg"></div></div> 
  <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
                zIndex={1600}
                showAtBottom={false}
              />

              <VisitTracker />
              <InitialSession />
              <Header locale={locale} />
              <main className='mx-auto max-w-screen-2xl'>{children}</main>
              <Toaster position="top-center" />
              <WhatsAppButton />
              <Footer locale={locale} />
            </NextIntlClientProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
