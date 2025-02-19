'use client'
import { TrendingUp, BarChart2, DollarSign, ArrowUpCircle } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    title: "Mutual Fund Investments",
    introContent: "Mutual funds are a great option for investors looking to diversify their portfolios and benefit from professional management. RxT offers a range of services to guide you through this investment vehicle.",
    details: [
      {
        header: "Tailored Recommendations",
        content: "We carefully assess your financial goals, risk tolerance, and investment horizon to recommend the best mutual funds for you. Whether you're interested in equity, debt, hybrid, or sectoral funds, we help you create a diversified and well-balanced portfolio."
      },
      {
        header: "Performance Monitoring",
        content: "Our commitment doesn’t end with recommending mutual funds. We actively monitor the performance of your investments, adjusting strategies based on changing market conditions to ensure your portfolio remains optimized."
      },
      {
        header: "Tax-Efficient Investments",
        content: "For those looking to minimize tax liabilities, we offer guidance on tax-saving mutual fund options like ELSS (Equity-Linked Savings Schemes), helping you reduce your tax burden while building long-term wealth."
      }
    ],
    icon: <TrendingUp size={24} />
  },
  {
    title: "Stock Market Trading",
    introContent: "The stock market presents an excellent opportunity for wealth growth, but navigating it requires expertise. At RxT, we equip you with the tools and knowledge you need to trade confidently.",
    details: [
      {
        header: "Create a Trading Plan",
        content: "We work with you to develop a personalized trading strategy that aligns with your investment objectives and risk appetite. Our strategies ensure you're positioned to take advantage of market opportunities."
      },
      {
        header: "Identify Opportunities",
        content: "Our research team identifies high-potential stocks across various sectors, providing you with actionable insights to make informed investment decisions."
      },
      {
        header: "Market Insights",
        content: "Gain access to up-to-date market trends and analyses, allowing you to make informed and timely decisions about your stock investments."
      },
      {
        header: "Risk Management",
        content: "We employ strategies like diversification, stop-loss orders, and position sizing to help you manage risk, ensuring your portfolio remains stable even in volatile markets."
      }
    ],
    icon: <BarChart2 size={24} />
  },
  {
    title: "Initial Public Offerings (IPOs)",
    introContent: "IPOs offer a unique investment opportunity, allowing you to invest in companies when they first enter the public market. We guide you every step of the way.",
    details: [
      {
        header: "Research and Analysis",
        content: "We conduct in-depth research on upcoming IPOs, evaluating key factors like company fundamentals, market growth potential, and overall valuation to help you decide if an IPO is right for your portfolio."
      },
      {
        header: "Subscription Guidance",
        content: "Participating in an IPO can be complex. RxT ensures that you understand the entire subscription process, making your entry into IPOs seamless and efficient."
      },
      {
        header: "Post-IPO Strategy",
        content: "After the IPO is listed, we provide guidance on whether to hold or trade the stock based on market performance and your long-term investment goals."
      }
    ],
    icon: <ArrowUpCircle size={24} />
  }
];


function MutualFundsShareMarket() {
  return (
    <div className='px-5 py-20 lg:px-32 lg:py-24 text-2xl'>
      <div className="py-12 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
        <section className="bg-white dark:bg-gray-900">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl lg:text-4xl dark:text-white">Mutual Funds | Share Market | Initial Public Offering (IPO)</h1>
            <p className="mb-8 text-base font-normal text-gray-800 lg:text-lg dark:text-gray-400">At RxT: A Financial Health Clinic, we provide expert guidance in mutual fund investments, stock market trading, and Initial Public Offerings (IPOs) to help you build a well-rounded investment portfolio. Whether you are looking to diversify your assets, capitalize on the stock market's potential, or explore new opportunities through IPOs, we offer a personalized approach that maximizes returns while effectively managing risks. Our mission is to empower you to achieve your financial goals with confidence and clarity.</p>
            <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
              <a href="./mutual-funds-share-market-ipo/request" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
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
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl lg:text-4xl dark:text-white">Why Choose RxT for Your Investment Journey?</h1>
            <ul className="list-disc list-outside space-y-5 ps-5 text-lg text-gray-800 dark:text-neutral-200 mt-5">
              <li className="ps-2 text-base">
                <span className='font-semibold'>Personalized Strategies</span>
                <span>We don't believe in one-size-fits-all solutions. Every investment plan is tailored to your unique financial goals, risk profile, and time horizon.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Comprehensive Support</span>
                <span>From initial research to investment execution, our team provides ongoing support, ensuring you’re always on track to meet your financial objectives.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Expert Insights</span>
                <span>Our seasoned experts keep you informed with the latest market trends, economic changes, and regulatory updates, offering you timely advice that helps you make well-informed decisions.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Focus on Risk Management</span>
                <span>At RxT, we prioritize risk management in every investment strategy, balancing growth opportunities with safeguards to protect your portfolio.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Transparent Processes</span>
                <span>We believe in complete transparency with our clients, ensuring you fully understand our recommendations and the reasoning behind each investment choice.</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-900 pb-20">
          <div className="">
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl lg:text-4xl dark:text-white">Benefits of Investing with RxT</h1>
            <ul className="list-disc list-outside space-y-5 ps-5 text-lg text-gray-800 dark:text-neutral-200 mt-5">
              <li className="ps-2 text-base">
                <span className='font-semibold'>Diversification</span>
                <span>We design investment strategies that help diversify your portfolio across various asset classes and market sectors, spreading risk while enhancing potential returns.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Access to Opportunities</span>
                <span>Stay ahead of the curve with the latest information on investment opportunities, including mutual funds, stock market trading, and IPOs.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Professional Expertise</span>
                <span>Tap into our team’s expertise and market insights to make informed, confident decisions that align with your financial objectives.</span>
              </li>
            </ul>
          </div>
        </section>

        <div className="bg-gray-100 relative rounded-xl p-5 sm:py-16 before:absolute before:top-0 before:start-0 before:bg-no-repeat before:bg-top before:bg-contain before:w-2/3 before:h-full before:z-0 dark:bg-neutral-950">
          <div className="max-w-3xl relative z-10 text-center mx-auto">
            <div className="mb-5">
              <h2 className="text-2xl font-bold md:text-3xl dark:text-white">Get Started Today</h2>
              <p className="mt-3 text-gray-800 dark:text-neutral-400 text-base">Whether you're a seasoned investor looking to refine your portfolio or a beginner eager to explore investment opportunities, RxT: A Financial Health Clinic is here to guide you every step of the way. Contact us today to schedule a consultation and start building a diversified, growth-oriented investment portfolio that aligns with your goals.</p>
            </div>
            <Link href='./mutual-funds-share-market-ipo/request' className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">Connect us Now!</Link>
          </div>
        </div>

      </div>
    </div>

  );
}

export default MutualFundsShareMarket;
