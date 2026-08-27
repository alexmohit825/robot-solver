import React, { useState } from 'react';
import { Plus, StickyNote, User, Clock } from 'lucide-react';
import { Review } from '../../types/reputation';
import { ApiService } from '../../services/apiService';

interface InternalNotesTabProps {
  review: Review;
  onNoteAdded: (review: Review) => void;
}

export const InternalNotesTab: React.FC<InternalNotesTabProps> = ({ review, onNoteAdded }) => {
  const [newNote, setNewNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsSubmitting(true);
    try {
      const updated = await ApiService.addInternalNote(review.id, newNote.trim());
      onNoteAdded(updated);
      setNewNote('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const notes = review.internalNotes || [];

  return (
    <div className="space-y-4">
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-lg p-3 text-xs text-slate-400 flex items-center space-x-2">
        <StickyNote className="w-4 h-4 text-teal-400 shrink-0" />
        <span>Private clinic notes are only visible to your staff and are never published publicly.</span>
      </div>

      {/* Existing Notes */}
      <div className="space-y-2.5">
        {notes.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">No internal staff notes recorded yet.</p>
        ) : (
          notes.map((note, idx) => (
            <div key={idx} className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs text-slate-200">
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                <span className="font-semibold text-slate-300">Staff Note #{idx + 1}</span>
                <span>Recorded</span>
              </div>
              <p className="leading-relaxed">{note}</p>
            </div>
          ))
        )}
      </div>

      {/* Add Note Form */}
      <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-slate-800">
        <label className="text-xs font-semibold text-slate-300">Add Staff Observation</label>
        <textarea
          rows={2}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="e.g. Patient had appointment on 8/23, lab results were delayed by external provider..."
          className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs rounded-lg p-2.5 focus:outline-none focus:border-teal-500"
        />
        <button
          type="submit"
          disabled={isSubmitting || !newNote.trim()}
          className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-50"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Save Internal Note</span>
        </button>
      </form>
    </div>
  );
};
