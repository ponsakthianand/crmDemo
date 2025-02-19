"use client"

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { ScrollArea, ScrollBar } from "@/registry/new-york/ui/scroll-area"
import LastSeen from '@/components/elements/lastSeen';
import { NoData } from '@/components/no-data/nodata';
import { DataLoader } from '@/components/dataLoader/dataLoader';
import { Circle, CircleCheckBig, Eye, FilePenLine, NotepadText, PlusCircle, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/registry/new-york/ui/button';
import { Check, ChevronsUpDown } from "lucide-react"
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import EditTaskDialog from './edit-task';
import { fetchusersDataAPI } from '@/app/store/reducers/usersList';
import { fetchAllTasksDataAPI } from '@/app/store/reducers/allTasks';
import { Card } from '@/registry/new-york/ui/card';
import { fetchCustomersListAPI } from '@/app/store/reducers/customersList';
import PageContainer from '@/components/layout/page-container';

export default function TasksMainPage() {
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.authToken);
  const todos = useAppSelector((state) => state.allTasks);
  const users = useAppSelector((state) => state.usersList);
  const customers = useAppSelector((state) => state.customersList);
  const profile = useAppSelector((state) => state.profileData);
  const [open, setOpen] = useState(false)
  const todosList = todos?.data;
  const [date, setDate] = useState<Date | undefined>()
  const [title, setTitle] = useState('')
  const [assignUser, setAssignUser] = useState('')
  const assignee = users?.data?.find(user => user?._id === assignUser)
  const [assignCustomer, setAssignCustomer] = useState('')
  const customer_assigned = customers?.data?.find((user: any) => user?._id === assignCustomer)
  const customersForDropdown = customers?.data?.map((customer: any) => ({ label: customer.name, value: customer._id }))
  const assign = {
    assignee_by_id: assignee?._id || profile?.data?._id,
    assignee_by_name: assignee?.name || profile?.data?.name,
  }
  useEffect(() => {
    if (accessToken?.access_token) {
      dispatch(fetchusersDataAPI(accessToken.access_token));
      dispatch(fetchCustomersListAPI(accessToken.access_token));
      dispatch(fetchAllTasksDataAPI(accessToken.access_token));
    }
  }, [accessToken])

  const deleteCall = (id: string, title: string) => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Trash2 className="ml-2 h-4 w-4 opacity-70 hover:text-red-500" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete {title}?</DialogTitle>
            <DialogDescription>
              Do you really want to delete this task?
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

  const onDelete = async (todoId: string, title: string) => {
    const response = await fetch(`/api/todos`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${accessToken?.access_token}`,
      },
      body: JSON.stringify({ todoId }),
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
      dispatch(fetchAllTasksDataAPI(accessToken.access_token));
    }
    return data;
  }

  const onComplete = async (todoId: string, title: string, status: boolean) => {
    const response = await fetch(`/api/todos/completed`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${accessToken?.access_token}`,
      },
      body: JSON.stringify({ todoId }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    toast({
      title: `${title} status changed to ${status ? 'Open' : 'Completed'}`,
    })
    const data = await response.json();
    if (accessToken?.access_token) {
      dispatch(fetchAllTasksDataAPI(accessToken.access_token));
    }
    return data;
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const payload = {
      title, assign, dueDate: date || new Date(), customer: { customer_name: customer_assigned?.name, customer_id: customer_assigned?._id }
    }

    if (title) {
      const response = await fetch(`/api/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: `Bearer ${accessToken.access_token}`,
        },
        body: JSON.stringify(payload)
      })
      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Sorry!",
          description: data?.error,
        })
        return
      }
      setTitle('')
      accessToken.access_token?.length && dispatch(fetchAllTasksDataAPI(accessToken.access_token));
      toast({
        title: "Great work!",
        description: 'New task has been added.',
      })
      return
    }
  };


  return (
    <div className="bg-background pt-4 border-t">

      <div>
        <Card className="w-full p-3 bg-slate-50">
          <div className="flex md:flex-row flex-col items-center justify-between">
            <div className='relative w-full'>
              <input type="text" id="floating_helper" aria-describedby="floating_helper_text" className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 border-0 border-b-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer bg-slate-50" placeholder=" "
                onChange={(e) => setTitle(e.target.value)} value={title}
                onKeyDown={(e) => {
                  if (e.code === "Enter") {
                    handleSubmit(e)
                  }
                }}
              />
              <label htmlFor="floating_helper" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
              >Add task</label>
            </div>

            <p className="flex mt-2 text-xs text-gray-500 dark:text-gray-400 md:hidden">Hit enter or add button to create task.</p>
            <div className='w-full'>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full pl-3 py-6 text-left font-normal hover:bg--slate-50 rounded-none border-0 border-b-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer bg-slate-50"
                  >
                    {assignCustomer
                      ? customersForDropdown?.find((customer) => customer.value === assignCustomer)?.label
                      : "Select customer..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command filter={(value, search) => {
                    if (value.includes(search)) return 1
                    return 0
                  }}>
                    <CommandInput placeholder="Search customer..." className='' />
                    <CommandList>
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
            <div className='w-full'>
              <Select onValueChange={(e: any) => setAssignUser(e)}>
                <SelectTrigger className='w-full pl-3 py-6 text-left font-normal hover:bg--slate-50 rounded-none border-0 border-b-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer bg-slate-50'>
                  <SelectValue placeholder="Assign" />
                </SelectTrigger>
                <SelectContent>
                  {users?.data?.map((user) =>
                    <SelectItem value={user?._id} key={user?._id}>
                      <div className="flex items-center gap-3">
                        <span className="flex-shrink-0 inline-flex items-center justify-center size-[38px] rounded-full bg-gray-400">
                          <span className="text-sm font-medium text-white leading-none" title={user?.name}>{user?.name?.charAt(0)}</span>
                        </span>
                        <span className='ml-1 flex flex-col'>
                          <span>{user?.name}</span>
                          <span className='text-xs'>{user?.email}</span>
                        </span>
                      </div>
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className='w-full'>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 py-6 text-left font-normal hover:bg--slate-50 rounded-none border-0 border-b-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer bg-slate-50",
                      !date && "text-muted-foreground"
                    )}
                  >
                    {date ? (
                      date ? format(date, "PPP") : "Due date"
                    ) : (
                      <span className='pr-2'>Due date</span>
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
            <div className='mt-2 md:mt-0'>
              <Button type='button' className='p-6' onClick={(e) => handleSubmit(e)}>
                <PlusCircle className='pr-2' /> Add
              </Button>
            </div>
          </div>
        </Card>
        <p className="hidden mt-2 text-xs text-gray-500 dark:text-gray-400 md:flex">Hit enter or add button to create task.</p>
      </div>

      <PageContainer scrollable={true}>
        <div className=" w-full pt-5">
          {todosList?.length ? <ul className="flex flex-col">
            {todosList?.map((todo, index) => (
              <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-white cursor-pointer hover:bg-gray-100" key={index}>
                <div className="flex justify-between w-full">
                  <div className='flex items-center w-9/12'>
                    <div className='mr-4 cursor-pointer' onClick={() => onComplete(todo._id, todo.title, todo.isCompleted)}>
                      {
                        todo?.isCompleted ? <div><CircleCheckBig className='text-green-500' /></div> : <div className='text-gray-500'><Circle /></div>
                      }
                    </div>
                    <div><EditTaskDialog todo={todo} users={users} customers={customers} token={accessToken.access_token} /></div>
                  </div>
                  <div className='flex items-center justify-end w-3/12'>
                    {!todo?.isCompleted ? <div className={`flex items-center text-xs ${new Date(todo?.dueDate).getTime() <= new Date().getTime() ? 'text-red-500' : ''}`}>due on &nbsp;
                      <LastSeen date={todo?.dueDate} />
                    </div> : <></>}
                    <div>
                      {deleteCall(todo._id, todo.title)}
                    </div>
                  </div>
                </div>
              </li>
            ))}</ul> : todos?.loading ? <DataLoader /> : <NoData />}
        </div>
      </PageContainer>
    </div>
  )
} 