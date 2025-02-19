'use client'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
interface Props {
  locale: string
}
export const ProfileFooter: FC<Props> = ({ locale }) => {
  const t = useTranslations('')
  return (
    <div className='text-xs text-gray-600 text-center'>© Copyright {new Date().getFullYear()}, FinTech.</div>
  )
}
