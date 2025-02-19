import { NextResponse } from 'next/server';
import clientPromise from '@/src/app/lib/mongodbConfig';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json(
      { success: false, error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const db = client.db('qa_database');

  const similarQuestions = await db
    .collection('questions')
    .find({
      $and: [
        { approved: true },
        { question: { $regex: query, $options: 'i' } },
      ],
    })
    .project({ _id: 1, question: 1 })
    .limit(5)
    .toArray();

  return NextResponse.json({ success: true, similarQuestions });
}
