import { NextResponse } from 'next/server';
import client from '@/app/lib/mongodbConfig';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';

export async function GET() {
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
    const categories = database.collection('categories');

    const categoriesList = await categories.find().toArray();

    return NextResponse.json({ categories: categoriesList });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ''); // Trim hyphens from start and end
}

async function getUniqueSlug(database: any, name: string) {
  const baseSlug = generateSlug(name);
  let slug = baseSlug;
  let count = 1;

  const categories = database.collection('categories');
  while (await categories.findOne({ slug })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
}

function generateUniqueId(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(); // Get 10-digit timestamp
  return `QC${timestamp}`;
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
    const categories = database.collection('categories');

    const { name } = await request.json();
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const slug = await getUniqueSlug(database, name);
    const uniqueId = generateUniqueId();

    await categories.insertOne({
      vagaiId: uniqueId,
      name,
      slug,
      created_by: user.id,
      created_at: new Date(),
      created_by_name: user.name,
    });

    return NextResponse.json(
      { success: true, id: uniqueId, slug },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
