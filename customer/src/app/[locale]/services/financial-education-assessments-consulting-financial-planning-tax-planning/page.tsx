'use client'
import { Book, BarChart, Users, Calendar, DollarSign } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    title: "Financial Education",
    introContent: "Financial education is the foundation upon which all good financial decisions are built. At RxT, we offer comprehensive educational programs to help you enhance your financial literacy.",
    details: [
      {
        header: "Workshops & Seminars",
        content: "We host regular workshops and seminars that cover key financial topics such as budgeting, investing, retirement planning, and managing debt. These sessions are designed to provide practical knowledge that you can immediately apply to your financial situation."
      },
      {
        header: "Personalized Coaching",
        content: "Whether you're looking to improve your understanding of specific financial concepts or need one-on-one guidance, our coaches work with you to deepen your knowledge and build your financial confidence."
      },
      {
        header: "Resource Materials",
        content: "We provide access to a variety of educational resources, including articles, books, videos, and tools, so you can continue learning and improving your financial literacy at your own pace."
      }
    ],
    icon: <Book size={24} />
  },
  {
    title: "Financial Assessments",
    introContent: "Understanding where you stand financially is the first step towards achieving your goals. Our Financial Assessments help you identify your current financial situation, strengths, and areas for improvement.",
    details: [
      {
        header: "Comprehensive Analysis",
        content: "We evaluate your income, expenses, debts, savings, and investments to give you a clear picture of your financial health. This assessment forms the basis for creating a strategy that will help you reach your financial goals."
      },
      {
        header: "Goal Setting",
        content: "Based on your financial situation, we help you set realistic and achievable goals. Whether you're planning for retirement, saving for a home, or reducing debt, we ensure your goals align with your financial reality."
      },
      {
        header: "Cash Flow & Budgeting",
        content: "We assess your cash flow to ensure you're managing your expenses effectively. Our team will provide guidance on budgeting and managing money in a way that supports your goals and builds long-term wealth."
      }
    ],
    icon: <BarChart size={24} />
  },
  {
    title: "Consulting Services",
    introContent: "RxT offers expert financial consulting services tailored to your needs. Whether you're an individual or a business, we help you navigate complex financial decisions with confidence.",
    details: [
      {
        header: "Investment Consulting",
        content: "We provide expert advice on investment strategies that are designed to maximize returns and minimize risks. Whether you're investing in stocks, bonds, mutual funds, or real estate, we help you create a plan that suits your goals and risk tolerance."
      },
      {
        header: "Business Financial Consulting",
        content: "For business owners, we offer consulting services to help with financial planning, tax optimization, and cash flow management. Our services are designed to improve your business's financial health and growth."
      },
      {
        header: "Debt & Credit Management",
        content: "Our consultants assist in managing debt, improving credit scores, and finding ways to reduce interest costs, ensuring that you achieve financial freedom faster."
      }
    ],
    icon: <Users size={24} />
  },
  {
    title: "Financial Planning",
    introContent: "Financial planning is about creating a roadmap that leads to financial security and success. RxT’s Financial Planning services are designed to help you set, track, and achieve your financial goals.",
    details: [
      {
        header: "Customized Financial Plans",
        content: "We tailor financial plans based on your unique circumstances, including your current financial position, short-term and long-term goals, risk appetite, and investment preferences. Our approach ensures that your plan is realistic and actionable."
      },
      {
        header: "Retirement Planning",
        content: "Planning for retirement can be challenging, but it’s essential for financial security. We help you set up a plan that ensures you save enough to maintain your lifestyle and cover future expenses."
      },
      {
        header: "Estate Planning",
        content: "We provide guidance on estate planning to ensure that your assets are distributed according to your wishes. This includes will preparation, trust formation, and succession planning for businesses or families."
      },
      {
        header: "Education Funding",
        content: "We assist with planning for your children’s education, whether it’s saving for college or preparing for other educational expenses."
      }
    ],
    icon: <Calendar size={24} />
  },
  {
    title: "Tax Planning",
    introContent: "Tax planning is an essential aspect of financial health that can significantly impact your overall financial outcomes. At RxT, our tax planning services are designed to help you minimize tax liabilities while maximizing your wealth-building potential.",
    details: [
      {
        header: "Tax-Efficient Strategies",
        content: "We identify tax-saving opportunities, such as investments in tax-advantaged accounts, retirement funds, and tax-efficient insurance products. Our goal is to minimize the taxes you pay while maximizing your savings and investments."
      },
      {
        header: "Tax Compliance & Filing",
        content: "We ensure that your tax filings are accurate and compliant with the latest regulations, reducing the risk of penalties and optimizing your tax situation."
      },
      {
        header: "Capital Gains & Wealth Tax",
        content: "We provide advice on minimizing capital gains taxes and managing wealth taxes. Whether you're selling investments, real estate, or business assets, we help you structure deals in a tax-efficient way."
      },
      {
        header: "Estate & Inheritance Taxes",
        content: "Our tax planners assist with reducing estate and inheritance taxes, helping to ensure that your wealth is passed on to the next generation with minimal tax impact."
      }
    ],
    icon: <DollarSign size={24} />
  }
];


function FinancialEducation() {
  return (
    <div className='px-5 py-20 lg:px-32 lg:py-24 text-2xl'>
      <div className="py-12 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
        <section className="bg-white dark:bg-gray-900">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl lg:text-4xl dark:text-white">Financial Education | Assessments | Consulting | Tax Planning</h1>
            <p className="mb-8 text-base font-normal text-gray-800 lg:text-lg dark:text-gray-400">At RxT: A Financial Health Clinic, we believe that financial literacy is the cornerstone of achieving financial success. Understanding the fundamentals of finance, mastering budgeting, investing wisely, and planning for taxes are all essential elements of a sound financial strategy. Our services are designed to empower you with the knowledge, tools, and strategies you need to make informed decisions and achieve your financial goals.</p>
            <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
              <a href="./financial-education-assessments-consulting-financial-planning-tax-planning/request" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                Learn more
                <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </a>
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
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl lg:text-4xl dark:text-white">Why Choose RxT for Financial Education & Planning?</h1>
            <ul className="list-disc list-outside space-y-5 ps-5 text-lg text-gray-800 dark:text-neutral-200 mt-5">
              <li className="ps-2 text-base">
                <span className='font-semibold'>Holistic Approach: </span>
                <span>We take a comprehensive approach to financial planning, considering every aspect of your financial life – from education to tax planning to retirement. Our goal is to create a unified strategy that aligns with your long-term objectives.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Expert Guidance: </span>
                <span>Our team of financial experts has years of experience in personal finance, taxation, investment strategies, and financial planning. We provide advice that’s based on current market conditions and tax laws.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Personalized Solutions: </span>
                <span>At RxT, we believe in offering customized solutions that fit your unique financial situation. Every financial plan, consultation, and educational session is designed specifically for you.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Continuous Support: </span>
                <span>Financial planning is an ongoing process. We provide regular follow-ups, updates, and reassessments to ensure that your plan evolves with your life changes and financial goals.</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-900 pb-20">
          <div className="">
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl lg:text-4xl dark:text-white">Benefits of Working with RxT</h1>
            <ul className="list-disc list-outside space-y-5 ps-5 text-lg text-gray-800 dark:text-neutral-200 mt-5">
              <li className="ps-2 text-base">
                <span className='font-semibold'>Clear Financial Strategy: </span>
                <span>With RxT’s financial planning services, you’ll have a clear roadmap to guide your financial decisions, helping you make confident moves toward your goals.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Tax Optimization: </span>
                <span>Our tax planning services help you keep more of what you earn by taking advantage of tax-saving strategies.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Informed Decision Making: </span>
                <span>Our educational programs and personalized consulting ensure that you’re making informed decisions about your financial future.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Goal Achievement: </span>
                <span>We help you set and achieve both short-term and long-term financial goals, from purchasing a home to saving for retirement and leaving a legacy.</span>
              </li>
            </ul>
          </div>
        </section>

        <div className="bg-gray-100 relative rounded-xl p-5 sm:py-16 before:absolute before:top-0 before:start-0 before:bg-no-repeat before:bg-top before:bg-contain before:w-2/3 before:h-full before:z-0 dark:bg-neutral-950">
          <div className="max-w-3xl relative z-10 text-center mx-auto">
            <div className="mb-5">
              <h2 className="text-2xl font-bold md:text-3xl dark:text-white">Get Started Today</h2>
              <p className="mt-3 text-gray-800 dark:text-neutral-400 text-base">Whether you're looking to increase your financial literacy, build a comprehensive financial plan, or optimize your tax strategy, RxT: A Financial Health Clinic is here to guide you every step of the way. Contact us today for a consultation and take control of your financial future.</p>
            </div>
            <Link href='./financial-education-assessments-consulting-financial-planning-tax-planning/request' className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">Connect us Now!</Link>
          </div>
        </div>

      </div>
    </div>

  );
}

export default FinancialEducation;
