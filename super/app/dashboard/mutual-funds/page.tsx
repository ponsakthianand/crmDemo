"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/app/store/hooks"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, Settings } from "lucide-react"
import NewMutualFundDialog from "../customers/[customerId]/mutual-funds/new-mf"
import { fetchMutualFundsDataAPI } from "@/app/store/reducers/allMutualFunds"
import MutualFundsTab from "./mutualFunds"
import { MutualFundsDocument } from "@/types/mutual-funds"
import { useRouter } from "next/navigation"
import { fetchCustomersDataAPI } from "@/app/store/reducers/allCutomers"

export default function MutualFundsListPage() {
  const router = useRouter();
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.authToken)
  const mutualFunds = useAppSelector((state) => state.mutualFunds)
  const customers = useAppSelector((state) => state.allCustomersData.data)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [filteredFunds, setFilteredFunds] = useState<MutualFundsDocument[]>()

  useEffect(() => {
    if (accessToken?.access_token) {
      dispatch(fetchMutualFundsDataAPI(accessToken.access_token))
      dispatch(fetchCustomersDataAPI(accessToken?.access_token));
    }
  }, [accessToken, dispatch])

  useEffect(() => {
    const filtered = mutualFunds?.data?.filter((fund: MutualFundsDocument) => {
      const matchesSearch =
        fund.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fund.created_by_name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || fund.status.toLowerCase() === statusFilter.toLowerCase()
      return matchesSearch && matchesStatus
    })
    setFilteredFunds(filtered || [])
  }, [mutualFunds, searchTerm, statusFilter])

  const handleRefresh = () => {
    if (accessToken?.access_token) {
      dispatch(fetchMutualFundsDataAPI(accessToken.access_token))
    }
  }

  const onSubmitSuccess = () => {
    if (accessToken?.access_token) {
      dispatch(fetchMutualFundsDataAPI(accessToken.access_token))
    }
  }

  return (
    <div className="h-full flex-1 flex-col px-8 md:flex">
      <div className="flex items-center justify-between space-y-2 mb-4">
        <div className="flex items-center justify-start space-x-2">

          <h2 className="text-2xl font-bold tracking-tight">Mutual Funds</h2>
          <div className="cursor-pointer hover:bg-slate-100 p-1 rounded-md" onClick={() => router.push('/dashboard/mutual-funds/settings/fund-management')}><Settings className="h-5 w-5" /></div>
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                placeholder="Search by customer or creator name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className='flex items-center justify-between space-x-2'>
          <Button onClick={handleRefresh} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <NewMutualFundDialog customerId={""} token={accessToken?.access_token || ""} customers={customers} onSuccess={() => onSubmitSuccess()} />
        </div>
      </div>

      <div>
        {/* <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer Name</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFunds ? filteredFunds?.map((fund: any) => (
              <TableRow key={fund._id}>
                <TableCell>{fund.customer_name}</TableCell>
                <TableCell>{fund.created_by_name}</TableCell>
                <TableCell>{format(new Date(fund.created_at), "PPP")}</TableCell>
                <TableCell><FundStatusBadge status={fund.status} /></TableCell>
                <TableCell>
                  ₹{fund.requests.reduce((sum: any, req: any) => sum + Number.parseFloat(req.amount), 0).toFixed(2)}
                </TableCell>
              </TableRow>
            )) : <>No data</>}
          </TableBody>
        </Table> */}
        <MutualFundsTab mutualFunds={filteredFunds || []} customers={customers} onSubmit={() => onSubmitSuccess()} loading={mutualFunds?.loading} />
      </div>

    </div>
  )
}

