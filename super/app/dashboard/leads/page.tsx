'use client'
import { LeadsDrawer } from './leads-drawer';
import TasksMainPage from './leads';
import { RefreshCw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchAllLeadsDataAPI } from '@/app/store/reducers/allLeadsData';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/registry/new-york/ui/tooltip';


export default function page() {
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.authToken);
  const reload = () => {
    accessToken?.access_token?.length && dispatch(fetchAllLeadsDataAPI(accessToken?.access_token));
  };
  return (
    <>
      <div className="h-full flex-1 flex-col px-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Leads</h2>
          </div>
          <div className='flex items-center justify-between'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='cursor-pointer mr-5 hover:animate-spin hover:text-green-700' onClick={() => reload()}><RefreshCw /></div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reload leads</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <LeadsDrawer action={'new'} />
          </div>
        </div>

        <TasksMainPage />

      </div>
    </>
  );
}
