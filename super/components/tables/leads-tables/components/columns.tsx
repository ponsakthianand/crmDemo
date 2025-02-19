"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/registry/new-york/ui/badge"
import { Checkbox } from "@/registry/new-york/ui/checkbox"

import { labels, statuses } from "../data/data"
import { DataTableColumnHeader } from "./data-table-column-header"
import LastSeen from "@/components/elements/lastSeen"
import { useRouter } from "next/navigation"
import { AssignCustomer } from "./assignCustomer"
import { LeadsInfo } from "@/app/store/reducers/allLeadsData"
import { dateToLocalTimeDateYear } from "@/global"
import { LeadsDrawer } from "@/app/dashboard/leads/leads-drawer"
import { DataTableRowActions } from "./data-table-row-actions"

export const columns: ColumnDef<LeadsInfo>[] = [
  {
    accessorKey: "full_Name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (<LeadsDrawer initialData={row?.original} />)
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const category = labels.find(
        (category) => category.value === row.getValue("category")
      )
      return (
        <div className="flex space-x-2">
          <Badge className={category?.color || ''} variant="outline">{category?.label || 'Uncategorized'}</Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "callSchedule",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Call schedule" />
    ),
    cell: ({ row }) => {
      const statusData: string = row.getValue("callSchedule")
      return (
        <div className="flex space-x-2">
          {statusData ? dateToLocalTimeDateYear(statusData) : 'Yet to schedule'}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "mobile",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => {
      const statusData: string = row.getValue("mobile")
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
    accessorKey: "referral_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Referral" />
    ),
    cell: ({ row }) => {
      const statusData: string = row.getValue("referral_name")
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
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate text-[13px]">
            <LastSeen date={row.getValue("created_at")} />
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
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
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
