"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/registry/new-york/ui/badge"
import { Checkbox } from "@/registry/new-york/ui/checkbox"

import { labels, priorities, statuses } from "../data/data"
import { DataTableColumnHeader } from "./data-table-column-header"
import LastSeen from "@/components/elements/lastSeen"
import { useRouter } from "next/navigation"
import { CustomersData } from "@/app/store/reducers/allCutomers"
import { AssignCustomer } from "./assignCustomer"
import { DataTableRowActions } from "./data-table-row-actions"

export const columns: ColumnDef<CustomersData>[] = [
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
        router.push(`/dashboard/customers/${rowData._id}`)
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
    accessorKey: "partner",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Partner" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate">
            <AssignCustomer customer_id={row.original._id} kid={
              <div className="flex items-center">
                {row?.original?.partner?.name || <span className="text-orange-400">Unassigned</span>}
              </div>
            } />
          </span>
        </div>
      )
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
    accessorKey: "ticket_count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tickets" />
    ),
    cell: ({ row }) => {

      return (
        <div className="flex items-center">
          <span>{row.getValue("ticket_count") || 0}</span>
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
