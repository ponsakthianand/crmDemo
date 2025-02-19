"use client"

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { ScrollArea, ScrollBar } from "@/registry/new-york/ui/scroll-area"
import LastSeen from '@/components/elements/lastSeen';
import { NoData } from '@/components/no-data/nodata';
import { DataLoader } from '@/components/dataLoader/dataLoader';
import { Circle, CircleCheckBig, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/registry/new-york/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { fetchusersDataAPI } from '@/app/store/reducers/usersList';
import { LeadsDrawer } from './leads-drawer';
import { DataTable } from '@/components/tables/leads-tables/components/data-table';
import { columns } from '@/components/tables/leads-tables/components/columns';
import { fetchAllLeadsDataAPI } from '@/app/store/reducers/allLeadsData';
import { fetchPartnersListAPI } from '@/app/store/reducers/partnersList';
import DateTimePicker from './datetime';
import TableLoader from '@/components/ui/table-loader';

export default function LeadsMainPage() {
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.authToken);
  const leadsList = useAppSelector((state) => state.allLeadsData);
  const leadsData = leadsList?.data;
  const partners = useAppSelector((state) => state.partnersDropdownsList);
  const profile = useAppSelector((state) => state.profileData);

  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchAllLeadsDataAPI(accessToken?.access_token));
    accessToken?.access_token?.length && dispatch(fetchPartnersListAPI(accessToken?.access_token));
  }, [accessToken])

  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchusersDataAPI(accessToken?.access_token));
  }, [accessToken])


  return (
    <div className="bg-background pt-2">
      {leadsList?.loading ? <TableLoader /> : leadsData?.length ? <DataTable data={leadsData} columns={columns} /> : <NoData />}
    </div>
  )
} 