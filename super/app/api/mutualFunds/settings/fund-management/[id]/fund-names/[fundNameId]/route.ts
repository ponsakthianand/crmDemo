import client from '@/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'mongodb';

export async function PUT(
  req: Request,
  { params }: { params: { id: string; fundNameId: string } }
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
    const fundNameId = new ObjectId(params.fundNameId);

    const result = await collection.updateOne(
      { _id: fundTypeId, 'fundNames._id': fundNameId },
      {
        $set: {
          'fundNames.$.name': name,
          'fundNames.$.updated_at': new Date(),
          'fundNames.$.updated_by': user.id,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Fund type or fund name not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ _id: fundNameId, name }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to update fund name' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; fundNameId: string } }
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
    const fundTypeId = new ObjectId(params.id);
    const fundNameId = new ObjectId(params.fundNameId);

    const result = await collection.updateOne(
      { _id: fundTypeId },
      { $pull: { fundNames: { _id: fundNameId } } as any }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Fund type not found' },
        { status: 404 }
      );
    }

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Fund name not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Fund name deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to delete fund name' },
      { status: 500 }
    );
  }
}
