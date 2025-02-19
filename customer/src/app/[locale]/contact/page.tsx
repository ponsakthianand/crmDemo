import { useTranslations } from 'next-intl'
import { ContactLeads } from './ContactLeads/leads'

export default function About() {

  const t = useTranslations('')
  return (
    <div className='px-2 py-24 lg:px-32 lg:py-24 text-center text-2xl'>

      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="max-w-2xl lg:max-w-5xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">
              Contact us
            </h1>
            <p className="mt-1 text-gray-600 dark:text-neutral-400">
              We'd love to talk about how we can help you.
            </p>
          </div>

          <div className="mt-12 grid items-center lg:grid-cols-2 gap-6 lg:gap-16">
            <div className="flex flex-col border rounded-xl p-4 sm:p-6 lg:p-8 dark:border-neutral-700">
              <h2 className="mb-8 text-xl font-semibold text-gray-800 dark:text-neutral-200">
                Submit your Query
              </h2>

              <ContactLeads category='Other' column={1} />
            </div>

            <div className="space-y-8 lg:space-y-16">
              <div>
                <h3 className="mb-5 font-semibold text-black dark:text-white">
                  Our address
                </h3>

                <div className="">
                  <div className="flex justify-center flex-col items-center">
                    <svg className="shrink-0 size-5 text-gray-500 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>

                    <div className="grow">
                      <p className="text-sm text-gray-600 dark:text-neutral-400">
                        India
                      </p>
                      <address className="mt-1 text-black not-italic dark:text-white text-base">
                        3rd Floor, Old No. 47, New no. 26, <br />Brindavan St Extension, West Mambalam, <br />Chennai, Tamil Nadu 600033.
                      </address>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-5 font-semibold text-black dark:text-white">
                  Our contacts
                </h3>

                <div className="">
                  <div className="flex justify-center flex-col items-center mb-9">
                    <svg className="shrink-0 size-5 text-gray-500 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"></path><path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"></path></svg>

                    <div className="grow">
                      <p className="text-sm text-gray-600 dark:text-neutral-400">
                        Email us
                      </p>
                      <p>
                        <a className="relative inline-block font-medium text-black before:absolute before:bottom-0.5 before:start-0 before:-z-[1] before:w-full before:h-1 before:bg-lime-400 hover:before:bg-black focus:outline-none focus:before:bg-black dark:text-white dark:hover:before:bg-white dark:focus:before:bg-white text-base" href="mailto:info@rxtn.in">
                          info@rxtn.in
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center flex-col items-center">
                    <svg className="shrink-0 size-5 text-gray-500 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>

                    <div className="grow">
                      <p className="text-sm text-gray-600 dark:text-neutral-400">
                        Call us
                      </p>
                      <p>
                        <a className="relative inline-block font-medium text-black before:absolute before:bottom-0.5 before:start-0 before:-z-[1] before:w-full before:h-1 before:bg-lime-400 hover:before:bg-black focus:outline-none focus:before:bg-black dark:text-white dark:hover:before:bg-white dark:focus:before:bg-white text-base" href="+919962340067">
                          +91 99623 40067
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
