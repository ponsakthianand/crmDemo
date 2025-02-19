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
        const partners = await db.collection('partners').find().toArray();
        const orders = await db
          .collection('orders')
          .find({
            ...filters,
            referralId: new ObjectId(user?.id),
            status: 'paid',
          })
          .sort({ createdAt: -1 })
          .toArray();

        const enrichedOrders = orders.map((order) => {
          if (order.referralId) {
            const partner = partners.find(
              (p) => p._id.toString() === order.referralId.toString()
            );
            if (partner) {
              return {
                ...order,
                partner: {
                  name: partner.name,
                  email: partner.email,
                  phone: partner.phone,
                  _id: partner._id,
                },
              };
            }
          }
          return { ...order, partner: null };
        });

        return NextResponse.json(enrichedOrders);
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
