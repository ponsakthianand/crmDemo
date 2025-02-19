"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { ChevronDown, ChevronRight, Check, Info, Trash2, WandSparkles, CalendarDays } from "lucide-react"
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { useCallback, useEffect, useState } from 'react';
import { fetchMutualFundsSpecificDataAPI } from '@/app/store/reducers/mfSpecificCustomer';
import { Separator } from '@/registry/new-york/ui/separator';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { EditMutualFundDialog } from "./edit-mf"
import { useSession } from "next-auth/react"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/registry/new-york/ui/sheet"
import { MutualFundsDocument } from "@/types/mutual-funds"
import { ScrollArea } from "@/registry/new-york/ui/scroll-area"
import { dateToLocalTimeDateYear } from "@/global"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/registry/new-york/ui/hover-card"
import Avatar from "@/components/avatar-initials"
import { fetchCustomersDataAPI } from "@/app/store/reducers/allCutomers"
import { FundStatusBadge } from "@/app/dashboard/mutual-funds/utils/mfUtils"
import TableLoader from "@/components/ui/table-loader"

interface FinancialTrackerTabProps {
  customerID: string;
}

export default function MutualFundsTab({ customerID }: FinancialTrackerTabProps) {
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.authToken);
  const currentUser = useAppSelector((state) => state.profileData);
  const mutualFunds = useAppSelector((state) => state.mutualFundsSpecificCustomer);
  const mfList = mutualFunds?.data;
  const [selectedFund, setSelectedFund] = useState<MutualFundsDocument>()
  const [magicLink, setMagicLink] = useState<string>('')
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState({ status: false, id: '' })

  const toggleRowExpansion = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  useEffect(() => {
    if (!accessToken?.access_token?.length) return
    dispatch(fetchMutualFundsSpecificDataAPI(accessToken?.access_token, customerID));
  }, [accessToken])

  const onDelete = async (id: string) => {
    const response = await fetch(`/api/customers/${customerID}/mf/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${accessToken?.access_token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    if (accessToken?.access_token) {
      dispatch(fetchMutualFundsSpecificDataAPI(accessToken.access_token, customerID));
    }
    return data;
  }

  const sendMagicLink = async (id: string) => {
    setIsSubmitting({ status: true, id: id })
    const response = await fetch(`/api/customers/${customerID}/mf/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${accessToken?.access_token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const url = `https://wa.me/${data.customer.phone}?text=${encodeURIComponent(data.link)}`;
    window.open(url, '_blank');
    setMagicLink(data.link);
    if (accessToken?.access_token) {
      dispatch(fetchMutualFundsSpecificDataAPI(accessToken.access_token, customerID));
    }
    setIsSubmitting({ status: false, id: id })
    return data;
  }


  const onApprove = async (id: string) => {
    const response = await fetch(`/api/customers/${customerID}/mf/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${accessToken?.access_token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    if (accessToken?.access_token) {
      dispatch(fetchMutualFundsSpecificDataAPI(accessToken.access_token, customerID));
    }
    return data;
  }

  const deleteCall = (id: string, status: string) => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant="destructive" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Mutual fund request?</DialogTitle>
            <DialogDescription>
              <div className='mb-2'>{status === 'Approved' ? 'Note: Customer approved this request. Probably it can be proceed to initiate mutual fund purchase or purchased already' : ''}</div>
              Do you really want to delete this request?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant={'outline'}>Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="button" onClick={() => onDelete(id)}>Delete</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  const approveCall = (id: string, status: string, mf: any) => {
    return (
      status !== 'Approved' ? <>
        <div className='hover:text-blue-500'>
          <EditMutualFundDialog customerId={customerID} token={accessToken?.access_token || ''} mfRequest={mf} />
        </div>
        <Separator orientation="vertical" />
        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" variant="default" size="sm">
              <Check className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Approve Mutual fund request?</DialogTitle>
              <DialogDescription>
                Typically, only the customer has the legal authority to approve this request. Are you certain you want to proceed with approving it?

                <div className='mt-2'>**Note:** Once approved, this request will be closed, and no further modifications will be possible. This action is irreversible.</div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant={'outline'}>Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="button" onClick={() => onApprove(id)}>Approve</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Separator orientation="vertical" /></> : <></>)
  }

  return (
    <div className="py-4">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100 hover:bg-gray-100">
            <TableHead>Created At</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!mutualFunds?.loading ? mfList?.length ? mfList.map((fund, index) => (
            <TableRow key={fund._id}>
              <TableCell>{format(new Date(fund.created_at), "PPP")}</TableCell>
              <TableCell>{fund.created_by_name}</TableCell>
              <TableCell>
                {fund.status === "Approved" ? (
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="link" className="!p-0">{FundStatusBadge(fund.status)}</Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-[300px]">
                      <div className="flex justify-start space-x-3">
                        <Avatar name={fund.approved_by || ''} userId={fund.approved_by_id || ''} />
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">{fund.approved_by || ''}</h4>
                          <p className="text-sm">
                            <>Approved through {fund.approved_through}</>
                          </p>
                          <div className="flex items-center pt-2">
                            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                            <span className="text-xs text-muted-foreground">
                              {dateToLocalTimeDateYear(fund.approved_at || '')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ) : fund.status === "Reconsider" ? (
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="link" className="!p-0">{FundStatusBadge(fund.status)}</Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-[300px]">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Reconsideration Comment</h4>
                        <p className="text-sm text-muted-foreground">
                          {fund.reconsider_comment || "No comment provided."}
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ) : (
                  FundStatusBadge(fund.status)
                )}
              </TableCell>
              <TableCell>
                ₹{fund.requests.reduce((sum, req) => sum + Number.parseFloat(req.amount), 0).toFixed(2)}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedFund(fund)}>
                        <Info className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Mutual Fund Details</SheetTitle>
                        <SheetDescription>Created on {format(new Date(fund.created_at), "PPP")}</SheetDescription>
                      </SheetHeader>
                      <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                        {selectedFund && (
                          <div className="space-y-4 mt-4">
                            {selectedFund.description && (
                              <div>
                                <h3 className="font-semibold mb-2">Description</h3>
                                <p>{selectedFund.description}</p>
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold mb-2">Requests</h3>
                              <ul className="space-y-4">
                                {selectedFund.requests.map((request, reqIndex) => (
                                  <li key={reqIndex} className="bg-muted p-4 rounded-md">
                                    <p>
                                      <strong>Title:</strong> {request.title}
                                    </p>
                                    <p>
                                      <strong>Transaction Type:</strong> {request.transactionType}
                                    </p>
                                    <p>
                                      <strong>Frequency:</strong> {request.frequency}
                                    </p>
                                    {request.installmentDate && (
                                      <p>
                                        <strong>Installment Date:</strong> {request.installmentDate}
                                      </p>
                                    )}
                                    {request.fromDate && (
                                      <p>
                                        <strong>From Date:</strong> {format(new Date(request.fromDate), "PPP")}
                                      </p>
                                    )}
                                    {request.toDate && (
                                      <p>
                                        <strong>To Date:</strong> {format(new Date(request.toDate), "PPP")}
                                      </p>
                                    )}
                                    <p>
                                      <strong>Amount:</strong> ₹{request.amount}
                                    </p>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </ScrollArea>
                      {/* <SheetFooter>
                            <SheetClose asChild>
                              <Button variant="outline">Close</Button>
                            </SheetClose>
                          </SheetFooter> */}
                    </SheetContent>
                  </Sheet>
                  {fund?.status !== 'Approved' ? (<Button type="button" variant="default" size="sm" onClick={() => sendMagicLink(fund._id)}>
                    <WandSparkles className="mr-2 h-4 w-4" /> Magic link
                  </Button>) : <></>}

                  {approveCall(fund._id, fund.status, fund)}
                  {deleteCall(fund._id, fund.status)}
                </div>
              </TableCell>
            </TableRow>
          )) : <TableRow className="text-center"><TableCell colSpan={5}>No mutual fund yet</TableCell></TableRow> : <TableLoader />}
        </TableBody>
      </Table>
    </div>
  )
}