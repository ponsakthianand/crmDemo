import Link from 'next/link';

import useAccordion from '../../hooks/useAccordion';
import Image from 'next/image';

const Faq = () => {
  const [activeIndex, handleAccordion] = useAccordion(0);
  return (
    <>
      {/*...::: FAQ Section Start :::... */}
      <section className='faq-section'>
        {/* Section Spacer */}
        <div className='pb-20 xl:pb-[150px]'>
          {/* Section Container */}
          <div className='global-container'>
            <div className='grid grid-cols-1 gap-y-10 md:grid-cols-2'>
              {/* FAQ Left Block */}
              <div
                className='jos flex flex-col'
                data-jos_animation='fade-right'
              >
                {/* Section Content Block */}
                <div className='mb-6'>
                  <div className='mx-auto md:mx-0 md:max-w-none'>
                    <h2>Freely ask us for more information</h2>
                  </div>
                </div>
                {/* Section Content Block */}
                <div className='text-lg leading-[1.4] lg:text-[21px]'>
                  <p className='mb-7 last:mb-0'>
                    Our AI SaaS solutions can be quickly deployed, enabling
                    users to start benefiting from AI capabilities without
                    lengthy setup and development times in fast-paced
                    industries.
                  </p>
                  <Link
                    href='/faq-1'
                    className='button mt-5 rounded-[50px] border-2 border-black bg-black py-4 text-white after:bg-rxtGreen hover:border-rxtGreen hover:text-white'
                  >
                    Ask you questions
                  </Link>
                </div>
              </div>
              {/* FAQ Left Block */}

              {/* FAQ Right Block */}
              <div
                className='jos md:ml-10 lg:ml-20 xl:ml-32'
                data-jos_animation='fade-left'
              >
                {/* Accordion*/}
                <ul className='accordion'>
                  {/* Accordion items */}
                  <li
                    className={`accordion-item border-b-[1px] border-[#DBD6CF] pb-6 pt-6 first:pt-0 last:border-b-0 last:pb-0 ${
                      activeIndex === 0 ? 'active' : ''
                    }`}
                    onClick={() => handleAccordion(0)}
                  >
                    <div className='accordion-header flex items-center justify-between font-dmSans text-xl font-bold leading-[1.2] -tracking-[0.5px] text-black lg:text-[28px]'>
                      <p>How do I start AI SaaS?</p>
                      <div className='accordion-icon'>
                        <Image src='assets/img/plus.svg' alt='plus' />
                      </div>
                    </div>
                    <div className='accordion-content text-[#2C2C2C]'>
                      <p>
                        Go to the our official website and require users to
                        create an account. You'll need to provide some basic
                        information and agree to our terms and conditions.
                      </p>
                    </div>
                  </li>
                  {/* Accordion items */}
                  {/* Accordion items */}
                  <li
                    className={`accordion-item border-b-[1px] border-[#DBD6CF] pb-6 pt-6 first:pt-0 last:border-b-0 last:pb-0 ${
                      activeIndex === 1 ? 'active' : ''
                    }`}
                    onClick={() => handleAccordion(1)}
                  >
                    <div className='accordion-header flex items-center justify-between font-dmSans text-xl font-bold leading-[1.2] -tracking-[0.5px] text-black lg:text-[28px]'>
                      <p>Can I customize AI SaaS solutions?</p>
                      <div className='accordion-icon'>
                        <Image src='assets/img/plus.svg' alt='plus' />
                      </div>
                    </div>
                    <div className='accordion-content text-[#2C2C2C]'>
                      <p>
                        Go to the our official website and require users to
                        create an account. You'll need to provide some basic
                        information and agree to our terms and conditions.
                      </p>
                    </div>
                  </li>
                  {/* Accordion items */}
                  {/* Accordion items */}
                  <li
                    className={`accordion-item border-b-[1px] border-[#DBD6CF] pb-6 pt-6 first:pt-0 last:border-b-0 last:pb-0 ${
                      activeIndex === 2 ? 'active' : ''
                    }`}
                    onClick={() => handleAccordion(2)}
                  >
                    <div className='accordion-header flex items-center justify-between font-dmSans text-xl font-bold leading-[1.2] -tracking-[0.5px] text-black lg:text-[28px]'>
                      <p>How can AI benefit my business?</p>
                      <div className='accordion-icon'>
                        <Image src='assets/img/plus.svg' alt='plus' />
                      </div>
                    </div>
                    <div className='accordion-content text-[#2C2C2C]'>
                      <p>
                        Go to the our official website and require users to
                        create an account. You'll need to provide some basic
                        information and agree to our terms and conditions.
                      </p>
                    </div>
                  </li>
                </ul>
                {/* Accordion*/}
              </div>
              {/* FAQ Right Block */}
            </div>
          </div>
          {/* Section Container */}
        </div>
        {/* Section Spacer */}
      </section>
      {/*...::: FAQ Section End :::... */}
    </>
  );
};

export default Faq;
