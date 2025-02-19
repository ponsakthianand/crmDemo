import client from '@/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'bson';

const todoCompleteHandler = async (req) => {
  const { method } = req;
  const headersList = await headers();
  const token = headersList.get('token');
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db('rxtn');
  const collection = db.collection('todos');

  switch (method) {
    case 'PUT':
      const editBody = await req.json();
      return completeTaskhandler(editBody, collection, user);
    default:
      return NextResponse.json({ message: "It's wrong buddy!" }, { status: 400 });
  }
}

export { todoCompleteHandler as PUT };

async function completeTaskhandler(body, collection, user) {
  const { todoId } = body;

  if (!todoId) {
    return NextResponse.json({ message: 'Missing required field: todoId' }, { status: 400 });
  }

  const existingTodo = await collection.findOne({ _id: new ObjectId(todoId) });
  if (!existingTodo) {
    return NextResponse.json({ message: 'Note not found' }, { status: 404 });
  }

  try {
    if (user?.role === 'org-admin') {
      const result = await collection.updateOne(
        { _id: new ObjectId(todoId) },
        { $set: { isCompleted: !existingTodo?.isCompleted, completed_at: new Date() } }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ message: 'Task not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Task status changes' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'You are not allowed to perform this operation' }, { status: 403 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}