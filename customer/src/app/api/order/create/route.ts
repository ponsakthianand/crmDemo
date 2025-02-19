import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY!,
  key_secret: process.env.RAZORPAY_SECRET,
});

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import client from '@/src/app/lib/mongodbConfig';

export async function POST(request: NextRequest) {
  const headersList = await headers();
  const token = headersList.get('token');
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db('rxtn');

  const { amount, productsToCheckout, partner_ref, currency, userInfo } =
    (await request.json()) as {
      amount: number;
      productsToCheckout: any[];
      currency: string;
      partner_ref: string;
      userInfo: any;
    };

  const cart = productsToCheckout;

  let partnerId = null;

  if (partner_ref) {
    const partner = await db
      .collection('partners')
      .findOne({ partner_user_id: partner_ref });
    partnerId = partner ? partner?._id?.toString() : null;
  }
  const getCustomer = await db
    .collection('customers')
    .findOne({ email: userInfo?.email });
  const customer = getCustomer ? getCustomer : null;
  const randomId = Math.random().toString(36).slice(2);

  const order = {
    orderId: randomId,
    amount,
    cart,
    currency: currency,
    referralId: partnerId,
    createdAt: new Date(),
    status: 'pending',
    razorpayOrderId: null,
    userInfo,
    isCustomer: customer ? true : false,
  };

  const result = await db.collection('orders').insertOne(order);

  const options = {
    amount,
    currency: currency,
    receipt: result.insertedId.toString(),
  };

  const razorpayOrder = await razorpay.orders.create(options);

  await db.collection('orders').updateOne(
    { _id: result.insertedId },
    {
      $set: {
        razorpayOrderInfo: razorpayOrder,
        razorpayOrderId: razorpayOrder.id,
      },
    }
  );
  return NextResponse.json({ orderId: razorpayOrder.id }, { status: 200 });
}
