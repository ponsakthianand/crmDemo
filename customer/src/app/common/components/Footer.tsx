'use client'
import { usePathname } from '@/src/navigation'
import { FC } from 'react'
import { ProfileFooter } from './ProfileFooter'
import { FooterCommon } from './FooterCommon'
interface Props {
  locale: string
}
export const Footer: FC<Props> = ({ locale }) => {
  const currentPage = usePathname()?.replace('/', '');
  const isProfileSection = currentPage?.includes('profile');
  const isLoginSection = currentPage?.includes('login');
  const isSignupSection = currentPage?.includes('signup');

  return (
    <>
      {
        (isProfileSection || isLoginSection || isSignupSection) ? <ProfileFooter locale={locale} /> : <FooterCommon locale={locale} />
      }
    </>
  )
}
