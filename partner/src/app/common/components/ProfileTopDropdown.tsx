'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/src/app/store/hooks';
import { logoutCall } from '../../store/reducers/auth';
import { signOut } from 'next-auth/react';
import { Link } from '@/src/navigation';
import { profileTabs } from '@/global';
import Avatar from '../../components/misc/avatar-initials';

const ProfileTopDropdown: React.FC = () => {
  interface Option {
    name: string;
    url
  }
  const dispatch = useAppDispatch()
  const getCustomerInfo = useAppSelector((state) => state.profileData);
  const currentUser = getCustomerInfo?.data;

  const [isOptionsExpanded, setIsOptionsExpanded] = useState(false)
  const options: Option[] = [
    { name: 'Profile', url: '/profile/info' },
    { name: 'Edit Profile', url: '/profile/edit' },
    { name: 'Security & Privacy', url: '/profile/security' },
  ]

  const myRef = useRef<HTMLInputElement>();

  const handleClickOutside = (e) => {
    if (!myRef.current?.contains(e.target)) {
      setIsOptionsExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onLogout = () => {
    signOut()
    setIsOptionsExpanded(false);
    dispatch(logoutCall());
  }

  return (
    <div className='flex items-center justify-center'>
      <div className='relative'>
        <button
          className='cursor-pointer'
          onClick={() => setIsOptionsExpanded(!isOptionsExpanded)}
        >

          <div className="relative w-10 h-10 overflow-hidden">
            <Avatar name={currentUser?.name} userId={currentUser?._id} />
          </div>

        </button>
        {isOptionsExpanded && (
          <div id="userDropdown" className="absolute z-10 origin-top-right mt-2 shadow-lg right-0 bg-white divide-y divide-gray-100 rounded-lg w-44 dark:bg-gray-700 dark:divide-gray-600" ref={myRef}>
            <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
              <div>{currentUser?.name}</div>
              <div className="font-small truncate">{currentUser?.email}</div>
            </div>
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="avatarButton">
              {
                options?.map((menu, index) => {
                  return <li key={index}>
                    <Link href={menu.url} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      {menu.name}
                    </Link>
                  </li>
                })
              }
            </ul>
            <div className="py-1">
              <div onClick={onLogout} className="block px-4 py-2 cursor-pointer text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</div>
            </div>
          </div>
        )}
      </div>
    </div >
  )
}

export default ProfileTopDropdown
