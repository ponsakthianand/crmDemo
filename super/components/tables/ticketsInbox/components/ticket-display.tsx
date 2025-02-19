'use client'
import addDays from "date-fns/addDays"
import addHours from "date-fns/addHours"
import format from "date-fns/format"
import nextSaturday from "date-fns/nextSaturday"
import {
  Archive,
  ArchiveX,
  Clock,
  Forward,
  MoreVertical,
  Reply,
  ReplyAll,
  Trash2,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york/ui/avatar"
import { Button } from "@/registry/new-york/ui/button"
import { Calendar } from "@/registry/new-york/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu"
import { Label } from "@/registry/new-york/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover"
import { Separator } from "@/registry/new-york/ui/separator"
import { Switch } from "@/registry/new-york/ui/switch"
import { Textarea } from "@/registry/new-york/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york/ui/tooltip"
import { Mail } from "../data"
import { GrChat } from "react-icons/gr"
import { BsReverseListColumnsReverse } from "react-icons/bs"
import LastSeen from "@/components/elements/lastSeen"
import OpenCloseChat from "@/app/dashboard/tickets/old/resolveOrOpenChat"
import Link from "next/link"
import { FormEvent, useEffect, useRef, useState } from "react"
import { baseUrl } from "@/global"
import { useAppDispatch, useAppSelector } from "@/app/store/hooks"
import { fetchCurrentTicketChatDataAPI } from "@/app/store/reducers/currentTicketChat"
import { RiLoader5Fill } from "react-icons/ri"
import { ScrollArea } from "@/registry/new-york/ui/scroll-area"
import { Input } from "@/registry/new-york/ui/input"
import { ticketData } from "@/app/store/reducers/currentTicket"

interface MailDisplayProps {
  ticketData: ticketData;
  ticketChatData: any;
}

export function MailDisplay({ ticketData, ticketChatData }: MailDisplayProps) {
  const today = new Date()
  const messagesEndRef = useRef<null | HTMLLIElement>(null);
  const [loader, setLoader] = useState(false);
  const [content, setContent] = useState('');
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.authToken);

  const scrollToBottom = () => {
    // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [ticketChatData]);

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

    const response = await fetch(`${baseUrl}/tickets/${ticketData?._id}/messages`, {
      method: 'POST',
      headers: {
        token: `Bearer ${accessToken?.access_token}`
      },
      body: data,
    })

    if (response.ok) {
      setContent('')
      accessToken?.access_token?.length && dispatch(fetchCurrentTicketChatDataAPI(ticketData?._id, accessToken?.access_token));
      setLoader(false)
    } else {
      accessToken?.access_token?.length && dispatch(fetchCurrentTicketChatDataAPI(ticketData?._id, accessToken?.access_token));
      setLoader(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          <div className="flex items-start">
            <div className="flex items-start gap-4 text-sm">
              <Avatar>
                <AvatarImage alt={ticketData?.customer_name} />
                <AvatarFallback>
                  {ticketData?.customer_name
                    .split(" ")
                    .map((chunk) => chunk[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">{ticketData?.customer_name}</div>
                {ticketData?.created_at && (
                  <div className="ml-auto text-xs text-muted-foreground">
                    {format(new Date(ticketData?.created_at), "PPpp")}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* <Separator orientation="vertical" className="mx-1 h-6" /> */}
          {/* <Tooltip>
            <Popover>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={!mail}>
                    <Clock className="h-4 w-4" />
                    <span className="sr-only">Snooze</span>
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
              <PopoverContent className="flex w-[535px] p-0">
                <div className="flex flex-col gap-2 border-r px-2 py-4">
                  <div className="px-4 text-sm font-medium">Snooze until</div>
                  <div className="grid min-w-[250px] gap-1">
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                    >
                      Later today{" "}
                      <span className="ml-auto text-muted-foreground">
                        {format(addHours(today, 4), "E, h:m b")}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                    >
                      Tomorrow
                      <span className="ml-auto text-muted-foreground">
                        {format(addDays(today, 1), "E, h:m b")}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                    >
                      This weekend
                      <span className="ml-auto text-muted-foreground">
                        {format(nextSaturday(today), "E, h:m b")}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                    >
                      Next week
                      <span className="ml-auto text-muted-foreground">
                        {format(addDays(today, 7), "E, h:m b")}
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="p-2">
                  <Calendar />
                </div>
              </PopoverContent>
            </Popover>
            <TooltipContent>Snooze</TooltipContent>
          </Tooltip> */}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <Reply className="h-4 w-4" />
                <span className="sr-only">Reply</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <ReplyAll className="h-4 w-4" />
                <span className="sr-only">Reply all</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply all</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <Forward className="h-4 w-4" />
                <span className="sr-only">Forward</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Forward</TooltipContent>
          </Tooltip> */}
        </div>
        {/* <Separator orientation="vertical" className="mx-2 h-6" /> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {ticketData?.status !== 'closed' && <OpenCloseChat ticketId={ticketData?._id} />}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Mark as unread</DropdownMenuItem>
            <DropdownMenuItem>Star thread</DropdownMenuItem>
            <DropdownMenuItem>Add label</DropdownMenuItem>
            <DropdownMenuItem>Mute thread</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      {/* <div>
        <div className="mb-4 border-b border-gray-200 dark:border-gray-700 bg-white rounded-md">
          <div className='p-4 flex items-center justify-between rounded-t-lg font-semibold'>

            <div className=' inline-flex items-center justify-center'>
              <div className="h-4 me-2">
                <GrChat />
              </div>
              {ticketChatData?.loading ? '...' : ticketData?.title}
            </div>

            <div className="flex gap-5">
              <Link className="text-xs font-normal flex items-center hover:text-blue-600" href='/profile/help'>
                <BsReverseListColumnsReverse className="mr-2" /> Back to all chats
              </Link>

              {ticketData?.status !== 'closed' && <OpenCloseChat ticketId={ticketData?._id} />}

            </div>

          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 p-5 border-t-4 border-t-[#008756]">
          
        </div>
      </div> */}
      {ticketChatData ? (
        <div className="flex flex-1 flex-col">
          <Separator />
          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
              <ul className="space-y-5">
                {
                  !ticketChatData?.loading ? ticketChatData?.map((message: any, index: any) => {
                    return message?.sender_id !== ticketData?._id ? <li key={index} className="max-w-lg flex gap-x-2 sm:gap-x-4 me-11" ref={messagesEndRef}>
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
                        {/* <span className="text-sm font-medium text-white leading-none" title="You">{currentUser?.data?.name?.charAt(0)}</span> */}
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
                        {/* <span className="text-sm font-medium text-white leading-none" title="You">{currentUser?.data?.name?.charAt(0)}</span> */}
                      </span>
                    </li>
                }
              </ul>
            </div>
          </ScrollArea>
          <Separator className="mt-auto" />
          <div className="p-2">
            <div>
              {
                ticketData?.status !== 'closed' ? <div className="relative rounded-md shadow-sm">
                  <div className={`sm:mx-auto sm:w-full items-center ${loader ? 'opacity-20 pointer-events-none	' : ''}`}>
                    <form onSubmit={(event) => handleSubmit(event)}>
                      <div className="grid gap-4">
                        <div className="flex items-center">
                          <input
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            name="content"
                            type="text"
                            placeholder="Type here..."
                            className="p-4 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          />
                          <Button
                            size="lg"
                            className="ml-2"
                            type="submit"
                          >
                            Send
                          </Button>
                        </div>
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
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No message selected
        </div>
      )}
    </div>
  )
}
