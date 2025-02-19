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
        isProfileSection ? <ProfileHeader locale={locale} /> : <HeaderCommon locale={locale} />
      }
    </>
  )
}
