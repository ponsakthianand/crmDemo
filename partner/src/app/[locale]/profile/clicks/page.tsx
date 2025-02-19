'use client';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/app/store/hooks';
import TableLoader from '@/components/ui/table-loader';
import { fetchClicksDataAPI } from '@/src/app/store/reducers/allClicks';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/registry/new-york/ui/hover-card';
import LastSeen from '@/src/app/common/elements/lastSeen';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/registry/new-york/ui/sheet';
import { ScrollArea } from '@/registry/new-york/ui/scroll-area';
import { dateToLocalTimeDateYear } from '@/global';
import { Button } from '@/registry/new-york/ui/button';

export default function Clicks() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.authToken);
  const clickList = useAppSelector((state) => state.allClicks);
  const click = clickList ? clickList?.data : []

  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchClicksDataAPI(accessToken?.access_token, null));
  }, [accessToken])

  return (
    <>
      <div id="default-styled-tab-content">
        <div className="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 border-t-4 border-t-[#008756]">
          <div className="relative">
            <div className="w-full md:w-12/12 min-h-[550px]">
              {!clickList?.loading && click?.length ? (
                <div className="flex flex-col">
                  <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                      <div className="border rounded-lg overflow-hidden dark:border-neutral-700">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                          <thead className="bg-gray-50 dark:bg-neutral-700">
                            <tr>
                              <th scope="col" className="px-6 py-3 pl-4 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Page</th>
                              <th scope="col" className="px-6 py-3 pl-4 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Date</th>
                              <th scope="col" className="px-6 py-3 pl-4 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Location</th>
                              <th scope="col" className="px-6 py-3 pl-4 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">IP</th>
                              <th scope="col" className="px-6 py-3 pl-4 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">System</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                            {click?.map((click, index) => {
                              return (
                                <tr key={index} className="bg-white dark:bg-neutral-800">
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                    <Sheet>
                                      <SheetTrigger asChild>
                                        <div className="p-0 hover:underline cursor-pointer">{click.pages?.length} Pages</div>
                                      </SheetTrigger>
                                      <SheetContent className="w-[100vw] md:w-[700px]">
                                        <SheetHeader>
                                          <SheetTitle>Pages List</SheetTitle>
                                        </SheetHeader>
                                        <div className="bg-white shadow-md rounded-md">
                                          <div style={{ height: 'calc(95vh - 200px)' }} className="p-4 overflow-hidden overflow-y-auto">
                                            <table className="min-w-full border-collapse">
                                              <thead>
                                                <tr className="bg-gray-100 border-b">
                                                  <th className="px-4 py-2 text-left text-sm font-medium text-black uppercase">
                                                    Url with time
                                                  </th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {click.pages.map((item, index) => (
                                                  <tr key={index} className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-2 text-sm text-gray-700">
                                                      <div>{item.url}</div>
                                                      <div className='text-xs text-stone-500'>{dateToLocalTimeDateYear(item?.visitTime)}</div>
                                                    </td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                      </SheetContent>
                                    </Sheet>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap uppercase text-sm text-gray-800 dark:text-neutral-200"><LastSeen date={click.timestamp} /></td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">

                                    {click?.location?.data ? (<div className="flex space-x-2">
                                      <HoverCard>
                                        <HoverCardTrigger asChild>
                                          <Button className="p-0" variant="link">{click?.location?.data?.city || 'No data'}</Button>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-80">
                                          <div className="flex justify-between space-x-4">
                                            <div className="space-y-1">
                                              <h4 className="text-sm font-semibold">Geo Location</h4>
                                              <p className="text-sm">{click?.location?.data?.city}, {click?.location?.data?.zip},</p>
                                              <p className="text-sm">{click?.location?.data?.regionName}({click?.location?.data?.region}), {click?.location?.data?.country} ({click?.location?.data?.countryCode}) </p>
                                              <p className="text-sm">Lat: {click?.location?.data?.lat}, Lon:{click?.location?.data?.lon} </p>
                                              <p className="text-sm">{click?.location?.data?.timezone} </p>
                                            </div>
                                          </div>
                                        </HoverCardContent>
                                      </HoverCard>
                                    </div >) : <div className="flex space-x-2">No data</div>}

                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                    {click?.ip}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-end text-sm truncate max-w-20">
                                    {click.userAgent}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                !clickList?.loading ? <div className='p-5'>You referral links are not clicked yet!</div> : <div className='p-5'><TableLoader /></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
