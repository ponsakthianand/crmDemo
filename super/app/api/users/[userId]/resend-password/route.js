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

  const password = generator.generate({
    length: 10,
    numbers: true,
  });

  const hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex'); // Generate a random salt
    const hash = crypto
      .createHmac('sha256', salt)
      .update(password)
      .digest('hex'); // Hash the password
    return { salt, hash };
  };

  switch (method) {
    case 'POST':
      if (method !== 'POST') {
        return NextResponse.json(
          { error: 'Method not allowed' },
          { status: 405 }
        );
      }

      // Check if email already exists
      const existingUser = await collection.findOne({ _id: new ObjectId(userId) });
      if (!existingUser) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      const { salt, hash } = hashPassword(password);

      try {
        const newRequest = {
          password: hash,
          salt: salt,
          ...userInfo,
        };

        const result = await collection.updateOne({ _id: new ObjectId(userId) }, { $set: newRequest });
        await sendAdminSignupEmail(
          existingUser?.email,
          `Hi ${existingUser?.name}, your Rxt CRM new password`,
          password,
          existingUser?.email,
          existingUser?.name
        );
        return NextResponse.json(
          {
            message: 'Password sent to user',
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

export { usersHandler as POST };
