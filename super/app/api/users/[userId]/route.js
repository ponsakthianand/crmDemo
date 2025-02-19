import client from '@/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'bson';

const percentage = (percentage, total) => (total * percentage) / 100;
const annualCalculation = (value) => value * 12;

const ftHandler = async (req, { params }) => {
  const { method } = req;
  const user_id = (await params).userId;
  const headersList = await headers();
  const token = headersList.get('token');
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db('rxtn');
  const collection = await db.collection('users');

  const id = new ObjectId(user_id);

  switch (method) {
    case 'GET':
      if (user) {
        const financeTracker = collection.find({ _id: id })
          .sort({ created_at: -1 }).toArray();
        return NextResponse.json(financeTracker);
      } else {
        return NextResponse.json({ message: "It's wrong buddy!" });
      }
    case 'DELETE':
      if (user) {
        collection.findOneAndDelete({ _id: id });
        return NextResponse.json({ message: "Successfully Deleted!" });
      } else {
        return NextResponse.json({ message: "It's wrong buddy!" });
      }
    default:
      return NextResponse.json({ message: "It's wrong buddy!" });
  }
};

export { ftHandler as GET, ftHandler as DELETE };