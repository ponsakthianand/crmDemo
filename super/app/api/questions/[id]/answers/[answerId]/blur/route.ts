import { NextResponse } from 'next/server';
import client from '@/app/lib/mongodbConfig';
import { ObjectId } from 'mongodb';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';

export async function PUT(
  request: Request,
  { params }: { params: { id: string; answerId: string } }
) {
  try {
    const headersList = await headers();
    const token = headersList.get('token');
    if (!token) {
      return NextResponse.json(
        { error: 'Token is not found' },
        { status: 400 }
      );
    }
    const user = parseJwt(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }
    await client.connect();
    const database = client.db('qa_database');
    const questions = database.collection('questions');

    const { isBlurred } = await request.json();
    const questionId = params.id;
    const answerId = params.answerId;

    const result = await questions.updateOne(
      { kelviId: questionId, 'answers._id': new ObjectId(answerId) },
      {
        $set: {
          'answers.$.isBlurred': isBlurred,
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
        message: 'Answer blur status updated successfully',
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to update answer blur status' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating answer blur status:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
