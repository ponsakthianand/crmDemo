import clientPromise from './mongodbConfig';

export async function dbConnect() {
  try {
    const client = await clientPromise;
    const db = client.db('qa_database');
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw new Error('Database connection failed');
  }
}
