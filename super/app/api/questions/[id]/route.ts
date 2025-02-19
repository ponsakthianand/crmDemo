import { NextResponse } from 'next/server';
import client from '@/app/lib/mongodbConfig';
import { ObjectId } from 'mongodb';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';

export async function GET(
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

    const questionId = params.id;

    const question = await questions.findOne({ kelviId: questionId });

    if (question) {
      return NextResponse.json({ success: true, question });
    } else {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

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

    const { editedQuestion } = await request.json();
    const questionId = params.id;

    const existingQuestion = await questions.findOne({
      kelviId: questionId,
    });

    if (!existingQuestion) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    const updateData: any = {
      editedQuestion,
      editedBy: user.name,
      editedById: user.id,
      editedAt: new Date(),
    };

    if (!existingQuestion.originalQuestion) {
      updateData.originalQuestion = existingQuestion.question;
    }

    const result = await questions.updateOne(
      { kelviId: questionId },
      { $set: updateData }
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

export async function DELETE(
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

    const questionId = params.id;

    const result = await questions.deleteOne({ kelviId: questionId });

    if (result.deletedCount) {
      return NextResponse.json({
        success: true,
        message: 'Question deleted successfully',
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to delete question' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
