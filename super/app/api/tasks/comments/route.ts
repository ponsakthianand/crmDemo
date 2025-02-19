import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodbConfig';
import { ObjectId } from 'mongodb';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';

export async function GET(request: Request) {
  const headersList = await headers();
  const token = headersList.get('token');
  if (!token) {
    return NextResponse.json({ error: 'Token is not found' }, { status: 400 });
  }
  const user = parseJwt(token);
  if (!user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId');

  if (!taskId) {
    return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
  }

  const client = await clientPromise;
  const collection = client.db('taskmanager').collection('comments');

  const query = ObjectId.isValid(taskId)
    ? { $or: [{ taskId: taskId }, { taskId: new ObjectId(taskId) }] }
    : { taskId: taskId };

  const comments = await collection
    .find(query)
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(comments);
}

export async function POST(request: Request) {
  const headersList = await headers();
  const token = headersList.get('token');
  if (!token) {
    return NextResponse.json({ error: 'Token is not found' }, { status: 400 });
  }
  const user = parseJwt(token);
  if (!user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }
  const client = await clientPromise;
  const collection = client.db('taskmanager').collection('comments');
  const { taskId, content } = await request.json();

  if (!taskId || !content) {
    return NextResponse.json(
      { error: 'Task ID and content are required' },
      { status: 400 }
    );
  }

  const newComment = {
    taskId,
    userId: user.id,
    userName: user.name,
    content,
    createdAt: new Date(),
  };

  const result = await collection.insertOne(newComment);
  return NextResponse.json({ ...newComment, _id: result.insertedId });
}
