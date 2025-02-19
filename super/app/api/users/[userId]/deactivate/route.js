import client from '@/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'bson';
import crypto from 'crypto';
import { sendAdminSignupEmail } from '@/app/api/users/register/email';
import generator from 'generate-password';
import SysInfo from '@/app/lib/sysInfo';

const usersHandler = async (req, { params }) => {
  const { method } = req;
  const userId = (await params).userId;
  const headersList = await headers();
  const token = headersList.get('token');
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db('rxtn');
  const collection = db.collection('users');

  const userInfo = await SysInfo();

  switch (method) {
    case 'POST':
      if (method !== 'POST') {
        return NextResponse.json(
          { error: 'Method not allowed' },
          { status: 405 }
        );
      }

      try {
        const result = await collection.updateOne({ _id: new ObjectId(userId) }, { $set: { active: false } });
        return NextResponse.json(
          {
            message: 'User deactivated',
            requestId: result.insertedId,
          },
          { status: 201 }
        );
      } catch (error) {
        console.error(error);
        return NextResponse.json(
          { error: 'Something went wrong', details: error.message },
          { status: 500 }
        );
      }
    case 'PUT':
      if (method !== 'PUT') {
        return NextResponse.json(
          { error: 'Method not allowed' },
          { status: 405 }
        );
      }

      try {
        const result = await collection.updateOne({ _id: new ObjectId(userId) }, { $set: { active: true } });
        return NextResponse.json(
          {
            message: 'User deactivated',
            requestId: result.insertedId,
          },
          { status: 201 }
        );
      } catch (error) {
        console.error(error);
        return NextResponse.json(
          { error: 'Something went wrong', details: error.message },
          { status: 500 }
        );
      }
    default:
      return NextResponse.json(
        { message: "It's wrong buddy!" },
        { status: 400 }
      );
  }
};

export { usersHandler as POST, usersHandler as PUT };
