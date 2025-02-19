"use client"

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { ScrollArea, ScrollBar } from "@/registry/new-york/ui/scroll-area"
import LastSeen from '@/components/elements/lastSeen';
import { NoData } from '@/components/no-data/nodata';
import { DataLoader } from '@/components/dataLoader/dataLoader';
import { Eye, FilePenLine, NotepadText, Trash2 } from 'lucide-react';
import { fetchNotesSpecificDataAPI } from '@/app/store/reducers/notesSpecificCustomer';
import { toast } from '@/components/ui/use-toast';
import EditNotesDialog from './edit-notes';
import PageContainer from '@/components/layout/page-container';

interface NotesTabProps {
  customerID: string;
}
export default function NotesTab({ customerID }: NotesTabProps) {
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.authToken);
  const notes = useAppSelector((state) => state.notesCustomerSpecific);
  const notesList = notes?.data;

  useEffect(() => {
    accessToken?.access_token?.length && dispatch(fetchNotesSpecificDataAPI(accessToken?.access_token, customerID));
  }, [accessToken])

  const onOpen = () => {
    console.log('open')
  }

  const onDelete = async (noteId: string, title: string) => {
    const response = await fetch(`/api/customers/${customerID}/notes`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${accessToken?.access_token}`,
      },
      body: JSON.stringify({ noteId }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    toast({
      title: "Deleted",
      description: `${title} has been deleted successfully.`,
      variant: "destructive",
    })
    const data = await response.json();
    if (accessToken?.access_token) {
      dispatch(fetchNotesSpecificDataAPI(accessToken.access_token, customerID));
    }
    return data;
  }


  return (
    <div className="block">
      <div className="border-t">
        <div className="bg-background pt-8">
          <PageContainer scrollable={true}>
            <div className=" w-full">
              {notesList?.length ? <div className="grid grid-cols-6 md:grid-cols-6 gap-6 w-full">
                {notesList?.map((note, index) => (
                  <div className='flex flex-col items-center justify-center' key={index}>
                    <EditNotesDialog customerId={customerID} token={accessToken?.access_token} noteData={note} onDelete={onDelete} />
                    <div className='max-w-[170px]'>
                      <div className='text-xs font-semibold truncate mt-2'>{note?.title}</div>
                    </div>
                    <div className='text-xs text-gray-600 text-center'> by {note?.updated_by} <LastSeen date={note?.updated_at} /></div>
                  </div>
                ))}</div> : notes?.loading ? <DataLoader /> : <NoData />}
            </div>
          </PageContainer>
        </div>
      </div >
    </div >
  )
} 