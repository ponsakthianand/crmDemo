'use client'
import { capitalize } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'
import { FiSun } from 'react-icons/fi'
import { useOnClickOutside } from 'usehooks-ts'
import Button from '../elements/Button'

export default function ProfileThemeSwitch() {
  const t = useTranslations('')
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false) // New state to control dropdown visibility
  const { setTheme, resolvedTheme, themes, theme } = useTheme()
  const ref = useRef(null)
  useEffect(() => setMounted(true), [])
  useOnClickOutside(ref, () => setIsOpen(false))
  if (!mounted)
    return (
      <Button
        size='small'
        type='button'
        className='text-destructive inline-flex w-full items-center justify-between gap-3'
        id='options-menu'
        aria-expanded={isOpen}
        onClick={() => { }}
      >
        <FiSun />
      </Button>
    )

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div ref={ref} className='relative inline-block text-left'>
      <Button
        size='small'
        type='button'
        className='text-destructive inline-flex w-full items-center justify-between gap-3'
        id='options-menu'
        aria-expanded={isOpen}
        onClick={toggleDropdown}
      >
        <FiSun />
      </Button>
      {isOpen && (
        <div className='absolute right-0 mt-2 w-28 origin-top-right rounded-md bg-dropdown shadow-lg'>
          <div
            className='py-1'
            role='menu'
            aria-orientation='vertical'
            aria-labelledby='options-menu'
          >
            {themes.map(themeItem => {
              return (
                <button
                  key={themeItem}
                  onClick={() => {
                    setTheme(themeItem)
                    setIsOpen(false)
                  }}
                  className={`block w-full px-4 py-2 text-left text-sm hover:bg-dropdownHover ${themeItem === theme
                    ? 'bg-selected text-primary hover:bg-selected'
                    : 'text-secondary'
                    }`}
                >
                  {capitalize(themeItem)}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
