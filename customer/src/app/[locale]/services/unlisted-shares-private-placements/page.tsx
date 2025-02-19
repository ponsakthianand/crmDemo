'use client'
import Link from 'next/link';
import { Search, Target, FileText, Monitor } from 'lucide-react';

const services = [
  {
    title: "Market Research and Analysis",
    introContent: "Investing in unlisted shares and private placements requires in-depth knowledge of the market and company fundamentals. Our team conducts:",
    details: [
      {
        header: "Comprehensive Research",
        content: "We identify high-potential opportunities by conducting thorough research on companies, projects, and industries."
      },
      {
        header: "Due Diligence",
        content: "We perform detailed checks on companies, management teams, and projects to ensure their credibility and viability."
      },
      {
        header: "Industry Trends Analysis",
        content: "We analyze industry trends and market dynamics to minimize risks and make well-informed decisions."
      }
    ],
    icon: <Search size={24} />
  },
  {
    title: "Investment Strategy Development",
    introContent: "We work closely with you to develop a personalized investment strategy that aligns with your financial goals. This includes:",
    details: [
      {
        header: "Risk Tolerance Assessment",
        content: "We assess your risk tolerance and time horizon to ensure the strategy fits your financial situation."
      },
      {
        header: "Opportunity Identification",
        content: "We help identify investment opportunities that complement and enhance your existing portfolio."
      },
      {
        header: "Maximizing Returns",
        content: "We structure investments to maximize returns while carefully mitigating associated risks."
      }
    ],
    icon: <Target size={24} />
  },
  {
    title: "Transaction Support",
    introContent: "Navigating the complexities of unlisted share investments and private placements can be challenging. We assist with:",
    details: [
      {
        header: "Documentation and Compliance",
        content: "We help you meet all necessary documentation and compliance requirements to ensure smooth transactions."
      },
      {
        header: "Valuation and Negotiation",
        content: "Our team provides support in valuing the investment and negotiating terms to your advantage."
      },
      {
        header: "Seamless Transactions",
        content: "We facilitate secure and seamless transactions, ensuring that every step of the process is handled efficiently."
      }
    ],
    icon: <FileText size={24} />
  },
  {
    title: "Portfolio Monitoring and Updates",
    introContent: "Once you’ve invested, we provide ongoing support to track the performance of your investments. Our regular updates and market insights ensure you stay informed and can make timely decisions to optimize your portfolio.",
    details: [],
    icon: <Monitor size={24} />
  }
];


function FinancialEducation() {
  return (
    <div className='px-5 py-20 lg:px-32 lg:py-24 text-2xl'>
      <div className="py-12 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
        <section className="bg-white dark:bg-gray-900">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl lg:text-4xl dark:text-white">Unlisted Shares | Private Placements</h1>
            <p className="mb-8 text-base font-normal text-gray-800 lg:text-lg dark:text-gray-400">At RxT: A Financial Health Clinic, we provide exclusive access to unique investment opportunities in unlisted shares and private placements. These high-potential investment avenues can offer substantial returns but often require deep market insights and careful navigation. Our expertise ensures that you can seize these opportunities with confidence, backed by detailed research and personalized guidance.</p>
            <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
              <a href="./unlisted-shares-private-placements/request" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                Learn more
                <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </a>
            </div>
          </div>
        </section>
        <section className="bg-white dark:bg-gray-900 pb-20">
          <div className="">
            <h2 className="text-2xl text-center font-bold md:text-3xl mb-8 md:leading-tight text-gray-800 dark:text-neutral-200">
              What are Unlisted Shares and Private Placements?
            </h2>
            <div className="max-w-5xl mx-auto">
              <div className="grid sm:grid-cols-2 gap-6 md:gap-12">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
                    Holistic Approach
                  </h3>
                  <p className="mt-2 text-gray-800 dark:text-neutral-400 text-base">
                    Unlisted Shares: These are shares of companies that are not listed on a recognized stock exchange. Investing in unlisted shares allows you to gain early access to promising companies with high growth potential, often before they go public.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
                    Private Placements
                  </h3>
                  <p className="mt-2 text-gray-800 dark:text-neutral-400 text-base">
                    Private placements involve the sale of securities to a select group of investors, typically high-net-worth individuals, institutional investors, or venture capitalists. These offerings are not made available to the general public and provide opportunities to invest in exclusive projects or ventures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-white dark:bg-gray-900 pb-20">
          <div>
            <h2 className="text-2xl text-center font-bold md:text-3xl mb-8 md:leading-tight text-gray-800 dark:text-neutral-200">
              Why Invest in Unlisted Shares and Private Placements?
            </h2>
            <div className="max-w-5xl mx-auto">
              <div className="grid sm:grid-cols-2 gap-6 md:gap-12">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
                    High Growth Potential
                  </h3>
                  <p className="mt-2 text-gray-800 dark:text-neutral-400 text-base">
                    Gain exposure to innovative companies and early-stage businesses with significant growth opportunities.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
                    Diversification
                  </h3>
                  <p className="mt-2 text-gray-800 dark:text-neutral-400 text-base">
                    Expand your investment portfolio by including unique asset classes that are less correlated with public markets.
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6 md:gap-12 mt-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
                    Early Investment Advantage
                  </h3>
                  <p className="mt-2 text-gray-800 dark:text-neutral-400 text-base">
                    Capture value early by investing in companies before they are listed on public stock exchanges.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
                    Customized Opportunities
                  </h3>
                  <p className="mt-2 text-gray-800 dark:text-neutral-400 text-base">
                    Participate in tailored private placements aligned with your financial goals and risk tolerance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-white dark:bg-gray-900 pb-20">
          <div className="">
            <div className="mb-8 text-center lg:mb-16">
              <h2 className="mb-4 text-2xl tracking-tight lg:text-3xl font-extrabold text-gray-900 dark:text-white">Services</h2>
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
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl lg:text-4xl dark:text-white">Benefits of Choosing RxT for Unlisted Shares and Private Placements</h1>
            <ul className="list-disc list-outside space-y-5 ps-5 text-lg text-gray-800 dark:text-neutral-200 mt-5">
              <li className="ps-2 text-base">
                <span className='font-semibold'>Expert Guidance: </span>
                <span> Leverage our deep expertise and market knowledge to make informed investment decisions.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Access to Exclusive Opportunities: </span>
                <span> Gain entry to high-quality investment options typically reserved for institutional investors.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Tailored Solutions: </span>
                <span> Our strategies are customized to suit your financial goals and risk appetite.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Transparency and Integrity: </span>
                <span> We prioritize your trust and ensure complete transparency throughout the investment process.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>End-to-End Support: </span>
                <span> From identifying opportunities to post-investment monitoring, we provide comprehensive support at every step.</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-900 pb-20">
          <div className="">
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl lg:text-4xl dark:text-white">Why Trust RxT?</h1>
            <div>At RxT: A Financial Health Clinic, we are committed to helping you unlock the potential of unlisted shares and private placements. With our proven expertise and client-centric approach, we make investing in these exclusive markets accessible and rewarding.</div>
          </div>
        </section>

        <div className="bg-gray-100 relative rounded-xl p-5 sm:py-16 before:absolute before:top-0 before:start-0 before:bg-no-repeat before:bg-top before:bg-contain before:w-2/3 before:h-full before:z-0 dark:bg-neutral-950">
          <div className="max-w-3xl relative z-10 text-center mx-auto">
            <div className="mb-5">
              <h2 className="text-2xl font-bold md:text-3xl dark:text-white">Get Started Today</h2>
              <p className="mt-3 text-gray-800 dark:text-neutral-400 text-base">Ready to explore high-potential investment opportunities? Contact RxT: A Financial Health Clinic today to schedule a consultation and learn how you can benefit from our Unlisted Shares and Private Placements services.
              </p>
            </div>
            <Link href='./unlisted-shares-private-placements/request' className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">Connect us Now!</Link>
          </div>
        </div>

      </div>
    </div>

  );
}

export default FinancialEducation;
