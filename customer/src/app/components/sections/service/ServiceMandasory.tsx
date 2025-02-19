import { description } from "@/registry/new-york/block/authentication-01";

const MasonryCards = () => {
  const cards = [
    {
      title: 'Financial Education & Planning',
      imgSrc:
        'https://e5osher1gwoyuako.public.blob.vercel-storage.com/webapp/static/1-W54DEVJ63zhDHO5RBXkpk1OMiHu1Ps.jpg',
      url: '/services/financial-education-assessments-consulting-financial-planning-tax-planning',
      description: 'Enhance your financial literacy with tailored programs and minimize tax liabilities with expert planning.'
    },
    {
      title: 'Investment & IPO',
      imgSrc:
        'https://e5osher1gwoyuako.public.blob.vercel-storage.com/webapp/static/2-L19NOA8ljPBnCuhCyG2MLDQeTPozqy.jpg',
      url: '/services/mutual-funds-share-market-ipo',
      description: 'Expert guidance on mutual funds, stock market trading, and participation in IPOs.'
    },
    {
      title: 'NRI Financial Services',
      imgSrc:
        'https://e5osher1gwoyuako.public.blob.vercel-storage.com/webapp/static/3-gY3mLbT2y9tQmBPwC3HnSI0lVtiFYb.jpg',
      url: '/services/nri-financial-services',
      description: 'Expert financial management for NRIs, including investment planning, tax compliance, and repatriation services.'
    },
    {
      title: 'Portfolio Analysis',
      imgSrc:
        'https://e5osher1gwoyuako.public.blob.vercel-storage.com/webapp/static/4-98y52YGcdhAUdeMQSByZAlJZhsNxuv.jpg',
      url: '/services/portfolio-analysis-and-review',
      description: 'Comprehensive reviews of your investment portfolio to ensure alignment with your goals and risk tolerance.'
    },
    {
      title: 'Risk & Loan Advisory',
      imgSrc:
        'https://e5osher1gwoyuako.public.blob.vercel-storage.com/webapp/static/5-KKkJer3IDeZqsINNqZuxHNfpH6eCB4.jpg',
      url: '/services/risk-management-insurance-loan-advisory-optimal-solutions',
      description: 'Comprehensive solutions for risk management, insurance, and loan advisory services.'
    },
    {
      title: 'Private Equity & Unlisted Shares',
      imgSrc:
        'https://e5osher1gwoyuako.public.blob.vercel-storage.com/webapp/static/6-RVVMJADzm5u0Sn9k13H5IAFpXKsgzU.jpg',
      url: '/services/unlisted-shares-private-placements',
      description: 'Access exclusive investment opportunities with detailed research and guidance.'
    }
  ];

  return (
    <div className='max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto'>
      <div className='aspect-w-16 aspect-h-7'>
        <img
          className='w-full object-cover rounded-xl lg:h-[250px]'
          src='https://e5osher1gwoyuako.public.blob.vercel-storage.com/webapp/static/fiancial-services-QyIAQvsXJAIjtZeTCK1kRqmVO4g5Ov.jpg'
          alt='Services Overview'
        />
      </div>

      <div className='mt-5 lg:mt-16 text-center'>
        <h2 className='font-bold text-2xl md:text-3xl text-gray-800 dark:text-neutral-200'>
          Our Services
        </h2>
        <p className='mt-4 text-gray-500 dark:text-neutral-500'>
          At RxT, we offer a comprehensive range of financial services
          designed to cater to the diverse needs of our clients. Our services
          include:
        </p>
      </div>
      <div className='max-w-6xl px-0 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto'>
        {/* Grid */}
        <div className='grid sm:grid-cols-12 gap-6'>
          {/* Map through cards */}
          {cards.map((card, index) => (
            <div
              key={index}
              className={`col-span-12 sm:col-span-6 md:col-span-4`}
            >
              {/* Card */}
              <a
                className='group relative block rounded-xl overflow-hidden focus:outline-none'
                href={card.url} // Link to the respective URL
              >
                <div className='aspect-w-12 aspect-h-7 sm:aspect-none rounded-xl overflow-hidden'>
                  <img
                    className='group-hover:scale-105 group-focus:scale-105 transition-transform duration-500 ease-in-out rounded-xl w-full object-cover'
                    src={card.imgSrc}
                    alt={card.title}
                  />
                </div>
                <div className='absolute bottom-0 start-0 end-0 p-2 sm:p-4'>
                  <div className='text-sm font-semibold text-gray-800 rounded-lg bg-white p-4 md:text-xl dark:bg-neutral-800 dark:text-neutral-200'>
                    {card.title}
                  </div>
                </div>
              </a>
              <p className="text-base pt-4 pb-4 lg:pb-8">{card.description}</p>
              {/* End Card */}
            </div>
          ))}
        </div>
        {/* End Grid */}
      </div>
    </div>
  );
};

export default MasonryCards;
