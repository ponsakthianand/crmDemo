import { NextResponse } from 'next/server';
import client from '@/app/lib/mongodbConfig';
import { ObjectId } from 'mongodb';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const headersList = await headers();
  const token = headersList.get('token');
  if (!token) {
    return NextResponse.json({ error: 'Token is not found' }, { status: 400 });
  }
  const user = parseJwt(token);
  if (!user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }
  try {
    await client.connect();
    const database = client.db('qa_database');
    const questions = database.collection('questions');

    const { isDuplicate, duplicateOf } = await request.json();
    const questionId = params.id;

    const updateData = isDuplicate
      ? { isDuplicate: true, duplicateOf: duplicateOf }
      : { isDuplicate: '', duplicateOf: '' };

    const result = await questions.updateOne(
      { kelviId: questionId },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
          updatedBy: user.name,
          updatedById: user.id,
        },
      }
    );

    if (result.modifiedCount === 1) {
      const updatedQuestion = await questions.findOne({
        kelviId: questionId,
      });
      return NextResponse.json({ success: true, question: updatedQuestion });
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to update question' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
