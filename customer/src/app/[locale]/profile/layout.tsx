'use client'
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { dateToLocalDateYear, parseJwt } from "@/global";
import isAuth from '@/src/app/protect/withAuth';
import { useEffect } from "react";
import { login } from "../../store/reducers/auth";
import { fetchProfileDataAPI } from "../../store/reducers/profile";
import LoaderSpinner from "../../common/elements/loader";
import NewChat from "./help/[chat]/newChat";
import Link from "next/link";
import Image from 'next/image'

function ProfileRootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {

  const dispatch = useAppDispatch()
  const { data: session, status } = useSession()
  const getCustomerInfo = useAppSelector((state) => state.profileData);
  const accessToken = useAppSelector((state) => state.authToken);
  const currentUser = getCustomerInfo?.data;
  const memberSince = dateToLocalDateYear(currentUser?.created_at);

  useEffect(() => {
    if (status === "authenticated") {
      const authData = parseJwt(session.accessToken);
      dispatch(login(authData));
    }
  }, [status])

  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchProfileDataAPI(accessToken?.access_token));
  }, [session, accessToken])

  return (
    <>
      {currentUser ? <div className="">
        <div className="container mx-auto p-5">
          <div className="md:flex no-wrap md:-mx-2 ">
            <div className="w-full md:w-3/12 md:mx-2">
              <div className="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 p-5 border-t-4 border-t-[#673AB7]">

                <div className="image overflow-hidden mx-auto flex justify-center">
                  <div className="relative inline-flex items-center justify-center w-28 h-28 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                    <span className="font-extrabold text-5xl text-gray-600 dark:text-gray-300">{currentUser?.name?.charAt(0)}</span>
                  </div>
                </div>

                <div className='w-full text-center mt-4'>
                  <h1 className="text-gray-900 font-bold text-lg leading-normal">{currentUser?.name}</h1>
                  <h3 className="text-gray-600 font-normal text-sm leading-6">
                    <span>Member since </span>
                    <span className="ml-auto">{memberSince}</span>
                  </h3>
                </div>
              </div>
              <div className="my-4"></div>
              {/* bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 p-5 border-t-4 border-t-green-400 */}
              {currentUser?.partner_id ?
                <div className="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 p-5 relative">
                  <span className="top-2 right-2 absolute inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-500">Support Partner</span>
                  <div className="flex flex-col items-center pb-10 pt-4">
                    <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                      <span className="font-medium text-gray-600 dark:text-gray-300">{currentUser?.partner_name?.charAt(0)}</span>
                    </div>
                    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{currentUser?.partner_name}</h5>
                    <div className="flex mt-4 md:mt-6">
                      <Link href={`tel:${currentUser?.partner_phone}`} className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-[#673AB7] rounded-lg hover:bg-[#673AB7] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-[#673AB7] dark:hover:bg-[#673AB7] mr-1 dark:focus:ring-[#673AB7]">Call</Link>

                      <NewChat buttonName={'Message'} />
                    </div>
                  </div>
                </div> : <></>}

              <div className="my-4"></div>
            </div>
            <div className="w-full md:w-9/12 md:mx-2">
              {children}
            </div>
          </div>
        </div>
      </div> : <div className="w-full min-h-96 mt-10"><LoaderSpinner /></div>
      }
    </>
  )
}


export default isAuth(ProfileRootLayout);