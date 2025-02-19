'use client'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
interface Props {
  locale: string
}
export const ProfileFooter: FC<Props> = ({ locale }) => {
  const t = useTranslations('')
  return (
    <>© 2024</>
  )
}
