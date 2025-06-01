"use client"
import Sidebars from "@/components/Sidebars";
import Header from "@/components/Header";
import { Note } from "@/lib/types";
import { useState, useEffect } from "react";
import NotesView from "@/components/NotesView";
import { loadNotes, saveNotes } from "@/lib/storage";
import NotesEdit from "@/components/NotesEdit";
import EmptyState from "@/components/EmptyState";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Migrate localStorage notes to MongoDB
  async function migrateNotesToMongoDB() {
    if (typeof window === "undefined") return;

    const localNotes = JSON.parse(localStorage.getItem('notes') || '[]') as Note[];
    if (localNotes.length > 0) {
      try {
        await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(localNotes),
        });
        console.log('Migrated', localNotes.length, 'notes to MongoDB');
        localStorage.removeItem('notes');
      } catch (error) {
        console.error('Migration failed:', error);
      }
    }
  }

  useEffect(() => {
    async function fetchNotes() {
      try {
        await migrateNotesToMongoDB(); // Run migration first
        const loadedNotes = await loadNotes();
        setNotes(loadedNotes);
      } catch (error) {
        console.error('Failed to load notes:', error);
      }
    }
    fetchNotes();
  }, []);

  useEffect(() => {
    async function saveNotesToAPI() {
      try {
        await saveNotes(notes);
      } catch (error) {
        console.error('Failed to save notes:', error);
      }
    }
    if (notes.length > 0 || notes.length === 0) {
      saveNotesToAPI();
    }
  }, [notes]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "New Note",
      content: "",
      createdAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setActiveNote(newNote);
    setIsEditing(true);
  };

  const selectNote = (note: Note) => {
    setActiveNote(note);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const saveNote = (updatedNote: Note) => {
    setNotes(
      notes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    );
    setActiveNote(updatedNote);
    setIsEditing(false);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
    if (activeNote && activeNote.id === id) {
      setActiveNote(null);
      setIsEditing(false);
    }
  };

  const renderNoteContent = () => {
    if (!activeNote && notes.length === 0) {
      return (
        <EmptyState
          message="Create your first note to get started"
          buttonText="New Note"
          onButtonClick={createNewNote}
        />
      );
    }

    if (activeNote && isEditing) {
      return <NotesEdit note={activeNote} onSave={saveNote} onCancel={cancelEdit} />;
    }

    if (activeNote) {
      return <NotesView note={activeNote} onEdit={() => setIsEditing(true)} />;
    }
    return null;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onNewNote={createNewNote} />
      <main className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Sidebars
            createNewNote={createNewNote}
            notes={notes}
            onSelectNote={selectNote}
            onDeleteNote={deleteNote}
            activeNoteId={activeNote?.id}
          />
        </div>
        <div className="md:col-span-2">{renderNoteContent()}</div>
      </main>
    </div>
  );
}