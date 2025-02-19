"use client"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/new-york/ui/drawer"
import { useState } from "react"
import AddLeadFrom from "./new-leads";
import EditLeadForm from "./edit-leads";

export function LeadsDrawer({ action, initialData }: any) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {action === 'new' ? <Button variant="default">
          New Lead
        </Button> : <div>{initialData?.full_Name}</div>}
      </DrawerTrigger>
      <DrawerOverlay className="bg-black/40" />
      <DrawerContent className="flex flex-col rounded-t-[10px] mt-24 h-[80%] bottom-0 left-0 right-0 outline-none">
        <div className="mx-auto w-full flex-1 overflow-y-auto">
          {action === 'new' ? (<AddLeadFrom onSubmitDrawer={setOpen} />) : (<EditLeadForm onSubmitDrawer={setOpen} initialData={initialData} />)}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
