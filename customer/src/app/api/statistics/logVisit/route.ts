import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import client from '@/src/app/lib/mongodbConfig';

interface Location {
  city: string;
  region: string;
  country: string;
}

interface Page {
  url: string;
  visitTime: string;
  duration: number; // Duration in seconds
}

interface VisitData {
  sessionId: string;
  ip: string;
  userAgent: string;
  location: Location;
  pages: Page[];
  referralId: string | null;
}

const handler = async (req) => {
  const { method } = req;
  const dbClient = await client;
  const db = dbClient.db('rxtn');

  if (method !== 'POST') {
    return NextResponse.json({ message: "It's wrong buddy!" }, { status: 405 });
  }
  const body = await req.json();
  const { sessionId, ip, userAgent, location, pages, referralId }: VisitData =
    body;

  if (!sessionId || !ip || !userAgent || !location || !pages) {
    return NextResponse.json({ message: "It's wrong buddy!" }, { status: 400 });
  }

  try {
    const existingSession = await db
      .collection('web-sessions')
      .findOne({ sessionId });

    if (existingSession) {
      // Update the session if it exists
      const updates: any = {
        $set: {
          ip,
          userAgent,
          location,
          updated_at: new Date(),
        },
        $push: {
          pages: {
            $each: pages, // Add the pages to the existing array
          },
        },
      };

      // Add referralId to an array only if it is different
      if (referralId && referralId !== existingSession.referralId) {
        updates.$addToSet = {
          referralIds: referralId, // Ensure referralId is unique in the array
        };
      }

      await db
        .collection<VisitData>('web-sessions')
        .updateOne({ sessionId }, updates);
    } else {
      // Create a new session if it doesn't exist
      await db.collection('web-sessions').insertOne({
        sessionId,
        ip,
        userAgent,
        location,
        pages,
        referralId: referralId || null,
        timestamp: new Date(),
        updated_at: new Date(),
      });
    }

    return NextResponse.json({ message: 'Visit logged successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "It's wrong buddy!" }, { status: 500 });
  }
};

export { handler as POST };
