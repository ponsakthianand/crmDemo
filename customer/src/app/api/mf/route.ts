import client from '@/src/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';

export async function POST(req, res) {
  if (req.method === 'POST') {
    const headersList = await headers();
    const token = headersList.get('token');
    const user = parseJwt(token);

    let filter;
    if (user?.id) {
      if (user?.role === 'customer') {
        filter = { customer_id: user?.id };
      } else if (user?.role === 'partner') {
        filter = {};
      } else if (user?.role === 'admin') {
        filter = {};
      }

      try {
        const dbClient = await client;
        const db = dbClient.db('rxtn');
        const mutualFund = await db
          .collection('mf_process')
          .find(filter)
          .sort({ created_at: -1 })
          .toArray();
        return NextResponse.json(mutualFund);
      } catch (e) {
        console.error(e);
      }
    }
  } else {
    return NextResponse.json({ message: "It's wrong buddy!" });
  }
}
