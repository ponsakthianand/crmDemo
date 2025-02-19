import client from '@/src/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';

const eventsHandler = async (req, res) => {
  const { method } = req;
  const headersList = await headers();
  const token = headersList.get('token');
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db('rxtn');

  switch (method) {
    case 'GET': {
      const eventsList = await db
        .collection('events')
        .find(
          { published: true },
          {
            projection: {
              admin_id: 0,
              creator_role: 0,
              created_by: 0,
              created_at: 0,
              slugId: 0,
              updated_at: 0,
            },
          }
        )
        .sort({ order: 1, created_at: -1 })
        .toArray();
      return NextResponse.json(eventsList);
    }
    default:
      return NextResponse.json({ message: 'Invalid method' });
  }
};

export { eventsHandler as GET, eventsHandler as POST };
