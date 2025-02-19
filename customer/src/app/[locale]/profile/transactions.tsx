import { RiProfileLine, RiShieldKeyholeLine } from "react-icons/ri";
import { CustomerData } from "../../store/reducers/profile";
import { fetchOrdersDataAPI } from "../../store/reducers/allOrders";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect } from "react";
import LastSeen from "../../common/elements/lastSeen";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/registry/new-york/ui/hover-card";
import TableLoader from "@/components/ui/table-loader";

interface ProfileData {
  currentUser: CustomerData
}

export default function Transactions(props: ProfileData) {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.authToken);
  const ordersList = useAppSelector((state) => state.allOrders);
  const orders = ordersList ? ordersList?.data : []

  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchOrdersDataAPI(accessToken?.access_token));
  }, [accessToken])

  return (
    <>
      <div id="default-styled-tab-content">
        <div className="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 border-t-4 border-t-[#673AB7]">
          <div className="relative">
            <div className="w-full md:w-12/12 min-h-[550px]">
              {!ordersList?.loading && orders?.length ? (
                <div className="flex flex-col">
                  <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                      <div className="border rounded-lg overflow-hidden dark:border-neutral-700">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                          <thead className="bg-gray-50 dark:bg-neutral-700">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Order Id</th>
                              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Customer</th>
                              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Date</th>
                              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Product</th>
                              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Total</th>
                              <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                            {orders?.map((order, index) => {
                              return (
                                <tr key={index} className="bg-white dark:bg-neutral-800">
                                  <td className="px-4 py-3 whitespace-nowrap uppercase text-sm font-medium text-gray-800 dark:text-neutral-200">{order.orderId}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                    {order?.userInfo?.name ? order?.userInfo?.name : 'No name'}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                    <div className="text-xs text-muted-foreground">
                                      <LastSeen date={order?.createdAt} />
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                    <>
                                      {order.cart?.length ? (<div className="flex space-x-2">
                                        <HoverCard>
                                          <HoverCardTrigger asChild>
                                            <div className="p-0 hover:underline cursor-pointer">{order.cart?.length} items</div>
                                          </HoverCardTrigger>
                                          <HoverCardContent className="w-full p-1 dark:bg-neutral-800 bg-white">
                                            <div className="space-y-1">
                                              <ul className="flex flex-col">
                                                <li className="inline-flex items-center gap-x-2 py-1 px-4 bg-gray-50 text-xs font-medium uppercase border text-gray-600 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:border-neutral-700 dark:text-neutral-200">
                                                  <div className="flex items-center justify-between w-full">
                                                    <span className="inline-block truncate w-48">Item</span>
                                                    <span className="inline-block w-10 text-right">Qty</span>
                                                    <span className="inline-block w-12 text-right font-medium">Price</span>
                                                  </div>
                                                </li>
                                                {order.cart.map((item, index) => (
                                                  <li key={index} className="inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:border-neutral-700 dark:text-neutral-200">
                                                    <div className="flex items-center justify-between w-full">
                                                      <span className="inline-block truncate w-48">{item?.title}</span>
                                                      <span className="inline-block w-8 text-right">{item?.count}</span>
                                                      <span className="inline-block w-12 text-right font-medium">₹{item?.salePrice}</span>
                                                    </div>
                                                  </li>
                                                ))}
                                                <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-semibold bg-gray-50 border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200">
                                                  <div className="flex items-center justify-between w-full">
                                                    <span>Total</span>
                                                    <span>₹{order.amount / 100}</span>
                                                  </div>
                                                </li>
                                              </ul>
                                            </div>
                                          </HoverCardContent>
                                        </HoverCard>
                                      </div >) : 'No data'}</>

                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">₹{order.amount / 100}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-end text-sm font-medium">

                                    {order.status === 'pending' && <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-500">Pending</span>}

                                    {order.status === 'paid' && <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-500">Paid</span>}

                                    {order.status === 'failed' && <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-500">Failed</span>}

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
                !ordersList?.loading ? <div className='p-5'>You have ordered yet</div> : <div className='p-5'><TableLoader /></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}