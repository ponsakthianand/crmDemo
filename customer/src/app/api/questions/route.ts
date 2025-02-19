import { NextResponse } from 'next/server';
import { dbConnect } from '@/src/app/lib/dbConnect';
import { generateKelviId } from '@/src/types/qa';

export async function POST(request: Request) {
  try {
    const { question, askedByName, askedByPhone } = await request.json();
    const { db } = await dbConnect();

    const kelviId = generateKelviId();

    const result = await db.collection('questions').insertOne({
      kelviId,
      question,
      askedByName,
      askedByPhone,
      createdAt: new Date(),
      answers: [],
      approved: false,
      category: 'Uncategorized',
      isPublished: false,
    });

    return NextResponse.json(
      { success: true, id: result.insertedId, kelviId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/questions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit question' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');

    const { db } = await dbConnect();

    const query: any = { approved: true, isPublished: true };
    if (category) query.category = category;
    if (tag) query.tags = tag;

    const total = await db.collection('questions').countDocuments(query);
    const questions = await db
      .collection('questions')
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      questions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error in GET /api/questions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}
