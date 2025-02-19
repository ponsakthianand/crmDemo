'use server';

import { del } from '@vercel/blob';
import clientPromise from '@/app/lib/mongodbConfig';
import { ObjectId } from 'mongodb';

export async function deleteImage(imageId: string, taskId: string) {
  try {
    const client = await clientPromise;
    const db = client.db('taskmanager');
    const tasksCollection = db.collection('tasks');

    // Find the task to get the image URL
    const task = await tasksCollection.findOne(
      { _id: new ObjectId(taskId), 'images._id': new ObjectId(imageId) },
      { projection: { 'images.$': 1 } }
    );

    if (!task || !task.images || task.images.length === 0) {
      return { success: false, error: 'Image not found in task' };
    }

    const image = task.images[0];

    // Delete the image from Vercel Blob
    await del(image.url);

    // Remove the image from the task's images array
    const result = await tasksCollection.updateOne(
      { _id: new ObjectId(taskId) },
      { $pull: { images: { _id: new ObjectId(imageId) } as any } }
    );

    if (result.modifiedCount === 0) {
      return { success: false, error: 'Failed to remove image from task' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting image:', error);
    return { success: false, error: 'Failed to delete image' };
  }
}
