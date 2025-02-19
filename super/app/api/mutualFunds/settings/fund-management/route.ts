import client from '@/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'mongodb';

export async function GET(req: Request) {
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
    // Fetch fund types
    const fundCollection = mfDb.collection('fund_types');
    const fundTypes = await fundCollection.find({}).toArray();

    // Extract unique user IDs from created_by and updated_by fields
    const userIds = new Set<string>();
    fundTypes.forEach((fund) => {
      userIds.add(fund.created_by);
      if (fund.updated_by) userIds.add(fund.updated_by);
      fund.fundNames.forEach((fundName: any) => {
        userIds.add(fundName.created_by);
        if (fundName.updated_by) userIds.add(fundName.updated_by);
      });
    });

    // Convert userIds to ObjectId format (only valid ones)
    const objectIds = Array.from(userIds)
      .filter((id) => ObjectId.isValid(id))
      .map((id) => new ObjectId(id));

    // Fetch users from the rxtn database
    const usersCollection = rxDb.collection('users');
    const users = await usersCollection
      .find({ _id: { $in: objectIds } })
      .toArray();

    // Create a user lookup map
    const userMap = new Map(
      users.map((user) => [user._id.toString(), user.name])
    );

    // Map user names to fund types and fund names
    const enrichedFundTypes = fundTypes.map((fund) => {
      const enrichedFund: any = {
        ...fund,
        created_by_name: userMap.get(fund.created_by?.toString()) || 'Unknown',
        fundNames: fund.fundNames.map((fundName: any) => {
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

      if (fund.updated_by) {
        enrichedFund.updated_by_name =
          userMap.get(fund.updated_by?.toString()) || 'Unknown';
      }

      return enrichedFund;
    });

    return NextResponse.json(enrichedFundTypes, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch fund types' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
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
    const newFundType = {
      name,
      fundNames: [],
      created_at: new Date(),
      created_by: user.id,
    };

    const result = await collection.insertOne(newFundType);
    return NextResponse.json(
      { ...newFundType, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to add fund type' },
      { status: 500 }
    );
  }
}
