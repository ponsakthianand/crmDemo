import { NextResponse } from 'next/server';
import client from '@/app/lib/mongodbConfig';
import { ObjectId } from 'mongodb';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ''); // Trim hyphens from start and end
}

async function getUniqueSlug(database: any, name: string, categoryId: string) {
  const baseSlug = generateSlug(name);
  let slug = baseSlug;
  let count = 1;

  const categories = database.collection('categories');

  while (await categories.findOne({ slug, vagaiId: { $ne: categoryId } })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
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
    const categories = database.collection('categories');

    const { name } = await request.json();
    const categoryId = params.id;

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Generate a unique slug for the updated category name
    const slug = await getUniqueSlug(database, name, categoryId);

    const result = await categories.updateOne(
      { vagaiId: categoryId },
      {
        $set: {
          name,
          slug,
          updatedAt: new Date(),
          updatedBy: user.name,
          updatedById: user.id,
        },
      }
    );

    if (result.modifiedCount === 1) {
      return NextResponse.json({ success: true, slug });
    } else {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error updating category:', error);
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
    const categories = database.collection('categories');

    const categoryId = params.id;

    const result = await categories.deleteOne({
      vagaiId: categoryId,
    });

    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
