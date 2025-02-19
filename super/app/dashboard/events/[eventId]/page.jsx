'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppSelector } from '@/app/store/hooks';
import { useSession } from 'next-auth/react';
import { ProductEventForm } from '../event-form/event-product-form';
import { ScrollArea, ScrollBar } from '@/registry/new-york/ui/scroll-area';
import {
  allEventAction,
  allEventSelectors,
  fetchSingleEvent,
  updateEvent,
} from '@/app/store/reducers/allEvents';
import TableLoader from '@/components/ui/table-loader';

const EditEvent = ({ params }) => {
  const { eventId } = params;
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const accessToken = useAppSelector((state) => state.authToken);
  const { data: event, loading } = useSelector(
    allEventSelectors.getSingleEvent
  );

  useEffect(() => {
    dispatch(allEventAction.clearEvent());
    if (accessToken?.access_token?.length) {
      eventId?.length &&
        dispatch(
          fetchSingleEvent({ token: accessToken.access_token, eventId })
        );
    }
  }, [eventId, accessToken, session]);

  return (
    <>
      {!loading ? (
        <ScrollArea
          className='rounded-md'
          style={{ height: 'calc(100vh - 50px)' }}
        >
          <ProductEventForm token={accessToken.access_token} event={event} />
        </ScrollArea>
      ) : (
        <div className='h-full flex-1 flex-col px-8 md:flex'>
          <TableLoader />
        </div>
      )}
    </>
  );
};

export default EditEvent;
