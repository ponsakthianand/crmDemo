import client from '@/src/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'bson';

const ordersHandler = async (req) => {
  const { method } = req;
  const headersList = await headers();
  const token = headersList.get('token');
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db('rxtn');

  switch (method) {
    case 'POST':
      if (user) {
        const body = await req.json();
        const { startDate, endDate } = body;
        const filters: { createdAt?: { $gte: Date; $lte: Date } } = {};
        if (startDate && endDate) {
          filters.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          };
        }
        const currentUser = await db
          .collection('partners')
          .findOne({ _id: new ObjectId(user.id) });

        const clicks = await db
          .collection('web-sessions')
          .find({ ...filters, referralId: currentUser.partner_user_id })
          .sort({ updated_at: -1, timestamp: -1 })
          .toArray();

        return NextResponse.json(clicks);
      } else {
        return NextResponse.json(
          { message: 'Unauthorized access!' },
          { status: 401 }
        );
      }

    default:
      return NextResponse.json(
        { message: 'Method not allowed!' },
        { status: 405 }
      );
  }
};

export { ordersHandler as POST };
