"use client"
import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Textarea } from "@/registry/new-york/ui/textarea"
import { Label } from "@/registry/new-york/ui/label"

interface Request {
  _id: string;
  customer_id: string;
  customer_name: string;
  created_by_id: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;
  status: string;
  process_status: string;
  requests: MFRequests[];
  description: string;
  approved_at?: string;
  approved_by?: string;
  approved_by_id?: string;
  approved_through?: string;
}

export interface MFRequests {
  id?: string;
  title: string;
  fundType: string;
  fundName: string;
  transactionType: string;
  toScheme?: string;
  frequency?: string;
  installmentDate?: string;
  fromDate?: string;
  toDate?: string;
  amount: string;
}

interface DecodedToken {
  mfId: string
  exp: number
  iat: number
}

function decodeToken(token: string): DecodedToken | null {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error("Failed to decode token:", error)
    return null
  }
}

export default function ApproveRequestClient({ token }) {
  const [request, setRequest] = useState<Request | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [approving, setApproving] = useState(false)
  const [approved, setApproved] = useState(false)
  const [reconsidering, setReconsidering] = useState(false)
  const [reconsiderComment, setReconsiderComment] = useState("")
  const [tokenExpired, setTokenExpired] = useState(false)

  useEffect(() => {
    if (!token) {
      setError("No token provided")
      setLoading(false)
      return
    }

    fetch(`/api/mutual-funds/approve/${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          setRequest(data.request)
          if (data.request.status === "Approved") {
            setApproved(true)
          }
        }
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load request details.")
        setLoading(false)
      })
  }, [token])

  const handleApprove = useCallback(() => {
    setApproving(true)
    fetch(`/api/mutual-funds/approve/${token}`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          setApproved(true)
          setRequest((prevRequest) => (prevRequest ? { ...prevRequest, status: "Approved" } : null))
        }
      })
      .catch(() => setError("Failed to approve request."))
      .finally(() => setApproving(false))
  }, [token])

  const handleReconsider = useCallback(() => {
    setReconsidering(true)
  }, [])

  const handleCancelReconsider = useCallback(() => {
    setReconsidering(false)
    setReconsiderComment("")
  }, [])

  const handleSubmitReconsider = useCallback(() => {
    if (!reconsiderComment.trim()) return

    fetch(`/api/mutual-funds/reconsider/${token}`, {
      method: "POST",
      body: JSON.stringify({ reconsider_comment: reconsiderComment }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          setReconsidering(false)
          setRequest((prevRequest) => (prevRequest ? { ...prevRequest, status: "Reconsidered" } : null))
        }
      })
      .catch(() => setError("Failed to reconsider request."))
  }, [token, reconsiderComment])

  if (loading) return <LoadingSkeleton />
  if (tokenExpired) return <TokenExpiredMessage />
  if (error) return <ErrorMessage message={error} />
  if (!request) return <ErrorMessage message="Request not found." />
  if (approved) return <AlreadyApprovedMessage request={request} />

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Approve Mutual Fund Request</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Customer Name</p>
            <p className="text-lg font-semibold">{request.customer_name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Created By</p>
            <p className="text-lg font-semibold">{request.created_by_name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Created At</p>
            <p className="text-lg font-semibold">{new Date(request.created_at).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <p className="text-lg font-semibold">{request.status}</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Description</p>
          <p className="text-lg">{request.description || "No description provided"}</p>
        </div>
        <div>
          <p className="text-xl font-bold mb-2">Mutual Fund Requests</p>
          <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
            {request.requests.map((mfRequest, index) => (
              <AccordionItem key={mfRequest.id} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  <div className="flex justify-between w-full">
                    <span>{mfRequest.title}</span>
                    <span className="font-semibold">₹{mfRequest.amount}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-2 p-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Transaction Type</p>
                      <p>{mfRequest.transactionType}</p>
                    </div>

                    {mfRequest?.toScheme && <div>
                      <p className="text-sm font-medium text-gray-500">To Scheme</p>
                      <p>{mfRequest.toScheme}</p>
                    </div>}

                    {mfRequest.frequency && <div>
                      <p className="text-sm font-medium text-gray-500">Frequency</p>
                      <p>{mfRequest.frequency}</p>
                    </div>}

                    <div>
                      <p className="text-sm font-medium text-gray-500">Amount</p>
                      <p>₹{mfRequest.amount}</p>
                    </div>

                    {mfRequest.installmentDate && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">SIP Due Date</p>
                        <p>{mfRequest.installmentDate}</p>
                      </div>
                    )}
                    {mfRequest.fromDate && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">From Date</p>
                        <p>{new Date(mfRequest.fromDate).toLocaleDateString()}</p>
                      </div>
                    )}
                    {mfRequest.toDate && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">To Date</p>
                        <p>{new Date(mfRequest.toDate).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col w-full space-y-4">
        {!reconsidering ? (
          <>
            {request.status !== 'Reconsider' ? <div className="flex gap-2 w-full">
              <Button onClick={handleReconsider} variant="outline" className="w-full">
                Reconsider
              </Button>
              <Button onClick={handleApprove} className="w-full" disabled={approving}>
                {approving ? "Approving..." : "Approve Request"}
              </Button>
            </div> : <div className="bg-yellow-100 px-3 py-2 text-sm">This request is under reconsideration. Please wait for the admin to generate a new approval or contact the admin for updates.</div>}
          </>

        ) : (
          <div className="w-full">
            <Label>Reason for reconsideration</Label>
            <Textarea
              value={reconsiderComment}
              onChange={(e) => setReconsiderComment(e.target.value)}
              placeholder="Enter reason for reconsideration..."
              className="w-full"
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" onClick={handleCancelReconsider}>
                Cancel
              </Button>
              <Button onClick={handleSubmitReconsider} disabled={!reconsiderComment.trim()}>
                Submit
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

function LoadingSkeleton() {
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <Skeleton className="h-8 w-3/4 mx-auto" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-6 w-full" />
            </div>
          ))}
        </div>
        <Skeleton className="h-20 w-full" />
        <div>
          <Skeleton className="h-6 w-1/4 mb-4" />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="mb-4">
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-40 w-full" />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <Card className="max-w-3xl mx-auto">
      <CardContent className="flex flex-col items-center justify-center py-6">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-lg font-semibold text-center text-red-500">{message}</p>
      </CardContent>
    </Card>
  )
}

function AlreadyApprovedMessage({ request }: { request: Request }) {
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Request Already Approved</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        </div>
        <p className="text-lg text-center mb-4">This mutual fund request has already been approved.</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Customer Name</p>
            <p className="text-lg font-semibold">{request.customer_name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Created By</p>
            <p className="text-lg font-semibold">{request.created_by_name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Created At</p>
            <p className="text-lg font-semibold">{new Date(request.created_at).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <p className="text-lg font-semibold">{request.status}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/">Return to Dashboard</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function TokenExpiredMessage() {
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Token Expired</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-6">
        <Clock className="w-16 h-16 text-yellow-500 mb-4" />
        <p className="text-lg text-center mb-4">
          The approval token has expired. Please request a new approval link from the admin.
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/">Return to Dashboard</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

