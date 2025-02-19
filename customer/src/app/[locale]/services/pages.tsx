'use client'
export default function Services() {
  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="text-center">
        <h2 className="font-bold text-3xl md:text-4xl text-gray-800 dark:text-neutral-200">
          Our Services
        </h2>
        <p className="mt-3 text-gray-600 dark:text-neutral-400 max-w-3xl mx-auto">
          At RxT, we offer a comprehensive range of financial services designed to cater to the diverse needs of our clients.
        </p>
      </div>

      {/* Services Grid */}
      <div className="mt-10 lg:mt-16 grid lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12">
        {/* Service Item */}
        <div className="flex flex-col items-start">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
            NRI Financial Services
          </h3>
          <p className="mt-2 text-gray-600 dark:text-neutral-400">
            Expert management for Non-Resident Indians (NRIs), including investment planning, tax compliance, and repatriation services to simplify managing finances from abroad.
          </p>
        </div>

        {/* Service Item */}
        <div className="flex flex-col items-start">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
            Portfolio Analysis & Review
          </h3>
          <p className="mt-2 text-gray-600 dark:text-neutral-400">
            Regular reviews of your investment portfolio to ensure alignment with your goals and risk tolerance, with actionable insights for optimization.
          </p>
        </div>

        {/* Service Item */}
        <div className="flex flex-col items-start">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
            Unlisted Shares | Private Placements
          </h3>
          <p className="mt-2 text-gray-600 dark:text-neutral-400">
            Access exclusive investment opportunities in unlisted shares and private placements with expert guidance to navigate these high-potential markets.
          </p>
        </div>

        {/* Service Item */}
        <div className="flex flex-col items-start">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
            Mutual Funds | Share Market | IPO
          </h3>
          <p className="mt-2 text-gray-600 dark:text-neutral-400">
            Expert guidance on mutual fund investments, stock market trading, and IPOs to build a diversified strategy for maximizing returns while managing risk.
          </p>
        </div>

        {/* Service Item */}
        <div className="flex flex-col items-start">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
            Risk Management | Insurance | Loan Advisory
          </h3>
          <p className="mt-2 text-gray-600 dark:text-neutral-400">
            Comprehensive risk management services, including insurance solutions, loan advisory, and customized financial plans to protect your future.
          </p>
        </div>

        {/* Service Item */}
        <div className="flex flex-col items-start">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
            Financial Education | Planning | Tax Planning
          </h3>
          <p className="mt-2 text-gray-600 dark:text-neutral-400">
            Enhance financial literacy through educational programs, assessments, and consulting. Tailored financial and tax planning ensures optimal outcomes.
          </p>
        </div>
      </div>
    </div>

  )
}