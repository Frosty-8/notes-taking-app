import { MongoClient, Db, Collection } from 'mongodb';
import { NextResponse } from 'next/server';
import { Note } from '@/lib/types';

// MongoDB connection variables
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'notesApp';
const COLLECTION_NAME = 'notes';

let client: MongoClient | null = null;
let db: Db | null = null;
let notesCollection: Collection<Note> | null = null;

// Initialize MongoDB connection with retry logic
async function initializeMongoDB() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI not defined in environment variables');
  }
  if (client && notesCollection) {
    return; // Already connected
  }

  const maxRetries = 3;
  let attempt = 1;

  while (attempt <= maxRetries) {
    try {
      client = new MongoClient(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
        connectTimeoutMS: 10000,
      });
      await client.connect();
      db = client.db(MONGODB_DB);
      notesCollection = db.collection<Note>(COLLECTION_NAME);
      await notesCollection.createIndex({ id: 1 }, { unique: true });
      console.log('Connected to MongoDB');
      return;
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to connect to MongoDB after ${maxRetries} attempts: ${errorMessage}`);
      }
      attempt++;
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
    }
  }
}

// GET: Load all notes
export async function GET() {
  try {
    if (!notesCollection) {
      await initializeMongoDB();
    }
    if (!notesCollection) {
      throw new Error('MongoDB not initialized');
    }
    const notes = await notesCollection.find().toArray();
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Failed to load notes:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json([], { status: 500, statusText: errorMessage });
  }
}

// POST: Save notes
export async function POST(request: Request) {
  try {
    if (!notesCollection) {
      await initializeMongoDB();
    }
    if (!notesCollection) {
      throw new Error('MongoDB not initialized');
    }
    const notes: Note[] = await request.json();
    await notesCollection.deleteMany({});
    if (notes.length > 0) {
      await notesCollection.insertMany(notes);
    }
    return NextResponse.json({ message: 'Notes saved' });
  } catch (error) {
    console.error('Failed to save notes:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to save notes', details: errorMessage }, { status: 500 });
  }
}