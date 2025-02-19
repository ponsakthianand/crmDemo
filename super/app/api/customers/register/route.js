import client from '@/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'bson';
import crypto from 'crypto';
import generator from 'generate-password';
import { sendCustomerSignupEmail } from './email';
import { validateCustomerData } from './validation';


const customerHandler = async (req) => {
  const { method } = req;
  const headersList = await headers();
  const token = headersList.get('token');
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db('rxtn');
  const collection = db.collection('customers');

  const password = generator.generate({
    length: 10,
    numbers: true
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
      const body = await req.json();
      if (method !== 'POST') {
        return NextResponse.json(
          { error: 'Method not allowed' },
          { status: 405 }
        );
      }

      const { name, email, photo, partner_user_id, partner_id, partner_name, phone, partner_phone } = body;

      // Check if email already exists
      const existingUser = await collection.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email is already registered.' },
          { status: 409 }
        );
      }

      const errors = validateCustomerData(body);
      if (errors.length > 0) {
        return NextResponse.json({ message: 'Validation failed', errors }, { status: 400 });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Email is not valid.' },
          { status: 400 }
        );
      }

      const { salt, hash } = hashPassword(password);

      try {
        const newRequest = {
          name,
          email,
          photo,
          partner_id,
          partner_name,
          partner_user_id,
          partner_phone,
          phone,
          role: 'customer',
          company_id: 'rxt',
          company_name: 'rxt',
          password: hash,
          salt: salt,
          verified: true,
          created_at: new Date(),
          updated_at: new Date(),
          created_by_id: user?.id,
          created_by_name: user?.name,
        };

        const result = await collection.insertOne(newRequest);
        await sendCustomerSignupEmail(email, `Hi ${name}, your RxT account has been created`, password, email, name);
        return NextResponse.json(
          {
            message: 'Customer created successfully',
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

export { customerHandler as POST };
