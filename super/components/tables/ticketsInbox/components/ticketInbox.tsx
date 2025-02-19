"use client"

import * as React from "react"
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CircleCheckBig,
  CircleHelp,
  CircleX,
  HandCoins,
  Handshake,
  LucideIcon,
  MessageCircle,
  ReceiptIndianRupee,
  Search,
  Timer,
  Umbrella
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/registry/new-york/ui/input"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/new-york/ui/resizable"
import { Separator } from "@/registry/new-york/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york/ui/tabs"
import { TooltipProvider } from "@/registry/new-york/ui/tooltip"
import { MailDisplay } from "./ticket-display"
import { MailList } from "./ticket-list"
import { Nav } from "./nav"
import { type Mail } from "../data"
import { AccountSwitcher } from "./account-switcher"
import { useMail } from "../use-mail"
import Select from "react-tailwindcss-select";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks"
import { useSession } from "next-auth/react"
import { fetchCustomersDataAPI } from "@/app/store/reducers/allCutomers"
import { fetchTicketsDataAPI } from "@/app/store/reducers/allTicketChat"
import { fetchCurrentTicketDataAPI } from "@/app/store/reducers/currentTicket"
import { fetchCurrentTicketChatDataAPI } from "@/app/store/reducers/currentTicketChat"


interface InboxProps {
  // accounts: {
  //   value: string
  //   label: string
  //   email: string
  //   icon: React.ReactNode
  //   selected: boolean
  // }[]
  customerId: string
  ticketId: string | null
  defaultLayout: number[] | undefined
  defaultCollapsed?: boolean
  navCollapsedSize: number
}

export interface TicketsNavProps {
  title: string
  label?: string
  icon: LucideIcon
  variant: "default" | "ghost"
  value: string
}

export const ticketCategory: TicketsNavProps[] = [
  {
    title: "All tickets",
    label: "",
    icon: MessageCircle,
    variant: "default",
    value: "alltickets"
  },
  {
    title: "Loan",
    label: "",
    icon: Handshake,
    variant: "ghost",
    value: 'loan'
  },
  {
    title: "Mutual Fund",
    label: "",
    icon: HandCoins,
    variant: "ghost",
    value: 'mutualfund'
  },
  {
    title: "Insurance",
    label: "",
    icon: Umbrella,
    variant: "ghost",
    value: 'insurance'
  },
  {
    title: "Income Tax",
    label: "",
    icon: ReceiptIndianRupee,
    variant: "ghost",
    value: 'incometax'
  },
]
export const ticketStatus: TicketsNavProps[] = [
  {
    title: "Open",
    label: "",
    icon: CircleHelp,
    variant: "ghost",
    value: "open",
  },
  {
    title: "Closed",
    label: "",
    icon: CircleCheckBig,
    variant: "ghost",
    value: "closed",
  },
  {
    title: "In Progress",
    label: "",
    icon: Timer,
    variant: "ghost",
    value: "inprogress",
  },
  {
    title: "Canceled",
    label: "",
    icon: CircleX,
    variant: "ghost",
    value: "canceled",
  }
]

export const ticketPriority: TicketsNavProps[] = [
  {
    title: "Low",
    label: "",
    icon: ArrowDown,
    variant: "ghost",
    value: "low",
  },
  {
    title: "Medium",
    label: "",
    icon: ArrowRight,
    variant: "ghost",
    value: "medium",
  },
  {
    title: "High",
    label: "",
    icon: ArrowUp,
    variant: "ghost",
    value: "high",
  }
]

export function Inbox({
  customerId,
  ticketId,
  defaultLayout = [20, 32, 48],
  defaultCollapsed = false,
  navCollapsedSize,
}: InboxProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
  const [account, setAccount] = React.useState<any>(null);
  const [category, setCategory] = React.useState<any>(ticketCategory);
  const [tiStatus, setTiStatus] = React.useState<any>(ticketStatus);
  const [priority, setPriority] = React.useState<any>(ticketPriority);
  const [selectedTicketId, setSelectedTicketId] = React.useState(ticketId);
  const dispatch = useAppDispatch()
  const { data: session, status } = useSession()
  const accessToken = useAppSelector((state) => state.authToken);
  const customersData = useAppSelector((state) => state.allCustomersData);
  const ticketsData = useAppSelector((state) => state.ticketChatData);
  const currentTicketsData = useAppSelector((state) => state.currentTicket);
  const currentTicketsChatData = useAppSelector((state) => state.currentTicketChat);
  const ticketsDataFilter = account ? ticketsData?.data?.filter(ticket => ticket?.customer === account?.id) : ticketsData?.data;

  const customersList = customersData?.data?.map(item => {
    return {
      value: item._id,
      label: item.name,
      email: item.email,
      id: item._id,
      selected: item._id === customerId,
      icon: <div className="relative inline-flex items-center justify-center w-5 h-5 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
        <span className="font-medium text-gray-600 dark:text-gray-300">{item?.name?.charAt(0)}</span>
      </div>
    }
  });
  const customersDataList = customersList?.length ? customersList : []

  const ticketsList = ticketsDataFilter?.map(item => {
    return {
      id: item?._id,
      name: item?.customer_name,
      customer_id: item?.customer,
      subject: item?.title,
      text: item?.description,
      date: item?.created_at,
      category: item?.category,
      priority: item?.priority,
      status: item?.status
    }
  })

  React.useEffect(() => {
    if (accessToken?.access_token?.length) {
      dispatch(fetchCustomersDataAPI(accessToken?.access_token));
      dispatch(fetchTicketsDataAPI(accessToken?.access_token));
    }

  }, [session, accessToken, ticketId])

  React.useEffect(() => {
    if (accessToken?.access_token?.length) {
      selectedTicketId?.length && dispatch(fetchCurrentTicketDataAPI(selectedTicketId, accessToken?.access_token));
      selectedTicketId?.length && dispatch(fetchCurrentTicketChatDataAPI(selectedTicketId, accessToken?.access_token));
    }

  }, [session, accessToken, selectedTicketId])


  const handleChange = (value: any) => {
    console.log("value:", value);
    setAccount(value);
  };

  const getSelectedTicketId = (value: any) => {
    setSelectedTicketId(value);
  };


  const [mail] = useMail()

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
            sizes
          )}`
        }}
        className="h-full max-h-[calc(100vh-80px)] items-stretch w-px"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={() => {
            setIsCollapsed(true)
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true
            )}`
          }}
          onResize={() => {
            setIsCollapsed(false)
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false
            )}`
          }}
          className={cn(
            isCollapsed &&
            "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <div
            className={cn(
              "flex h-[52px] items-center justify-center",
              isCollapsed ? "h-[52px]" : "px-2"
            )}
          >
            <Select
              value={account}
              isSearchable={true}
              isClearable
              placeholder="Select user..."
              onChange={handleChange}
              options={customersDataList}
              loading={customersData.loading}
              primaryColor={"indigo"}
            />
            {/* <AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} /> */}
          </div>
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={category}
          />
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={tiStatus}
          />
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={priority}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Inbox</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  All mail
                </TabsTrigger>
                {/* <TabsTrigger
                  value="unread"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Unread
                </TabsTrigger> */}
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0">
              {ticketsList?.length ? <MailList items={ticketsList} currentTicketId={ticketId as string} selectedTicket={(value) => getSelectedTicketId(value)} /> : (
                <div className="p-8 text-center text-muted-foreground">
                  No tickets
                </div>
              )}
            </TabsContent>
            {/* <TabsContent value="unread" className="m-0">
              <MailList items={ticketsList.filter((item) => !item.read)} />
            </TabsContent> */}
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
          <MailDisplay
            ticketData={currentTicketsData?.data}
            ticketChatData={currentTicketsChatData?.data}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
