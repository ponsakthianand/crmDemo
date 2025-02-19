'use client';
import { columns } from '@/components/tables/courses-tables/components/columns';
import { DataTable } from '@/components/tables/courses-tables/components/data-table';
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
  allCourseAction,
  allCourseSelectors,
  deleteCourse,
  fetchAllCourses,
} from '../../store/reducers/allCourses';
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

  const { data: allCourses, loading } = useSelector(
    allCourseSelectors.getCourseList
  );
  const {
    data: deleteData,
    isOpen,
    id,
  } = useSelector(allCourseSelectors.getDeletecourse);

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchAllCourses(accessToken.access_token));
    }
  }, [accessToken]);

  const onHandleAddNewEvent = () => {
    router.push(`/dashboard/courses/addCourse`);
  };

  const modalOnChange = () => {
    if (isOpen) {
      dispatch(allCourseAction.deleteCourse({ open: false, data: '', id: '' }));
    }
  };
  const confirmDelete = () => {
    dispatch(deleteCourse({ token: accessToken.access_token, id })).then(
      (res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          dispatch(
            allCourseAction.deleteCourse({ open: false, data: '', id: '' })
          );
          dispatch(fetchAllCourses(accessToken.access_token));
        }
      }
    );
  };

  return (
    <>
      <div className='h-full flex-1 flex-col px-8 md:flex'>
        <div className='flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Courses</h2>
          </div>
          <Button variant='default' size='sm' onClick={onHandleAddNewEvent}>
            + Add New Course
          </Button>
        </div>

        {loading ? (
          <TableLoader />
        ) : allCourses?.length ? (
          <DataTable data={allCourses} columns={columns} />
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
