'use client'
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchPartnersDataAPI } from '@/app/store/reducers/allPartners';
import TableLoader from '@/components/ui/table-loader';
import { DataTable } from '@/components/tables/partner-tables/components/data-table';
import { columns } from '@/components/tables/partner-tables/components/columns';
import NewPartnerDialog from '@/components/tables/partner-tables/components/new-partner';
import { NoData } from '@/components/no-data/nodata';

export default function page() {
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.authToken);
  const partnersList = useAppSelector((state) => state.partnersList);
  const partners = partnersList ? partnersList?.data : []

  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchPartnersDataAPI(accessToken?.access_token));
  }, [accessToken])

  return (
    <>
      <div className="h-full flex-1 flex-col px-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Partners</h2>
          </div>
          <NewPartnerDialog />
        </div>
        {partnersList?.loading ? <TableLoader /> : partners?.length ? <DataTable data={partners} columns={columns} /> : <NoData />}
        { }
      </div>
    </>
  )
}
