import { NextResponse } from 'next/server';
import client from '@/app/lib/mongodbConfig';
import { ObjectId } from 'mongodb';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';

export async function PUT(
  request: Request,
  { params }: { params: { id: string; answerId: string } }
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

    const { isHidden } = await request.json();
    const questionId = params.id;
    const answerId = params.answerId;

    const result = await questions.updateOne(
      { kelviId: questionId, 'answers._id': new ObjectId(answerId) },
      {
        $set: {
          'answers.$.isHidden': isHidden,
          updatedAt: new Date(),
          updatedBy: user.name,
          updatedById: user.id,
        },
      }
    );
    const getQuestion = await questions.findOne({ kelviId: questionId });

    if (result.modifiedCount === 1) {
      return NextResponse.json({
        success: true,
        question: getQuestion,
        message: 'Answer hide status updated successfully',
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to update answer hide status' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating answer hide status:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
