import client from '@/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'bson';

const customersHandler = async (req) => {
  const { method } = req;
  const headersList = await headers();
  const token = headersList.get('token');
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db('rxtn');

  function transformApiResponse(customer) {
    return customer?.map(user => {
      const transformedUser = {
        _id: user?._id,
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
        created_at: user?.created_at,
        updated_at: user?.updated_at,
        verified: user?.verified,
        photo: user?.photo,
        ticket_count: user?.tickets?.length,
        partner: {
          id: user?.partner_id,
          name: user?.partner_name,
          partner_user_id: user?.partner_user_id,
        }
      };

      return transformedUser;
    });
  }

  switch (method) {
    case 'GET':
      if (user) {
        const customer = await db.collection('customers').find().sort({ created_at: -1 }).toArray();
        const updatedResponse = await transformApiResponse(customer);
        return NextResponse.json(updatedResponse);
      } else {
        return NextResponse.json({ message: "It's wrong buddy!" });
      }

    default:
      return NextResponse.json({ message: "It's wrong buddy!" });
  }
};

export { customersHandler as GET, };