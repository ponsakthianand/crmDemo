import client from '@/src/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { createLeadModel } from '../model';
import { validateLead } from '../validation';
import { ObjectId } from 'bson';

async function LeadEdithandler(req, { params }) {
  const { method } = req;
  const leadId = (await params).lead_id;
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
          const lead = await collection.findOne({ _id: new ObjectId(leadId) });
          if (!lead) return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
          return NextResponse.json(lead, { status: 200 });
        } else {
          return NextResponse.json({ message: 'You are not allowed' }, { status: 403 });
        }
      }
      case 'PUT': {
        if (user?.role === 'org-admin') {
          const body = await req.json();
          // const lead = await collection.findOne({ _id: new ObjectId(id) });
          // if (!lead) return NextResponse.json({ message: 'Lead not found' }, { status: 404 });

          // const updatedLead = {
          //   ...lead,
          //   ...updates,
          //   modified_at: new Date(),
          //   modified_history: [...lead.modified_history, { updates, date: new Date() }],
          // };

          // await collection.updateOne({ _id: new ObjectId(id) }, { $set: updatedLead });

          const { comment, callSchedule } = body;

          // Fetch the original lead
          const lead = await collection.findOne({ _id: new ObjectId(leadId) });

          if (!lead) {
            return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
          }

          // Track modified history
          const updated_history = Object.keys(body).map((key) => ({
            [key]: lead[key]
          }));

          function transformUpdatedHistory(input) {
            const result = {};

            // Iterate over the keys in the input object
            for (const key in input) {
              if (!isNaN(key)) {
                // Add the properties inside numeric keys to the result
                Object.assign(result, input[key]);
              } else {
                // Directly add other properties to the result
                result[key] = input[key];
              }
            }

            return result;
          }
          const transformedUpdatedHistory = transformUpdatedHistory(...updated_history);

          // Update the lead
          const updatedLead = {
            ...body,
            updated_at: new Date(),
            updated_by_id: user?.id,
            updated_by_name: user?.name,
          };


          const result = await collection.updateOne(
            { _id: new ObjectId(leadId) },
            {
              $set: updatedLead,
              $push: {
                updated_history: {
                  updated_at: new Date(),
                  updated_by_id: user?.id,
                  updated_by_name: user?.name,
                  changes: transformedUpdatedHistory
                },
                ...(comment && {
                  commentHistory: {
                    comment: lead?.comment, updated_at: new Date(),
                    updated_by_id: user?.id,
                    updated_by_name: user?.name,
                  }
                }),
                ...(callSchedule && {
                  callScheduleHistory: {
                    callSchedule, updated_at: new Date(),
                    updated_by_id: user?.id,
                    updated_by_name: user?.name,
                  },
                }),
              },
            }
          );
          return NextResponse.json(result, { status: 200 });
        } else {
          return NextResponse.json({ message: 'You are not allowed' }, { status: 403 });
        }
      }
      case 'DELETE': {
        if (user?.role === 'org-admin') {
          const result = await collection.deleteOne({ _id: new ObjectId(leadId) });
          if (!result.deletedCount) return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
          return NextResponse.json({ message: 'Lead deleted successfully' }, { status: 200 });
        } else {
          return NextResponse.json({ message: 'You are not allowed' }, { status: 403 });
        }
      }
      default:
        return NextResponse.json({ message: `Method ${method} not allowed` }, { status: 405 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export { LeadEdithandler as GET, LeadEdithandler as PUT, LeadEdithandler as DELETE };