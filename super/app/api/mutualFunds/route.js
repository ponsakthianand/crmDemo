import client from '@/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'bson';

const mfHandler = async (req) => {
  const { method } = req;
  const headersList = headers();
  const token = headersList.get('token');
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db('mutual_funds');
  const collection = db.collection('mutual_funds_requests');

  switch (method) {
    case 'POST': case 'POST': {
      if (!user || user.role !== 'org-admin') {
        return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
      }

      const body = await req.json();
      const requests = body.requests;
      const description = body.description;
      const customerId = body.customerId;
      const customerObjectId = new ObjectId(customerId);
      try {
        if (!Array.isArray(requests) || requests.length === 0) {
          return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
        }
      } catch (error) {
        return NextResponse.json({ error: 'Invalid JSON data' }, { status: 400 });
      }

      const findCustomer = await db.collection('customers').findOne({ _id: customerObjectId });
      if (!findCustomer) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
      }

      // Validate all requests
      for (const req of requests) {
        const { fundType, transactionType, frequency, installmentDate, fromDate, toDate, amount } = req;
        if (!fundType || !transactionType || !amount) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        // if (frequency !== 'OneTime' && (!installmentDate || !fromDate || !toDate)) {
        //   return NextResponse.json({ error: 'Recurring transactions require SIP Due Date, From Date, and To Date' }, { status: 400 });
        // }
      }

      try {
        // Prepare new document structure
        const newRequest = {
          customer_id: customerId,
          customer_name: findCustomer.name,
          created_by_id: user.id,
          created_by_name: user.name,
          created_at: new Date(),
          updated_at: new Date(),
          status: 'Pending',
          process_status: 'Open',
          description: description || '',
          requests: requests.map(req => ({
            ...req,
            fromDate: req.fromDate ? new Date(req.fromDate) : null,
            toDate: req.toDate ? new Date(req.toDate) : null,
          })),
          history: [{
            updated_by_id: user?.id,
            updated_by_name: user?.name,
            updated_at: new Date(),
            description: description || '',
            requests: requests.map(req => ({
              ...req,
              fromDate: req.fromDate ? new Date(req.fromDate) : null,
              toDate: req.toDate ? new Date(req.toDate) : null,
            }))
          }]
        };

        const result = await collection.insertOne(newRequest);

        return NextResponse.json(
          { message: 'Request created successfully', requestId: result.insertedId },
          { status: 201 }
        );
      } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong', details: error.message }, { status: 500 });
      }
    }

    case 'GET': {
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
      }

      try {
        const mutualFunds = await collection.find({}).sort({ created_at: -1 }).toArray();
        if (!mutualFunds.length) {
          return NextResponse.json({ error: 'No requests found' }, { status: 404 });
        }
        return NextResponse.json(mutualFunds, { status: 200 });
      } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
      }
    }

    default:
      return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
};

export { mfHandler as GET, mfHandler as POST };

