"use client"

import { Row } from "@tanstack/react-table"
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { Button } from "@/registry/new-york/ui/button"
import { toast } from '@/components/ui/use-toast';
import { fetchAllLeadsDataAPI, LeadsInfo } from "@/app/store/reducers/allLeadsData"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/registry/new-york/ui/dialog"
import { MessageSquareText, Send, Trash2 } from "lucide-react"
import { useState } from "react";
import { WhatsAppSender } from "./sendWhatsapp";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task: any = row.original
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.authToken);
  const [open, setOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);

  const deleteCall = (id: string, title: string) => {
    useState(true)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="flex items-center space-x-2 cursor-pointer">
            <Trash2 className="h-4 w-4 opacity-70 hover:text-red-500" />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete {title}?</DialogTitle>
            <DialogDescription>
              Do you really want to delete this lead?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant={'outline'}>Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="button" onClick={() => onDelete(id, title)}>Delete</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  const sedWhatsappMessage = (lead: LeadsInfo) => {
    useState(true)
    return (
      <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
        <DialogTrigger asChild>
          <div className="flex items-center space-x-2 cursor-pointer">
            <Send className="h-4 w-4 opacity-70 hover:text-red-500" />
          </div>
        </DialogTrigger>
        <WhatsAppSender userData={lead} />
      </Dialog>
    )
  }

  const onDelete = async (leadId: string, title: string) => {
    const response = await fetch(`/api/leads/${leadId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${accessToken?.access_token}`,
      },
      body: JSON.stringify({ leadId }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    toast({
      title: "Deleted",
      description: `${title} - task has been deleted successfully.`,
      variant: "destructive",
    })
    const data = await response.json();
    if (accessToken?.access_token) {
      dispatch(fetchAllLeadsDataAPI(accessToken.access_token));
    }
    return data;
  }

  return (
    <div className="flex items-center space-x-2">
      {sedWhatsappMessage(task)}
      {deleteCall(task._id as string, task.customer_name as string)}
    </div>
  )
}
