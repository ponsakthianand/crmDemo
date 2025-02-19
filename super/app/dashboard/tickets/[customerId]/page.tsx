'use client'
// import { cookies } from "next/headers"
import { Inbox } from "../../../../components/tables/ticketsInbox/components/ticketInbox"
import { accounts, mails } from "../../../../components/tables/ticketsInbox/data"
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { fetchCustomersDataAPI } from "@/app/store/reducers/allCutomers";

export default function TicketInboxPage({ params }: any) {
  const { customerId } = params;
  const searchParams = useSearchParams()
  const ticketIdFromUrl = searchParams.get('ticket_Id')
  // const layout = cookies().get("react-resizable-panels:layout:mail")
  // const collapsed = cookies().get("react-resizable-panels:collapsed")
  // const defaultLayout = layout ? JSON.parse(layout.value) : undefined
  // const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined

  return (
    <>
      <div className="hidden flex-col md:flex border">
        <Inbox
          customerId={customerId}
          ticketId={ticketIdFromUrl}
          defaultLayout={[18.662124047, 37.24855198, 44.089323973]}
          defaultCollapsed={false}
          navCollapsedSize={4}
        />
      </div>
    </>
  )
}
