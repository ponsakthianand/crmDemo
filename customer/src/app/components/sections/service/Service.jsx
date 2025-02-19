import {
  Globe,
  BarChart,
  Package,
  TrendingUp,
  Shield,
  BookOpen,
} from 'lucide-react';

const Service = () => {
  return (
    <>
      <div className='max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto'>
        <div className='aspect-w-16 aspect-h-7'>
          <img
            className='w-full object-cover rounded-xl lg:h-[250px]'
            src='https://e5osher1gwoyuako.public.blob.vercel-storage.com/webapp/static/fiancial-services-QyIAQvsXJAIjtZeTCK1kRqmVO4g5Ov.jpg'
            alt='Services Overview'
          />
        </div>

        <div className='mt-5 lg:mt-16'>
          <h2 className='font-bold text-2xl md:text-3xl text-gray-800 dark:text-neutral-200'>
            Our Services
          </h2>
          <p className='mt-4 text-gray-500 dark:text-neutral-500'>
            At RxT, we offer a comprehensive range of financial services
            designed to cater to the diverse needs of our clients. Our services
            include:
          </p>

          <div className='mt-8 grid sm:grid-cols-2 gap-8 md:gap-12'>
            {/* Service 1 */}
            <div className='flex gap-x-5'>
              <Globe className='shrink-0 mt-1 size-6 text-blue-600 dark:text-blue-500' />
              <div className='grow'>
                <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>
                  NRI Financial Services
                </h3>
                <p className='mt-1 text-gray-600 dark:text-neutral-400'>
                  Expert financial management for NRIs, including investment
                  planning, tax compliance, and repatriation services.
                </p>
              </div>
            </div>

            {/* Service 2 */}
            <div className='flex gap-x-5'>
              <BarChart className='shrink-0 mt-1 size-6 text-blue-600 dark:text-blue-500' />
              <div className='grow'>
                <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>
                  Portfolio Analysis & Review
                </h3>
                <p className='mt-1 text-gray-600 dark:text-neutral-400'>
                  Comprehensive reviews of your investment portfolio to ensure
                  alignment with your goals and risk tolerance.
                </p>
              </div>
            </div>

            {/* Service 3 */}
            <div className='flex gap-x-5'>
              <Package className='shrink-0 mt-1 size-6 text-blue-600 dark:text-blue-500' />
              <div className='grow'>
                <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>
                  Unlisted Shares | Private Placements
                </h3>
                <p className='mt-1 text-gray-600 dark:text-neutral-400'>
                  Access exclusive investment opportunities with detailed
                  research and guidance.
                </p>
              </div>
            </div>

            {/* Service 4 */}
            <div className='flex gap-x-5'>
              <TrendingUp className='shrink-0 mt-1 size-6 text-blue-600 dark:text-blue-500' />
              <div className='grow'>
                <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>
                  Mutual Funds | Share Market | IPO
                </h3>
                <p className='mt-1 text-gray-600 dark:text-neutral-400'>
                  Expert guidance on mutual funds, stock market trading, and
                  participation in IPOs.
                </p>
              </div>
            </div>

            {/* Service 5 */}
            <div className='flex gap-x-5'>
              <Shield className='shrink-0 mt-1 size-6 text-blue-600 dark:text-blue-500' />
              <div className='grow'>
                <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>
                  Risk Management | Insurance | Loan Advisory
                </h3>
                <p className='mt-1 text-gray-600 dark:text-neutral-400'>
                  Comprehensive solutions for risk management, insurance, and
                  loan advisory services.
                </p>
              </div>
            </div>

            {/* Service 6 */}
            <div className='flex gap-x-5'>
              <BookOpen className='shrink-0 mt-1 size-6 text-blue-600 dark:text-blue-500' />
              <div className='grow'>
                <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>
                  Financial Education | Tax Planning
                </h3>
                <p className='mt-1 text-gray-600 dark:text-neutral-400'>
                  Enhance your financial literacy with tailored programs and
                  minimize tax liabilities with expert planning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Service;
