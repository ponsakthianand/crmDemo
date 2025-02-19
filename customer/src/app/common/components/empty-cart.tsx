import { CalendarCheck, Handshake, LibraryBig } from "lucide-react";
import Link from "next/link";

export default function EmptyCart() {

  return (

    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="mx-auto max-w-2xl mb-8 lg:mb-14 text-center">
        <h2 className="text-3xl lg:text-4xl text-gray-800 font-bold dark:text-neutral-200">
          Your cart is empty
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
  )
}