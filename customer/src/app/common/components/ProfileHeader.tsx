'use client'
import { Link } from '@/src/navigation'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import LogoIcon from '../../../../assets/branding/logo'
import ProfileThemeSwitch from './ProfileThemeSwitch'
import ProfileLangSwitcher from './ProfileLangSwitcher'
import ProfileTopDropdown from './ProfileTopDropdown'
import { GrChat } from 'react-icons/gr'
import { RiHome5Line } from 'react-icons/ri'
interface Props {
  locale: string
}
export const ProfileHeader: FC<Props> = ({ locale }) => {
  const t = useTranslations('')
  return (
    <div className="bg-white dark:bg-gray-900 w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600 ">
      <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between px-5 py-2">
        <Link lang={locale} href='/'>
          <div className='flex flex-row items-center'>
            <div className='w-28'>
              <LogoIcon />
            </div>
          </div>
        </Link>
        <div className="flex flex-row items-center gap-3 md:flex md:w-auto md:order-1" id="navbar-sticky">
          <div className="flex">
            <button type="button" data-collapse-toggle="navbar-search" aria-controls="navbar-search" aria-expanded="false" className="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 me-1">
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
              <span className="sr-only">Search</span>
            </button>
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
                <span className="sr-only">Search icon</span>
              </div>
              <input type="text" id="search-navbar" className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..." />
            </div>
            <button data-collapse-toggle="navbar-search" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-search" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </button>
          </div>
          <div className='ml-3'>
            <Link lang={locale} href='/profile'>
              <RiHome5Line size={'16px'} />
            </Link>
          </div>
          <div className='ml-3'>
            <Link lang={locale} href='/profile/help'>
              <GrChat />
            </Link>
          </div>
          <ProfileLangSwitcher />
          {/* <ProfileThemeSwitch /> */}
          <ProfileTopDropdown />
        </div>
      </div>
    </div>
  )
}
