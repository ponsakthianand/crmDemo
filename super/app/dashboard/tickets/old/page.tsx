'use client'

import { baseUrl } from "@/global";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { fetchCurrentTicketDataAPI } from "@/app/store/reducers/currentTicket";
import { fetchCurrentTicketChatDataAPI } from "@/app/store/reducers/currentTicketChat";
import { FormEvent, useEffect, useRef, useState } from "react";
import { GrChat } from "react-icons/gr";
import { RiLoader5Fill } from "react-icons/ri";
import { BsReverseListColumnsReverse } from "react-icons/bs";
import OpenCloseChat from "./resolveOrOpenChat";
import Link from "next/link";
import LastSeen from "@/components/elements/lastSeen";

export default function ChatView({ params }: any) {
  const { chat } = params;
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.authToken);
  const getCurrentTicket = useAppSelector((state) => state.currentTicket);
  const getCurrentChat = useAppSelector((state) => state.currentTicketChat);
  const currentUser = useAppSelector((state) => state.profileData);
  const getCurrentChatData = getCurrentChat?.data;
  const [loader, setLoader] = useState(false);
  const [content, setContent] = useState('');
  const messagesEndRef = useRef<null | HTMLLIElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [getCurrentChatData]);

  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchCurrentTicketDataAPI(chat, accessToken?.access_token));
  }, [accessToken])


  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchCurrentTicketChatDataAPI(chat, accessToken?.access_token));
  }, [accessToken])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoader(true)
    const formData = new FormData(event.currentTarget)
    const data = new FormData();
    // const files = []
    // this is for images
    // for (const file of acceptedFiles) {
    //   data.append('files[]', file, file.name);
    // }
    const content = formData.get('content')
    data.append('content', content as string);

    const response = await fetch(`${baseUrl}/tickets/${chat}/messages`, {
      method: 'POST',
      headers: {
        token: `Bearer ${accessToken?.access_token}`
      },
      body: data,
    })

    if (response.ok) {
      setContent('')
      accessToken?.access_token?.length && dispatch(fetchCurrentTicketChatDataAPI(chat, accessToken?.access_token));
      setLoader(false)
    } else {
      accessToken?.access_token?.length && dispatch(fetchCurrentTicketChatDataAPI(chat, accessToken?.access_token));
      setLoader(false)
    }
  }


  return <div>
    <div className="mb-4 border-b border-gray-200 dark:border-gray-700 bg-white rounded-md">
      <div className='p-4 flex items-center justify-between rounded-t-lg font-semibold'>

        <div className=' inline-flex items-center justify-center'>
          <div className="h-4 me-2">
            <GrChat />
          </div>
          {getCurrentChat?.loading ? '...' : getCurrentTicket?.data?.title}
        </div>

        <div className="flex gap-5">
          <Link className="text-xs font-normal flex items-center hover:text-blue-600" href='/profile/help'>
            <BsReverseListColumnsReverse className="mr-2" /> Back to all chats
          </Link>

          {getCurrentTicket?.data?.status !== 'closed' && <OpenCloseChat ticketId={chat} />}

        </div>

      </div>
    </div>
    <div className="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 p-5 border-t-4 border-t-[#008756]">
      <div className='mb-7 h-[450px] overflow-y-auto'>
        <ul className="space-y-5">
          {
            !getCurrentChat?.loading ? getCurrentChatData?.map((message, index) => {
              return message?.sender_id !== currentUser?.data?._id ? <li key={index} className="max-w-lg flex gap-x-2 sm:gap-x-4 me-11" ref={messagesEndRef}>
                <span className="flex-shrink-0 inline-flex items-center justify-center size-[38px] rounded-full bg-gray-400">
                  <span className="text-sm font-medium text-white leading-none" title={message?.receiver_name}>{message?.receiver_name?.charAt(0)}</span>
                </span>
                <div className="">
                  <span className="font-semibold text-xs inline-block">{message?.receiver_name}</span>
                  <div className="border border-gray-200 rounded-2xl p-2 px-4 rounded-tl-none bg-slate-200 dark:bg-neutral-900 dark:border-neutral-700">
                    <p className="text-sm text-gray-800 dark:text-white mt-0">
                      {message?.content}
                    </p>
                  </div>
                  <span className="font-normal text-slate-400 text-xs inline-block">
                    <LastSeen date={message?.created_at} />
                  </span>
                </div>
              </li> : <li className="flex ms-auto gap-x-2 sm:gap-x-4" key={index} ref={messagesEndRef}>
                <div className="grow text-end space-y-3">
                  <div className="pt-5">
                    <div className="flex justify-end">
                      <div className="inline-block bg-blue-600 rounded-2xl p-2 px-4 shadow-sm rounded-tr-none">
                        <p className="text-sm text-white">
                          {message?.content}
                        </p>
                      </div>
                    </div>
                    <span className="font-normal text-slate-400 text-xs inline-block">
                      <LastSeen date={message?.created_at} />
                    </span>
                  </div>
                </div>
                <span className="flex-shrink-0 inline-flex items-center justify-center size-[38px] rounded-full bg-blue-600">
                  <span className="text-sm font-medium text-white leading-none" title="You">{currentUser?.data?.name?.charAt(0)}</span>
                </span>
              </li>
            })
              : <li className="flex ms-auto gap-x-2 sm:gap-x-4">
                <div className="grow text-end space-y-3">
                  <div className="inline-flex flex-col justify-end">
                    <div className="inline-block bg-blue-600 rounded-2xl p-2 px-4 shadow-sm">
                      <p className="text-sm text-white">
                        ...
                      </p>
                    </div>
                  </div>
                </div>
                <span className="flex-shrink-0 inline-flex items-center justify-center size-[38px] rounded-full bg-gray-600">
                  <span className="text-sm font-medium text-white leading-none" title="You">{currentUser?.data?.name?.charAt(0)}</span>
                </span>
              </li>
          }
        </ul>
      </div>
      <div>
        {
          getCurrentTicket?.data?.status !== 'closed' ? <div className="relative mt-2 rounded-md shadow-sm">
            <div className={`sm:mx-auto sm:w-full items-center ${loader ? 'opacity-20 pointer-events-none	' : ''}`}>
              <form className="" action="#" method="POST" onSubmit={(event) => handleSubmit(event)}>
                <input
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  name="content"
                  type="text"
                  placeholder="Type here..."
                  className="block w-full rounded-md border-0 py-1.5 pl-3 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <button type="submit" disabled={!content?.length} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                    Send
                  </button>
                </div>
              </form>
            </div>
            {loader ? <div role="status" className='absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2'>
              <RiLoader5Fill className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" />
              <span className="sr-only">Loading...</span>
            </div> : <></>}
          </div> : <div className="relative mt-2 bg-slate-100 py-2 px-4 rounded-md text-center">This ticket is already resolved</div>
        }

      </div>
    </div>
  </div>

}