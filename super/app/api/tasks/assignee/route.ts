import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodbConfig';
import { ObjectId } from 'mongodb';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';

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
  const collection = client.db('rxtn').collection('users');
  const departments = await collection.find({}).sort({ name: 1 }).toArray();
  return NextResponse.json(departments);
}
