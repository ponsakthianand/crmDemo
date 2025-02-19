'use client'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchCustomersDataAPI } from '@/app/store/reducers/allCutomers';
import { NoData } from '@/components/no-data/nodata';
import { columns } from '@/components/tables/customer-tables/components/columns';
import { DataTable } from '@/components/tables/customer-tables/components/data-table';
import NewCustomerDialog from '@/components/tables/customer-tables/components/new-customer';
import TableLoader from '@/components/ui/table-loader';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';


export default function page() {
  const dispatch = useAppDispatch()
  const { data: session, status } = useSession()
  const accessToken = useAppSelector((state) => state.authToken);
  const customersList = useAppSelector((state) => state.allCustomersData);
  const customersData = customersList?.data;

  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchCustomersDataAPI(accessToken?.access_token));
  }, [accessToken])

  return (
    <>
      <div className="h-full flex-1 flex-col px-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
          </div>
          <NewCustomerDialog />
        </div>
        {customersList?.loading ? <TableLoader /> : customersData?.length ? <DataTable data={customersData} columns={columns} /> : <NoData />}
        { }
      </div>
    </>
  );
}
