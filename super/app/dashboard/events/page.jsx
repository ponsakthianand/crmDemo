'use client';
import { columns } from '@/components/tables/events-tables/components/columns';
import { DataTable } from '@/components/tables/events-tables/components/data-table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  allEventAction,
  allEventSelectors,
  deleteEvent,
  fetchAllEvents,
} from '../../store/reducers/allEvents';
import { useAppSelector } from '@/app/store/hooks';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { NoData } from '@/components/no-data/nodata';
import TableLoader from '@/components/ui/table-loader';

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const accessToken = useAppSelector((state) => state.authToken);

  const { data: allEvents, loading } = useSelector(
    allEventSelectors.getEventList
  );
  const {
    data: deleteData,
    isOpen,
    id,
  } = useSelector(allEventSelectors.getDeleteEvent);

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchAllEvents(accessToken.access_token));
    }
  }, [accessToken]);

  const onHandleAddNewEvent = () => {
    router.push(`/dashboard/events/addEvent`);
  };

  const modalOnChange = () => {
    if (isOpen) {
      dispatch(allEventAction.deleteEvent({ open: false, data: '', id: '' }));
    }
  };
  const confirmDelete = () => {
    dispatch(deleteEvent({ token: accessToken.access_token, id })).then(
      (res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          dispatch(
            allEventAction.deleteEvent({ open: false, data: '', id: '' })
          );
          dispatch(fetchAllEvents(accessToken.access_token));
        }
      }
    );
  };

  return (
    <>
      <div className='h-full flex-1 flex-col px-8 md:flex'>
        <div className='flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Events</h2>
          </div>
          <Button variant='default' size='sm' onClick={onHandleAddNewEvent}>
            + Add New Event
          </Button>
        </div>

        {loading ? (
          <TableLoader />
        ) : allEvents?.length ? (
          <DataTable data={allEvents} columns={columns} />
        ) : (
          <NoData />
        )}
      </div>
      <Dialog open={isOpen} onOpenChange={modalOnChange}>
        <DialogTrigger asChild>
          <div className='text-red-500 cursor-pointer'>Delete</div>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Delete '{deleteData}'</DialogTitle>
            <DialogDescription>
              Do you really want to delete this course?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type='button' variant={'outline'}>
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type='button' onClick={confirmDelete}>
                Delete
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
