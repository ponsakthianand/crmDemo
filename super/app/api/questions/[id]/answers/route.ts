import { NextResponse } from 'next/server';
import client from '@/app/lib/mongodbConfig';
import { ObjectId } from 'mongodb';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';

export async function POST(
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

    const { content, category, tags } = await request.json();
    const questionId = params.id;

    const updateFields: any = {
      category: category && category !== 'uncategorized' ? category : null,
      tags: Array.isArray(tags) ? tags : [],
      approved: true,
      isBlurred: false,
      isHidden: false,
      updatedAt: new Date(),
      updatedBy: user.name,
      updatedById: user.id,
    };

    // Build update object with $set and optional $push
    const updateQuery: any = { $set: updateFields };

    if (content && content.trim() !== '') {
      updateQuery.$push = {
        answers: {
          _id: new ObjectId(),
          content,
          answeredBy: user.name,
          answeredById: user.id,
          createdAt: new Date(),
        },
      };
    }

    const result = await questions.updateOne(
      { kelviId: questionId },
      updateQuery
    );

    if (result.modifiedCount === 1) {
      const updatedQuestion = await questions.findOne({ kelviId: questionId });
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
