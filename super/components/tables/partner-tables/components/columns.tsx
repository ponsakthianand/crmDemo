"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/registry/new-york/ui/badge"
import { Checkbox } from "@/registry/new-york/ui/checkbox"

import { labels, priorities, statuses } from "../data/data"
import { DataTableColumnHeader } from "./data-table-column-header"
import LastSeen from "@/components/elements/lastSeen"
import { useRouter } from "next/navigation"
import { PartnersData } from "@/app/store/reducers/allPartners"
import PartnerApproval from "./approve"
import { DataTableRowActions } from "./data-table-row-actions"

export const columns: ColumnDef<PartnersData>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const router = useRouter()
      const clickHandler = (rowData: any) => {
        router.push(`/dashboard/partners/${rowData._id}`)
      }
      return (<div className="w-full hover:underline uppercase" onClick={() => clickHandler(row.original)}>
        {row.getValue("name") || 'No name'}
      </div>)
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const statusData: string = row.getValue("email")
      return (
        <div className="flex space-x-2">
          {statusData}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => {
      const statusData: string = row.getValue("phone")
      return (
        <div className="flex space-x-2">
          {statusData || 'Not Available'}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "partner_user_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          {row.getValue("partner_user_id") || '--'}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate text-[13px]">
            <LastSeen date={row.getValue("created_at")} />
            <span className="text-xs text-slate-700 block">{row.original.current_city}</span>
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
      const statusValueApproved = statusData === 'approved'
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
