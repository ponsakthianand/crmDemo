import client from '@/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'bson';

const profileHandler = async (req) => {
  const { method } = req;
  const headersList = await headers();
  const token = headersList.get('token');
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db('rxtn');


  switch (method) {
    case 'GET':
      if (user) {
        const customer = await db.collection('customers').find({},
          { projection: { email: 1, name: 1, photo: 1, updated_at: 1, created_at: 1, _id: 1 } }
        ).sort({ name: 1 })
          .toArray();
        return NextResponse.json(customer);
      } else {
        return NextResponse.json({ message: "It's wrong buddy!" });
      }
    default:
      return NextResponse.json({ message: "It's wrong buddy!" });
  }
};

export { profileHandler as GET };
