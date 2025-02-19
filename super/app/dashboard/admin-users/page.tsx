'use client'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchUsersDataAPI } from '@/app/store/reducers/allUsers';
import { NoData } from '@/components/no-data/nodata';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import TableLoader from '@/components/ui/table-loader';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import LastSeen from '@/components/elements/lastSeen';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
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
import { toast } from '@/components/ui/use-toast';
import NewAdminUserDialog from './new-user';


export default function page() {
  const dispatch = useAppDispatch()
  const { data: session, status } = useSession()
  const accessToken = useAppSelector((state) => state.authToken);
  const usersList = useAppSelector((state) => state.allUsers);
  const usersData = usersList?.data;

  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchUsersDataAPI(accessToken?.access_token));
  }, [accessToken])

  async function resendPasswordHandle(_id: string, title: string): Promise<void> {
    try {
      const response = await fetch(`/api/users/${_id}/resend-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: `Bearer ${accessToken.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to resend password');
      }

      toast({
        title: "Password reset",
        description: `${title}'s new password sent to their email.`,
        variant: "default",
      })
    } catch (error) {
      console.error('Error resending password:', error);
    }
  }


  function editHandle(_id: string, title: string): void {
    // Redirect to the edit user page with the user ID
  }


  async function deactivateHandle(_id: string, title: string, active: boolean): Promise<void> {
    try {
      const response = await fetch(`/api/users/${_id}/deactivate`, {
        method: (active === true ? 'POST' : 'PUT'),
        headers: {
          'Content-Type': 'application/json',
          token: `Bearer ${accessToken.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to deactivate user');
      }

      (active === true ? toast({
        title: "Deavtivated",
        description: `${title} has been deactivated successfully.`,
        variant: "default",
      }) : toast({
        title: "Activated",
        description: `${title} has been activated successfully.`,
        variant: "default",
      }))


      // Optionally, you can refresh the users list after deactivation
      if (accessToken?.access_token) {
        dispatch(fetchUsersDataAPI(accessToken.access_token));
      }
    } catch (error) {
      console.error('Error deactivating user:', error);
      alert('Error deactivating user');
    }
  }

  async function deleteHandle(_id: string, title: string): Promise<void> {
    try {
      const response = await fetch(`/api/users/${_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          token: `Bearer ${accessToken.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }


      toast({
        title: "Deleted",
        description: `${title} has been deleted successfully.`,
        variant: "destructive",
      })
      // Optionally, you can refresh the users list after deletion
      if (accessToken?.access_token) {
        dispatch(fetchUsersDataAPI(accessToken.access_token));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  }

  const deleteCall = (id: string, title: string) => {
    return (
      <Dialog>
        <DialogTrigger className='w-full text-left'>
          <div>Delete</div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete {title}?</DialogTitle>
            <DialogDescription>
              Do you really want to delete this user?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant={'outline'}>Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="button" onClick={() => deleteHandle(id, title)}>Delete</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <>
      <div className="h-full flex-1 flex-col px-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          </div>
          <NewAdminUserDialog />
        </div>
        {usersList?.loading ? <TableLoader /> : usersData?.length ?
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mt-6'>
            {usersData?.map((user, index) => <div className={`flex justify-start space-x-4 rounded-md border bg-popover shadow-md outline-none p-4 relative ${user?.active === false ? 'opacity-55' : ''}`} key={index}>
              <Avatar>
                <AvatarImage src={user?.photo} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className='flex items-center justify-between'>
                  <h4 className="text-sm font-semibold">{user?.name}</h4>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 absolute right-1 top-1">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className='w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => editHandle(user?._id, user?.name)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => resendPasswordHandle(user?._id, user?.name)}>Resend password</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => deactivateHandle(user?._id, user?.name, user?.active)}>Deactivate</DropdownMenuItem>
                      <DropdownMenuItem className='focus:bg-red-500 focus:text-white block' onSelect={(e) => e.preventDefault()}>{deleteCall(user?._id, user?.name)}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className='text-xs'>{user?.email}</div>
                <div className="flex items-center">
                  <span className="text-xs text-muted-foreground flex">
                    Joined &nbsp; <LastSeen date={user?.created_at} />
                  </span>
                </div>
              </div>
            </div>)}
          </div>
          : <NoData />}
        { }
      </div>
    </>
  );
}
