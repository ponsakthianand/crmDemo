'use client'
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import TableLoader from '@/components/ui/table-loader';
import { NoData } from '@/components/no-data/nodata';
import { DataTable } from '@/components/tables/websessions-tables/components/data-table';
import { columns } from '@/components/tables/websessions-tables/components/columns';
import { fetchWebsessionsDataAPI } from '@/app/store/reducers/allwebSessions';
import { RefreshCw } from 'lucide-react';

export default function page() {
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.authToken);
  const websessionsList = useAppSelector((state) => state.allWebsessions);
  const websessions = websessionsList ? websessionsList?.data : []

  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchWebsessionsDataAPI(accessToken?.access_token));
  }, [accessToken])

  const reload = () => {
    accessToken?.access_token?.length && dispatch(fetchWebsessionsDataAPI(accessToken?.access_token));
  };

  return (
    <>
      <div className="h-full flex-1 flex-col px-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Web Sessions</h2>
          </div>
          <div className='flex items-center justify-between'>
            <div className='cursor-pointer mr-5 hover:animate-spin hover:text-green-700' onClick={() => reload()}><RefreshCw /></div>
          </div>
        </div>
        {websessionsList?.loading ? <TableLoader /> : websessions?.length ? <DataTable data={websessions} columns={columns} /> : <NoData />}
        { }
      </div>
    </>
  )
}
