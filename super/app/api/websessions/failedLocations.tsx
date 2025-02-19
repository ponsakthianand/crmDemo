
import { NextResponse } from 'next/server';
import client from '@/app/lib/mongodbConfig';
import { ObjectId } from 'mongodb';

export const updateFailedLocations = async () => {
  const dbClient = await client;
  const db = dbClient.db('rxtn');
  const websessions = await db.collection('web-sessions')
    .find({ "location.status": "fail" }) // Only get documents where location.status is 'fail'
    .sort({ updated_at: -1, timestamp: -1 }) // Sort by latest updated_at & timestamp
    .toArray();

  const updates = websessions.map(async (session) => {
    try {
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/locate-ip/${session.ip}`);
      const locationData = await response.json();

      // Update the session's location in the database
      await db.collection('web-sessions').updateOne(
        { _id: new ObjectId(session._id) },
        { $set: { location: locationData } }
      );

      console.log(`Updated location for sessionId: ${session.sessionId}`);
    } catch (error) {
      console.error(`Error fetching location for IP: ${session.ip}`, error);
    }
  });

  // Wait for all updates to complete
  await Promise.all(updates);
};
