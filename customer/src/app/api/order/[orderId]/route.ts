import client from '@/src/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'bson';

const orderHandler = async (req, { params }) => {
  const { method } = req;
  const orderId = (await params).orderId;
  const headersList = await headers();
  const token = headersList.get('token');
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db('rxtn');

  switch (method) {
    case 'GET':
      const customer = await db.collection('orders').findOne({ orderId });
      return NextResponse.json(customer);

    default:
      return NextResponse.json({ message: "It's wrong buddy!" });
  }
};

export { orderHandler as GET };
