'use client';

import Link from 'next/link';
import { DataTableColumnHeader } from './data-table-column-header';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Trash2, FilePenLine, ExternalLink } from 'lucide-react';
import { allEventAction } from '@/app/store/reducers/allEvents';

const EditButton = ({ row, icon }) => {
  const router = useRouter();
  const onHandleEditEvent = () => {
    router.push(`/dashboard/events/${row.original._id}`);
  };
  return (
    <div onClick={onHandleEditEvent}>
      {icon === 'edit' ? (
        <FilePenLine
          className='h-4 w-4 opacity-70 hover:text-blue-700 mr-3'
          style={{ marginRight: '10px', marginLeft: '10px' }}
        />
      ) : (
        { icon }
      )}
    </div>
  );
};

const DeleteButton = ({ row, icon }) => {
  const dispatch = useDispatch();
  const onHandleDeleteEvent = () => {
    dispatch(
      allEventAction.deleteEvent({
        open: true,
        data: row.original?.title,
        id: row.original._id,
      })
    );
    // router.push(`/dashboard/events/deleteEvent/${row.original._id}`);
  };
  return (
    <div onClick={onHandleDeleteEvent}>
      <Trash2 className='h-4 w-4 opacity-70 hover:text-red-500' />
    </div>
  );
};

export const columns = [
  {
    accessorKey: 'image',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Image' />
    ),
    cell: ({ row }) => {
      const imageUrl = row.original.image[0]; // Get the first image URL
      return (
        <img
          src={
            imageUrl
              ? imageUrl
              : 'https://e5osher1gwoyuako.public.blob.vercel-storage.com/webapp/static/image-gallery-2H3aGjxwClJBOZBRV4eBfpXfitkPHF.png'
          }
          alt='Product'
          className='w-auto h-10 object-contain rounded'
        />
      );
    },
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ row }) => {
      const router = useRouter();
      const onHandleEditEvent = () => {
        router.push(`/dashboard/events/${row.original._id}`);
      };
      const title = row.original.title;
      return (
        <>
          <div
            className='flex cursor-pointer hover:underline'
            onClick={onHandleEditEvent}
          >
            {title ? title : 'No name'}
          </div>
          <p className='text-xs text-muted-foreground'>
            {row.original.category}
          </p>
        </>
      );
    },
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Category' />
    ),
  },
  {
    accessorKey: 'regularPrice',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Regular Price' />
    ),
  },
  {
    accessorKey: 'salePrice',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sale Price' />
    ),
  },
  {
    accessorKey: 'published',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Published' />
    ),
  },
  {
    accessorKey: 'order',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Order' />
    ),
  },
  {
    accessorKey: 'created_by',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Creator by' />
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className='flex'>
        <Link
          target='_blank'
          href={`https://www.rxtn.in/events/${row.original.slug}`}
        >
          <ExternalLink className='h-4 w-4 opacity-70 hover:text-blue-700 mr-3' />
        </Link>
        <EditButton row={row} icon='edit' />
        <DeleteButton row={row} icon='delete' />
      </div>
    ),
  },
];
