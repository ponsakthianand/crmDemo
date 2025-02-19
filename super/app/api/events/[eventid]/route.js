import client from '@/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'bson';

const specificEventHandler = async (req, { params }) => {
  const { method } = req;
  const eventId = params.eventid;
  const headersList = headers();
  const token = headersList.get('token');
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db('rxtn');
  const id = new ObjectId(eventId);

  switch (method) {
    case 'POST':
      const body = await req.json();
      if (user?.role === 'org-admin') {
        // Fetch the current event details
        const existingEvent = await db.collection('events').findOne({ _id: id });

        let slug = existingEvent?.slug; // Default to existing slug

        // If slug is changed in request, check for uniqueness
        if (body.slug && body.slug !== existingEvent?.slug) {
          let baseSlug = body.slug
            .toLowerCase()
            .replace(/[^a-z0-9- ]/g, "") // Remove special characters except hyphens & spaces
            .replace(/\s+/g, "-") // Replace spaces with hyphens
            .replace(/-+/g, "-"); // Remove duplicate hyphens

          const eventsList = await db.collection('events')
            .find({ _id: { $ne: id } }) // Exclude current event from check
            .toArray();

          // Ensure uniqueness if slug already exists in another event
          let count = 1;
          let newSlug = baseSlug;
          while (eventsList.some((event) => event.slug === newSlug)) {
            newSlug = `${baseSlug}-${count}`;
            count++;
          }
          slug = newSlug;
        }

        const updatedData = {
          ...body,
          admin_id: user?.id,
          updated_role: user?.role,
          updated_by: user?.name,
          updated_at: new Date(),
          slug, // Use final slug
        };

        try {
          const product = await db.collection('events').findOneAndUpdate(
            { _id: id },
            { $set: updatedData },
            { upsert: true, returnDocument: 'after' }
          );
          return NextResponse.json(product);
        } catch (e) {
          console.error(e);
          return NextResponse.json({ message: 'Error updating event' }, { status: 500 });
        }
      } else {
        return NextResponse.json({ message: 'You are not allowed' }, { status: 403 });
      }

    case 'GET':
      if (user) {
        const event = await db.collection('events').findOne({ _id: id });
        return NextResponse.json(event);
      } else {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
      }

    case 'DELETE':
      if (user) {
        await db.collection('events').findOneAndDelete({ _id: id });
        return NextResponse.json({ message: "Successfully Deleted!" });
      } else {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
      }

    default:
      return NextResponse.json({ message: "Invalid request method" }, { status: 405 });
  }
};

export { specificEventHandler as GET, specificEventHandler as POST, specificEventHandler as DELETE };
