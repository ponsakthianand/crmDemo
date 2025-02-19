'use client'
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import TableLoader from '@/components/ui/table-loader';
import { NoData } from '@/components/no-data/nodata';
import { fetchOrdersDataAPI } from '@/app/store/reducers/allOrders';
import { DataTable } from '@/components/tables/orders-tables/components/data-table';
import { columns } from '@/components/tables/orders-tables/components/columns';

export default function page() {
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.authToken);
  const ordersList = useAppSelector((state) => state.allOrders);
  const orders = ordersList ? ordersList?.data : []

  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchOrdersDataAPI(accessToken?.access_token));
  }, [accessToken])

  return (
    <>
      <div className="h-full flex-1 flex-col px-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
          </div>
        </div>
        {ordersList?.loading ? <TableLoader /> : orders?.length ? <DataTable data={orders} columns={columns} /> : <NoData />}
        { }
      </div>
    </>
  )
}
