'use client'
import isAuth from '@/src/app/protect/withAuth';
import { useAppDispatch, useAppSelector } from '@/src/app/store/hooks';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { GrChat } from "react-icons/gr";
import Link from 'next/link';
import NewChat from './[chat]/newChat';
import { dateToLocalTimeDateYear } from '@/global';
import { fetchTicketsDataAPI } from '@/src/app/store/reducers/allTicketChat';
import { GoCheckCircle } from "react-icons/go";
import { BiMessageSquareDots } from "react-icons/bi";

const ProfileHelpPage = () => {
  const dispatch = useAppDispatch()
  const [loader, setLoader] = useState(false);
  const accessToken = useAppSelector((state) => state.authToken);
  const getTicketsAPI = useAppSelector((state) => state.ticketChatData);
  const getTickets = getTicketsAPI?.data;

  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchTicketsDataAPI(accessToken?.access_token));
  }, [accessToken])

  return (
    <div>
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700 bg-white rounded-md">
        <div className='p-4 flex items-center justify-between rounded-t-lg font-semibold'>

          <div className=' inline-flex items-center justify-center'>
            <div className="h-4 me-2">
              <GrChat />
            </div>
            Help Chats
          </div>

          <div>
            <NewChat buttonName={'New chat'} />
          </div>

        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 p-5 border-t-4 border-t-[#673AB7]">
        <div className='h-[550px] overflow-y-auto'>
          <ul role="list" className="divide-y divide-gray-100">
            {getTickets?.map((ticket, index) => (
              <li key={index} className="">
                <Link className='flex justify-between gap-x-6 rounded-md p-5 hover:bg-slate-100 cursor-pointer'
                  href={`/profile/help/${ticket._id}`}>
                  <div className="flex min-w-0 gap-x-4">
                    <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-600">
                      <span className="font-medium text-gray-600 dark:text-gray-300">{ticket?.title?.charAt(0)}</span>
                    </div>
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm font-semibold leading-6 text-gray-900">{ticket.title}</p>
                      <p className="mt-1 truncate text-xs leading-5 text-gray-500">{`${ticket.description.substring(0, 80)} ${ticket.description.length > 80 ? '...' : ''}`}</p>
                    </div>
                  </div>
                  <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                    <p className="text-sm leading-6 text-gray-900" title={ticket.status}>{ticket.status === 'closed' ? <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-red-100 text-red-800 rounded-full dark:bg-red-500/10 dark:text-red-500">
                      <GoCheckCircle />
                      {ticket.status}
                    </span> : <span className="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                      <BiMessageSquareDots />
                      Open
                    </span>}</p>
                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      {dateToLocalTimeDateYear(ticket?.created_at)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default isAuth(ProfileHelpPage);