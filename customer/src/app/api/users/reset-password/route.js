import client from '@/src/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt, dateToLocalTimeDateYear } from '@/global';
import { ObjectId } from 'bson';
import crypto from 'crypto';
import { ResetPasswordEmail } from './email';
import generator from 'generate-password';
import SysInfo from '@/src/app/lib/sysInfo';

const usersHandler = async (req) => {
  const { method } = req;
  const headersList = await headers();
  const token = headersList.get('token');
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db('rxtn');
  const collection = db.collection('customers');
  const body = await req.json();
  const { id, new_password, current_password } = body;

  const userInfo = await SysInfo();

  const hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex'); // Generate a random salt
    const hash = crypto
      .createHmac('sha256', salt)
      .update(password)
      .digest('hex'); // Hash the password
    return { salt, hash };
  };

  const verifyPassword = (inputPassword, storedHash, storedSalt) => {
    const inputHash = crypto.createHmac("sha256", storedSalt).update(inputPassword).digest("hex");
    return inputHash === storedHash;
  };

  switch (method) {
    case 'POST':
      if (user) {
        if (method !== 'POST') {
          return NextResponse.json(
            { error: 'Method not allowed' },
            { status: 405 }
          );
        }

        // Check if email already exists
        const existingUser = await collection.findOne({ _id: new ObjectId(id) });
        if (!existingUser) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        // Verify the password
        const isValidPassword = verifyPassword(current_password, existingUser.password, existingUser.salt);

        if (!isValidPassword) {
          return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
        }

        const { salt, hash } = hashPassword(new_password);

        try {
          const newRequest = {
            password: hash,
            salt: salt,
            ...userInfo,
          };

          const result = await collection.updateOne({ _id: new ObjectId(existingUser?._id) }, { $set: newRequest });
          await ResetPasswordEmail(
            existingUser?.email,
            `Your RxT Partner password has been reset`,
            dateToLocalTimeDateYear(new Date()),
            existingUser?.name
          );
          return NextResponse.json(
            {
              message: 'Password has been reset',
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
      } else {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
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
