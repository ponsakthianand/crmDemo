'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/registry/new-york/ui/button';
import { Input } from '@/registry/new-york/ui/input';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { toast } from '@/components/ui/use-toast';
import { NotepadText } from "lucide-react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/new-york/ui/sheet"
import { fetchNotesSpecificDataAPI } from '@/app/store/reducers/notesSpecificCustomer';
import dynamic from 'next/dynamic';

export default function NewNotesDialog({ customerId, token }: any) {
  const dispatch = useAppDispatch()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState<string>()
  const [content, setContent] = useState<any>()

  const Editor = dynamic(
    () => import('./editor'),
    { ssr: false }
  );

  const handleSubmit = async () => {
    setLoading(true)

    const payload = { title, content }
    if (content || title) {
      const response = await fetch(`/api/customers/${customerId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      })
      const data = await response.json();

      if (!response.ok) {
        setDialogOpen(false);
        setLoading(false)
        toast({
          title: "Sorry!",
          description: data?.error,
        })
        return
      }
      setTitle('')
      setContent('')
      token?.length && dispatch(fetchNotesSpecificDataAPI(token, customerId));
      setDialogOpen(false);
      setLoading(false)
      toast({
        title: "Great work!",
        description: 'New Note has been added.',
      })
      return
    }
  };

  useEffect(() => {
    handleSubmit()
  }, [content, title]);

  return (
    <Sheet open={dialogOpen} onOpenChange={setDialogOpen}>
      <SheetTrigger>
        <Button type='button'>
          <NotepadText className='pr-2' /> Add Note
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[820px] sm:max-w-[1000px]">
        <SheetHeader>
          <SheetDescription>
            <Editor data={content} noteTitle={setTitle} titleValue={title} onChange={setContent} holder="Start Typing Here..." />
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet >
  );
}
