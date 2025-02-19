"use client"

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { NoData } from '@/components/no-data/nodata';
import { usePathname, useRouter } from 'next/navigation';

const tabsData = [
  {
    name: 'Customers',
    route: "/dashboard/activity-logs/customers",
  }, ,
  {
    name: 'Partners',
    route: "/dashboard/activity-logs/partners",
  },
  {
    name: 'Admin',
    route: "/dashboard/activity-logs/admin",
  }
];

export default function ActivityLogsRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch()
  const pathname = usePathname(); // Get the current path
  const router = useRouter();
  const { data: session, status } = useSession()
  const accessToken = useAppSelector((state) => state.authToken);
  const customer = useAppSelector((state) => state.customerSpecificData);
  const selectedTab = tabsData.find((tab) => tab && pathname.includes(tab.route))?.name || 'Customers';

  const updateSelectedTab = (route: string) => {
    router.push(route); // Navigate to the respective route
  };

  return (
    <>
      <div className="block">
        <div className="border-t">
          <div className="bg-background">
            <div className="grid lg:grid-cols-5">
              <div className="col-span-4 lg:col-span-5 lg:border-l">
                <div className="h-full px-4 py-6 lg:px-8">
                  <div className="flex items-center justify-between rounded-t-lg font-semibold overflow-x-auto overflow-hidden">
                    <ul
                      className="flex -mb-px text-sm font-medium text-center"
                      role="tablist"
                    >
                      {tabsData?.map((tab, index) => (
                        <li className="me-2" role="presentation" key={index}>
                          <button
                            className={
                              selectedTab === tab?.name
                                ? "flex p-2 lg:p-4 items-center text-[#008756] hover:text-[#008756] dark:text-[#008756] dark:hover:text-[#008756] border-[#008756] dark:border-[#008756] border-b-2"
                                : "p-2 lg:p-4 inline-flex items-center justify-center rounded-t-lg"
                            }
                            type="button"
                            role="tab"
                            onClick={() => tab?.route && updateSelectedTab(tab.route)}
                          >
                            {tab?.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div id="default-styled-tab-content">{children}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}