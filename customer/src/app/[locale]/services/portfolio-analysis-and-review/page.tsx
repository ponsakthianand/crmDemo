'use client'
import { Target, PieChart, TrendingUp, RefreshCcw, LifeBuoy } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    title: "Goal Assessment",
    introContent: "We start by understanding your current financial goals, risk tolerance, and time horizon. Whether you're planning for retirement, buying a home, or funding education, we tailor our approach to your unique objectives.",
    details: [],
    icon: <Target size={24} />
  },
  {
    title: "Performance Review",
    introContent: "We conduct an in-depth review of your portfolio’s historical performance, identifying underperforming assets, overexposure to certain sectors, or imbalances that may hinder growth.",
    details: [],
    icon: <TrendingUp size={24} />
  },
  {
    title: "Portfolio Evaluation",
    introContent: "Using advanced tools and methodologies, we analyze your existing portfolio to assess:",
    details: [
      {
        header: "Asset Allocation and Diversification",
        content: "Ensuring a balanced distribution across various asset classes."
      },
      {
        header: "Risk Exposure and Performance Consistency",
        content: "Evaluating how your portfolio performs across market cycles."
      },
      {
        header: "Alignment with Market Trends and Economic Indicators",
        content: "Assessing how well your investments align with current market trends and economic signals."
      }
    ],
    icon: <PieChart size={24} />
  },
  {
    title: "Optimization Recommendations",
    introContent: "Based on our evaluation, we provide actionable recommendations to optimize your portfolio. These may include:",
    details: [
      {
        header: "Rebalancing Your Portfolio",
        content: "Maintaining the desired risk-return profile by adjusting the asset allocation."
      },
      {
        header: "Reallocating Assets",
        content: "Taking advantage of market opportunities and repositioning investments."
      },
      {
        header: "Exiting Misaligned Investments",
        content: "Cutting ties with investments that no longer serve your financial goals."
      }
    ],
    icon: <RefreshCcw size={24} />
  },
  {
    title: "Ongoing Monitoring and Support",
    introContent: "Financial markets are ever-changing, and staying ahead requires continuous monitoring. Our team provides regular updates, performance reports, and strategic guidance to ensure your portfolio remains resilient and aligned with your goals.",
    details: [],
    icon: <LifeBuoy size={24} />
  }
];


function PortfolioAndAnalysys() {
  return (
    <div className='px-5 py-20 lg:px-32 lg:py-24 text-2xl'>
      <div className="py-12 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
        <section className="bg-white dark:bg-gray-900">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl lg:text-4xl dark:text-white">Portfolio Analysis & Review</h1>
            <p className="mb-8 text-base font-normal text-gray-800 lg:text-lg dark:text-gray-400">At RxT: A Financial Health Clinic, we understand that managing an investment portfolio is an ongoing process that requires consistent monitoring, analysis, and adjustments. A well-structured portfolio not only aligns with your financial goals but also helps mitigate risks in a dynamic market environment. Our Portfolio Analysis & Review service is designed to ensure that your investments remain on track and deliver optimal performance.</p>
            <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
              <a href="./portfolio-analysis-and-review/request" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                Learn more
                <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </a>
            </div>
          </div>
        </section>
        <section className="bg-white dark:bg-gray-900 pb-20">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl lg:text-4xl dark:text-white">Why Portfolio Analysis & Review is Essential</h1>
            <p className="mb-8 text-base font-normal text-gray-800 lg:text-lg dark:text-gray-400">Your investment portfolio reflects your financial aspirations, risk tolerance, and time horizon. However, market conditions, personal circumstances, and financial goals evolve over time. Without regular reviews, portfolios may drift from their intended objectives, leading to suboptimal returns or exposure to unnecessary risks. Through our comprehensive portfolio analysis and review process, we help you:</p>
            <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
              <ul className="space-y-2 text-sm sm:text-base">
                <li className="flex gap-x-3">
                  <span className="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-800/30 dark:text-blue-500">
                    <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </span>
                  <span className="text-gray-800 dark:text-neutral-200">
                    Stay aligned with your financial goals.
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <span className="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-800/30 dark:text-blue-500">
                    <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </span>
                  <span className="text-gray-800 dark:text-neutral-200">
                    Identify and mitigate risks.
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <span className="mt-0.5 size-5 flex justify-center items-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-800/30 dark:text-blue-500">
                    <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </span>
                  <span className="text-gray-800 dark:text-neutral-200">
                    Maximize the potential of your investments.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section className="bg-white dark:bg-gray-900 pb-20">
          <div className="">
            <div className="mb-8 text-center lg:mb-16">
              <h2 className="mb-4 text-2xl tracking-tight lg:text-3xl font-extrabold text-gray-900 dark:text-white">Our Approach</h2>
              <p>Our portfolio analysis and review service follows a structured, personalized process that combines data-driven insights with expert advice. Here’s how we work:</p>
            </div>
            <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-2 md:gap-12 md:space-y-0">
              {services?.map((service, index) => (
                <div key={index} className='last:col-span-2'>
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
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl lg:text-4xl dark:text-white">Benefits of Our Portfolio Analysis & Review Service</h1>
            <ul className="list-disc list-outside space-y-5 ps-5 text-lg text-gray-800 dark:text-neutral-200 mt-5">
              <li className="ps-2 text-base">
                <span className='font-semibold'>Customized Insights </span>
                <span> Our recommendations are tailored to your unique financial goals and risk appetite.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Risk Management </span>
                <span> We help you identify and mitigate risks, ensuring that your portfolio is prepared for market fluctuations.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Optimized Returns </span>
                <span> Through expert advice and informed decision-making, we help maximize the potential of your investments.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Transparency and Clarity </span>
                <span> We provide clear, data-driven insights to help you understand the health and performance of your portfolio.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Proactive Approach </span>
                <span> By staying ahead of market trends, we ensure that your portfolio evolves with changing circumstances.</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-900 pb-20">
          <div className="">
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl lg:text-4xl dark:text-white">Why Choose RxT for Portfolio Analysis & Review?</h1>
            <ul className="list-disc list-outside space-y-5 ps-5 text-lg text-gray-800 dark:text-neutral-200 mt-5">
              <li className="ps-2 text-base">
                <span className='font-semibold'>Expertise You Can Trust </span>
                <span> Our team of financial experts leverages years of experience and cutting-edge tools to deliver precise and actionable insights.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Holistic Perspective </span>
                <span> We look beyond numbers, considering your personal goals and financial behavior to create strategies that work for you.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Commitment to Excellence </span>
                <span> With integrity and transparency at our core, we are dedicated to helping you achieve lasting financial success.</span>
              </li>
            </ul>
          </div>
        </section>

        <div className="bg-gray-100 relative rounded-xl p-5 sm:py-16 before:absolute before:top-0 before:start-0 before:bg-no-repeat before:bg-top before:bg-contain before:w-2/3 before:h-full before:z-0 dark:bg-neutral-950">
          <div className="max-w-3xl relative z-10 text-center mx-auto">
            <div className="mb-5">
              <h2 className="text-2xl font-bold md:text-3xl dark:text-white">Get Started Today</h2>
              <p className="mt-3 text-gray-800 dark:text-neutral-400 text-base">Take control of your financial future with confidence. Contact RxT: A Financial Health Clinic today to schedule your portfolio analysis and review session. Let us help you optimize your investments and achieve your financial goals with ease.</p>
            </div>
            <Link href='./portfolio-analysis-and-review/request' className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">Connect us Now!</Link>
          </div>
        </div>

      </div>
    </div>

  );
}

export default PortfolioAndAnalysys;
