import client from '@/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'bson';

async function deleteHandler(req, { params }) {
  const { method } = req;
  const collectionId = params.collectionId;
  const documentId = params.documentId;
  const headersList = headers();
  const token = headersList.get('token');
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db('rxtn');

  try {
    if (method !== 'DELETE') {
      return NextResponse.json({ message: `Method ${method} not allowed` }, { status: 405 });
    }

    if (user?.role !== 'org-admin') {
      return NextResponse.json({ message: 'You are not allowed' }, { status: 403 });
    }

    const collection = db.collection(collectionId);

    if (collectionId === 'customers') {
      const customer = await collection.findOne({ _id: new ObjectId(documentId) });

      if (!customer) {
        return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
      }

      const ordersCollection = db.collection('orders');
      await ordersCollection.updateMany(
        { 'userInfo.email': customer.email },
        { $set: { isCustomer: false } }
      );

      const deleteResult = await collection.deleteOne({ _id: new ObjectId(documentId) });

      if (!deleteResult.deletedCount) {
        return NextResponse.json({ message: 'Failed to delete customer' }, { status: 500 });
      }

      return NextResponse.json({ message: 'Customer deleted and orders updated successfully' }, { status: 200 });
    }

    // Regular delete for non-customers collection
    const result = await collection.deleteOne({ _id: new ObjectId(documentId) });

    if (!result.deletedCount) {
      return NextResponse.json({ message: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export { deleteHandler as DELETE };
