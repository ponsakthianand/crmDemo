"use client"

import { use, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { PlusCircle, Trash2, CalendarIcon, CheckCircle, AlertCircle } from "lucide-react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, isAfter, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"
import { addDays, isBefore, startOfDay } from "date-fns"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { fetchMutualFundsSpecificDataAPI } from "@/app/store/reducers/mfSpecificCustomer"
import { useAppDispatch, useAppSelector } from "@/app/store/hooks"
import { ToDatePicker } from "@/components/ToDatePicker"
import { fetchFundTypesAPI } from "@/app/store/reducers/fundManagement"
import { CustomersData } from "@/app/store/reducers/allCutomers"
import { SearchSelectDropdown } from "@/components/search-select-dropdown"

export default function NewMutualFundDialog({ customerId, token, customers, onSuccess }: { customerId: string; token: string, customers?: CustomersData[], onSuccess?: () => void }) {
  const dispatch = useAppDispatch()
  const fundTypes = useAppSelector((state) => state.fundManagement.fundTypes)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [requests, setRequests] = useState<any[]>([])
  const [expanded, setExpanded] = useState<number | null>(null)
  const [description, setDescription] = useState("")
  const [customer, setCustomer] = useState(customerId)

  useEffect(() => {
    token?.length && dispatch(fetchFundTypesAPI(token))
  }, [token])

  const handleAddRequest = () => {
    setRequests((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: `Request ${prev.length + 1}`,
        fundType: "",
        fundName: "",
        transactionType: "",
        frequency: "",
        installmentDate: "",
        fromDate: null,
        toDate: null,
        amount: "",
        toScheme: "",
      },
    ])
    setExpanded(requests.length)
  }

  // const handleChange = (index: number, field: string, value: any) => {
  //   setRequests((prev) =>
  //     prev.map((req, i) =>
  //       i === index
  //         ? {
  //           ...req,
  //           [field]: value,
  //           ...(field === "fromDate" && req.toDate && isSameDay(value, req.toDate) ? { toDate: null } : {}),
  //         }
  //         : req,
  //     ),
  //   )
  // }

  const handleChange = (index: number, field: string, value: any) => {
    setRequests((prev) =>
      prev.map((req, i) => {
        if (i !== index) return req; // Return unchanged requests

        // Update the specific field
        const updatedRequest = { ...req, [field]: value, ...(field === "fromDate" && req.toDate && isSameDay(value, req.toDate) ? { toDate: null } : {}) };

        // Generate the title dynamically based on fundType and fundName
        const fundType = fundTypes.find((a) => a._id === updatedRequest.fundType);
        const fundName = fundType?.fundNames.find((a) => a._id === updatedRequest.fundName);

        updatedRequest.title = fundType && fundName ? `${fundType.name}: ${fundName.name}` : `Request ${index + 1}`;

        return updatedRequest;
      })
    );
  };


  const handleRemoveRequest = (index: number) => {
    setRequests((prev) => prev.filter((_, i) => i !== index))
  }

  const isFormValid = (form: any) => {
    if (!form.title || !form.fundType || !form.transactionType || !form.amount) {
      return false
    }
    if ((form.transactionType === "STP" || form.transactionType === "Switch") && !form.toScheme) {
      return false
    }
    if (
      form.transactionType !== "Redemption" &&
      form.transactionType !== "Lumpsum Purchase" &&
      form.transactionType !== "Switch"
    ) {
      if (!form.frequency) {
        return false
      }
      if (form.frequency !== "OneTime") {
        return !!(
          form.installmentDate &&
          form.fromDate instanceof Date &&
          form.toDate instanceof Date &&
          isAfter(form.toDate, form.fromDate)
        )
      }
    }
    return true
  }

  const handleSubmit = async () => {
    if (requests.length === 0) {
      toast({ title: "Error", description: "Please add at least one request." })
      return
    }

    if (!customer) {
      toast({ title: "Error", description: "Please select customer." })
      return
    }

    const emptyTitles = requests.filter((req) => !req.title).length
    if (emptyTitles > 0) {
      toast({
        title: "Error",
        description: `Please provide titles for all requests. ${emptyTitles} ${emptyTitles === 1 ? "request is" : "requests are"} missing a title.`,
      })
      return
    }

    if (!requests.every(isFormValid)) {
      toast({ title: "Error", description: "Please fill all required fields before submitting." })
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/customers/${customer}/mf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${token}`,
        },
        body: JSON.stringify({ requests, description }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit request")
      }
      if (customers?.length && typeof onSuccess === "function") {
        onSuccess();
      }
      toast({ title: "Success", description: "Mutual Fund requests submitted." })
      setRequests([])
      setDescription("")
      setDialogOpen(false)
      !customers?.length && token?.length && dispatch(fetchMutualFundsSpecificDataAPI(token, customer))
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "An error occurred" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button type="button">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Mutual Fund
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Mutual Fund Requests</DialogTitle>
          <DialogDescription>Fill in the details for each request.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          {customers?.length ? <div className="space-y-2 w-full flex flex-col bg-slate-100 px-2 rounded-sm py-3">
            <Label>Customer</Label>
            <SearchSelectDropdown
              items={customers}
              placeholder="Select user"
              emptyText="No user found"
              displayField="name"
              searchFields={["name", "email"]}
              avatarField="name"
              onChange={(user: CustomersData | null) => setCustomer(user?._id ? user?._id : '')}
            /></div> : <></>}
          {requests.length > 0 ? (
            <Accordion
              type="single"
              collapsible
              className={cn("w-full", requests.length > 5 && "max-h-[400px] overflow-y-auto pr-4")}
            >
              {requests.map((request, index) => (
                <AccordionItem key={request.id} value={`request-${index}`}>
                  <AccordionTrigger onClick={() => setExpanded(expanded === index ? null : index)}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2">
                        {isFormValid(request) ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                        )}
                        <span className="font-medium">{request.title}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className="cursor-pointer mr-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveRequest(index)
                          }}
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                          <span className="sr-only">Remove Request</span>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 p-4 border rounded-md">
                      <div className="space-y-2">
                        <Label htmlFor={`title-${index}`}>Fund Type</Label>
                        <Select
                          value={request.fundType}
                          onValueChange={(value) => handleChange(index, "fundType", value)}
                        >
                          <SelectTrigger id={`fundType-${index}`}>
                            <SelectValue placeholder="Select Fund Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {fundTypes?.map((type: any) => <SelectItem value={type._id}>{type.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`fundName-${index}`}>Fund Name</Label>
                          <Select
                            value={request.fundName}
                            onValueChange={(value) => handleChange(index, "fundName", value)}
                          >
                            <SelectTrigger id={`fundName-${index}`}>
                              <SelectValue placeholder="Select Scheme Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {request.fundType &&
                                fundTypes
                                  .find((fundType) => fundType._id === request.fundType) // Find the matching fundType
                                  ?.fundNames?.map((name) => (
                                    <SelectItem key={name._id} value={name._id}>
                                      {name.name}
                                    </SelectItem>
                                  ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`transactionType-${index}`}>Transaction Type</Label>
                          <Select
                            value={request.transactionType}
                            onValueChange={(value) => handleChange(index, "transactionType", value)}
                          >
                            <SelectTrigger id={`transactionType-${index}`}>
                              <SelectValue placeholder="Select Transaction Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Lumpsum Purchase">Lumpsum Purchase</SelectItem>
                              <SelectItem value="SIP">SIP</SelectItem>
                              <SelectItem value="STP">STP</SelectItem>
                              <SelectItem value="Switch">Switch</SelectItem>
                              <SelectItem value="Redemption">Redemption</SelectItem>
                              <SelectItem value="SWP">SWP</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {(request.transactionType === "STP" || request.transactionType === "Switch") && (
                        <div className="space-y-2">
                          <Label htmlFor={`toScheme-${index}`}>To Scheme</Label>
                          <Input
                            id={`toScheme-${index}`}
                            value={request.toScheme || ""}
                            onChange={(e) => handleChange(index, "toScheme", e.target.value)}
                            placeholder="Enter To Scheme"
                          />
                        </div>
                      )}

                      {request.transactionType !== "Switch" &&
                        request.transactionType !== "Redemption" &&
                        request.transactionType !== "Lumpsum Purchase" && (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`frequency-${index}`}>Frequency</Label>
                                <Select
                                  value={request.frequency}
                                  onValueChange={(value) => handleChange(index, "frequency", value)}
                                >
                                  <SelectTrigger id={`frequency-${index}`}>
                                    <SelectValue placeholder="Select Frequency" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="OneTime">One Time</SelectItem>
                                    <SelectItem value="Daily">Daily</SelectItem>
                                    <SelectItem value="Weekly">Weekly</SelectItem>
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                                    <SelectItem value="HalfYearly">Half Yearly</SelectItem>
                                    <SelectItem value="Yearly">Yearly</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`amount-${index}`}>Amount</Label>
                                <Input
                                  id={`amount-${index}`}
                                  type="number"
                                  value={request.amount}
                                  onChange={(e) => handleChange(index, "amount", e.target.value)}
                                  placeholder="Enter amount"
                                />
                              </div>
                            </div>

                            {request.frequency !== "OneTime" && (
                              <>
                                <div className="space-y-2">
                                  <Label htmlFor={`installmentDate-${index}`}>Installment Date</Label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className={cn(
                                          "w-full justify-start text-left font-normal",
                                          !request.installmentDate && "text-muted-foreground",
                                        )}
                                      >
                                        {request.installmentDate
                                          ? `Day ${request.installmentDate}`
                                          : "Select Installment Date"}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <div className="grid grid-cols-7 gap-2 p-2">
                                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                          <Button
                                            key={day}
                                            size="sm"
                                            variant={request.installmentDate === day.toString() ? "default" : "outline"}
                                            onClick={() => handleChange(index, "installmentDate", day.toString())}
                                          >
                                            {day}
                                          </Button>
                                        ))}
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`fromDate-${index}`}>From Date</Label>
                                    <DatePicker
                                      id={`fromDate-${index}`}
                                      label="From Date"
                                      date={request.fromDate}
                                      onSelect={(date) => handleChange(index, "fromDate", date)}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`toDate-${index}`}>To Date</Label>
                                    <DatePicker
                                      id={`toDate-${index}`}
                                      label="To Date"
                                      date={request.toDate}
                                      onSelect={(date) => handleChange(index, "toDate", date)}
                                      minDate={request.fromDate ? addDays(request.fromDate, 1) : undefined}
                                      showYearPicker={true}
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                          </>
                        )}

                      {(request.transactionType === "Switch" ||
                        request.transactionType === "Redemption" ||
                        request.transactionType === "Lumpsum Purchase") && (
                          <div className="space-y-2">
                            <Label htmlFor={`amount-${index}`}>Amount</Label>
                            <Input
                              id={`amount-${index}`}
                              type="number"
                              value={request.amount}
                              onChange={(e) => handleChange(index, "amount", e.target.value)}
                              placeholder="Enter amount"
                            />
                          </div>
                        )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-center text-sm text-muted-foreground">No requests added yet.</p>
          )}
        </ScrollArea>

        {requests.length > 0 && (
          <div className="space-y-2 mt-4">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a note for all requests"
            />
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <Button type="button" onClick={handleAddRequest}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add More
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading || requests.length === 0 || !requests.every(isFormValid)}
          >
            {loading ? "Submitting..." : "Create Requests"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DatePicker({
  id,
  label,
  date,
  onSelect,
  minDate,
  showYearPicker = false,
}: {
  id: string
  label: string
  date: Date | null
  onSelect: (date: Date | null) => void
  minDate?: Date | null
  showYearPicker?: boolean
}) {
  const today = startOfDay(new Date())
  const tomorrow = addDays(today, 1)

  return (
    <>
      <ToDatePicker onSelect={(date) => onSelect(date as Date)} dateValue={date as Date} minDate={minDate as Date} />
    </>
  )
}

