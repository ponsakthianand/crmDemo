"use client"

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { ScrollArea, ScrollBar } from "@/registry/new-york/ui/scroll-area"
import LastSeen from '@/components/elements/lastSeen';
import { NoData } from '@/components/no-data/nodata';
import { DataLoader } from '@/components/dataLoader/dataLoader';
import { fetchAdminLogsDataAPI } from '@/app/store/reducers/adminLogs';
import { fetchCustomerLogsDataAPI } from '@/app/store/reducers/customersLogs';
import PageContainer from '@/components/layout/page-container';

export default function AdminsTab() {
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.authToken);
  const adminLogs = useAppSelector((state) => state.customersLogs);
  const adminLogsList = adminLogs?.data;

  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchCustomerLogsDataAPI(accessToken?.access_token));
  }, [accessToken])

  return (
    <div className="block">
      <PageContainer scrollable={true}>
        <div className=" w-full pt-5">
          {adminLogsList?.length ? <ul className="flex flex-col">
            {adminLogsList?.map((log, index) => (
              <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-white cursor-pointer hover:bg-gray-100" key={index}>
                <div className="flex justify-between w-full">
                  <div className='flex items-center w-9/12'>
                    {log?.name} logged in at &nbsp;<LastSeen date={log?.login_time} />&nbsp;from {log?.userInfo?.networkGatewayDefault}
                  </div>
                </div>
              </li>
            ))}</ul> : adminLogs?.loading ? <DataLoader /> : <NoData />}
        </div>
      </PageContainer>
    </div >
  )
} 