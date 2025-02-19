import React, { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import CheckList from '@editorjs/checklist';
import Code from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import Embed from '@editorjs/embed';
import Image from '@editorjs/image';
import InlineCode from '@editorjs/inline-code';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import SimpleImage from '@editorjs/simple-image';
import Paragraph from '@editorjs/paragraph';
import Header from '@editorjs/header';
import Raw from '@editorjs/raw';
import classes from './editor.css';
import { ScrollArea } from '@/registry/new-york/ui/scroll-area';
import { Button } from '@/registry/new-york/ui/button';
import PageContainer from '@/components/layout/page-container';

const EDITOR_TOOLS = {
  code: Code,
  header: {
    class: Header,
    shortcut: 'CMD+H',
    inlineToolbar: true,
    config: {
      placeholder: 'Enter a Header',
      levels: [2, 3, 4],
      defaultLevel: 2,
    },
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
  checklist: CheckList,
  inlineCode: InlineCode,
  table: Table,
  list: List,
  quote: Quote,
  delimiter: Delimiter,
  raw: Raw,
};
function Editor({ data, onChange, noteTitle, titleValue, holder }) {
  const ref = useRef();
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const disableButton = !title && !content;

  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder: holder,
        autofocus: true,
        placeholder: 'Start writing here..',
        tools: EDITOR_TOOLS,
        style: {},
        data,
      });
      ref.current = editor;
    }

    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);

  const onSave = async () => {
    ref.current.save().then((outputData) => {
      setContent(outputData);
      onChange(outputData);
      noteTitle(title);
    });
  };
  const titleValueFromLocalState = title || titleValue;

  return (
    <>
      <PageContainer scrollable={true}>
        <input
          contentEditable
          className='flex h-9 w-full rounded-md border-none bg-transparent py-1 shadow-sm transition-colors file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-0 font-semibold text-gray-900 text-base ml-4 border-b-[1px]'
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Untitled note'
          value={titleValueFromLocalState}
        />
        <div
          id={holder}
          className='h-96 rounded bg-white text-gray-900 text-base w-full'
        />
      </PageContainer>
      <div className='flex justify-end mt-4'>
        <Button type='submit' onClick={(e) => onSave()}>
          Save note
        </Button>
      </div>
    </>
  );
}

export default Editor;
