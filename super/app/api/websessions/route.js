import client from '@/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'bson';
import { updateFailedLocations } from './failedLocations';

const websessionsHandler = async (req) => {
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
        // await updateFailedLocations();
        const websessions = await db.collection('web-sessions').find().sort({ updated_at: -1, timestamp: -1 }).toArray();
        const enrichedWebsessions = websessions.map((websession) => {
          if (websession.referralId) {
            const partner = partners.find((p) => p.partner_user_id.toString() === websession.referralId.toString());
            if (partner) {
              return {
                ...websession,
                partner: {
                  name: partner.name,
                  email: partner.email,
                  phone: partner.phone,
                  _id: partner._id,
                },
              };
            }
          }
          return { ...websession, partner: null };
        });

        return NextResponse.json(enrichedWebsessions);
      } else {
        return NextResponse.json({ message: "Unauthorized access!" }, { status: 401 });
      }

    default:
      return NextResponse.json({ message: "Method not allowed!" }, { status: 405 });
  }
};

export { websessionsHandler as GET };
