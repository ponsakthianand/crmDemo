import todos from '@/app/dashboard/customers/[customerId]/todos/todos';
import EditTaskDialog from '@/app/dashboard/todos/edit-task';
import { fetchAllTasksDataAPI, TasksDataInfo } from '@/app/store/reducers/allTasks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/registry/new-york/ui/scroll-area';
import { CircleCheckBig, Circle } from 'lucide-react';
import { DataLoader } from './dataLoader/dataLoader';
import LastSeen from './elements/lastSeen';
import { NoData } from './no-data/nodata';
import { useAppDispatch } from '@/app/store/hooks';
import { toast } from '@/registry/new-york/ui/use-toast';

interface RecentTasksProps {
  tasksData: TasksDataInfo[];
  token: string;
}

export function RecentTodos({ tasksData, token }: RecentTasksProps) {
  const dispatch = useAppDispatch()

  const onComplete = async (todoId: string, title: string, status: boolean) => {
    const response = await fetch(`/api/todos/completed`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${token}`,
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
    if (token) {
      dispatch(fetchAllTasksDataAPI(token));
    }
    return data;
  }

  return (
    <div className="space-y-8">
      <div className=" w-full">
        {tasksData?.length ? <ScrollArea className="h-[330px] rounded-md"><ul className="flex flex-col">
          {tasksData?.map((todo, index) => (
            <li className="inline-flex items-center gap-x-2 p-3 py-2 text-sm font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-white cursor-pointer hover:bg-gray-100" key={index}>
              <div className="flex justify-between w-full">
                <div className='flex items-center w-9/12'>
                  <div className='mr-4 cursor-pointer' onClick={() => onComplete(todo._id, todo.title, todo.isCompleted)}>
                    {
                      todo?.isCompleted ? <div><CircleCheckBig className='text-green-500' /></div> : <div className='text-gray-500'><Circle /></div>
                    }
                  </div>
                  <div>
                    <p className="text-xs font-medium leading-none truncate w-64">{todo.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{todo.description}</p>
                  </div>
                  {/* <div><EditTaskDialog todo={todo} users={users} customers={customers} token={accessToken.access_token} /></div> */}
                </div>
                <div className='flex items-center justify-end w-3/12'>
                  {!todo?.isCompleted ? <div className={`flex items-center text-xs ${new Date(todo?.dueDate).getTime() <= new Date().getTime() ? 'text-red-500' : ''}`}><LastSeen date={todo?.dueDate} /></div> : <></>}
                  {/* <div>
                      {deleteCall(todo._id, todo.title)}
                    </div> */}
                </div>
              </div>
            </li>
          ))}</ul></ScrollArea> : <NoData className="min-h-full" />}
      </div>
    </div>
  );
}
