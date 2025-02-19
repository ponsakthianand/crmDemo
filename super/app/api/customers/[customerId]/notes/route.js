import client from '@/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';
import { ObjectId } from 'bson';

const notesHandler = async (req, { params }) => {
  const { method } = req;
  const { customerId } = await params;
  const headersList = await headers();
  const token = headersList.get('token');
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db('rxtn');
  const collection = db.collection('notes');

  switch (method) {
    case 'GET':
      // Get all notes for a specific customer
      return getNotes(customerId, collection, user);
    case 'POST':
      // Add a new note
      const body = await req.json();
      return addNote(body, customerId, db, user);
    case 'PUT':
      // Edit or complete a note
      const editBody = await req.json();
      return updateNote(editBody, collection, user);
    case 'DELETE':
      // Delete a note
      const deleteBody = await req.json();
      return deleteNote(deleteBody, collection, user);
    default:
      return NextResponse.json({ message: "It's wrong buddy!" }, { status: 403 });
  }
};

export { notesHandler as GET, notesHandler as POST, notesHandler as PUT, notesHandler as DELETE };


// Handler to get all notes for a specific customer
async function getNotes(customerId, collection, user) {

  if (!customerId) {
    return NextResponse.json({ error: 'Missing customerId' }, { status: 400 });
  }

  try {
    if (user?.role === 'org-admin') {
      const notes = await collection.find({ customer_id: customerId }).sort({ updated_at: -1 }).toArray();
      return NextResponse.json(notes, { status: 200 });
    } else {
      return NextResponse.json({ error: 'You are not allowed to perform this operation' }, { status: 403 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

// Handler to add a new note
async function addNote(body, customerId, db, user) {
  const { title, content } = body;
  const collection = await db.collection('notes');

  if (!title && !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  } else if ((title && !content) || (content && !title) || (title && content)) {
    try {
      if (user?.role === 'org-admin') {
        let finalTitle = title;
        if (!title) {
          // Find the current count of untitled notes
          const untitledCount = await collection.countDocuments({
            customer_id: customerId,
            title: { $regex: /^Untitled \d+$/ },
          });
          finalTitle = `Untitled ${untitledCount + 1}`;
        }

        const findCustomer = await db.collection('customers').findOne({ _id: new ObjectId(customerId) });

        const newNote = {
          title: finalTitle,
          content,
          created_at: new Date(),
          updated_at: new Date(),
          created_by_id: user?.id,
          created_by: user?.name,
          customer_id: customerId,
          customer_name: findCustomer?.name,
          updated_by: user?.name,
          updated_by_id: user?.id,
          versions: []
        };

        const result = await collection.insertOne(newNote);
        return NextResponse.json({ message: `${finalTitle} created successfully`, requestId: result.insertedId }, { status: 200 });
      } else {
        return NextResponse.json({ error: 'You are not allowed to perform this operation' }, { status: 403 });
      }
    } catch (error) {
      return NextResponse.json({ error: 'Failed to add note' }, { status: 500 });
    }
  }
}

// Handler to update a note (edit or mark as complete)
async function updateNote(body, collection, user) {
  const { noteId, title, content } = body;

  if (!noteId) {
    res.status(400).json({ success: false, message: 'Note ID and editedBy are required' });
    return;
  }

  const existingNote = await collection.findOne({ _id: new ObjectId(noteId) });
  if (!existingNote) {
    res.status(404).json({ success: false, message: 'Note not found' });
    return;
  }

  const versionEntry = {
    updated_at: existingNote.updated_at,
    content: existingNote.content,
    title: existingNote.title,
    created_by_id: existingNote.created_by_id,
    created_by: existingNote.created_by
  };

  try {
    if (user?.role === 'org-admin') {
      const updateFields = {
        updated_at: new Date(),
      };

      if (title !== undefined) {
        updateFields.title = title || undefined; // Allow setting title to undefined if empty
      }

      if (content !== undefined) {
        updateFields.content = content;
      }

      const updateData = {
        updated_at: new Date(),
        updated_by_id: user?.id,
        updated_by: user?.name,
      };

      if (title !== undefined) updateData.title = title.trim();
      if (content !== undefined) updateData.content = content;

      // If title is being removed, assign a new untitled name
      if (title === '') {
        const untitledCount = await collection.countDocuments({
          customer,
          title: { $regex: /^Untitled \d+$/ },
        });
        updateFields.title = `Untitled ${untitledCount + 1}`;
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(noteId) },
        {
          $set: updateData,
          $push: { versions: versionEntry }, // Add version to history
        }
      );
      return NextResponse.json({ message: `${title} updated successfully`, requestId: result.insertedId }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'You are not allowed to perform this operation' }, { status: 403 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

// Handler to delete a note
async function deleteNote(body, collection, user) {
  const { noteId } = body;

  if (!noteId) {
    return NextResponse.json({ error: 'Missing noteId' }, { status: 400 });
  }

  try {
    if (user?.role === 'org-admin') {
      const result = await collection.deleteOne({ _id: new ObjectId(noteId) })
      return NextResponse.json({ message: 'Note deleted successfully', result }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'You are not allowed to perform this operation' }, { status: 403 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}