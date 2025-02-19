import Image from "next/image"
import { columns } from "../../ticket-tables/components/columns"
import { DataTable } from "../../ticket-tables/components/data-table"
import { useAppDispatch, useAppSelector } from "@/app/store/hooks"
import { fetchTicketsDataAPI } from "@/app/store/reducers/allTicketChat"
import { useEffect, useState } from "react"
import TableLoader from "@/components/ui/table-loader"
import { baseUrl } from "@/global"
import { NextApiResponse } from "next"
import { RiLoader5Fill } from "react-icons/ri"
import { fetchPartnersDataAPI } from "@/app/store/reducers/allPartners"
import { toast } from '@/components/ui/use-toast';

export default function PartnerApproval({ id, content, value }: any) {

  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.authToken);
  const [loading, setLoading] = useState(false);

  const fetchTicketsDataAPI = async (seesionId: string, partnerID: string) => {
    setLoading(true)
    await fetch(`${baseUrl}/admin/approve/${partnerID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: `Bearer ${seesionId}`
      },
      body: JSON.stringify({ status: (value === 'approved') ? 'suspended' : 'approved' })
    })
      .then(async (response) => {
        setLoading(false)
        if (response.ok) {
          accessToken?.access_token?.length && dispatch(fetchPartnersDataAPI(accessToken?.access_token));
          toast({
            description: `Updated!`,
          })
          return response.json();
        }
      })
  }


  return (
    <>
      <div className='relative'>
        <div onClick={() => fetchTicketsDataAPI(accessToken?.access_token as string, id)}>
          {content}
        </div>
        {loading ? <div role="status" className='absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2'>
          <RiLoader5Fill className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" />
          <span className="sr-only">Loading...</span>
        </div> : <></>}
      </div>
    </>
  )
}