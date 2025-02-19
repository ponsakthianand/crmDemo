const Content_01 = () => {
  return (
    <section id='content-section-2'>
      {/* Section Spacer */}
      <div className='pb-20 xl:pb-[150px]'>
        {/* Section Container */}
        <div className='global-container'>
          {/* Section Content Block */}
          <div className='jos mb-10 text-center lg:mb-16 xl:mb-20'>
            <div className='mx-auto md:max-w-xl lg:max-w-4xl xl:max-w-[950px]'>
              <h2>Client Benefits</h2>
              <p>
                Clients of RxT enjoy a range of benefits designed to enhance
                their financial well-being
              </p>
            </div>
          </div>
          {/* Section Content Block */}
          <div className='grid grid-cols-1 items-center gap-12 md:grid-cols-[minmax(0,_1fr)_1.2fr] xl:gap-28 xxl:gap-32'>
            {/* Content Left Block */}
            <div
              className='jos order-2 md:order-1'
              data-jos_animation='fade-left'
            >
              <ul className='flex flex-col gap-y-6'>
                <li>
                  <h5 className='mb-[10px]'>
                    Personalized Financial Solutions:
                  </h5>
                  <p className='mb-7 last:mb-0'>
                    We take a personalized approach, crafting financial
                    strategies that are tailored to your individual
                    circumstances, goals, and risk tolerance.
                  </p>
                </li>
                <li>
                  <h5 className='mb-[10px]'>Comprehensive Support</h5>
                  <p className='mb-7 last:mb-0'>
                    From initial consultation to ongoing management, we provide
                    end-to-end support, helping you navigate the complexities of
                    the financial world with confidence.
                  </p>
                </li>
                <li>
                  <h5 className='mb-[10px]'>Financial Empowerment</h5>
                  <p className='mb-7 last:mb-0'>
                    Through our educational initiatives and one-on-one
                    consultations, we empower you with the knowledge and skills
                    to make informed financial decisions that align with your
                    long-term goals.
                  </p>
                </li>
                <li>
                  <h5 className='mb-[10px]'>Proactive Management</h5>
                  <p className='mb-7 last:mb-0'>
                    We actively monitor your financial health, offering timely
                    advice and adjustments to keep you on track and help you
                    achieve your objectives.
                  </p>
                </li>
                <li>
                  <h5 className='mb-[10px]'>Peace of Mind</h5>
                  <p className='mb-7 last:mb-0'>
                    With RxT as your financial partner, you can focus on living
                    your life, knowing that your financial well-being is in
                    expert hands.
                  </p>
                </li>
              </ul>
            </div>
            {/* Content Left Block */}

            {/* Content Right Block */}
            <div
              className='jos order-1 md:order-2 overflow-hidden rounded-md'
              data-jos_animation='fade-right'
            >
              <img
                src='https://e5osher1gwoyuako.public.blob.vercel-storage.com/webapp/static/customer-7Q5Dl4i73GZugxkB33vbrW5rIVYNvd.jpg'
                alt='content-image-4'
                width={529}
                height={500}
                className='h-auto w-full'
              />
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

export default Content_01;
