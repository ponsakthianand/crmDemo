import client from '@/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'bson';
import crypto from 'crypto';
import { sendApprovalEmail } from './email';
import generator from 'generate-password';

import { NextApiRequest } from 'next';

const usersHandler = async (req: any) => {
  const { method } = req;
  const headersList = await headers();
  const token = headersList.get('token');
  const user = token ? parseJwt(token) : null;
  const dbClient = await client;
  const db = dbClient.db('rxtn');
  const collection = db.collection('partners');

  const password = generator.generate({
    length: 10,
    numbers: true,
  });

  const hashPassword = (password: string) => {
    const salt = crypto.randomBytes(16).toString('hex'); // Generate a random salt
    const hash = crypto
      .createHmac('sha256', salt)
      .update(password)
      .digest('hex'); // Hash the password
    return { salt, hash };
  };

  switch (method) {
    case 'POST':
      const body = await req.json();
      const { parnerId, status } = body;

      if (!parnerId || !status) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      if (method !== 'POST') {
        return NextResponse.json(
          { error: 'Method not allowed' },
          { status: 405 }
        );
      }

      if (user?.role === 'org-admin') {
        // Check if email already exists
        const existingUser = await collection.findOne({
          _id: new ObjectId(parnerId),
        });
        if (!existingUser) {
          return NextResponse.json(
            { error: 'User not available.' },
            { status: 409 }
          );
        }

        const { salt, hash } = hashPassword(password);

        try {
          const newRequest = {
            password: hash,
            salt: salt,
            status: status,
            updated_at: new Date(),
            approved_by_id: user?.id,
            approved_by_name: user?.name,
            approved_at: new Date(),
          };

          const result = await collection.updateOne(
            { _id: new ObjectId(parnerId) },
            {
              $set: newRequest,
            }
          );

          const emailSubject =
            status === 'approved'
              ? `Hi ${existingUser.name}, your RxT account has been approved. Here are your login credentials`
              : `Hi ${existingUser.name}, Your RxT Account Has Been Suspended`;

          await sendApprovalEmail(
            existingUser.email,
            emailSubject,
            password,
            existingUser.email,
            existingUser.name,
            status
          );
          return NextResponse.json(
            {
              message: `Partner user ${status} successfully`,
              requestId: result.upsertedId,
            },
            { status: 201 }
          );
        } catch (error) {
          console.error(error);
          return NextResponse.json(
            {
              error: 'Something went wrong',
              details: (error as Error).message,
            },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

    default:
      return NextResponse.json(
        { message: "It's wrong buddy!" },
        { status: 400 }
      );
  }
};

export { usersHandler as POST };
