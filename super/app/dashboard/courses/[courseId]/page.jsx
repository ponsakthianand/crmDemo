'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppSelector } from '@/app/store/hooks';
import { useSession } from 'next-auth/react';
import { ProductCourseForm } from '../course-form/course-product-form';
import { ScrollArea, ScrollBar } from '@/registry/new-york/ui/scroll-area';
import {
  allCourseAction,
  allCourseSelectors,
  fetchSingleCourse,
  updateCourse,
} from '@/app/store/reducers/allCourses';
import TableLoader from '@/components/ui/table-loader';

const EditCourse = ({ params }) => {
  const { courseId } = params;
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const accessToken = useAppSelector((state) => state.authToken);
  const { data: course, loading } = useSelector(
    allCourseSelectors.getSinglecourse
  );

  useEffect(() => {
    dispatch(allCourseAction.clearcourse());
    if (accessToken?.access_token?.length) {
      courseId?.length &&
        dispatch(
          fetchSingleCourse({ token: accessToken.access_token, courseId })
        );
    }
  }, [courseId, accessToken, session]);

  return (
    <>
      {!loading ? (
        <ScrollArea
          className='rounded-md'
          style={{ height: 'calc(100vh - 50px)' }}
        >
          <ProductCourseForm token={accessToken.access_token} course={course} />
        </ScrollArea>
      ) : (
        <div className='h-full flex-1 flex-col px-8 md:flex'>
          <TableLoader />
        </div>
      )}
    </>
  );
};

export default EditCourse;
