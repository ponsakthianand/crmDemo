'use client'
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { signOut, useSession } from 'next-auth/react';
import { dateToLocalDateYear, parseJwt } from '@/global';
import { useEffect, useState } from 'react';
import { login } from '../store/reducers/auth';
import { fetchProfileDataAPI } from '../store/reducers/profile';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch()
  const { data: session, status } = useSession()
  const accessToken = useAppSelector((state) => state.authToken);
  const profileData = useAppSelector((state) => state.profileData);
  const currentUser = profileData?.data;

  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchProfileDataAPI(accessToken?.access_token));
  }, [session, accessToken])

  useEffect(() => {
    if (status === "authenticated") {
      const authData = parseJwt(session.accessToken as string);
      dispatch(login(authData));
    }
  }, [status])

  return (
    <div className="flex">
      <Sidebar userData={currentUser} />
      <main className="w-full flex-1">
        <Header userData={currentUser} />
        {children}
      </main>
    </div>
  );
}
