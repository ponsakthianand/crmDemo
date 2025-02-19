'use client';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/app/store/hooks';
import TableLoader from '@/components/ui/table-loader';
import { fetchLeadsDataAPI } from '@/src/app/store/reducers/allLeads';
import LastSeen from '@/src/app/common/elements/lastSeen';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/registry/new-york/ui/sheet';
import { ScrollArea } from '@/registry/new-york/ui/scroll-area';
import { dateToLocalTimeDateYear } from '@/global';

export default function Leads() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.authToken);
  const leadList = useAppSelector((state) => state.allLeads);
  const leads = leadList ? leadList?.data : []

  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchLeadsDataAPI(accessToken?.access_token));
  }, [accessToken])

  return (
    <>
      <div id="default-styled-tab-content">
        <div className="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 border-t-4 border-t-[#008756]">
          <div className="relative">
            <div className="w-full md:w-12/12 min-h-[550px]">
              {!leadList?.loading && leads?.length ? (
                <div className="flex flex-col">
                  <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                      <div className="border rounded-lg overflow-hidden dark:border-neutral-700">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                          <thead className="bg-gray-50 dark:bg-neutral-700">
                            <tr>
                              <th scope="col" className="px-6 py-3 pl-4 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Name</th>
                              <th scope="col" className="px-6 py-3 pl-4 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Date</th>
                              <th scope="col" className="px-6 py-3 pl-4 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Phone</th>
                              <th scope="col" className="px-6 py-3 pl-4 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Category</th>
                              <th scope="col" className="px-6 py-3 pl-4 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                            {leads?.map((lead, index) => {
                              return (
                                <tr key={index} className="bg-white dark:bg-neutral-800">
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                    <Sheet>
                                      <SheetTrigger asChild>
                                        <div className="p-0 hover:underline cursor-pointer">{lead.full_Name}</div>
                                      </SheetTrigger>
                                      <SheetContent className="w-[100vw] md:w-[700px]">
                                        <SheetHeader>
                                          <SheetTitle>{lead.full_Name}</SheetTitle>
                                        </SheetHeader>
                                        <div className="bg-white shadow-md rounded-md overflow-x-auto">
                                          <div style={{ height: 'calc(95vh - 200px)' }} className="p-4 overflow-auto">
                                            <table className="w-full border-collapse text-sm">
                                              <tbody>
                                                {Object.entries(lead).map(([key, value]) => {
                                                  let displayValue;

                                                  // Format "created_at" and "updated_at" using LastSeen component
                                                  if (key === "created_at" || key === "updated_at") {
                                                    displayValue = dateToLocalTimeDateYear(value);
                                                  } else if (Array.isArray(value)) {
                                                    displayValue = value.length > 0 ? value.join(", ") : "N/A";
                                                  } else if (typeof value === "boolean") {
                                                    displayValue = value ? "Yes" : "No";
                                                  } else {
                                                    displayValue = value || "N/A";
                                                  }

                                                  return (
                                                    <tr key={key} className="border-b">
                                                      <td className="px-4 py-2 font-medium capitalize bg-gray-100">{key.replace(/_/g, " ")}</td>
                                                      <td className="px-4 py-2">{displayValue}</td>
                                                    </tr>
                                                  );
                                                })}
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                      </SheetContent>
                                    </Sheet>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200"><LastSeen date={lead.created_at} /></td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{lead.mobile}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{lead.category}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm truncate max-w-20">
                                    {lead.status}
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
                !leadList?.loading ? <div className='p-5'>You referral links are not leaded yet!</div> : <div className='p-5'><TableLoader /></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
