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
import LastSeen from '@/components/elements/lastSeen';
import { NoData } from '@/components/no-data/nodata';
import { ScrollArea } from '@/components/ui/scroll-area';
import { fetchPartnerSpecificDataAPI } from '@/app/store/reducers/partnerInfo';
import PartnersCustomerse from './customers/customers';
import PageContainer from '@/components/layout/page-container';

export default function PartnerProfile({ params }: any) {
  const { partnerId } = params;
  const dispatch = useAppDispatch()
  const { data: session, status } = useSession()
  const accessToken = useAppSelector((state) => state.authToken);
  const partner = useAppSelector((state) => state.partnerSpecificData);
  const partnerData = partner?.data;
  const [selectedTab, setSelectedTab] = useState('customers');

  const actionButton = useCallback(() => {
    switch (selectedTab) {
      case 'customers':
        return null
      case 'earnings':
        return null
      case 'activity':
        return null
      case 'profile':
        return null
      default:
        return null
    }
  }, [selectedTab])

  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchPartnerSpecificDataAPI(accessToken?.access_token, partnerId));
  }, [accessToken])
  return (
    <PageContainer scrollable={true}>
      <div className="block">
        <div className="border-t">
          <div className="bg-background">
            <div className="grid lg:grid-cols-5">
              <div className="col-span-4 lg:col-span-5 lg:border-l">
                <div className="h-full px-4 py-6 lg:px-8">
                  <Tabs defaultValue="customers" className="h-full space-y-6" onValueChange={(value) => setSelectedTab(value)}>
                    <div className="space-between flex items-center">
                      <div className="flex space-x-4 pr-6 min-w-80 max-w-80">
                        <Avatar>
                          {/* <AvatarImage src="https://github.com/vercel.png" /> */}
                          <AvatarFallback>{partnerData?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h3 className="text-base font-semibold">{partnerData?.name}</h3>
                          <div className="flex items-center">
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                            <span className="text-xs text-muted-foreground flex">
                              Joined &nbsp; <LastSeen date={partnerData?.created_at} />
                            </span>
                          </div>
                        </div>
                      </div>
                      <TabsList>
                        <TabsTrigger value="customers">Customers</TabsTrigger>
                        <TabsTrigger value="earnings">Earnings</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                      </TabsList>
                      <div className="ml-auto mr-4">
                        {actionButton()}
                      </div>
                    </div>

                    <TabsContent
                      value="profile"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex">
                      <NoData />
                    </TabsContent>

                    <TabsContent
                      value="customers"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex">
                      <PartnersCustomerse customerID={partnerId} />
                    </TabsContent>

                    <TabsContent
                      value="earnings"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex">
                      <NoData />
                    </TabsContent>

                    <TabsContent
                      value="activity"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex">
                      <NoData />
                    </TabsContent>

                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
