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

  function transformApiResponse(users) {
    return users?.map(user => {
      const transformedUser = {
        _id: user?._id,
        name: user?.name,
        email: user?.email,
        photo: user?.photo,
        created_at: user?.created_at,
        updated_at: user?.updated_at,
        permission: user?.permission,
        role: user?.role,
        company_id: user?.company_id,
        comapny_name: user?.comapny_name,
        verified: user?.verified,
        created_by_id: user?.created_by_id,
        created_by_name: user?.created_by_name,
        active: user?.active,
      };

      return transformedUser;
    });
  }

  switch (method) {
    case 'GET':
      if (user) {
        const customer = await db.collection('users').find().sort({ active: -1, name: -1 }).toArray();
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