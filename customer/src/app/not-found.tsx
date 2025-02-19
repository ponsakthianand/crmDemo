import Logo from "@/assets/branding/logo";
import { CalendarCheck, CircleOff, Handshake, LibraryBig } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '404 - RxT - A Financial Health Clinic',
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

export default function NotFound() {

  return (
    <>
      <div className="flex justify-center items-center mt-10"><Logo className="w-56" /></div>
      <main className="container mx-auto flex flex-1 flex-col gap-0 md:flex-row md:gap-12 lg:gap-16 lg:px-20 lg:py-16 px-8 py-16">
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <div className="mx-auto max-w-2xl mb-8 lg:mb-14 text-center">
            <div className="flex justify-center items-center"><CircleOff className="w-28 h-28 text-red-400" /></div>
            <h2 className="text-3xl lg:text-4xl text-gray-800 font-bold dark:text-neutral-200">
              Looking for something?
            </h2>
            <p className="mt-3 text-gray-800 dark:text-neutral-200">
              Explore our courses, book our services, or feel free to contact us for guidance!
            </p>
          </div>

          <div className="max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              <Link className="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md focus:outline-none focus:shadow-md transition dark:bg-neutral-900 dark:border-neutral-800" href="/courses">
                <div className="p-4 md:p-5">
                  <div className="flex gap-x-5">
                    <LibraryBig className="h-14 w-14 text-cyan-600" />

                    <div className="grow">
                      <h3 className="group-hover:text-primary-800 font-semibold text-gray-800 dark:group-hover:text-neutral-400 dark:text-neutral-200">
                        Courses
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-neutral-500">
                        Discover our courses to boost your skills and financial health
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link className="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md focus:outline-none focus:shadow-md transition dark:bg-neutral-900 dark:border-neutral-800" href="/sessions">
                <div className="p-4 md:p-5">
                  <div className="flex gap-x-5">
                    <CalendarCheck className="h-14 w-14 text-cyan-600" />

                    <div className="grow">
                      <h3 className="group-hover:text-primary-800 font-semibold text-gray-800 dark:group-hover:text-neutral-400 dark:text-neutral-200">
                        Our Exclusive Sessions
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-neutral-500">
                        Book our services for expert financial solutions tailored to your needs
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link className="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md focus:outline-none focus:shadow-md transition dark:bg-neutral-900 dark:border-neutral-800" href="/contact">
                <div className="p-4 md:p-5">
                  <div className="flex gap-x-5">
                    <Handshake className="h-14 w-14 text-cyan-600" />

                    <div className="grow">
                      <h3 className="group-hover:text-primary-800 font-semibold text-gray-800 dark:group-hover:text-neutral-400 dark:text-neutral-200">
                        Connect
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-neutral-500">
                        Have questions? Contact us for friendly support and expert guidance!
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-12 items-center gap-x-2 sm:gap-x-6 lg:gap-x-8">
            <div className="hidden md:block col-span-4 md:col-span-3">
              <img className="rounded-xl" src="https://images.unsplash.com/photo-1606868306217-dbf5046868d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=920&q=80" alt="Features Image" />
            </div>

            <div className="col-span-4 md:col-span-3">
              <img className="rounded-xl" src="https://images.unsplash.com/photo-1587613991119-fbbe8e90531d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=920&q=80" alt="Features Image" />
            </div>

            <div className="col-span-4 md:col-span-3">
              <img className="rounded-xl" src="https://images.unsplash.com/photo-1554295405-abb8fd54f153?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=920&q=80" alt="Features Image" />
            </div>

            <div className="col-span-4 md:col-span-3">
              <img className="rounded-xl" src="https://images.unsplash.com/photo-1640622300473-977435c38c04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=920&q=80" alt="Features Image" />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}