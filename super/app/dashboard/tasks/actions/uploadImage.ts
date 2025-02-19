'use server';

import { put } from '@vercel/blob';
import clientPromise from '@/app/lib/mongodbConfig';
import { ObjectId } from 'mongodb';

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File;
  const taskId = formData.get('taskId') as string;
  const isCropped = formData.get('isCropped') as string;
  const linkUrl = formData.get('linkUrl') as string;

  if (!file || !taskId) {
    throw new Error('Invalid request: No file or task ID provided');
  }

  try {
    const blob = await put(file.name, file, { access: 'public' });

    const client = await clientPromise;
    const db = client.db('taskmanager');
    const tasksCollection = db.collection('tasks');

    const imageDoc = {
      _id: new ObjectId(),
      url: blob.url,
      linkUrl: linkUrl || null,
      isCropped: isCropped === 'true',
      createdAt: new Date(),
    };

    const taskObjectId = ObjectId.isValid(taskId) ? new ObjectId(taskId) : null;
    if (!taskObjectId) throw new Error('Invalid task ID');

    const result = await tasksCollection.updateOne(
      { _id: taskObjectId },
      {
        $push: { images: { ...imageDoc } } as any, // Append to images array
      },
      { upsert: false } // Don't create a new task if not found
    );

    if (result.modifiedCount === 0) {
      throw new Error('Task not found or update failed');
    }

    return {
      success: true,
      image: imageDoc,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
