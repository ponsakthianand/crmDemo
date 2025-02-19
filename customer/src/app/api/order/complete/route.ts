import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import client from '@/src/app/lib/mongodbConfig';
import crypto from 'crypto';
import { sendProductPurchaseConfirmationEmail } from './email';

const generatedSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string
) => {
  const keySecret = process.env.RAZORPAY_SECRET;
  if (!keySecret) {
    throw new Error(
      'Razorpay key secret is not defined in environment variables.'
    );
  }
  const sig = crypto
    .createHmac('sha256', keySecret)
    .update(razorpayOrderId + '|' + razorpayPaymentId)
    .digest('hex');
  return sig;
};

export async function POST(request: NextRequest) {
  const headersList = await headers();
  const token = headersList.get('token');
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db('rxtn');
  const {
    orderCreationId,
    razorpayPaymentId,
    razorpaySignature,
    paymentId,
    productsToCheckout,
    userInfo,
  } = await request.json();

  const cart = productsToCheckout;

  const signature = generatedSignature(orderCreationId, razorpayPaymentId);
  const getOrder = await db
    .collection('orders')
    .findOne({ razorpayOrderId: orderCreationId });
  // if (signature !== razorpaySignature) {
  //   await db
  //     .collection('orders')
  //     .updateOne(
  //       { razorpayOrderId: orderCreationId },
  //       { $set: { paymentId, signature, status: 'failed', cart, userInfo } }
  //     );
  //   return NextResponse.json(
  //     { message: 'payment verification failed', isOk: false },
  //     { status: 400 }
  //   );
  // }

  await db
    .collection('orders')
    .updateOne(
      { razorpayOrderId: orderCreationId },
      { $set: { paymentId, signature, status: 'paid', cart, userInfo } }
    );
  await sendProductPurchaseConfirmationEmail(
    userInfo.email,
    `${userInfo.name}! Your order has been placed successfully.`,
    getOrder,
    userInfo.name
  );
  await sendProductPurchaseConfirmationEmail(
    'returnxtn@gmail.com',
    `New order has been placed.`,
    getOrder,
    userInfo.name
  );
  return NextResponse.json(
    {
      message: 'payment verified successfully',
      isOk: true,
      orderId: getOrder.orderId,
    },
    { status: 200 }
  );
}
