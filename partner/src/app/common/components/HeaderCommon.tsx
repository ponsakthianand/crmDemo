'use client'
import { Link } from '@/src/navigation'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import LogoIcon from '../../../../assets/branding/logo'
import LangSwitcher from './LangSwitcher'
import ThemeSwitch from './ThemeSwitch'
interface Props {
  locale: string
}
export const HeaderCommon: FC<Props> = ({ locale }) => {
  const t = useTranslations('')
  return (
    <div className='mx-auto flex max-w-screen-2xl flex-row items-center justify-between p-5'>
      <Link lang={locale} href='/'>
        <div className='flex flex-row items-center'>
          <div className='w-28'>
            <LogoIcon />
          </div>
        </div>
      </Link>
      <div className='flex flex-row items-center gap-3'>
        {/* <nav className='mr-10 inline-flex gap-5'>
          <Link lang={locale} href={`/about`}>
            {t('About')}
          </Link>
          <Link lang={locale} href={`/login`}>
            {t('Login')}
          </Link>
        </nav> */}
        {/* <LangSwitcher /> */}
        {/* <ThemeSwitch /> */}
      </div>
    </div>
  )
}
