"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/app/store/hooks"
import { fetchFundTypesAPI, addFundTypeAPI, deleteFundTypeAPI } from "@/app/store/reducers/fundManagement"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import Link from "next/link"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

export default function FundManagementPage() {
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.authToken)
  const fundTypes = useAppSelector((state) => state.fundManagement.fundTypes)
  const [newFundType, setNewFundType] = useState("")
  const [editingFundType, setEditingFundType] = useState<{ id: string; name: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (accessToken?.access_token) {
      dispatch(fetchFundTypesAPI(accessToken.access_token))
    }
  }, [accessToken, dispatch])

  const handleAddFundType = async () => {
    if (!newFundType.trim()) {
      toast({ title: "Error", description: "Fund type name cannot be empty" })
      return
    }

    if (accessToken?.access_token) {
      try {
        await dispatch(addFundTypeAPI({ token: accessToken.access_token, name: newFundType })).unwrap()
        setNewFundType("")
        toast({ title: "Success", description: "Fund type added successfully" })
      } catch (error) {
        toast({ title: "Error", description: "Failed to add fund type" })
      }
    }
  }

  const handleEditFundType = async () => {
    if (!editingFundType || !editingFundType.name.trim()) {
      toast({ title: "Error", description: "Fund type name cannot be empty" })
      return
    }

    if (accessToken?.access_token) {
      try {
        await dispatch(
          addFundTypeAPI({ token: accessToken.access_token, name: editingFundType.name, id: editingFundType.id }),
        ).unwrap()
        setEditingFundType(null)
        toast({ title: "Success", description: "Fund type updated successfully" })
      } catch (error) {
        toast({ title: "Error", description: "Failed to update fund type" })
      }
    }
  }

  const handleDeleteFundType = async (id: string) => {
    if (accessToken?.access_token) {
      try {
        await dispatch(deleteFundTypeAPI({ token: accessToken.access_token, id })).unwrap()
        toast({ title: "Success", description: "Fund type deleted successfully" })
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete fund type" })
      }
    }
  }

  return (
    <div className="h-full flex-1 flex-col px-8 md:flex">
      <div className="flex items-center justify-between space-y-2 mb-4">
        <div className="flex items-center justify-start space-x-2">
          <h2 className="text-2xl font-bold tracking-tight">Fund Type Management</h2>
          <Link href="/dashboard/mutual-funds">
            <Button variant="outline">Back</Button>
          </Link>
        </div>
        <div className='flex items-center justify-between space-x-2'>
          <Input
            placeholder="Enter new fund type"
            value={newFundType}
            onChange={(e) => setNewFundType(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={handleAddFundType} variant={"default"} className="w-[250px]">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Fund Type
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Number of Fund Names</TableHead>
              <TableHead>Created By</TableHead>
              {fundTypes.some((fundType) => fundType.updated_by_name) && (
                <TableHead>Updated By</TableHead>
              )}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fundTypes.map((fundType) => (
              <TableRow key={fundType._id}>
                <TableCell>
                  <Link href={`/dashboard/mutual-funds/settings/fund-management/${fundType._id}`} className="text-blue-500 hover:underline">
                    {fundType.name}
                  </Link>
                </TableCell>
                <TableCell>{format(new Date(fundType.created_at), "PPP")}</TableCell>
                <TableCell>{fundType.fundNames.length}</TableCell>
                <TableCell>{fundType.created_by_name}</TableCell>
                {fundTypes.some((fundType) => fundType.updated_by_name) && (
                  <TableCell>{fundType.updated_by_name || "N/A"}</TableCell>
                )}
                <TableCell>
                  <div className="flex space-x-2">
                    {/* <Link href={`/dashboard/mutual-funds/settings/fund-management/${fundType._id}`} className="text-blue-500 hover:underline">
                      ＋ Fund names
                    </Link> */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/dashboard/mutual-funds/settings/fund-management/${fundType._id}`)}
                    >
                      Add Fund names
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingFundType({ id: fundType._id, name: fundType.name })}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Fund Type</DialogTitle>
                        </DialogHeader>
                        <div className="flex space-x-2 mt-4">
                          <Input
                            value={editingFundType?.name || ""}
                            onChange={(e) =>
                              setEditingFundType((prev) => (prev ? { ...prev, name: e.target.value } : null))
                            }
                          />
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant={'outline'}>Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button onClick={handleEditFundType}>Save</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Do you want to delete this fund type?</DialogTitle>
                        </DialogHeader>
                        <p>This action will permanently remove the fund type and all associated data.</p>
                        <div className="mt-4"><p><strong>Note:</strong> This action is irreversible. Please confirm your decision before proceeding.</p></div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant={'outline'}>Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button onClick={() => handleDeleteFundType(fundType._id)}>Yes</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

    </div >
  )
}

