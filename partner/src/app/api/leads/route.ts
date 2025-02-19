import client from '@/src/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { createLeadModel } from './model';
import { validateLead } from './validation';
import { ObjectId } from 'bson';

async function leadsHandler(req, res) {
  const { method } = req;
  const headersList = await headers();
  const token = headersList.get('token');
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db('rxtn');
  const collection = db.collection('leads');

  try {
    switch (method) {
      case 'GET': {
        if (user?.role === 'partner') {
          const referralIdObject = ObjectId.isValid(user?.id)
            ? new ObjectId(user?.id)
            : null;
          const leads = await collection
            .find(
              {
                $or: [
                  { referral_id: user?.id }, // Match string
                  { referral_id: referralIdObject }, // Match ObjectId (if valid)
                ],
              },
              {
                projection: {
                  _id: 1,
                  full_Name: 1,
                  mobile: 1,
                  mobileTwo: 1,
                  email: 1,
                  category: 1,
                  review_status: 1,
                  converted: 1,
                  note: 1,
                  status: 1,
                  callSchedule: 1,
                  callScheduleHistory: 1,
                  isCustomer: 1,
                  created_at: 1,
                  created_by_name: 1,
                  updated_at: 1,
                  updated_by_name: 1,
                },
              }
            )
            .sort({ callSchedule: -1, created_at: -1 })
            .toArray();
          return NextResponse.json(leads, { status: 200 });
        } else {
          return NextResponse.json(
            { message: 'You are not allowed' },
            { status: 403 }
          );
        }
      }
      case 'POST': {
        if (user?.role === 'partner') {
          const body = await req.json();
          const errors = validateLead(body);
          if (errors.length > 0) {
            return NextResponse.json(
              { message: 'Validation failed', errors },
              { status: 400 }
            );
          }

          const partner = await db
            .collection('partners')
            .findOne({ _id: new ObjectId(user?.id) });

          const existingCustomer = await db
            .collection('customers')
            .findOne({ phone: body.mobile });
          if (existingCustomer) {
            body.customer_id = existingCustomer._id;
            body.customer_name = existingCustomer.name;
            body.isCustomer = true;
          }
          const updatedBody = {
            ...body,
            lead_from: 'Reference',
            created_by_id: user?.id,
            created_by_name: user?.name,
            updated_by_id: user?.id,
            updated_by_name: user?.name,
            created_at: new Date(),
            updated_at: new Date(),
            referral_id: partner?._id,
            referral_name: partner?.name,
          };
          const lead = createLeadModel(updatedBody);
          const result = await collection.insertOne(lead);
          return NextResponse.json(result, { status: 201 });
        } else {
          return NextResponse.json(
            { message: 'You are not allowed' },
            { status: 403 }
          );
        }
      }
      default:
        return NextResponse.json(
          { message: `Method ${method} not allowed` },
          { status: 405 }
        );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
export { leadsHandler as GET, leadsHandler as POST };
