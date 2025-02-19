import { NextResponse } from 'next/server';
import client from '@/app/lib/mongodbConfig';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';

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
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json(
      { error: 'Search query is required' },
      { status: 400 }
    );
  }

  try {
    await client.connect();
    const database = client.db('qa_database');
    const questions = database.collection('questions');

    const searchResults = await questions
      .find({ question: { $regex: query, $options: 'i' } })
      .limit(10)
      .toArray();

    return NextResponse.json({ questions: searchResults });
  } catch (error) {
    console.error('Error searching questions:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
