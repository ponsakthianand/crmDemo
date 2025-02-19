import client from '@/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'bson';

const SpecificCustomerHandler = async (req, { params }) => {
  const { method } = req;
  const customerId = (await params).customerId;
  const headersList = await headers();
  const token = headersList.get('token');
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db('rxtn');

  const id = new ObjectId(customerId);


  switch (method) {
    case 'GET':
      if (user) {
        const customer = await db.collection('customers').findOne({ _id: id });
        return NextResponse.json(customer);
      } else {
        return NextResponse.json({ message: "It's wrong buddy!" });
      }
    case 'DELETE':
      if (user) {
        const customer = await db.collection('customers').findOneAndDelete({ _id: id });
        return NextResponse.json({ message: "Successfully Deleted!" });
      } else {
        return NextResponse.json({ message: "It's wrong buddy!" });
      }
    default:
      return NextResponse.json({ message: "It's wrong buddy!" });
  }
};

export { SpecificCustomerHandler as GET, SpecificCustomerHandler as POST, SpecificCustomerHandler as DELETE };
