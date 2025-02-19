'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { toast } from '@/components/ui/use-toast';
import { CalendarIcon, NotepadText, Trash2 } from "lucide-react"
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
import Editor from './editor';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/registry/new-york/ui/context-menu"

export default function EditNotesDialog({ customerId, token, noteData, onDelete }: any) {
  const dispatch = useAppDispatch()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState<string>()
  const [content, setContent] = useState<string>()
  const [newTitle, setNewTitle] = useState<string>()
  const [newContent, setNewContent] = useState<string>()

  useEffect(() => {
    setTitle(noteData?.title)
    setContent(noteData?.content)
  }, [noteData]);

  const handleSubmit = async () => {
    setLoading(true)

    const payload = { title: newTitle, content: newContent, noteId: noteData?._id }
    if (newContent || newTitle) {
      const response = await fetch(`/api/customers/${customerId}/notes`, {
        method: 'PUT',
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
      setNewTitle('')
      setNewContent('')
      token?.length && dispatch(fetchNotesSpecificDataAPI(token, customerId));
      setDialogOpen(false);
      setLoading(false)
      toast({
        title: "Great work!",
        description: 'New Note has been updated.',
      })
      return
    }
  };


  useEffect(() => {
    handleSubmit()
  }, [newContent, newTitle]);

  return (
    <Sheet open={dialogOpen} onOpenChange={setDialogOpen}>
      <ContextMenu>
        <ContextMenuTrigger>
          <SheetTrigger>
            <NotepadText className="mr-2 h-8 w-8 opacity-70" />
          </SheetTrigger>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={() => onDelete(noteData?._id, noteData?.title)}>
            <Trash2 className="mr-2 h-4 w-4 opacity-70" />Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <SheetContent className="w-[820px] sm:max-w-[1000px] overflow-visible">
        <SheetHeader>
          <SheetDescription>
            <Editor data={content} noteTitle={setNewTitle} titleValue={title} onChange={setNewContent} holder="Start Typing Here..." />
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
