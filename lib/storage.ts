import { Note } from "./types";

// Load notes from API
export async function loadNotes(): Promise<Note[]> {
  if (typeof window === "undefined") return [];

  try {
    const response = await fetch('/api/notes');
    if (!response.ok) {
      throw new Error('Failed to fetch notes');
    }
    const notes = await response.json();
    return notes as Note[];
  } catch (error) {
    console.error("Failed to load notes from API:", error);
    return [];
  }
}

// Save notes to API
export async function saveNotes(notes: Note[]): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notes),
    });
    if (!response.ok) {
      throw new Error('Failed to save notes');
    }
  } catch (error) {
    console.error("Failed to save notes to API:", error);
    throw error;
  }
}

// Format date (unchanged)
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}