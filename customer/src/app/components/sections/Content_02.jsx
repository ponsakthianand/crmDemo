const Content_02 = () => {
  return (
    <section id='content-section-2'>
      {/* Section Spacer */}
      <div className='pb-20 xl:pb-[150px]'>
        {/* Section Container */}
        <div className='global-container'>
          {/* Section Content Block */}
          <div className='jos mb-10 text-center lg:mb-16 xl:mb-20'>
            <div className='mx-auto md:max-w-xl lg:max-w-4xl xl:max-w-[950px]'>
              <h2>Partner Benefits</h2>
              <p>Partnering with RxT offers a wealth of benefits</p>
            </div>
          </div>
          {/* Section Content Block */}
          <div className='grid grid-cols-1 items-center gap-12 md:grid-cols-[minmax(0,_1fr)_1.2fr] xl:gap-28 xxl:gap-32'>
            {/* Content Left Block */}
            <div
              className='jos order-2 overflow-hidden rounded-md md:order-1'
              data-jos_animation='fade-left'
            >
              <img
                src='https://e5osher1gwoyuako.public.blob.vercel-storage.com/webapp/static/handshake-5LrqnCUcQnE9L0653lhqgSLq93WmRn.jpg'
                alt='content-image-4'
                width={529}
                height={500}
                className='h-auto w-full'
              />
            </div>
            {/* Content Left Block */}
            {/* Content Right Block */}
            <div
              className='jos order-1 md:order-2'
              data-jos_animation='fade-right'
            >
              <ul className='flex flex-col gap-y-6'>
                <li>
                  <h5 className='mb-[10px]'>Access to Expertise</h5>
                  <p className='mb-7 last:mb-0'>
                    Our team of financial experts brings years of experience and
                    a deep understanding of the financial landscape. Partners
                    benefit from our insights, strategies, and tailored advice.
                  </p>
                </li>
                <li>
                  <h5 className='mb-[10px]'>Exclusive Opportunities</h5>
                  <p className='mb-7 last:mb-0'>
                    As a partner, you gain access to exclusive investment
                    opportunities, financial products, and services that are not
                    available to the general public.
                  </p>
                </li>
                <li>
                  <h5 className='mb-[10px]'>Collaborative Growth</h5>
                  <p className='mb-7 last:mb-0'>
                    We work closely with our partners to develop customized
                    financial solutions that meet the specific needs of their
                    clients or employees, fostering mutual growth and success.
                  </p>
                </li>
                <li>
                  <h5 className='mb-[10px]'>Reputation Enhancement</h5>
                  <p className='mb-7 last:mb-0'>
                    Aligning with RxT, a trusted and respected name in financial
                    services, can enhance your brand’s reputation and
                    credibility in the marketplace.
                  </p>
                </li>
              </ul>
            </div>
            {/* Content Right Block */}
          </div>
        </div>
        {/* Section Container */}
      </div>
      {/* Section Spacer */}
    </section>
  );
};

export default Content_02;
