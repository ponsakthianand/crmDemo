import client from '@/app/lib/mongodbConfig';
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
    case 'GET':
      if (user) {
        const partners = await db.collection('partners').find().toArray();
        const orders = await db.collection('orders').find().sort({ createdAt: -1 }).toArray();

        const enrichedOrders = orders.map((order) => {
          if (order.referralId) {
            const partner = partners.find((p) => p._id.toString() === order.referralId.toString());
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
        return NextResponse.json({ message: "Unauthorized access!" }, { status: 401 });
      }

    default:
      return NextResponse.json({ message: "Method not allowed!" }, { status: 405 });
  }
};

export { ordersHandler as GET };
