'use client'
import { useTranslations } from 'next-intl'
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react'
import footer_text_slider_icon from '@/assets/img/th-1/footer-text-slider-icon.svg'
import Logo from '@/src/app/components/logo/Logo'
import arrow_right_large from '@/assets/img/th-1/arrow-right-large.svg'
import { useRouter } from 'next/navigation';
interface Props {
  locale: string
}
export const FooterCommon: FC<Props> = ({ locale }) => {
  const t = useTranslations('')
  const router = useRouter();
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <footer id='footer'>
      <div className='bg-primary-800 text-white'>
        {/* Section Spacer */}
        <div className='py-20 xl:py-[50px]'>
          {/* Footer Top */}
          <div className='mb-[50px]'>
            {/* Section Container */}
            <div className='global-container'>
              {/* Footer Content */}
              <div className='grid-col-1 grid items-center gap-10 md:grid-cols-2'>
                {/* Section Content Block */}
                <div>
                  <h1 className='font-raleway text-white text-[50px] lg:text-[100px]'>Let’s talk</h1>
                </div>
                {/* Section Content Block */}
                <div className='jos flex flex-col gap-10 md:gap-[50px]'>
                  <p className='text-lg font-semibold leading-[1.33] md:text-xl lg:text-2xl'>
                    Together, we’ll design a customized plan to help you achieve financial freedom and reach your goals. Finance isn’t complicated—it’s about building simple, consistent habits. Let us guide you and reveal the secrets to success.
                  </p>
                </div>
              </div>
              {/* Footer Content */}
              {/* Footer Contact */}
              <div className='mt-11 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                <div className='rounded-[10px] bg-secondary-300 px-11 py-5 text-center font-bold leading-[1.33] text-secondary-900 transition-all duration-300 hover:bg-secondary-400 xl:text-2xl xxl:text-3xl cursor-pointer font-dmSans' onClick={() => router.push('mailto:info@rxtn.in')}>
                  info@rxtn.in
                </div>
                <div className='rounded-[10px] bg-secondary-300 px-11 py-5 text-center font-bold leading-[1.33] text-secondary-900 transition-all duration-300 hover:bg-secondary-400 xl:text-2xl xxl:text-3xl cursor-pointer font-dmSans' onClick={() => router.push('tel:+919962340067')}>
                  +91 99623 40067
                </div>
                <div className='rounded-[10px] bg-secondary-300 px-11 py-5 text-center font-bold leading-[1.33] text-secondary-900 transition-all duration-300 hover:bg-secondary-400 xl:text-2xl xxl:text-3xl cursor-pointer font-dmSans' onClick={() => router.push('/contact')}>
                  Request to call back
                </div>
              </div>
              {/* Footer Contact */}
            </div>
            {/* Section Container */}
          </div>
          {/* Footer Top */}
          {/* Footer Bottom */}
          <div className='pt-[50px] border-t-[1px] border-primary-700'>
            {/* Section Container */}
            <div className='global-container'>
              {/* Footer Widgets Block */}
              <div className='grid gap-x-10 gap-y-[60px] md:grid-cols-2 lg:flex lg:grid-cols-4 lg:justify-between lg:gap-x-20'>
                {/* Footer Widget Item */}
                <div className='flex flex-col gap-y-6 md:max-w-xs xl:max-w-[480px]'>
                  <div className='text-3xl font-bold'>FinTech</div>
                  <p>
                    Our mission is to empower individuals to achieve financial freedom and long-term success through personalized guidance and simple, effective strategies. We believe that mastering finance is about building habits, not solving complex equations.
                  </p>
                  <p>
                    © Copyright {new Date().getFullYear()}, FinTech.
                  </p>
                </div>
                {/* Footer Widget Item */}
                {/* Footer Widget Item */}
                <div className='flex flex-col gap-y-6'>
                  {/* Footer Title */}
                  <h4 className='text-lg uppercase font-semibold text-white'>
                    Primary Navigations
                  </h4>
                  {/* Footer Title */}
                  {/* Footer Navbar */}
                  <ul className='flex flex-col gap-y-[10px] capitalize'>
                    <li>
                      <Link
                        href='/'
                        className='transition-all duration-300 ease-linear hover:underline'
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='/about'
                        className='transition-all duration-300 ease-linear hover:underline'
                      >
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='/sessions'
                        className='transition-all duration-300 ease-linear hover:underline'
                      >
                        Book Us
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='/courses'
                        className='transition-all duration-300 ease-linear hover:underline'
                      >
                        Courses
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='/contact'
                        className='transition-all duration-300 ease-linear hover:underline'
                      >
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>
                {/* Footer Widget Item */}
                {/* Footer Widget Item */}
                <div className='flex flex-col gap-y-6'>
                  {/* Footer Title */}
                  <h4 className='text-lg uppercase font-semibold text-white'>
                    Legals
                  </h4>
                  {/* Footer Title */}
                  {/* Footer Navbar */}
                  <ul className='flex flex-col gap-y-[10px] capitalize'>
                    <li>
                      <Link
                        href='/terms-and-conditions'
                        className='transition-all duration-300 ease-linear hover:underline'
                      >
                        Terms & Conditions
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='/privacy-policy'
                        className='transition-all duration-300 ease-linear hover:underline'
                      >
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='/refund-policy'
                        className='transition-all duration-300 ease-linear hover:underline'
                      >
                        Refund Policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='/forgot-password'
                        className='transition-all duration-300 ease-linear hover:underline'
                      >
                        Password Reset
                      </Link>
                    </li>
                  </ul>
                </div>
                {/* Footer Widget Item */}
                {/* Footer Widget Item */}
                <div className='flex flex-col gap-y-6'>
                  {/* Footer Title */}
                  <h4 className='text-lg uppercase font-semibold text-white'>
                    Socials
                  </h4>
                  {/* Footer Title */}
                  {/* Footer Navbar */}
                  <ul className='flex flex-col gap-y-[15px] capitalize'>
                    <li>
                      <Link
                        rel='noopener noreferrer'
                        target='_blank'
                        href='https://www.facebook.com/RxT.Financial.Health.Clinic/'
                        className='group flex items-center gap-x-3'
                      >
                        <div className='flex h-[30px] w-[30px] items-center justify-center rounded-[50%] bg-white bg-opacity-10 transition-all duration-300 group-hover:bg-colorViolet'>
                          <img
                            src='https://e5osher1gwoyuako.public.blob.vercel-storage.com/social-icons/facebook-GEKmTUtpy7SY7Mx4XgJKnOQt43S8GL.png'
                            alt='facebook-icon-white'
                            width={24}
                            height={24}
                          />
                        </div>
                        <span className='inline-block flex-1'>Facebook</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        rel='noopener noreferrer'
                        target='_blank'
                        href='https://x.com/RxT_Return_x_T'
                        className='group flex items-center gap-x-3'
                      >
                        <div className='flex h-[30px] w-[30px] items-center justify-center rounded-[50%] bg-white bg-opacity-10 transition-all duration-300 group-hover:bg-colorViolet'>
                          <img
                            src='https://e5osher1gwoyuako.public.blob.vercel-storage.com/social-icons/twitter-t4yxlbirOpeUJpMALk1zUAa5iqbUlD.png'
                            alt='twitter-icon-white'
                            width={24}
                            height={24}
                          />
                        </div>
                        <span className='inline-block flex-1'>Twitter</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        rel='noopener noreferrer'
                        target='_blank'
                        href='https://www.instagram.com/rxt_a_financial_health_clinic/'
                        className='group flex items-center gap-x-3'
                      >
                        <div className='flex h-[30px] w-[30px] items-center justify-center rounded-[50%] bg-white bg-opacity-10 transition-all duration-300 group-hover:bg-colorViolet'>
                          <img
                            src='https://e5osher1gwoyuako.public.blob.vercel-storage.com/social-icons/instagram-htfUfU3a62hEPO9WUyJgZqVITaEUbB.png'
                            alt='instagram-icon-white'
                            width={24}
                            height={24}
                          />
                        </div>
                        <span className='inline-block flex-1'>Instagram</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        rel='noopener noreferrer'
                        target='_blank'
                        href='https://www.linkedin.com/company/rxtn/'
                        className='group flex items-center gap-x-3'
                      >
                        <div className='flex h-[30px] w-[30px] items-center justify-center rounded-[50%] bg-white bg-opacity-10 transition-all duration-300 group-hover:bg-colorViolet'>
                          <img
                            src='https://e5osher1gwoyuako.public.blob.vercel-storage.com/social-icons/linkedin-2iuoFykNAJSoHqiJJJJSV04DQaGQOT.png'
                            alt='linkedin-icon-white'
                            width={24}
                            height={24}
                          />
                        </div>
                        <span className='inline-block flex-1'>Linkedin</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        rel='noopener noreferrer'
                        target='_blank'
                        href='https://www.youtube.com/@RxT-AFinancialHealthClinic'
                        className='group flex items-center gap-x-3'
                      >
                        <div className='flex h-[30px] w-[30px] items-center justify-center rounded-[50%] bg-white bg-opacity-10 transition-all duration-300 group-hover:bg-colorViolet'>
                          <img
                            src='https://e5osher1gwoyuako.public.blob.vercel-storage.com/social-icons/youtube-eWo0fJyX0thlKhkxHAog5GbkwmTDia.png'
                            alt='linkedin-icon-white'
                            width={24}
                            height={24}
                          />
                        </div>
                        <span className='inline-block flex-1'>YouTube</span>
                      </Link>
                    </li>
                  </ul>
                </div>
                {/* Footer Widget Item */}
              </div>
              {/* Footer Widgets Block */}
            </div>
            {/* Section Container */}
          </div>
          {/* Footer Bottom */}
        </div>
        {/* Section Spacer */}
      </div>
    </footer>
  );
}
