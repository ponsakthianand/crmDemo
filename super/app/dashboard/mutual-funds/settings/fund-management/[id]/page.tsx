"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/app/store/hooks"
import {
  fetchFundTypeAPI,
  addFundNameAPI,
  editFundNameAPI,
  deleteFundNameAPI,
} from "@/app/store/reducers/fundManagement"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"

export default function FundNamesPage() {
  const { id } = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.authToken)
  const fundType = useAppSelector((state) => state.fundManagement.currentFundType)
  const [newFundName, setNewFundName] = useState("")
  const [editingFundName, setEditingFundName] = useState<{ id: string; name: string } | null>(null)

  useEffect(() => {
    if (accessToken?.access_token && id) {
      dispatch(fetchFundTypeAPI({ token: accessToken.access_token, id: id as string }))
        .unwrap()
        .catch((error) => {
          toast({ title: "Error", description: error.message || "Failed to fetch fund type" })
          router.push("/dashboard/mutual-funds/settings/fund-management")
        })
    }
  }, [accessToken, dispatch, id, router])

  const handleAddFundName = async () => {
    if (!newFundName.trim()) {
      toast({ title: "Error", description: "Fund name cannot be empty" })
      return
    }

    if (accessToken?.access_token && id) {
      try {
        await dispatch(
          addFundNameAPI({ token: accessToken.access_token, fundTypeId: id as string, name: newFundName }),
        ).unwrap()
        setNewFundName("")
        toast({ title: "Success", description: "Fund name added successfully" })
      } catch (error) {
        toast({ title: "Error", description: "Failed to add fund name" })
      }
    }
  }

  const handleEditFundName = async () => {
    if (!editingFundName || !editingFundName.name.trim()) {
      toast({ title: "Error", description: "Fund name cannot be empty" })
      return
    }

    if (accessToken?.access_token && id) {
      try {
        await dispatch(
          editFundNameAPI({
            token: accessToken.access_token,
            fundTypeId: id as string,
            fundNameId: editingFundName.id,
            name: editingFundName.name,
          }),
        ).unwrap()
        setEditingFundName(null)
        toast({ title: "Success", description: "Fund name updated successfully" })
      } catch (error) {
        toast({ title: "Error", description: "Failed to update fund name" })
      }
    }
  }

  const handleDeleteFundName = async (fundNameId: string) => {
    if (accessToken?.access_token && id) {
      try {
        await dispatch(
          deleteFundNameAPI({ token: accessToken.access_token, fundTypeId: id as string, fundNameId }),
        ).unwrap()
        toast({ title: "Success", description: "Fund name deleted successfully" })
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete fund name" })
      }
    }
  }

  if (!fundType) {
    return <div className="h-full flex-1 flex-col px-8 md:flex">
      <div className="flex items-center justify-between space-y-2 mb-4">
        <div className="flex items-center justify-start space-x-2">
          <h2 className="text-2xl font-bold tracking-tight"></h2>
        </div>
        <div className='flex items-center justify-between space-x-2'>

        </div>
      </div>

      <div className="rounded-md border">
        Loading...
      </div>
    </div>
  }

  return (
    <div className="h-full flex-1 flex-col px-8 md:flex">
      <div className="flex items-center justify-between space-y-2 mb-4">
        <div className="flex items-center justify-start space-x-2">
          <h2 className="text-2xl font-bold tracking-tight">Fund Names for {fundType.name}</h2>
          <Link href="/dashboard/mutual-funds/settings/fund-management">
            <Button variant="outline">Back to Fund Types</Button>
          </Link>
        </div>
        <div className='flex items-center justify-between space-x-2'>
          <Input
            placeholder="Enter new fund name"
            value={newFundName}
            onChange={(e) => setNewFundName(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={handleAddFundName} className="w-[250px]">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Fund Name
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Updated By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fundType.fundNames.map((fundName) => (
              <TableRow key={fundName._id}>
                <TableCell>{fundName.name}</TableCell>
                <TableCell>{format(new Date(fundName.created_at), "PPP")}</TableCell>
                <TableCell>{fundName.created_by_name}</TableCell>
                <TableCell>{fundName.updated_by_name || "N/A"}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingFundName({ id: fundName._id, name: fundName.name })}
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
                            value={editingFundName?.name || ""}
                            onChange={(e) =>
                              setEditingFundName((prev) => (prev ? { ...prev, name: e.target.value } : null))
                            }
                          />
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant={'outline'}>Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button onClick={handleEditFundName}>Save</Button>
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
                          <DialogTitle>Do you want to delete this fund name?</DialogTitle>
                        </DialogHeader>
                        <p>This action will permanently remove the fund name.</p>
                        <div className="mt-4"><p><strong>Note:</strong> This action is irreversible. Please confirm your decision before proceeding.</p></div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant={'outline'}>Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button onClick={() => handleDeleteFundName(fundName._id)}>Yes</Button>
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

    </div>
  )
}

