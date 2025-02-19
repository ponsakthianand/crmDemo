'use client'
import { useAppDispatch, useAppSelector } from '@/src/app/store/hooks';
import { logoutCall } from '../../store/reducers/auth';
import { signOut } from 'next-auth/react';
import Avatar from './avatar-initials';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '@/registry/new-york/ui/menubar'
import { useRouter } from 'next/navigation';

const ProfileTopDropdownCommon = () => {
  const dispatch = useAppDispatch()
  const router = useRouter();
  const getCustomerInfo = useAppSelector((state) => state.profileData);
  const currentUser = getCustomerInfo?.data;
  const onLogout = () => {
    signOut()
    dispatch(logoutCall());
  }

  return (
    <div className=''>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger className='border-0 overflow-visible cursor-pointer'>
            <Avatar name={currentUser?.name} userId={currentUser?._id} />
          </MenubarTrigger>
          <MenubarContent className='bg-white'>
            <MenubarItem className='cursor-pointer Hover:bg-gray-100' onClick={() => router.push('/profile')}>
              Profile
            </MenubarItem>
            <MenubarSeparator className='border border-b-[1px]' />
            <MenubarItem className='cursor-pointer Hover:bg-gray-100' onClick={onLogout}>
              Logout
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div >
  )
}

export default ProfileTopDropdownCommon
