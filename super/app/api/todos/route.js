import client from '@/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'bson';

const todoHandler = async (req) => {
  const { method } = req;
  const headersList = await headers();
  const token = headersList.get('token');
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db('rxtn');
  const collection = db.collection('todos');

  switch (method) {
    case 'GET':
      return getTaskHandler(collection, user);
    case 'POST':
      const body = await req.json();
      return addTaskHandler(body, db, user);
    case 'PUT':
      const editBody = await req.json();
      return editTaskHandler(editBody, collection, user);
    case 'DELETE':
      const deleteBody = await req.json();
      return delteTaskHandler(deleteBody, collection, user);
    default:
      return NextResponse.json({ message: "It's wrong buddy!" }, { status: 400 });
  }
}

export { todoHandler as GET, todoHandler as POST, todoHandler as PUT, todoHandler as DELETE };


// Handler to get all notes for a specific customer
async function getTaskHandler(collection, user) {

  try {
    if (user?.role === 'org-admin') {
      const notes = await collection.find({ assignee_by_id: user?.id }).sort({ isCompleted: 1, dueDate: 1 }).toArray();
      return NextResponse.json(notes, { status: 200 });
    } else {
      return NextResponse.json({ error: 'You are not allowed to perform this operation' }, { status: 403 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

async function addTaskHandler(body, db, user) {
  const { title, dueDate, assign, customer, description } = body;
  const collection = await db.collection('todos');

  if (!title) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    if (user?.role === 'org-admin') {
      const newTask = {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : new Date(), // Convert to Date object
        created_by_id: user?.id,
        created_by: user?.name,
        customer_id: customer?.customer_id || null,
        customer_name: customer?.customer_name || '',
        created_at: new Date(),
        updated_at: new Date(),
        isCompleted: false,
        assigned_by_id: user?.id,
        assigned_by_name: user?.name,
        assigned_at: new Date(),
        assignee_by_id: assign?.assignee_by_id || user?.id,
        assignee_by_name: assign?.assignee_by_name || user?.name,
        assignHistory: [],
      };

      const { insertedId } = await collection.insertOne(newTask);

      return NextResponse.json({
        message: 'Task created successfully',
        taskId: insertedId,
      });
    } else {
      return NextResponse.json({ error: 'You are not allowed to perform this operation' }, { status: 403 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

async function editTaskHandler(body, collection, user) {
  const { todoId, title, dueDate, assign, customer } = body;

  if (!todoId || !title) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  const existingTodo = await collection.findOne({ _id: new ObjectId(todoId) });
  if (!existingTodo) {
    return NextResponse.json({ message: 'Note not found' }, { status: 404 });
  }

  try {
    if (user?.role === 'org-admin') {
      const updatedTask = {
        title,
        description: body?.description || existingTodo?.description,
        dueDate: dueDate ? new Date(dueDate) : new Date(), // Convert to Date object
        updated_at: new Date(),
        updated_by_id: user?.id,
        updated_by: user?.name,
        assigned_by_id: user?.id,
        assigned_by_name: user?.name,
        assigned_at: new Date(),
        assignee_by_id: assign?.assignee_by_id || user?.id,
        assignee_by_name: assign?.assignee_by_name || user?.name,
        customer_id: customer?.customer_id || null,
        customer_name: customer?.customer_name || '',
      };

      const updatedHistory = await assign ? {
        assigned_by_id: existingTodo?.assigned_by_id,
        assigned_by_name: existingTodo?.assigned_by_name,
        assigned_at: new Date(),
        assignee_by_id: existingTodo?.assignee_by_id,
        assignee_by_name: existingTodo?.assignee_by_name,
      } : {};

      const result = await collection.updateOne(
        { _id: new ObjectId(todoId) },
        {
          $set: updatedTask,
          $push: { assignHistory: updatedHistory }
        }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ message: 'Task not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Task updated successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'You are not allowed to perform this operation' }, { status: 403 });
    }
  } catch (error) {
    console.error(error);
    NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

async function delteTaskHandler(body, collection, user) {
  const { todoId } = body;

  if (!todoId) {
    return NextResponse.json({ message: 'Missing required field: todoId' }, { status: 400 });
  }

  try {
    if (user?.role === 'org-admin') {
      const result = await collection.deleteOne({ _id: new ObjectId(todoId) });

      if (result.deletedCount === 0) {
        return NextResponse.json({ message: 'Task not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'You are not allowed to perform this operation' }, { status: 403 });
    }
  } catch (error) {
    console.error(error);
    NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
