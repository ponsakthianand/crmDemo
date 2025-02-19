'use client'
import isAuth from '@/src/app/protect/withAuth';
import { useAppSelector } from '@/src/app/store/hooks';
import ProfileTabs from './tabs';

const ProfilePage = () => {
  const getCustomerInfo = useAppSelector((state) => state.profileData);
  const currentUser = getCustomerInfo?.data;

  return <ProfileTabs currentUser={currentUser} />
}

export default isAuth(ProfilePage);