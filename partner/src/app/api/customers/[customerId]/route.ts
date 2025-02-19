import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { ObjectId } from 'bson';
import { parseJwt } from '@/global';
import client from '@/src/app/lib/mongodbConfig';

const SpecificCustomerHandler = async (req, { params }) => {
  const { method } = req;
  const paramValue = (await params).customerId;
  const headersList = await headers();
  const token = headersList.get('token');
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db('rxtn');

  switch (method) {
    case 'GET':
      if (user) {
        const customer = await db
          .collection('customers')
          .findOne({ _id: new ObjectId(paramValue) });
        return NextResponse.json(customer);
      } else {
        return NextResponse.json({ message: "It's wrong buddy!" });
      }
    default:
      return NextResponse.json({ message: "It's wrong buddy!" });
  }
};

export { SpecificCustomerHandler as GET };
