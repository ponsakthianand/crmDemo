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
        const customer = await db.collection('users').findOne(
          { _id: new ObjectId(user.id) },
          { projection: { email: 1, name: 1, photo: 1, updated_at: 1, created_at: 1, _id: 1, permission: 1 } }
        );
        return NextResponse.json(customer);
      } else {
        return NextResponse.json({ message: "It's wrong buddy!" });
      }
    default:
      return NextResponse.json({ message: "It's wrong buddy!" });
  }
};

export { profileHandler as GET };
