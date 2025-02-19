import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { ObjectId } from 'bson';
import { parseJwt } from '@/global';
import client from '@/src/app/lib/mongodbConfig';

const SpecificCourse = async (req, { params }) => {
  const { method } = req;
  const paramValue = (await params).slug;
  const headersList = await headers();
  const token = headersList.get('token');
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db('rxtn');

  switch (method) {
    case 'GET':
      const customer = await db
        .collection('courses')
        .findOne({ slug: paramValue });
      return NextResponse.json(customer);
    default:
      return NextResponse.json({ message: "It's wrong buddy!" });
  }
};

export { SpecificCourse as GET };
