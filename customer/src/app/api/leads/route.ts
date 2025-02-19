import client from '@/src/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { createLeadModel } from './model';
import { validateLead } from './validation';
import { sendNotificationEmail } from './email/email';

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
        if (user?.role === 'org-admin') {
          const leads = await collection
            .find()
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
          .findOne({ partner_user_id: body.referral_id });

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
          created_by_id: user?.id,
          created_by_name: user?.name,
          created_at: new Date(),
          updated_at: new Date(),
          updated_by_id: user?.id,
          updated_by_name: user?.name,
          referral_id: partner?._id.toString(),
          referral_name: partner?.name,
        };
        const lead = createLeadModel(updatedBody);
        const result = await collection.insertOne(lead);
        await sendNotificationEmail(`We got new Lead`, updatedBody, 'Lead');
        return NextResponse.json(result, { status: 201 });
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
