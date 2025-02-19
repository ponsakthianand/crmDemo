import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodbConfig';
import { ObjectId } from 'mongodb';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { de } from 'date-fns/locale';

export type Priority = 'low' | 'medium' | 'high';

export type TaskStatus =
  | 'open'
  | 'in_progress'
  | 'in_review'
  | 'done'
  | 'cancelled';

export type Task = {
  _id: string;
  title: string | null;
  description?: string;
  completed: boolean;
  category: string;
  priority: Priority;
  status: TaskStatus;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  assignee?: string;
  reporter?: string;
  estimatedTime?: string;
  tags?: string[];
  image?: string;
};

export async function GET() {
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
  const collection = client.db('taskmanager').collection('tasks');
  const tasks = await collection
    .find({})
    .project({
      title: 1,
      description: 1,
      completed: 1,
      department: 1,
      category: 1,
      priority: 1,
      status: 1,
      dueDate: 1,
      createdAt: 1,
      updatedAt: 1,
      assignee: 1,
      reporter: 1,
      estimatedTime: 1,
      tags: 1,
      images: 1,
    })
    .sort({ createdAt: -1 })
    .toArray();
  return NextResponse.json(tasks);
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
  const collection = client.db('taskmanager').collection('tasks');
  const {
    title,
    description,
    department,
    category,
    priority,
    dueDate,
    assignee,
    reporter,
    estimatedTime,
    tags,
    status,
    image,
  } = await request.json();

  if (title !== null && typeof title !== 'string') {
    return NextResponse.json(
      { error: 'Title must be a string or null' },
      { status: 400 }
    );
  }

  if (!priority || !['low', 'medium', 'high'].includes(priority)) {
    return NextResponse.json(
      { error: 'Valid priority is required' },
      { status: 400 }
    );
  }

  if (
    !status ||
    !['open', 'in_progress', 'in_review', 'done', 'cancelled'].includes(status)
  ) {
    return NextResponse.json(
      { error: 'Valid status is required' },
      { status: 400 }
    );
  }

  const result = await collection.insertOne({
    title: title ? title.trim() : null,
    description: description ? description : '',
    department: department || null,
    category: category || null,
    priority,
    status: status || 'open',
    dueDate: dueDate ? new Date(dueDate) : null,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    assignee: assignee || user.id,
    reporter: reporter || user.id,
    estimatedTime: estimatedTime || null,
    tags: tags || [],
    image: image || null,
  });
  return NextResponse.json(result);
}

export async function PUT(request: Request) {
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
  const collection = client.db('taskmanager').collection('tasks');
  const {
    id,
    title,
    description,
    completed,
    department,
    category,
    priority,
    dueDate,
    assignee,
    reporter,
    status,
    image,
    tags,
  } = await request.json();

  if (title !== undefined && title !== null && typeof title !== 'string') {
    return NextResponse.json(
      { error: 'Title must be a string or null' },
      { status: 400 }
    );
  }

  if (priority !== undefined && !['low', 'medium', 'high'].includes(priority)) {
    return NextResponse.json({ error: 'Invalid priority' }, { status: 400 });
  }

  if (
    status !== undefined &&
    !['open', 'in_progress', 'in_review', 'done', 'cancelled'].includes(status)
  ) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const updateData: any = {
    updatedAt: new Date(),
  };

  if (title !== undefined) updateData.title = title ? title.trim() : null;
  if (description !== undefined) updateData.description = description;
  if (completed !== undefined) updateData.completed = completed;
  if (department !== undefined) updateData.department = department;
  if (category !== undefined) updateData.category = category;
  if (priority !== undefined) updateData.priority = priority;
  if (dueDate !== undefined)
    updateData.dueDate = dueDate ? new Date(dueDate) : null;
  if (assignee !== undefined) updateData.assignee = assignee;
  if (reporter !== undefined) updateData.reporter = reporter;
  if (status !== undefined) updateData.status = status;
  if (image !== undefined) updateData.image = image;
  if (tags !== undefined) updateData.tags = tags;

  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );
  return NextResponse.json(result);
}

export async function DELETE(request: Request) {
  try {
    const headersList = headers();
    const token = headersList.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is not found' },
        { status: 400 }
      );
    }

    const user = parseJwt(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    const { id } = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('taskmanager');

    // Delete the task
    const taskResult = await db
      .collection('tasks')
      .deleteOne({ _id: new ObjectId(id) });

    if (taskResult.deletedCount === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Delete all comments associated with the task
    const commentsResult = await db
      .collection('comments')
      .deleteMany({ taskId: id });

    return NextResponse.json({
      success: true,
      deletedTask: taskResult.deletedCount,
      deletedComments: commentsResult.deletedCount,
    });
  } catch (error) {
    console.error('Error deleting task and comments:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
