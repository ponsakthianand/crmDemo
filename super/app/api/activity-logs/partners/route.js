import client from '@/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'bson';

const customersHandler = async (req) => {
  const { method } = req;
  const headersList = await headers();
  const token = headersList.get('token');
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db('rxtn');

  switch (method) {
    case 'GET':
      if (user) {
        const customer = await db.collection('partners_login_activity').find().sort({ login_time: -1 }).toArray();
        return NextResponse.json(customer);
      } else {
        return NextResponse.json({ message: "It's wrong buddy!" });
      }

    default:
      return NextResponse.json({ message: "It's wrong buddy!" });
  }
};

export { customersHandler as GET, };