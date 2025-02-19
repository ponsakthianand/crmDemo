'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/registry/new-york/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/new-york/ui/command"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select"
import { toast } from '@/components/ui/use-toast';
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from '@/registry/new-york/ui/textarea';
import { dateToLocalDateYear } from '@/global';
import { fetchAllTasksDataAPI } from '@/app/store/reducers/allTasks';
import { ScrollArea } from '@/registry/new-york/ui/scroll-area';
import { Input } from '@/registry/new-york/ui/input';

export default function EditTaskDialog({ token, todo, users, customers }: any) {
  const dispatch = useAppDispatch()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const profile = useAppSelector((state) => state.profileData);
  const disableButton = !title;
  const [assignUser, setAssignUser] = useState('')
  const [assignCustomer, setAssignCustomer] = useState('')
  const assignee = users?.data?.find((user: any) => user?._id === assignUser)
  const customer_assigned = customers?.data?.find((user: any) => user?._id === assignCustomer)
  const assign = {
    assignee_by_id: assignee?._id || profile?.data?._id,
    assignee_by_name: assignee?.name || profile?.data?.name,
  }
  const customersForDropdown = customers?.data?.map((customer: any) => ({ label: customer.name, value: customer._id }))

  useEffect(() => {
    setDate(todo?.dueDate)
    setTitle(todo?.title)
    setDescription(todo?.description)
    setAssignUser(todo?.assignee_by_id)
    setAssignCustomer(todo?.customer_id)
  }, [todo]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const payload = {
      todoId: todo?._id, title, description, dueDate: date || new Date(), assign, customer: { customer_name: customer_assigned?.name, customer_id: customer_assigned?._id }
    }

    const response = await fetch(`/api/todos`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token: `Bearer ${token}`,
      },
      body: JSON.stringify(payload)
    })
    const data = await response.json();

    if (!response.ok) {
      setDialogOpen(false);
      toast({
        title: "Sorry!",
        description: data?.error,
      })
      return
    }
    token?.length && dispatch(fetchAllTasksDataAPI(token));
    setDialogOpen(false);
    toast({
      title: "Great work!",
      description: 'Task has been updated.',
    })
  };


  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <div>{todo?.title}</div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => {
        e.preventDefault();
      }}>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            {/* Get the new client today! */}
          </DialogDescription>
        </DialogHeader>
        <div>
          <Input
            id="title"
            name="title"
            value={title}
            className="col-span-4 mb-2"
            placeholder='Task title...'
            onChange={(e: any) => setTitle(e.target.value)}
          />
          <Textarea
            id="description"
            name="description"
            value={description}
            placeholder='Task detail...'
            className="col-span-4 mb-2"
            onChange={(e: any) => setDescription(e.target.value)}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full pl-3 text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                {date ? (
                  date ? dateToLocalDateYear(date.toString()) : "Start from"
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => setDate(date)}
                disabled={(date) =>
                  date < new Date()
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
              >
                {assignCustomer
                  ? customersForDropdown?.find((customer: any) => customer.value === assignCustomer)?.label
                  : "Select customer..."}
                <ChevronsUpDown className="h-3 w-3 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search customer..." className='' />
                <CommandList className='w-full'>
                  <CommandEmpty>No customers found.</CommandEmpty>
                  <CommandGroup>
                    <ScrollArea className="h-[200px] rounded-md">
                      {customersForDropdown?.map((customer: any) => (
                        <CommandItem
                          key={customer.value}
                          value={customer.value}
                          onSelect={(currentValue) => {
                            setAssignCustomer(currentValue === assignCustomer ? "" : currentValue)
                            setOpen(false)
                          }}
                          className='hover:bg-gray-100 cursor-pointer'
                        >
                          {customer.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              assignCustomer === customer.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </ScrollArea>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Select onValueChange={(e: any) => setAssignUser(e)} defaultValue={assignUser}>
            <SelectTrigger>
              <SelectValue placeholder="Assign" />
            </SelectTrigger>
            <SelectContent>
              {users?.data?.map((user: any) =>
                <SelectItem value={user?._id} key={user?._id}>
                  <div className="flex items-center gap-1">
                    <span className="flex-shrink-0 inline-flex items-center justify-center size-[24px] rounded-full bg-gray-400">
                      <span className="text-sm font-medium text-white leading-none" title={user?.name}>{user?.name?.charAt(0)}</span>
                    </span>
                    <span className='ml-1 flex flex-col justify-start text-left'>
                      <span className='text-xs font-semibold'>{user?.name}</span>
                      <span className='text-xs'>{user?.email}</span>
                    </span>
                  </div>
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button type="submit" form="new-partner-form" disabled={disableButton} onClick={(e) => handleSubmit(e)}>
            Update task
          </Button>
        </DialogFooter>
      </DialogContent >
    </Dialog >
  );
}
