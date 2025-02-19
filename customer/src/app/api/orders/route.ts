import client from '@/src/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'bson';

const ordersHandler = async (req) => {
  const { method } = req;
  const headersList = await headers();
  const token = headersList.get('token');
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db('rxtn');

  switch (method) {
    case 'GET':
      if (user) {
        const orders = await db
          .collection('orders')
          .find({
            $or: [
              { _id: new ObjectId(user?.id) },
              { 'userInfo.email': user?.email },
            ],
          })
          .sort({ createdAt: -1 })
          .toArray();

        return NextResponse.json(orders);
      } else {
        return NextResponse.json(
          { message: 'Unauthorized access!' },
          { status: 401 }
        );
      }

    default:
      return NextResponse.json(
        { message: 'Method not allowed!' },
        { status: 405 }
      );
  }
};

export { ordersHandler as GET };
