import Link from 'next/link';

import useTabs from '../../hooks/useTabs';

const Pricing = () => {
  const [activeTab, handleTab] = useTabs();
  return (
    <>
      {/*...::: Pricing Section Start :::... */}
      <section className='pricing-section'>
        {/* Section Spacer */}
        <div className='pb-20 pt-20 xl:pb-[150px] xl:pt-[130px]'>
          {/* Section Container */}
          <div className='global-container'>
            {/* Section Content Block */}
            <div className='jos mb-10 text-center lg:mb-12'>
              <div className='mx-auto md:max-w-xs lg:max-w-xl xl:max-w-[746px]'>
                <h2>Cost-effectively build any software</h2>
              </div>
            </div>
            {/* Section Content Block */}
            {/* Pricing Block */}
            <div className='container mx-auto'>
              {/* Tab buttons */}
              <div
                className='jos flex justify-center'
                data-jos_animation='fade'
              >
                <div className='inline-flex space-x-4 rounded-[50px] border-2 border-black font-semibold'>
                  <button
                    className={`tab-button price-button ${
                      activeTab === 0 ? 'active' : ''
                    }`}
                    onClick={() => handleTab(0)}
                    data-tab='monthly'
                  >
                    Monthly
                  </button>
                  <button
                    className={`tab-button price-button ${
                      activeTab === 1 ? 'active' : ''
                    }`}
                    onClick={() => handleTab(1)}
                    data-tab='annually'
                  >
                    Annually
                  </button>
                </div>
              </div>

              {/* Pricing Block */}
              <div className='mt-12 lg:mt-16 xl:mt-20'>
                {/* Price List */}
                {activeTab === 0 && (
                  <ul
                    id='monthly'
                    className='tab-content grid grid-cols-1 gap-6 md:grid-cols-2 xxl:grid-cols-3'
                  >
                    {/* Price Item */}
                    <li
                      className='jos group flex flex-col rounded-[10px] bg-colorLinenRuffle p-10 transition-all duration-300 ease-linear hover:bg-black'
                      data-jos_animation='flip'
                      data-jos_delay='0'
                    >
                      <h3 className='font-dmSans text-[28px] font-bold leading-[1.28] tracking-tighter text-black transition-all duration-300 ease-linear group-hover:text-white'>
                        Beginner
                      </h3>
                      <span className='text-lg text-black transition-all duration-300 ease-linear group-hover:text-white'>
                        Up to 10 members
                      </span>

                      <div className='my-5 h-[1px] w-full bg-[#DBD6CF]'></div>
                      <h4 className='mb-4 font-dmSans text-5xl font-bold leading-none text-black transition-all duration-300 ease-linear group-hover:text-white md:text-6xl lg:text-7xl xl:text-[80px]'>
                        $25
                        <span className='text-lg font-semibold'>
                          /Per month
                        </span>
                      </h4>
                      <p className='mb-10 text-lg text-black transition-all duration-300 ease-linear group-hover:text-white'>
                        This is an excellent option for people & small
                        businesses who are starting out.
                      </p>
                      <Link
                        href='/pricing'
                        className='button mt-auto block rounded-[50px] border-2 border-black bg-transparent py-4 text-center text-black transition-all duration-300 ease-linear after:bg-rxtGreen hover:border-rxtGreen hover:text-black group-hover:border-rxtGreen group-hover:text-white'
                      >
                        Choose the plan
                      </Link>
                    </li>
                    {/* Price Item */}
                    {/* Price Item */}
                    <li
                      className='jos group flex flex-col rounded-[10px] bg-colorLinenRuffle p-10 transition-all duration-300 ease-linear hover:bg-black'
                      data-jos_animation='flip'
                      data-jos_delay='0'
                    >
                      <h3 className='font-dmSans text-[28px] font-bold leading-[1.28] tracking-tighter text-black transition-all duration-300 ease-linear group-hover:text-white'>
                        Starter
                      </h3>
                      <span className='text-lg text-black transition-all duration-300 ease-linear group-hover:text-white'>
                        Up to 50 members
                      </span>

                      <div className='my-5 h-[1px] w-full bg-[#DBD6CF]'></div>
                      <h4 className='mb-4 font-dmSans text-5xl font-bold leading-none text-black transition-all duration-300 ease-linear group-hover:text-white md:text-6xl lg:text-7xl xl:text-[80px]'>
                        $89
                        <span className='text-lg font-semibold'>
                          /Per month
                        </span>
                      </h4>
                      <p className='mb-10 text-lg text-black transition-all duration-300 ease-linear group-hover:text-white'>
                        This plan is suitable for e-commerce stores as well as
                        professional blogs.
                      </p>
                      <Link
                        href='/pricing'
                        className='button mt-auto block rounded-[50px] border-2 border-black bg-transparent py-4 text-center text-black transition-all duration-300 ease-linear after:bg-rxtGreen hover:border-rxtGreen hover:text-black group-hover:border-rxtGreen group-hover:text-white'
                      >
                        Choose the plan
                      </Link>
                    </li>
                    {/* Price Item */}
                    {/* Price Item */}
                    <li
                      className='jos group flex flex-col rounded-[10px] bg-colorLinenRuffle p-10 transition-all duration-300 ease-linear hover:bg-black'
                      data-jos_animation='flip'
                      data-jos_delay='0'
                    >
                      <h3 className='font-dmSans text-[28px] font-bold leading-[1.28] tracking-tighter text-black transition-all duration-300 ease-linear group-hover:text-white'>
                        Pro
                      </h3>
                      <span className='text-lg text-black transition-all duration-300 ease-linear group-hover:text-white'>
                        Up to 100 members
                      </span>

                      <div className='my-5 h-[1px] w-full bg-[#DBD6CF]'></div>
                      <h4 className='mb-4 font-dmSans text-5xl font-bold leading-none text-black transition-all duration-300 ease-linear group-hover:text-white md:text-6xl lg:text-7xl xl:text-[80px]'>
                        $199
                        <span className='text-lg font-semibold'>
                          /Per month
                        </span>
                      </h4>
                      <p className='mb-10 text-lg text-black transition-all duration-300 ease-linear group-hover:text-white'>
                        Ideal for handling complicated projects enterprise-level
                        projects, and websites.
                      </p>
                      <Link
                        href='/pricing'
                        className='button mt-auto block rounded-[50px] border-2 border-black bg-transparent py-4 text-center text-black transition-all duration-300 ease-linear after:bg-rxtGreen hover:border-rxtGreen hover:text-black group-hover:border-rxtGreen group-hover:text-white'
                      >
                        Choose the plan
                      </Link>
                    </li>
                    {/* Price Item */}
                  </ul>
                )}
                {/* Price List */}
                {/* Price List */}
                {activeTab === 1 && (
                  <ul
                    id='annually'
                    className='tab-content grid grid-cols-1 gap-6 md:grid-cols-2 xxl:grid-cols-3'
                  >
                    {/* Price Item */}
                    <li
                      className='jos group flex flex-col rounded-[10px] bg-colorLinenRuffle p-10 transition-all duration-300 ease-linear hover:bg-black'
                      data-jos_animation='flip'
                      data-jos_delay='0'
                    >
                      <h3 className='font-dmSans text-[28px] font-bold leading-[1.28] tracking-tighter text-black transition-all duration-300 ease-linear group-hover:text-white'>
                        Beginner
                      </h3>
                      <span className='text-lg text-black transition-all duration-300 ease-linear group-hover:text-white'>
                        Up to 10 members
                      </span>

                      <div className='my-5 h-[1px] w-full bg-[#DBD6CF]'></div>
                      <h4 className='mb-4 font-dmSans text-5xl font-bold leading-none text-black transition-all duration-300 ease-linear group-hover:text-white md:text-6xl lg:text-7xl xl:text-[80px]'>
                        $240
                        <span className='text-lg font-semibold'>/Per year</span>
                      </h4>
                      <p className='mb-10 text-lg text-black transition-all duration-300 ease-linear group-hover:text-white'>
                        This is an excellent option for people & small
                        businesses who are starting out.
                      </p>
                      <Link
                        href='/pricing'
                        className='button mt-auto block rounded-[50px] border-2 border-black bg-transparent py-4 text-center text-black transition-all duration-300 ease-linear after:bg-rxtGreen hover:border-rxtGreen hover:text-black group-hover:border-rxtGreen group-hover:text-white'
                      >
                        Choose the plan
                      </Link>
                    </li>
                    {/* Price Item */}
                    {/* Price Item */}
                    <li
                      className='jos group flex flex-col rounded-[10px] bg-colorLinenRuffle p-10 transition-all duration-300 ease-linear hover:bg-black'
                      data-jos_animation='flip'
                      data-jos_delay='0'
                    >
                      <h3 className='font-dmSans text-[28px] font-bold leading-[1.28] tracking-tighter text-black transition-all duration-300 ease-linear group-hover:text-white'>
                        Starter
                      </h3>
                      <span className='text-lg text-black transition-all duration-300 ease-linear group-hover:text-white'>
                        Up to 50 members
                      </span>

                      <div className='my-5 h-[1px] w-full bg-[#DBD6CF]'></div>
                      <h4 className='mb-4 font-dmSans text-5xl font-bold leading-none text-black transition-all duration-300 ease-linear group-hover:text-white md:text-6xl lg:text-7xl xl:text-[80px]'>
                        $960
                        <span className='text-lg font-semibold'>/Per year</span>
                      </h4>
                      <p className='mb-10 text-lg text-black transition-all duration-300 ease-linear group-hover:text-white'>
                        This plan is suitable for e-commerce stores as well as
                        professional blogs.
                      </p>
                      <Link
                        href='/pricing'
                        className='button mt-auto block rounded-[50px] border-2 border-black bg-transparent py-4 text-center text-black transition-all duration-300 ease-linear after:bg-rxtGreen hover:border-rxtGreen hover:text-black group-hover:border-rxtGreen group-hover:text-white'
                      >
                        Choose the plan
                      </Link>
                    </li>
                    {/* Price Item */}
                    {/* Price Item */}
                    <li
                      className='jos group flex flex-col rounded-[10px] bg-colorLinenRuffle p-10 transition-all duration-300 ease-linear hover:bg-black'
                      data-jos_animation='flip'
                      data-jos_delay='0'
                    >
                      <h3 className='font-dmSans text-[28px] font-bold leading-[1.28] tracking-tighter text-black transition-all duration-300 ease-linear group-hover:text-white'>
                        Pro
                      </h3>
                      <span className='text-lg text-black transition-all duration-300 ease-linear group-hover:text-white'>
                        Up to 100 members
                      </span>

                      <div className='my-5 h-[1px] w-full bg-[#DBD6CF]'></div>
                      <h4 className='mb-4 font-dmSans text-5xl font-bold leading-none text-black transition-all duration-300 ease-linear group-hover:text-white md:text-6xl lg:text-7xl xl:text-[80px]'>
                        $1800
                        <span className='text-lg font-semibold leading-none'>
                          /Per year
                        </span>
                      </h4>
                      <p className='mb-10 text-lg text-black transition-all duration-300 ease-linear group-hover:text-white'>
                        Ideal for handling complicated projects enterprise-level
                        projects, and websites.
                      </p>
                      <Link
                        href='/pricing'
                        className='button mt-auto block rounded-[50px] border-2 border-black bg-transparent py-4 text-center text-black transition-all duration-300 ease-linear after:bg-rxtGreen hover:border-rxtGreen hover:text-black group-hover:border-rxtGreen group-hover:text-white'
                      >
                        Choose the plan
                      </Link>
                    </li>
                    {/* Price Item */}
                  </ul>
                )}
                {/* Price List */}
              </div>
              {/* Pricing Block */}
            </div>
          </div>
          {/* Section Container */}
        </div>
        {/* Section Spacer */}
      </section>
      {/*...::: Pricing Section End :::... */}
    </>
  );
};

export default Pricing;
