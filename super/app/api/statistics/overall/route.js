import client from '@/app/lib/mongodbConfig';
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

  if (method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
  const body = await req.json();
  const { startDate, endDate } = body;

  try {
    // Construct filters
    const filters = {};
    if (startDate && endDate) {
      filters.created_at = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    // if (userId) {
    //   filters.assignee_by_id = userId;
    // }

    // Collections and queries
    const collections = {
      todos: db.collection("todos"),
      leads: db.collection("leads"),
      customers: db.collection("customers"),
      partners: db.collection("partners"),
      orders: db.collection('orders'),
      websessions: db.collection('web-sessions'),
    };

    const queries = {
      totalTodos: collections.todos.countDocuments({ ...filters, assignee_by_id: userId }),
      openTodos: collections.todos.countDocuments({ ...filters, assignee_by_id: userId, isCompleted: !true }),
      totalLeads: collections.leads.countDocuments(filters),
      leadsWithoutCallSchedule: collections.leads.countDocuments({ ...filters, callSchedule: "" }),
      pendingLeads: collections.leads.countDocuments({ ...filters, status: "open", converted: false }),
      convertedLeads: collections.leads.countDocuments({ ...filters, converted: true }),
      totalCustomers: collections.customers.countDocuments(filters),
      totalPartners: collections.partners.countDocuments(filters),
      clicks: collections.websessions.countDocuments({
        ...filters,
      }),
      ordersTotal: collections.orders.countDocuments({
        ...filters,
      }),
      ordersPending: collections.orders.countDocuments({
        ...filters,
        status: 'pending',
      }),
      ordersPaid: collections.orders.countDocuments({
        ...filters,
        status: 'paid',
      }),
    };


    const chartQueries = {
      leadsByDay: collections.leads
        .aggregate([
          { $match: filters },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
              leads: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } }, // Sort by date
        ])
        .toArray(),

      customersByDay: collections.customers
        .aggregate([
          { $match: filters },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
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
      combinedData[item._id] = { date: item._id, leads: item.leads, customers: 0 };
    });

    customersByDay.forEach((item) => {
      if (!combinedData[item._id]) {
        combinedData[item._id] = { date: item._id, leads: 0, customers: item.customers };
      } else {
        combinedData[item._id].customers = item.customers;
      }
    });

    // Convert combined data to array
    const chartData = Object.values(combinedData).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Execute all queries concurrently
    const results = await Promise.all(Object.values({ ...queries, chartData }));

    // Map results back to keys
    const response = Object.keys({ ...queries, chartData }).reduce((acc, key, idx) => {
      acc[key] = results[idx];
      return acc;
    }, {});

    // Respond with data
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
export { handler as POST };