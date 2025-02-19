import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodbConfig';
import { ObjectId } from 'mongodb';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';

export interface Category {
  _id: string;
  name: string;
  departmentId: string;
  owner: string;
  assignee?: string;
  description?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

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
  const departmentId = searchParams.get('dep');

  const client = await clientPromise;
  const collection = client.db('taskmanager').collection('categories');
  const filter = departmentId ? { departmentId } : {};
  const categories = await collection.find(filter).sort({ name: 1 }).toArray();
  return NextResponse.json(categories);
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
  const collection = client.db('taskmanager').collection('categories');
  const { name, departmentId, owner, assignee, description, color } =
    await request.json();

  if (!name || typeof name !== 'string') {
    return NextResponse.json(
      { error: 'Category name is required and must be a string' },
      { status: 400 }
    );
  }

  if (!departmentId || typeof departmentId !== 'string') {
    return NextResponse.json(
      { error: 'Department ID is required and must be a string' },
      { status: 400 }
    );
  }

  const existingCategory = await collection.findOne({
    name: name.trim(),
    departmentId,
  });
  if (existingCategory) {
    return NextResponse.json(
      { error: 'Category already exists in this department' },
      { status: 400 }
    );
  }

  const result = await collection.insertOne({
    name: name.trim(),
    departmentId,
    owner: owner.trim(),
    assignee: assignee?.trim(),
    description: description?.trim(),
    color: color?.trim(),
    createdAt: new Date(),
    updatedAt: new Date(),
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
  const collection = client.db('taskmanager').collection('categories');
  const { id, name, departmentId, owner, assignee, description, color } =
    await request.json();

  if (!id) {
    return NextResponse.json(
      { error: 'Category ID is required' },
      { status: 400 }
    );
  }

  if (!name || typeof name !== 'string') {
    return NextResponse.json(
      { error: 'Category name is required and must be a string' },
      { status: 400 }
    );
  }

  if (!departmentId || typeof departmentId !== 'string') {
    return NextResponse.json(
      { error: 'Department ID is required and must be a string' },
      { status: 400 }
    );
  }

  const updateData: Partial<Category> = {
    name: name.trim(),
    departmentId,
    owner: owner.trim(),
    assignee: assignee?.trim(),
    description: description?.trim(),
    color: color?.trim(),
    updatedAt: new Date(),
  };

  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );
  return NextResponse.json(result);
}

export async function DELETE(request: Request) {
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
  const collection = client.db('taskmanager').collection('categories');
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json(
      { error: 'Category ID is required' },
      { status: 400 }
    );
  }

  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json(result);
}
