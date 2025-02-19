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
import { fetchTodosSpecificDataAPI } from '@/app/store/reducers/todosSpecificCustomer';
import { Button } from '@/registry/new-york/ui/button';
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
import EditTodoDialog from './edit-todo';
import { fetchusersDataAPI } from '@/app/store/reducers/usersList';
import PageContainer from '@/components/layout/page-container';

interface NotesTabProps {
  customerID: string;
}
export default function TodosTab({ customerID }: NotesTabProps) {
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.authToken);
  const todos = useAppSelector((state) => state.todosCustomerSpecific);
  const users = useAppSelector((state) => state.usersList);
  const profile = useAppSelector((state) => state.profileData);
  const todosList = todos?.data;
  const [date, setDate] = useState<Date | undefined>()
  const [title, setTitle] = useState('')
  const [assignUser, setAssignUser] = useState('')
  const assignee = users?.data?.find(user => user?._id === assignUser)
  const assign = {
    assignee_by_id: assignee?._id || profile?.data?._id,
    assignee_by_name: assignee?.name || profile?.data?.name,
  }

  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchTodosSpecificDataAPI(accessToken?.access_token, customerID));
  }, [accessToken])

  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchusersDataAPI(accessToken?.access_token));
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
    const response = await fetch(`/api/customers/${customerID}/todos`, {
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
      dispatch(fetchTodosSpecificDataAPI(accessToken.access_token, customerID));
    }
    return data;
  }

  const onComplete = async (todoId: string, title: string, status: boolean) => {
    const response = await fetch(`/api/customers/${customerID}/todos/completed`, {
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
      dispatch(fetchTodosSpecificDataAPI(accessToken.access_token, customerID));
    }
    return data;
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const payload = {
      title, assign, dueDate: date || new Date()
    }
    if (title) {
      const response = await fetch(`/api/customers/${customerID}/todos`, {
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
      accessToken.access_token?.length && dispatch(fetchTodosSpecificDataAPI(accessToken.access_token, customerID));
      toast({
        title: "Great work!",
        description: 'New task has been added.',
      })
      return
    }
  };


  return (
    <div className="block">
      <div className="border-t">
        <div className="bg-background pt-8">

          <div>
            <div className="flex items-center justify-between">
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
              <div>
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
              <div>
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
              <div>
                <Button type='button' className='p-6' onClick={(e) => handleSubmit(e)}>
                  <PlusCircle className='pr-2' /> Add
                </Button>
              </div>
            </div>
            <p id="floating_helper_text" className="mt-2 text-xs text-gray-500 dark:text-gray-400">Hit enter or add button to create task.</p>
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
                        <div><EditTodoDialog customerId={customerID} todo={todo} users={users} token={accessToken.access_token} /></div>
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
      </div >
    </div >
  )
} 