import client from '@/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'mongodb';

export async function GET(
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
  const mfDb = dbClient.db('mutual_funds');
  const rxDb = dbClient.db('rxtn');

  try {
    const fundTypeId = new ObjectId(params.id);
    const fundCollection = mfDb.collection('fund_types');
    const fundType = await fundCollection.findOne({ _id: fundTypeId });

    if (!fundType) {
      return NextResponse.json(
        { error: 'Fund type not found' },
        { status: 404 }
      );
    }

    // Extract user IDs
    const userIds = new Set<string>();
    userIds.add(fundType.created_by);
    if (fundType.updated_by) userIds.add(fundType.updated_by);
    fundType.fundNames.forEach((fundName: any) => {
      userIds.add(fundName.created_by);
      if (fundName.updated_by) userIds.add(fundName.updated_by);
    });

    // Convert user IDs to ObjectId
    const objectIds = Array.from(userIds)
      .filter((id) => ObjectId.isValid(id))
      .map((id) => new ObjectId(id));

    // Fetch users from rxtn database
    const usersCollection = rxDb.collection('users');
    const users = await usersCollection
      .find({ _id: { $in: objectIds } })
      .toArray();

    // Create a user lookup map
    const userMap = new Map(
      users.map((user) => [user._id.toString(), user.name])
    );

    // Attach names to fundType and fundNames
    const enrichedFundType: any = {
      ...fundType,
      created_by_name:
        userMap.get(fundType.created_by?.toString()) || 'Unknown',
      fundNames: fundType.fundNames.map((fundName: any) => {
        const enrichedFundName: any = {
          ...fundName,
          created_by_name:
            userMap.get(fundName.created_by?.toString()) || 'Unknown',
        };
        if (fundName.updated_by) {
          enrichedFundName.updated_by_name =
            userMap.get(fundName.updated_by?.toString()) || 'Unknown';
        }
        return enrichedFundName;
      }),
    };

    if (fundType.updated_by) {
      enrichedFundType.updated_by_name =
        userMap.get(fundType.updated_by?.toString()) || 'Unknown';
    }

    return NextResponse.json(enrichedFundType, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch fund type' },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const result = await collection.updateOne(
      { _id: fundTypeId },
      { $set: { name, updated_by: user.id, updated_at: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Fund type not found' },
        { status: 404 }
      );
    }

    const updatedFundType = await collection.findOne({ _id: fundTypeId });
    return NextResponse.json(updatedFundType, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to update fund type' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    const fundTypeId = new ObjectId(params.id);
    const result = await collection.deleteOne({ _id: fundTypeId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Fund type not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Fund type deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to delete fund type' },
      { status: 500 }
    );
  }
}
