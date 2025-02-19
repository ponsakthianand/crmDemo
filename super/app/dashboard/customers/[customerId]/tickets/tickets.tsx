"use client"

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { useSession } from 'next-auth/react';
import { columns } from "@/components/tables/ticket-tables/components/columns"
import { DataTable } from "@/components/tables/ticket-tables/components/data-table"
import { useCallback, useEffect, useState } from 'react';
import { ScrollArea, ScrollBar } from "@/registry/new-york/ui/scroll-area"
import LastSeen from '@/components/elements/lastSeen';
import { NoData } from '@/components/no-data/nodata';
import { DataLoader } from '@/components/dataLoader/dataLoader';
import { toast } from '@/components/ui/use-toast';
import { fetchTicketsSpecificDataAPI } from '@/app/store/reducers/ticketsSpecificCustomer';
import PageContainer from '@/components/layout/page-container';

interface TicketsTabProps {
  customerID: string;
}
export default function TicketsTab({ customerID }: TicketsTabProps) {
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.authToken);
  const tickets = useAppSelector((state) => state.ticketsCustomerSpecific);
  const ticketsList = tickets?.data;

  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchTicketsSpecificDataAPI(accessToken?.access_token, customerID));
  }, [accessToken])

  const onDelete = async (noteId: string, title: string) => {
    const response = await fetch(`/api/customers/${customerID}/tickets`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${accessToken?.access_token}`,
      },
      body: JSON.stringify({ noteId }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    toast({
      title: "Deleted",
      description: `${title} has been deleted successfully.`,
      variant: "destructive",
    })
    const data = await response.json();
    if (accessToken?.access_token) {
      dispatch(fetchTicketsSpecificDataAPI(accessToken.access_token, customerID));
    }
    return data;
  }


  return (
    <div className="block">
      <div className="border-t">
        <div className="bg-background pt-8">
          <PageContainer scrollable={true}>
            <div className=" w-full">
              {ticketsList?.length ? <DataTable data={ticketsList} columns={columns} /> : tickets?.loading ? <DataLoader /> : <NoData />}
            </div>
          </PageContainer>
        </div>
      </div >
    </div >
  )
} 