'use client'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { parseJwt } from '@/global';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login } from '../store/reducers/auth';
import { fetchProfileDataAPI } from '../store/reducers/profile';
import { GoogleAnalytics } from "nextjs-google-analytics";

export function InitialSession() {
  const dispatch = useAppDispatch()
  const { data: session, status } = useSession()
  const t = useTranslations('')
  const accessToken = useAppSelector((state) => state.authToken);

  useEffect(() => {
    if (status === "authenticated") {
      const authData = parseJwt(session.accessToken);
      dispatch(login(authData));
    }
  }, [status])

  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchProfileDataAPI(accessToken?.access_token));
  }, [session, accessToken])

  return <GoogleAnalytics trackPageViews />
}