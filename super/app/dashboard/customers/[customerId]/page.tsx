"use client"

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import Image from "next/image"
import { CalendarIcon, PlusCircle } from "lucide-react"

import { Button } from "@/registry/new-york/ui/button"
import { Separator } from "@/registry/new-york/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/new-york/ui/avatar"
import { fetchCustomerSpecificDataAPI } from '@/app/store/reducers/customerInfo';
import LastSeen from '@/components/elements/lastSeen';
import FinancialTrackerTab from './financial-tracker/financialTracker';
import { NoData } from '@/components/no-data/nodata';
import { FinancialTrackerForm } from './financial-tracker/ft-form';
import MutualFundsTab from './mutual-funds/mutualFunds';
// import NewMutualFundDialog from './mutual-funds/new-mutual-fund';
import NotesTab from './notes/notes';
import NewNotesDialog from './notes/new-notes';
import TodosTab from './todos/todos';
import TicketsTab from './tickets/tickets';
import NewMutualFundDialog from './mutual-funds/new-mf';

export default function CustomerProfile({ params }: any) {
  const { customerId } = params;
  const dispatch = useAppDispatch()
  const { data: session, status } = useSession()
  const accessToken = useAppSelector((state) => state.authToken);
  const customer = useAppSelector((state) => state.customerSpecificData);
  const financialTracker = useAppSelector((state) => state.financialTracker);
  const customerData = customer?.data;
  const [selectedTab, setSelectedTab] = useState('financeTracker');

  const actionButton = useCallback(() => {
    switch (selectedTab) {
      case 'financeTracker':
        return (
          <FinancialTrackerForm financialTracker={financialTracker} customerId={customerId} token={accessToken?.access_token} />
        )
      case 'mutualFunds':
        return (
          <NewMutualFundDialog customerId={customerId} token={accessToken?.access_token || ''} />
        )
      case 'tickets':
        return null
      case 'todos':
        return null
      case 'notes':
        return (
          <NewNotesDialog customerId={customerId} token={accessToken?.access_token} />
        )
      case 'profile':
        return null
      default:
        return null
    }
  }, [selectedTab, financialTracker])

  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchCustomerSpecificDataAPI(accessToken?.access_token, customerId));
  }, [accessToken])


  return (
    <>
      <div className="block">
        <div className="border-t">
          <div className="bg-background">
            <div className="grid lg:grid-cols-5">
              <div className="col-span-4 lg:col-span-5 lg:border-l">
                <div className="h-full px-4 py-6 lg:px-8">
                  <Tabs defaultValue="financeTracker" className="h-full space-y-6" onValueChange={(value) => setSelectedTab(value)}>
                    <div className="space-between flex items-center">
                      <div className="flex space-x-4 pr-6 min-w-80 max-w-80">
                        <Avatar>
                          {/* <AvatarImage src="https://github.com/vercel.png" /> */}
                          <AvatarFallback>{customerData?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h3 className="text-base font-semibold">{customerData?.name}</h3>
                          <div className="flex items-center">
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                            <span className="text-xs text-muted-foreground flex">
                              Joined &nbsp; <LastSeen date={customerData?.created_at} />
                            </span>
                          </div>
                        </div>
                      </div>
                      <TabsList>
                        <TabsTrigger value="financeTracker">Finance Tracker</TabsTrigger>
                        <TabsTrigger value="mutualFunds">Mutual Funds</TabsTrigger>
                        <TabsTrigger value="tickets">Tickets</TabsTrigger>
                        <TabsTrigger value="todos">To-do's</TabsTrigger>
                        <TabsTrigger value="notes">Notes</TabsTrigger>
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                      </TabsList>
                      <div className="ml-auto mr-4">
                        {actionButton()}
                      </div>
                    </div>
                    <TabsContent
                      value="financeTracker"
                      className="border-none p-0 outline-none"
                    >
                      <FinancialTrackerTab customerID={customerId} />
                    </TabsContent>
                    <TabsContent
                      value="mutualFunds"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex"
                    >
                      <MutualFundsTab customerID={customerId} />
                    </TabsContent>
                    <TabsContent
                      value="tickets"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex"
                    >
                      <TicketsTab customerID={customerId} />
                    </TabsContent>
                    <TabsContent
                      value="todos"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex"
                    >
                      <TodosTab customerID={customerId} />
                    </TabsContent>
                    <TabsContent
                      value="notes"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex"
                    >
                      <NotesTab customerID={customerId} />
                    </TabsContent>
                    <TabsContent
                      value="profile"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex"
                    >
                      <NoData />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}