'use client'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchPartnersCustomersDataAPI } from '@/app/store/reducers/partnerSpecificallCutomers';
import { NoData } from '@/components/no-data/nodata';
import { columns } from '@/components/tables/customer-tables/components/columns';
import { DataTable } from '@/components/tables/customer-tables/components/data-table';
import NewCustomerDialog from '@/components/tables/customer-tables/components/new-customer';
import TableLoader from '@/components/ui/table-loader';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';


interface PartnersCustomersProps {
  customerID: string;
}

export default function PartnersCustomers({ customerID }: PartnersCustomersProps) {
  const dispatch = useAppDispatch()
  const { data: session, status } = useSession()
  const accessToken = useAppSelector((state) => state.authToken);
  const customersList = useAppSelector((state) => state.partnerSpecificCustomersData);
  const customersData = customersList?.data;

  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchPartnersCustomersDataAPI(accessToken?.access_token, customerID));
  }, [accessToken])

  return (
    <>
      <div className="h-full flex-1 flex-col px-0 md:flex">
        <div className="flex items-center justify-between space-y-2">
          {/* <NewCustomerDialog /> */}
        </div>
        {customersList?.loading ? <TableLoader /> : customersData?.length ? <DataTable data={customersData} columns={columns} /> : <NoData />}
        { }
      </div>
    </>
  );
}
