'use client'
import { columns } from "@/components/tables/ticket-tables/components/columns"
import { DataTable } from "@/components/tables/ticket-tables/components/data-table"
import { useAppDispatch, useAppSelector } from "@/app/store/hooks"
import { fetchTicketsDataAPI } from "@/app/store/reducers/allTicketChat"
import { useEffect } from "react"
import TableLoader from "@/components/ui/table-loader"
import { fetchPartnersDataAPI } from "@/app/store/reducers/allPartners"
import { NoData } from "@/components/no-data/nodata"

// export const metadata: Metadata = {
//   title: "Tasks",
//   description: "A task and issue tracker build using Tanstack Table.",
// }

// Simulate a database read for tasks.
// async function getTasks() {
//   const dispatch = useAppDispatch()
//   const data = await dispatch(fetchTicketsDataAPI(accessToken?.access_token))

//   const tasks = JSON.parse(data.toString())

//   return z.array(taskSchema).parse(tasks)
// }

export default function TaskPage() {
  // const tasks = await getTasks()

  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.authToken);
  const getTicketsAPI = useAppSelector((state) => state.ticketChatData);
  const getTickets = getTicketsAPI?.data;

  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchTicketsDataAPI(accessToken?.access_token));
    accessToken?.access_token?.length && dispatch(fetchPartnersDataAPI(accessToken?.access_token));
  }, [accessToken])

  return (
    <>
      <div className="h-full flex-1 flex-col px-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Tickets</h2>
          </div>
        </div>
        {getTicketsAPI?.loading ? <TableLoader /> : getTickets?.length ? <DataTable data={getTickets} columns={columns} /> : <NoData />}
        { }
      </div>
    </>
  )
}
