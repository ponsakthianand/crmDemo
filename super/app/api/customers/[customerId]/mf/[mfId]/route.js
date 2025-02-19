import client from '@/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'bson';
import { request } from 'http';
import jwt from 'jsonwebtoken';
import sendgrid from '@sendgrid/mail';

const SECRET_KEY = process.env.JWT_SECRET; // Store securely
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const mfSpecificHandler = async (req, { params }) => {
  const { method } = req;
  const { customerId, mfId } = params;
  const headersList = headers();
  const token = headersList.get('token');
  const user = token ? parseJwt(token) : null;
  const dbClient = await client;
  const dbRxtn = dbClient.db('rxtn');
  const db = dbClient.db('mutual_funds');
  const collection = db.collection('mutual_funds_requests');

  switch (method) {
    case 'GET':
      return await generateAndSendMagicLink(collection, mfId, dbRxtn, customerId);
    case 'POST':
      const body = await req.json();
      return await handlePostRequest(collection, user, body, mfId);
    case 'PUT':
      return await handlePutRequest(collection, user, mfId);
    case 'DELETE':
      if (user) {
        await collection.findOneAndDelete({ _id: new ObjectId(mfId) });
        return NextResponse.json({ message: 'Successfully Deleted!' });
      } else {
        return NextResponse.json(
          { message: "It's wrong buddy!" },
          { status: 403 }
        );
      }
    default:
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
  }
};

async function handlePostRequest(
  collection,
  user,
  body,
  mfId
) {
  try {
    await collection.updateOne(
      { _id: new ObjectId(mfId) },
      {
        $set: {
          ...body,
          status: 'Pending',
          updated_at: new Date(),
          updated_by_id: user?.id,
          updated_by_name: user?.name,
        },
        $push: {
          history: {
            updated_by_id: user.id,
            updated_by_name: user.name,
            updated_at: new Date(),
            ...body,
          },
        },
      }
    );
    return NextResponse.json(
      { message: 'Request submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Something went wrong', details: error.message },
      { status: 500 }
    );
  }
}

async function generateAndSendMagicLink(collection, mfId, db, customerId) {
  const request = await collection.findOne({ _id: new ObjectId(mfId) });
  if (!request) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  }
  const customer = await db.collection('customers').findOne({ _id: new ObjectId(customerId) });
  const token = jwt.sign({ mfId, exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 }, SECRET_KEY);
  const magicLink = `https://www.rxtn.in/mutual-funds/approve/${token}`;

  // try {
  //   await sendgrid.send({
  //     to: customer.email, // Ensure the customer email is stored properly
  //     from: 'no-reply@rxtn.in',
  //     subject: 'Approve Your Mutual Fund Request',
  //     html: `<p>Hello ${customer.name},</p>
  //            <p>Please click the link below to approve your request:</p>
  //            <a href="${magicLink}">${magicLink}</a>
  //            <p>This link is valid for 24 hours.</p>`
  //   });
  // } catch (error) {
  //   console.error('SendGrid error:', error);
  //   return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  // }

  return NextResponse.json({ link: magicLink, customer }, { status: 200 });
}

async function handlePutRequest(collection, user, mfId) {
  if (!mfId) {
    return NextResponse.json({ error: 'Missing required fields' });
  }

  try {
    if (user?.role === 'org-admin') {
      const request = await collection.findOne({ _id: new ObjectId(mfId) });

      if (!request) {
        return NextResponse.json({ error: 'Request not found' });
      }

      if (request.process_status !== 'Open') {
        return NextResponse.json({
          error: 'Request is already completed or closed.',
        });
      }

      // Approve and close the request
      await collection.updateOne(
        { _id: new ObjectId(mfId) },
        {
          $set: {
            status: 'Approved',
            process_status: 'Closed',
            approved_by_id: user?.id,
            approved_by: user?.name,
            approved_at: new Date(),
            approved_through: 'Admin dashboard',
          },
        }
      );

      return NextResponse.json({ message: 'Request approved successfully' });
    } else {
      return NextResponse.json({
        error: 'You are not allowed to perform this operation',
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: 'Something went wrong',
      details: error.message,
    });
  }
}

export {
  mfSpecificHandler as POST,
  mfSpecificHandler as PUT,
  mfSpecificHandler as DELETE,
  mfSpecificHandler as GET,
};
