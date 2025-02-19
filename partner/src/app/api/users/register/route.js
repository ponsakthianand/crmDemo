import client from '@/src/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import SysInfo from '@/src/app/lib/sysInfo';
import { sendPartnerSignupEmail } from './email';

const usersHandler = async (req) => {
  const { method } = req;
  const dbClient = await client;
  const db = dbClient.db('rxtn');
  const collection = db.collection('partners');
  const userInfo = await SysInfo();

  switch (method) {
    case 'POST':
      const body = await req.json();
      if (method !== 'POST') {
        return NextResponse.json(
          { error: 'Method not allowed' },
          { status: 405 }
        );
      }

      const { name, email, partner_user_id, phone } = body;

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Email is not valid.' },
          { status: 400 }
        );
      }

      // Check if email already exists
      const existingUser = await collection.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email is already registered.' },
          { status: 409 }
        );
      }

      if (!name || !email) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }


      try {
        const newRequest = {
          name,
          email,
          partner_user_id, phone,
          role: 'partner',
          company_id: 'rxt',
          company_name: 'rxt',
          verified: true,
          status: "pending",
          created_at: new Date(),
          updated_at: new Date(),
          ...userInfo,
        };

        const result = await collection.insertOne(newRequest);
        await sendPartnerSignupEmail(email, `Welcome ${name}! Welcome to RxT Partnership Program`, email, name);
        return NextResponse.json(
          {
            message: 'Partner user created successfully',
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
