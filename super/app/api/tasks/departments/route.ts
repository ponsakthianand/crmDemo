import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodbConfig';
import { ObjectId } from 'mongodb';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';

export interface Department {
  _id: string;
  name: string;
  description?: string;
  owner: string;
  assignee?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

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
  const collection = client.db('taskmanager').collection('departments');
  const departments = await collection.find({}).sort({ name: 1 }).toArray();
  return NextResponse.json(departments);
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
  const collection = client.db('taskmanager').collection('departments');
  const { name, description, owner, assignee, color } = await request.json();

  if (!name || typeof name !== 'string') {
    return NextResponse.json(
      { error: 'Department name is required and must be a string' },
      { status: 400 }
    );
  }

  const existingDepartment = await collection.findOne({ name: name.trim() });
  if (existingDepartment) {
    return NextResponse.json(
      { error: 'Department already exists' },
      { status: 400 }
    );
  }

  const result = await collection.insertOne({
    name: name.trim(),
    description: description?.trim(),
    owner,
    assignee: assignee || null,
    color: color || null,
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
  const collection = client.db('taskmanager').collection('departments');
  const {
    _id: id,
    name,
    description,
    owner,
    assignee,
    color,
  } = await request.json();

  if (!id) {
    return NextResponse.json(
      { error: 'Department ID is required' },
      { status: 400 }
    );
  }

  if (!name || typeof name !== 'string') {
    return NextResponse.json(
      { error: 'Department name is required and must be a string' },
      { status: 400 }
    );
  }

  const updateData: Partial<Department> = {
    name: name.trim(),
    description: description?.trim(),
    owner,
    assignee: assignee || null,
    color: color || null,
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
  const collection = client.db('taskmanager').collection('departments');
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json(
      { error: 'Department ID is required' },
      { status: 400 }
    );
  }

  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json(result);
}
