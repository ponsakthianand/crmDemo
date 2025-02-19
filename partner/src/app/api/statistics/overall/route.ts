import client from '@/src/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'bson';

const handler = async (req) => {
  const { method } = req;
  const headersList = await headers();
  const token = headersList.get('token');
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db('rxtn');
  const userId = user?.id;

  if (method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
  const body = await req.json();
  const { startDate, endDate } = body;

  try {
    // Construct filters
    const filters: { created_at?: { $gte: Date; $lte: Date } } = {};
    if (startDate && endDate) {
      filters.created_at = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const existingUser = await db
      .collection('partners')
      .findOne({ _id: new ObjectId(userId) });

    // Collections and queries
    const collections = {
      leads: db.collection('leads'),
      customers: db.collection('customers'),
      orders: db.collection('orders'),
      websessions: db.collection('web-sessions'),
    };

    const queries = {
      totalLeads: collections.leads.countDocuments({
        ...filters,
        referral_id: userId,
      }),
      convertedLeads: collections.leads.countDocuments({
        ...filters,
        referral_id: userId,
        converted: true,
      }),
      totalCustomers: collections.customers.countDocuments({
        ...filters,
        partner_id: userId,
      }),
      clicks: collections.websessions.countDocuments({
        ...filters,
        referralId: existingUser?.partner_user_id,
      }),
      orders: collections.orders.countDocuments({
        ...filters,
        referralId: new ObjectId(userId),
        status: 'paid',
      }),
    };

    const chartQueries = {
      leadsByDay: collections.leads
        .aggregate([
          { $match: { ...filters, referral_id: userId } },
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$created_at' },
              },
              leads: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } }, // Sort by date
        ])
        .toArray(),

      customersByDay: collections.customers
        .aggregate([
          { $match: { ...filters, partner_id: userId } },
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$created_at' },
              },
              customers: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } }, // Sort by date
        ])
        .toArray(),
    };

    // Execute both aggregation queries concurrently
    const [leadsByDay, customersByDay] = await Promise.all([
      chartQueries.leadsByDay,
      chartQueries.customersByDay,
    ]);

    // Combine data for chart response
    const combinedData = {};
    leadsByDay.forEach((item) => {
      combinedData[item._id] = {
        date: item._id,
        leads: item.leads,
        customers: 0,
      };
    });

    customersByDay.forEach((item) => {
      if (!combinedData[item._id]) {
        combinedData[item._id] = {
          date: item._id,
          leads: 0,
          customers: item.customers,
        };
      } else {
        combinedData[item._id].customers = item.customers;
      }
    });

    // Convert combined data to array
    const chartData = Object.values(combinedData).sort(
      (a: { date: string }, b: { date: string }) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Execute all queries concurrently
    const results = await Promise.all(Object.values({ ...queries, chartData }));

    // Map results back to keys
    const response = Object.keys({ ...queries, chartData }).reduce(
      (acc, key, idx) => {
        acc[key] = results[idx];
        return acc;
      },
      {}
    );

    // Respond with data
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
export { handler as POST };
