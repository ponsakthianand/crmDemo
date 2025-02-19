"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/registry/new-york/ui/badge"
import { Checkbox } from "@/registry/new-york/ui/checkbox"

import { labels, priorities, statuses } from "../data/data"
import { DataTableColumnHeader } from "./data-table-column-header"
import LastSeen from "@/components/elements/lastSeen"
import { useRouter } from "next/navigation"
import PartnerApproval from "./approve"
import { Cart, OrdersData, Partner, UserInfo } from "@/app/store/reducers/allOrders"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/registry/new-york/ui/hover-card"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import { CalendarDays } from "lucide-react"
import { Button } from "@/registry/new-york/ui/button"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/registry/new-york/ui/sheet"
import { DataTableRowActions } from "./data-table-row-actions"
import { Page, WebsessionsData, Location } from "@/app/store/reducers/allwebSessions"
import { dateToLocalTimeDateYear } from "@/global"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/registry/new-york/ui/tooltip"
import PageContainer from "@/components/layout/page-container"

export const columns: ColumnDef<WebsessionsData>[] = [
  {
    accessorKey: "ip",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="IP" />
    ),
    cell: ({ row }) => {
      const ip: string = row.getValue("ip")
      const pages: Page[] = row.original.pages
      return (
        <div className="flex space-x-2 uppercase">
          <Sheet>
            <SheetTrigger asChild>
              <div className="p-0 hover:underline cursor-pointer">{ip}</div>
            </SheetTrigger>
            <SheetContent className="w-[500px] sm:max-w-[1000px]">
              <SheetHeader>
                <SheetTitle>Pages</SheetTitle>
              </SheetHeader>
              <PageContainer scrollable={true}>
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="px-4 py-2 text-left text-sm font-medium text-black uppercase">
                        Url with time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pages?.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-700">
                          <div>{item.url}</div>
                          <div className='text-xs text-stone-500'>{dateToLocalTimeDateYear(item?.visitTime)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </PageContainer>
            </SheetContent>
          </Sheet>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  }, {
    accessorKey: "pages",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pages" />
    ),
    cell: ({ row }) => {
      const pages: Page[] = row.getValue("pages")
      return (
        <div className="flex space-x-2 uppercase">
          <Sheet>
            <SheetTrigger asChild>
              <div className="p-0 hover:underline cursor-pointer">{pages?.length}</div>
            </SheetTrigger>
            <SheetContent className="w-[500px] sm:max-w-[1000px]">
              <SheetHeader>
                <SheetTitle>Pages</SheetTitle>
              </SheetHeader>
              <PageContainer scrollable={true}>
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="px-4 py-2 text-left text-sm font-medium text-black uppercase">
                        Url with time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pages?.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-700">
                          <div>{item.url}</div>
                          <div className='text-xs text-stone-500'>{dateToLocalTimeDateYear(item?.visitTime)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </PageContainer>
            </SheetContent>
          </Sheet>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "userAgent",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User Agent" />
    ),
    cell: ({ row }) => {
      const agent: string = row.getValue("userAgent")
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="p-0 cursor-pointer w-[300px] truncate">{agent}</div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-[500px] break-words">{agent}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => {
      const location: Location = row.getValue("location")
      return (
        <>
          {location?.data ? (<div className="flex space-x-2">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button className="p-0" variant="link">{location?.data?.city || 'No data'}</Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">Geo Location</h4>
                    <p className="text-sm">{location?.data?.city}, {location?.data?.zip},</p>
                    <p className="text-sm">{location?.data?.regionName}({location?.data?.region}), {location?.data?.country} ({location?.data?.countryCode}) </p>
                    <p className="text-sm">Lat: {location?.data?.lat}, Lon:{location?.data?.lon} </p>
                    <p className="text-sm">{location?.data?.timezone} </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div >) : <div className="flex space-x-2">No data</div>}</>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "partner",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Referral" />
    ),
    cell: ({ row }) => {
      const partner: Partner = row.getValue("partner")
      return (
        <>
          {partner ? (<div className="flex space-x-2">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button className="p-0" variant="link">{partner?.name || 'No data'}</Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{partner.name}</h4>
                    <p className="text-sm">
                      {partner.email}
                    </p>
                    <p className="text-sm">
                      {partner.phone}
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div >) : <div className="flex space-x-2">No data</div>}</>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Visited" />
    ),
    cell: ({ row }) => {
      const date: string = row.getValue("updated_at") ? row.getValue("updated_at") : row.original.timestamp
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate text-[13px]">
            {dateToLocalTimeDateYear(date)}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
