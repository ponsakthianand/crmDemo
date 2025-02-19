import client from '@/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'bson';

const ticketsHandler = async (req, { params }) => {
  const { method } = req;
  const { customerId } = await params;
  const headersList = await headers();
  const token = headersList.get('token');
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db('rxtn');
  const collection = db.collection('tickets');

  switch (method) {
    case 'GET':
      // Get all tickets for a specific customer
      return getTickets(customerId, collection, user);
    default:
      return NextResponse.json({ message: "It's wrong buddy!" }, { status: 403 });
  }
};

export { ticketsHandler as GET, ticketsHandler as POST, ticketsHandler as PUT, ticketsHandler as DELETE };


// Handler to get all tickets for a specific customer
async function getTickets(customerId, collection, user) {

  if (!customerId) {
    return NextResponse.json({ error: 'Missing customerId' }, { status: 400 });
  }

  try {
    if (user?.role === 'org-admin') {
      const notes = await collection.find({ customer: customerId }).sort({ created_at: -1 }).toArray();
      return NextResponse.json(notes, { status: 200 });
    } else {
      return NextResponse.json({ error: 'You are not allowed to perform this operation' }, { status: 403 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}