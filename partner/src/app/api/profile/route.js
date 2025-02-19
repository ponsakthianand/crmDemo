import client from '@/src/app/lib/mongodbConfig';
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
        const customer = await db.collection('partners').findOne(
          { _id: new ObjectId(user.id) },
          { projection: { company_id: 0, company_name: 0, created_by_id: 0, created_by_name: 0, password: 0, salt: 0, otp: 0, otp_expires_at: 0, userInfo: 0 } }
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
