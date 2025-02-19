"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import AddTaskForm from "./AddTaskForm"

export default function CreateTaskModal({ onTaskCreated, token }: { onTaskCreated: () => void, token: string }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenChange = (open: boolean) => {
    // Only allow the dialog to be closed programmatically
    if (!open) {
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="!mt-0" onClick={() => setIsOpen(true)}>New Task</Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Task</DialogTitle>
        </DialogHeader>
        <AddTaskForm
          onTaskAdded={() => {
            setIsOpen(false)
            onTaskCreated()
          }}
          token={token}
        />
      </DialogContent>
    </Dialog>
  )
}

