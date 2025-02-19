import { NextResponse } from 'next/server';
import { dbConnect } from '@/src/app/lib/dbConnect';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json(
      { success: false, error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const { db } = await dbConnect();

    const questions = await db
      .collection('questions')
      .find({
        $and: [
          { approved: true },
          {
            $or: [
              { question: { $regex: query, $options: 'i' } },
              {
                answers: {
                  $elemMatch: { content: { $regex: query, $options: 'i' } },
                },
              },
            ],
          },
        ],
      })
      .project({ question: 1, kelviId: 1 })
      .limit(5)
      .toArray();

    const categories = await db
      .collection('questions')
      .distinct('category', { category: { $regex: query, $options: 'i' } });

    const tags = await db
      .collection('questions')
      .distinct('tags', { tags: { $regex: query, $options: 'i' } });

    return NextResponse.json({
      success: true,
      questions,
      categories: categories.slice(0, 3),
      tags: tags.slice(0, 3),
    });
  } catch (error) {
    console.error('Error in GET /api/questions/search:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}
