import client from '@/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'bson';

const SpecificPartnersHandler = async (req, { params }) => {
  const { method } = req;
  const partnerId = (await params).partnerId;
  const headersList = await headers();
  const token = headersList.get('token');
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db('rxtn');

  const id = new ObjectId(partnerId);

  switch (method) {
    case 'GET':
      if (user) {
        const partner = await db.collection('partners').findOne({ _id: id });
        return NextResponse.json(partner);
      } else {
        return NextResponse.json({ message: "It's wrong buddy!" });
      }
    case 'DELETE':
      if (user) {
        await db.collection('partners').findOneAndDelete({ _id: id });
        return NextResponse.json({ message: "Successfully Deleted!" });
      } else {
        return NextResponse.json({ message: "It's wrong buddy!" });
      }
    default:
      return NextResponse.json({ message: "It's wrong buddy!" });
  }
};

export { SpecificPartnersHandler as GET, SpecificPartnersHandler as POST, SpecificPartnersHandler as DELETE };
