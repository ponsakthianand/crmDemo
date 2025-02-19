import client from '@/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'bson';

async function OrderEdithandler(req, { params }) {
  const { method } = req;
  const headersList = await headers();
  const token = headersList.get('token');
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db('rxtn');
  const collection = db.collection('orders');

  try {
    switch (method) {
      case 'PUT': {
        if (user?.role === 'org-admin') {
          const body = await req.json();
          const { email, isCustomer } = body;

          // Update the order
          const updatedOrder = {
            isCustomer,
            updated_at: new Date(),
            updated_by_id: user?.id,
            updated_by_name: user?.name,
          };


          const result = await collection.updateMany(
            { 'userInfo.email': email },
            {
              $set: updatedOrder
            }
          );
          return NextResponse.json(result, { status: 200 });
        } else {
          return NextResponse.json({ message: 'You are not allowed' }, { status: 403 });
        }
      }
      default:
        return NextResponse.json({ message: `Method ${method} not allowed` }, { status: 405 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export { OrderEdithandler as PUT };