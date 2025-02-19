import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  return (
    <>
      <div className="relative overflow-hidden before:absolute before:top-0 before:start-1/2 before:bg-[url('https://e5osher1gwoyuako.public.blob.vercel-storage.com/webapp/static/polygon-bg-nG8TV6x6Z109RZUePGmivcbVODLrpe.svg')] dark:before:bg-[url('https://e5osher1gwoyuako.public.blob.vercel-storage.com/webapp/static/polygon-bg-element-CzgEjqIEnw4UmcWi77EUDATXRUIHS0.svg')] before:bg-no-repeat before:bg-top before:bg-cover before:size-full before:-z-[1] before:transform before:-translate-x-1/2">
        <div className='max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10'>
          <div className='flex justify-center'>
            <a
              className='inline-flex items-center gap-x-2 bg-white border border-gray-200 text-sm text-gray-800 p-1 ps-3 rounded-full transition hover:border-gray-300 focus:outline-none focus:border-gray-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-600 dark:focus:border-neutral-600'
              href='/contact'
            >
              We’ve just launched our newly upgraded website! We’d love to hear
              your feedback. 😊
              <span className='py-1.5 px-2.5 inline-flex justify-center items-center gap-x-2 rounded-full bg-gray-200 font-semibold text-sm text-gray-600 dark:bg-neutral-700 dark:text-neutral-400'>
                <svg
                  className='shrink-0 size-4'
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='m9 18 6-6-6-6' />
                </svg>
              </span>
            </a>
          </div>

          <div className='mt-5 max-w-4xl text-center mx-auto'>
            <h1 className='block font-bold text-gray-800 text-4xl md:text-5xl lg:text-6xl dark:text-neutral-200'>
              <span className='lg:text-5xl text-3xl font-bold'>
                World’s First{' '}
              </span>
              <span className='text-rxtGreen lg:text-7xl text-4xl font-extrabold'>
                GenAI-Enabled Financial Consulting Company
              </span>
              <span className='lg:text-5xl text-3xl font-bold'>
                {' '}
                Bringing Financial Habits to the Masses
              </span>
            </h1>
          </div>

          <div className='mt-5 max-w-3xl text-center mx-auto'>
            <p className='text-lg text-gray-600 dark:text-neutral-400'>
              We are revolutionizing the way people approach finance. As the
              world’s first GenAI-powered financial consulting company, we
              leverage advanced AI to introduce and simplify financial habits
              for everyone. Our personalized guidance, innovative tools, and
              expert resources are designed to help you build lasting financial
              habits and unlock your path to success. Join us and be part of a
              new era of smarter financial living!
            </p>
          </div>

          <div className='mt-8 gap-3 flex justify-center'>
            <Link
              className='inline-flex justify-center items-center gap-x-3 text-center bg-gradient-to-tl from-blue-600 to-violet-600 hover:from-violet-600 hover:to-blue-600 border border-transparent text-white text-sm font-medium rounded-md focus:outline-none focus:from-violet-600 focus:to-blue-600 py-3 px-4'
              href='/contact'
            >
              Get started
              <svg
                className='shrink-0 size-4'
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='m9 18 6-6-6-6' />
              </svg>
            </Link>
            <Link
              className='relative group p-2 px-6 inline-flex items-center gap-x-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800'
              href='/about'
            >
              Learn more
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
