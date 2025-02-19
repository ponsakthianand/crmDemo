'use client'
import { Briefcase, FileText, ArrowDownCircle, Home, Shield, Globe } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    title: "Investment Planning",
    introContent: "Navigating investment opportunities while living abroad can be overwhelming, especially with fluctuating market conditions and currency exchange rates. Our team of financial experts works with you to identify the best investment options tailored to your goals, risk tolerance, and time horizon. From mutual funds and shares to real estate and other asset classes, we help you build a diversified portfolio that aligns with your financial aspirations.",
    details: [],
    icon: <Briefcase size={24} />
  },
  {
    title: "Retirement Planning",
    introContent: "For NRIs planning to retire either in India or abroad, we offer customized retirement solutions that ensure financial security. From building a corpus to optimizing income streams during retirement, we help you plan for a stress-free future.",
    details: [],
    icon: <Shield size={24} />
  },
  {
    title: "Tax Compliance",
    introContent: "Understanding and adhering to the tax regulations in both your home country and the country of residence is critical for NRIs. Our tax advisory services are designed to simplify compliance, helping you:",
    details: [
      {
        header: "File Your Income Tax Returns",
        content: "Accurately and on time to avoid penalties and ensure compliance with local tax laws."
      },
      {
        header: "Claim DTAAs Benefits",
        content: "Benefit from the Double Taxation Avoidance Agreements (DTAAs) where applicable."
      },
      {
        header: "Minimize Tax Liabilities",
        content: "We guide you on how to reduce tax burdens while staying compliant with local and international tax regulations."
      }
    ],
    icon: <FileText size={24} />
  },
  {
    title: "Repatriation of Funds",
    introContent: "Transferring money between countries involves strict regulations, documentation, and understanding of exchange controls. Our team assists in:",
    details: [
      {
        header: "Streamlining the Repatriation Process",
        content: "Ensuring your funds are transferred securely and efficiently."
      },
      {
        header: "Complying with RBI Guidelines",
        content: "Helping you navigate the Reserve Bank of India (RBI) guidelines for repatriation."
      },
      {
        header: "Optimizing Foreign Exchange Rates",
        content: "We offer strategies to reduce transaction costs and maximize the value of your repatriated funds."
      }
    ],
    icon: <ArrowDownCircle size={24} />
  },
  {
    title: "Advisory for Real Estate Investments",
    introContent: "Many NRIs seek to invest in property back home. Our services include:",
    details: [
      {
        header: "Evaluating Real Estate Opportunities",
        content: "Identifying high-return investments to help you maximize property value."
      },
      {
        header: "Providing Legal and Tax Guidance",
        content: "Assisting with legal compliance, property documentation, and taxation for real estate transactions."
      },
      {
        header: "Repatriating Sale Proceeds",
        content: "We help you repatriate proceeds when selling property in India."
      }
    ],
    icon: <Home size={24} />
  },
  {
    title: "Succession and Estate Planning",
    introContent: "Managing wealth across multiple geographies requires meticulous planning to ensure a smooth transfer of assets to your heirs. Our experts assist with:",
    details: [
      {
        header: "Drafting Wills and Succession Planning",
        content: "Ensuring that your wealth is properly distributed according to your wishes."
      },
      {
        header: "Establishing Trusts",
        content: "Safeguarding your wealth for future generations."
      },
      {
        header: "Navigating Inheritance Laws",
        content: "Reducing complexities and ensuring a smooth transition for your family."
      }
    ],
    icon: <Globe size={24} />
  }
];


function NRIFinancialServices() {
  return (
    <div className='px-5 py-20 lg:px-32 lg:py-24 text-2xl'>
      <div className="py-12 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
        <section className="bg-white dark:bg-gray-900">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl lg:text-4xl dark:text-white">NRI Financial Services</h1>
            <p className="mb-8 text-base font-normal text-gray-800 lg:text-lg dark:text-gray-400">At RxT: A Financial Health Clinic, we recognize the unique challenges faced by Non-Resident Indians (NRIs) when managing their financial assets across borders. Our NRI Financial Services are designed to simplify these complexities, empowering NRIs to make informed decisions and maximize their financial potential while living abroad. Whether you need assistance with investments, tax compliance, or repatriation of funds, we are here to ensure that your financial journey is seamless and stress-free.</p>
            <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
              <a href="./nri-financial-services/request" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                Learn more
                <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </a>
            </div>
          </div>
        </section>
        <section className="bg-white dark:bg-gray-900 pb-20">
          <div className="">
            <div className="mb-8 text-center lg:mb-16">
              <h2 className="mb-4 text-2xl tracking-tight lg:text-3xl font-extrabold text-gray-900 dark:text-white">Our Approach</h2>
            </div>
            <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-2 md:gap-12 md:space-y-0">
              {services?.map((service, index) => (
                <div key={index} className=''>
                  <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                    {service.icon}
                  </div>
                  <h3 className="mb-2 text-xl font-bold dark:text-white">{service.title}</h3>
                  <p className="text-gray-800 dark:text-gray-400 text-base">{service.introContent}</p>
                  <ul className="list-disc list-outside space-y-5 ps-5 text-lg text-gray-800 dark:text-neutral-200 mt-5">
                    {service.details.map((detail, index) => (
                      <li className="ps-2 text-base" key={index}><span className='font-semibold'>{detail.header}: </span><span>{detail.content}</span></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-900 pb-20">
          <div className="">
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl lg:text-4xl dark:text-white">Why Choose RxT for NRI Financial Services?</h1>
            <ul className="list-disc list-outside space-y-5 ps-5 text-lg text-gray-800 dark:text-neutral-200 mt-5">
              <li className="ps-2 text-base">
                <span className='font-semibold'>Tailored Solutions </span>
                <span>We customize our services to suit your unique needs, financial goals, and geographic considerations.
                </span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Expert Guidance </span>
                <span>Our team stays updated with the latest regulatory changes and market trends to provide you with accurate and timely advice.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Seamless Execution </span>
                <span>We handle the complexities of financial management, allowing you to focus on your personal and professional priorities.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Holistic Approach </span>
                <span>Our comprehensive services cover all aspects of financial planning, ensuring that every decision supports your long-term financial well-being.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Trusted Partner </span>
                <span>With a foundation of integrity, transparency, and excellence, we are committed to being your reliable financial partner.</span>
              </li>
            </ul>
          </div>
        </section>

        <div className="bg-gray-100 relative rounded-xl p-5 sm:py-16 before:absolute before:top-0 before:start-0 before:bg-no-repeat before:bg-top before:bg-contain before:w-2/3 before:h-full before:z-0 dark:bg-neutral-950">
          <div className="max-w-3xl relative z-10 text-center mx-auto">
            <div className="mb-5">
              <h2 className="text-2xl font-bold md:text-3xl dark:text-white">Get Started Today</h2>
              <p className="mt-3 text-gray-800 dark:text-neutral-400 text-base">Managing your finances while living abroad doesn’t have to be complicated. Let us simplify the process for you. Contact RxT: A Financial Health Clinic today to schedule a consultation and take the first step toward achieving your financial goals with confidence.</p>
            </div>
            <Link href='./nri-financial-services/request' className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">Connect us Now!</Link>
          </div>
        </div>

      </div>
    </div>

  );
}

export default NRIFinancialServices;
