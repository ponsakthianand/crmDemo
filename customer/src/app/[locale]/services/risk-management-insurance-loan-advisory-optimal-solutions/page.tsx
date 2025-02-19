'use client'
import { Shield, LifeBuoy, CreditCard, Key, Box } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    title: "Risk Management",
    introContent: "Managing financial risks is a cornerstone of a successful financial strategy. At RxT, we help you identify potential risks and develop a proactive approach to protect your financial well-being. Our services include:",
    details: [
      {
        header: "Risk Assessment",
        content: "We thoroughly assess your financial situation, lifestyle, and goals to identify the risks that could threaten your wealth and future. These may include market volatility, health crises, accidents, and other life uncertainties."
      },
      {
        header: "Custom Solutions",
        content: "Based on our assessment, we work with you to create tailored risk management strategies designed to minimize financial exposure. From diversifying your investments to setting up emergency funds, we ensure your wealth is well-protected."
      },
      {
        header: "Ongoing Monitoring",
        content: "We continuously monitor your risk management strategies to ensure they remain effective as your financial situation and external conditions evolve. Our team adjusts your plan as necessary to safeguard your financial goals."
      }
    ],
    icon: <Shield size={24} />
  },
  {
    title: "Insurance Solutions",
    introContent: "Insurance is an essential tool in securing your financial future. RxT offers a wide array of insurance products designed to protect you, your family, and your assets:",
    details: [
      {
        header: "Life Insurance",
        content: "Life insurance provides financial security for your loved ones in the event of an untimely demise. We help you choose the right policy based on your dependents’ needs, income replacement, and long-term goals."
      },
      {
        header: "Health Insurance",
        content: "Rising medical costs can quickly derail your financial plans. We guide you in selecting health insurance policies that offer adequate coverage, ensuring you have access to healthcare without compromising your financial stability."
      },
      {
        header: "Property Insurance",
        content: "Whether you own a home, car, or other valuable assets, protecting them with the right insurance policies is crucial. We assist in finding the best coverage for your property, helping you protect against theft, damage, or unforeseen events."
      },
      {
        header: "Critical Illness and Disability Insurance",
        content: "Protect yourself against financial risks associated with serious health conditions or disability. We help you choose policies that ensure continued financial security during challenging times."
      }
    ],
    icon: <LifeBuoy size={24} />
  },
  {
    title: "Loan Advisory",
    introContent: "Loans are powerful financial tools when used wisely, but they require careful planning. At RxT, we provide expert loan advisory services to help you make sound borrowing decisions:",
    details: [
      {
        header: "Loan Assessment",
        content: "Whether it’s a home loan, personal loan, business loan, or education loan, we evaluate your financial capacity to determine the most suitable loan options for your needs."
      },
      {
        header: "Debt Management Strategies",
        content: "We guide you in managing existing loans and provide advice on optimizing repayment schedules, refinancing options, and reducing interest costs."
      },
      {
        header: "Loan Selection",
        content: "We assist you in selecting the right loan products, ensuring the terms, interest rates, and repayment structures align with your financial goals and long-term plans."
      }
    ],
    icon: <CreditCard size={24} />
  },
  {
    title: "Optimal Financial Solutions",
    introContent: "Our Optimal Financial Solutions approach is designed to integrate all aspects of your financial health, ensuring a balanced and sustainable plan:",
    details: [
      {
        header: "Comprehensive Planning",
        content: "We combine risk management, insurance, and loan advisory services to create a comprehensive financial plan tailored to your individual needs. This integrated strategy ensures that all aspects of your financial life are aligned for maximum protection and efficiency."
      },
      {
        header: "Personalized Recommendations",
        content: "We focus on your unique circumstances, ensuring that every recommendation – from insurance policies to loan strategies – is in line with your financial goals, lifestyle, and risk tolerance."
      },
      {
        header: "Long-Term Financial Security",
        content: "Our optimal solutions are designed not just for short-term needs, but also to ensure long-term financial security. Whether it’s planning for retirement, safeguarding your assets, or securing your business, we create solutions that support your future success."
      }
    ],
    icon: <Key size={24} />
  }
];


function RiskManagement() {
  return (
    <div className='px-5 py-20 lg:px-32 lg:py-24 text-2xl'>
      <div className="py-12 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
        <section className="bg-white dark:bg-gray-900">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl lg:text-4xl dark:text-white">Risk Management | Insurance | Loan Advisory | Optimal Solutions</h1>
            <p className="mb-8 text-base font-normal text-gray-800 lg:text-lg dark:text-gray-400">At RxT: A Financial Health Clinic, we recognize that effective financial planning goes beyond investments. Protecting your financial future through risk management, choosing the right insurance coverage, and making informed decisions about loans are crucial steps toward long-term stability. Our expert services are designed to help you safeguard your wealth, mitigate risks, and optimize your financial solutions for peace of mind.</p>
            <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
              <a href="./risk-management-insurance-loan-advisory-optimal-solutions/request" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
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
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl lg:text-4xl dark:text-white">Why Choose RxT for Risk Management & Advisory Services?</h1>
            <ul className="list-disc list-outside space-y-5 ps-5 text-lg text-gray-800 dark:text-neutral-200 mt-5">
              <li className="ps-2 text-base">
                <span className='font-semibold'>Expertise: </span>
                <span> Our team brings years of experience in risk management, insurance planning, and loan advisory, ensuring that you receive the best advice and support for all your financial needs.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Personalized Approach: </span>
                <span> At RxT, we understand that each client is different. We take the time to understand your financial goals and personal circumstances to craft solutions that work for you.
                </span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Comprehensive Coverage: </span>
                <span> We provide a full suite of services – from risk assessment to insurance selection and loan management – ensuring your financial health is covered on all fronts.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Transparent Processes: </span>
                <span> We prioritize transparency, offering clear and honest communication about our recommendations and the rationale behind them. You’ll always know exactly where your money is going and how it’s working for you.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Ongoing Support: </span>
                <span> Our relationship doesn’t end once a solution is in place. RxT offers continuous monitoring and support, ensuring that your financial plans evolve as your life does.</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-900 pb-20">
          <div className="">
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl lg:text-4xl dark:text-white">Benefits of Working with RxT</h1>
            <ul className="list-disc list-outside space-y-5 ps-5 text-lg text-gray-800 dark:text-neutral-200 mt-5">
              <li className="ps-2 text-base">
                <span className='font-semibold'>Holistic Protection: </span>
                <span> Our integrated approach ensures that every part of your financial landscape is protected and optimized, from investments to insurance to debt management.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Tailored Solutions: </span>
                <span> No two clients are alike, and we pride ourselves on offering bespoke solutions that address your specific needs and goals.</span>
              </li>
              <li className="ps-2 text-base">
                <span className='font-semibold'>Peace of Mind: </span>
                <span> With RxT managing your risk, insurance, and loan strategies, you can focus on achieving your life’s goals, knowing your financial future is in expert hands.</span>
              </li>
            </ul>
          </div>
        </section>

        <div className="bg-gray-100 relative rounded-xl p-5 sm:py-16 before:absolute before:top-0 before:start-0 before:bg-no-repeat before:bg-top before:bg-contain before:w-2/3 before:h-full before:z-0 dark:bg-neutral-950">
          <div className="max-w-3xl relative z-10 text-center mx-auto">
            <div className="mb-5">
              <h2 className="text-2xl font-bold md:text-3xl dark:text-white">Get Started Today</h2>
              <p className="mt-3 text-gray-800 dark:text-neutral-400 text-base">Protect your future with RxT’s Risk Management, Insurance, and Loan Advisory services. Whether you're looking to mitigate risks, secure your assets, or navigate the complexities of loan options, we’re here to help. Contact us today to discuss how our tailored solutions can safeguard your financial well-being.</p>
            </div>
            <Link href='./risk-management-insurance-loan-advisory-optimal-solutions/request' className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">Connect us Now!</Link>
          </div>
        </div>

      </div>
    </div>

  );
}

export default RiskManagement;
