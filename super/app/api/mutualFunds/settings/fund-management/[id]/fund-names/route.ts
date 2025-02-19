import client from '@/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'mongodb';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const headersList = headers();
  const token = headersList.get('token');
  const user = parseJwt(token || '');

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
  }

  const dbClient = await client;
  const db = dbClient.db('mutual_funds');
  const collection = db.collection('fund_types');

  try {
    const { name } = await req.json();
    const fundTypeId = new ObjectId(params.id);

    const newFundName = {
      _id: new ObjectId(),
      name,
      created_at: new Date(),
      created_by: user.id,
    };

    const result = await collection.updateOne(
      { _id: fundTypeId },
      { $push: { fundNames: newFundName } as any }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Fund type not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(newFundName, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to add fund name' },
      { status: 500 }
    );
  }
}
