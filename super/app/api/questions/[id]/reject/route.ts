import { NextResponse } from 'next/server';
import client from '@/app/lib/mongodbConfig';
import { ObjectId } from 'mongodb';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { Answer } from '@/types/question';

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

    const { rejectionReason } = await request.json();
    const questionId = params.id;

    const getQuestion = await questions.findOne({ kelviId: questionId });

    // Check if all answers are either hidden
    const allAnswersHidden = getQuestion?.answers.every(
      (answer: Answer) => answer.isHidden === true
    );

    const updateData = rejectionReason
      ? {
          rejectionReason,
          approved: false,
          rejectedBy: user.name,
          rejectedById: user.id,
        }
      : allAnswersHidden
      ? {
          rejectionReason: '',
          approved: false,
          rejectedBy: '',
          rejectedById: '',
        }
      : {
          rejectionReason: '',
          approved: true,
          rejectedBy: '',
          rejectedById: '',
        };

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
