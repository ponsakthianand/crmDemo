import { NextResponse } from 'next/server';
import client from '@/app/lib/mongodbConfig';
import { ObjectId } from 'mongodb';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; relatedId: string } }
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

    const questionId = params.id;
    const relatedQuestionId = params.relatedId;

    const result = await questions.updateOne(
      { kelviId: questionId },
      {
        $set: {
          updatedAt: new Date(),
          updatedBy: user.name,
          updatedById: user.id,
        },
        $pull: {
          relatedQuestions: { kelviId: relatedQuestionId } as any,
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
        { success: false, message: 'Failed to remove related question' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error removing related question:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
