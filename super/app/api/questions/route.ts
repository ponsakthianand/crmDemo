import { NextResponse } from 'next/server';
import client from '@/app/lib/mongodbConfig';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { create } from 'domain';

export async function GET(request: Request) {
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

    // Instead of using request.url, we'll use default values
    const query: any = {};
    const sortOptions: any = { createdAt: -1 };
    const page = 1;
    const limit = 10;

    const totalQuestions = await questions.countDocuments(query);
    const questionsList = await questions
      .find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      questions: questionsList,
      totalQuestions,
      totalPages: Math.ceil(totalQuestions / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    const questionData = await request.json();

    // Ensure required fields are present
    if (!questionData.question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    // Add default values for optional fields and include createdBy
    const newQuestion = {
      ...questionData,
      kelviId: `Q${Date.now()}`,
      createdAt: new Date(),
      createdByName: user.name,
      createdById: user.id,
      approved: false,
      answers: [],
      isPublished: false,
      createdBy: 'admin',
    };

    const result = await questions.insertOne(newQuestion);

    return NextResponse.json(
      { success: true, id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding question:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
