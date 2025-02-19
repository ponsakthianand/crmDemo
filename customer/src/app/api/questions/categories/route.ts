import { NextResponse } from 'next/server';
import client from '@/src/app/lib/mongodbConfig';

const SpecificCategory = async (req: Request) => {
  const { method } = req;
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get('cat');
  const dbClient = await client;
  const db = dbClient.db('qa_database');

  switch (method) {
    case 'GET':
      const customer = await db
        .collection('categories')
        .findOne({ vagaiId: cat });
      return NextResponse.json(customer);
    default:
      return NextResponse.json({ message: "It's wrong buddy!" });
  }
};

export { SpecificCategory as GET };
