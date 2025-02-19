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
import { AddAsCustomer } from "./table-row-action-convert-customer"

export const columns: ColumnDef<OrdersData>[] = [
  {
    accessorKey: "orderId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order ID" />
    ),
    cell: ({ row }) => {
      const orderId: string = row.getValue("orderId")
      const orderData = {
        orderId: row.original.orderId,
        status: row.original.status,
        razorpayOrderId: row.original.razorpayOrderId,
        razorpayOrderInfo: row.original.razorpayOrderInfo,
      };

      const transformData = (data: any) => {
        const transformed = [];
        for (const key in data) {
          if (typeof data[key] === "object" && !Array.isArray(data[key])) {
            for (const subKey in data[key]) {
              transformed.push({ name: subKey, value: data[key][subKey] });
            }
          } else {
            transformed.push({ name: key, value: data[key] });
          }
        }
        return transformed;
      };

      const transformedOrderData = transformData(orderData);
      return (
        <div className="flex space-x-2 uppercase">
          <Sheet>
            <SheetTrigger asChild>
              <div className="p-0 hover:underline cursor-pointer">{orderId}</div>
            </SheetTrigger>
            <SheetContent className="w-[500px] sm:max-w-[1000px]">
              <SheetHeader>
                <SheetTitle>RazorPay inofrmation</SheetTitle>
              </SheetHeader>
              <div className="bg-white shadow-md rounded-md">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 uppercase">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 uppercase">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transformedOrderData.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-700">{item.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {item.value !== null && item.value !== undefined
                            ? item?.name === 'amount_due' || item?.name === 'amount' ? (item.value.toString() / 100) : item.value.toString()
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
    accessorKey: "userInfo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => {
      const statusData: UserInfo = row.getValue("userInfo")
      const getOriginal = row.original
      return (
        <>
          {statusData ? (<div className="flex space-x-2 items-center justify-start">
            <div className="flex space-x-2">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button className="p-0" variant="link">{statusData?.name || 'No data'}</Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex justify-between space-x-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">{statusData.name}</h4>
                      <p className="text-sm">
                        {statusData.email}
                      </p>
                      <p className="text-sm">
                        {statusData.phone}
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            {!getOriginal?.isCustomer ? (
              <div className="flex items-center space-x-2">
                <AddAsCustomer row={row} />
              </div>
            ) : null}
          </div>) : 'No data'}</>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "cart",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Items" />
    ),
    cell: ({ row }) => {
      const cart: Cart[] = row.getValue("cart")
      return (
        <>
          {cart?.length ? (<div className="flex space-x-2">
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="p-0 hover:underline cursor-pointer">{cart?.length} items</div>
              </HoverCardTrigger>
              <HoverCardContent className="w-full p-1">
                <div className="space-y-1">
                  <ul className="flex flex-col">
                    <li className="inline-flex items-center gap-x-2 py-1 px-4 bg-gray-50 text-xs font-medium uppercase border text-gray-600 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:border-neutral-700 dark:text-neutral-200">
                      <div className="flex items-center justify-between w-full">
                        <span className="inline-block truncate w-48">Item</span>
                        <span className="inline-block w-10 text-right">Qty</span>
                        <span className="inline-block w-12 text-right font-medium">Price</span>
                      </div>
                    </li>
                    {cart.map((item, index) => (
                      <li key={index} className="inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:border-neutral-700 dark:text-neutral-200">
                        <div className="flex items-center justify-between w-full">
                          <span className="inline-block truncate w-48">{item?.title}</span>
                          <span className="inline-block w-8 text-right">{item?.count}</span>
                          <span className="inline-block w-12 text-right font-medium">₹{item?.salePrice}</span>
                        </div>
                      </li>
                    ))}
                    <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-semibold bg-gray-50 border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200">
                      <div className="flex items-center justify-between w-full">
                        <span>Total</span>
                        <span>₹{row.original.amount / 100}</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div >) : 'No data'}</>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const statusData: string = row.getValue("amount")
      return (
        <div className="flex space-x-2">
          {Number(statusData) / 100}
        </div>
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
      const statusData: Partner = row.getValue("partner")
      return (
        <>
          {statusData ? (<div className="flex space-x-2">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button className="p-0" variant="link">{statusData?.name || 'No data'}</Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{statusData.name}</h4>
                    <p className="text-sm">
                      {statusData.email}
                    </p>
                    <p className="text-sm">
                      {statusData.phone}
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
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate text-[13px]">
            <LastSeen date={row.getValue("createdAt")} />
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const statusData: string = row.getValue("status")
      const statusValueApproved = statusData === 'paid'
      const statusValuePending = statusData === 'pending'
      return (
        <div className="flex space-x-2">
          <PartnerApproval id={row.original._id} value={statusData} content={
            <span className={`${statusValueApproved ?
              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-200' : statusValuePending ?
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 hover:bg-yellow-200' :
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 hover:bg-red-200'}
              text-xs font-medium me-2 px-2.5 py-0.5 rounded capitalize`}>
              {statusData || 'Pending'}
            </span>
          } />
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
