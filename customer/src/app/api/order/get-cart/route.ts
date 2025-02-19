import { parseJwt } from '@/global';
import client from '@/src/app/lib/mongodbConfig';
import { getSession } from 'next-auth/react';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

async function handler(req, res) {
  const { method } = req;
  const headersList = await headers();
  const token = headersList.get('token');
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db('rxtn');

  if (method === 'GET') {
    const session = await getSession({ req });
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const cart = await db
      .collection('carts')
      .findOne({ userId: session.user.id });

    return NextResponse.json({ cart: cart?.cart || [] }, { status: 200 });
  } else {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }
}

export { handler as GET };
