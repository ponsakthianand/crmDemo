import client from '@/src/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import SysInfo from '@/src/app/lib/sysInfo';
import { sendPartnerSignupEmail } from './email';
import { sendForgotPasswordEmail } from '../forgot-password/email';
import generator from 'generate-password';
import crypto from 'crypto';

const usersHandler = async (req) => {
  const { method } = req;
  const dbClient = await client;
  const db = dbClient.db('rxtn');
  const collection = db.collection('customers');
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

      const { salt, hash } = hashPassword(password);

      const { name, email, referralId, phone } = body;


      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Email is not valid.' },
          { status: 400 }
        );
      }

      let referredBy = null;

      if (referralId) {
        referredBy = await db
          .collection('customers')
          .findOne({ partner_user_id: referralId });
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
          phone,
          role: 'partner',
          company_id: 'rxt',
          company_name: 'rxt',
          partner_id: referredBy ? referredBy._id : null,
          partner_name: referredBy ? referredBy.name : null,
          partner_user_id: referralId,
          partner_phone: referredBy ? referredBy.phone : null,
          created_at: new Date(),
          updated_at: new Date(),
          password: hash,
          salt: salt,
          ...userInfo,
        };

        const result = await collection.insertOne(newRequest);
        await sendPartnerSignupEmail(email, `Welcome ${name}! Excited to have you onboard!`, email, name);
        await sendForgotPasswordEmail(
          email,
          `Hi ${name}, Your password for RxT account`,
          password,
          email,
          name
        );
        return NextResponse.json(
          {
            message: 'Customer user created successfully',
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
