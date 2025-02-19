'use client'
import { usePathname } from '@/src/navigation'
import { FC } from 'react'
import { ProfileHeader } from './ProfileHeader'
import { HeaderCommon } from './HeaderCommon'
interface Props {
  locale: string
}
export const Header: FC<Props> = ({ locale }) => {
  const currentPage = usePathname()?.replace('/', '');
  const isProfileSection = currentPage?.includes('profile');

  return (
    <>
      {
        isProfileSection ? <ProfileHeader locale={locale} /> : <HeaderCommon locale={locale} loginCSS='button hidden rounded-[50px] border-[#7F8995] bg-transparent text-black after:bg-rxtGreen hover:border-rxtGreen hover:text-white lg:inline-block'
          signupCSS='button hidden rounded-[50px] border-black bg-black text-white after:bg-rxtGreen hover:border-rxtGreen hover:text-white lg:inline-block' />
      }
    </>
  )
}
