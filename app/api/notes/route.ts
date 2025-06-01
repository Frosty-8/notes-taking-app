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
        throw new Error(`Failed to connect to MongoDB after ${maxRetries} attempts: ${error.message}`);
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
    return NextResponse.json([], { status: 500, statusText: error.message });
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
    return NextResponse.json({ error: 'Failed to save notes', details: error.message }, { status: 500 });
  }
}

// Close connection (optional, for cleanup during server shutdown)
export async function closeMongoDB() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    notesCollection = null;
    console.log('MongoDB connection closed');
  }
}