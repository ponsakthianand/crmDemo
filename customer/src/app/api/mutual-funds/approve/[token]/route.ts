import client from '@/src/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { ObjectId } from 'bson';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export interface JWTType {
  mfId: string;
  exp: number;
  iat: number;
}

export async function GET(req, { params }) {
  const { token } = params;

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JWTType;
    const dbClient = await client;
    const db = dbClient.db('mutual_funds');
    const collection = db.collection('mutual_funds_requests');

    const request = await collection.findOne({
      _id: new ObjectId(decoded.mfId),
    });

    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json({ request }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid or expired link' },
      { status: 400 }
    );
  }
}

export async function POST(req, { params }) {
  const { token } = params;

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JWTType;
    const dbClient = await client;
    const db = dbClient.db('mutual_funds');
    const collection = db.collection('mutual_funds_requests');

    const request = await collection.findOne({
      _id: new ObjectId(decoded.mfId),
    });

    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (request.process_status !== 'Open') {
      return NextResponse.json(
        { error: 'Request already processed' },
        { status: 400 }
      );
    }

    await collection.updateOne(
      { _id: new ObjectId(decoded.mfId) },
      {
        $set: {
          status: 'Approved',
          process_status: 'Closed',
          approved_at: new Date(),
          approved_by: request.customer_name,
          approved_by_id: request.customer_id,
          approved_through: 'MagicLink',
        },
      }
    );

    return NextResponse.json(
      { message: 'Request approved successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid or expired link' },
      { status: 400 }
    );
  }
}
