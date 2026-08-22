import React, { useState, useMemo } from 'react';
import { EMOJI_CATEGORIES } from '../engine/EmojiData';
import { Search, Delete, Globe, Sparkles } from 'lucide-react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onBackToAlpha: () => void;
  onBackspace: () => void;
  height: number;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  onEmojiSelect,
  onBackToAlpha,
  onBackspace,
  height
}) => {
  const [activeCategoryIdx, setActiveCategoryIdx] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const displayedEmojis = useMemo(() => {
    if (!searchQuery.trim()) {
      return EMOJI_CATEGORIES[activeCategoryIdx].emojis;
    }
    const q = searchQuery.toLowerCase();
    // Filter across all categories
    const all = EMOJI_CATEGORIES.flatMap((c) => c.emojis);
    return Array.from(new Set(all));
  }, [activeCategoryIdx, searchQuery]);

  return (
    <div
      className="w-full flex flex-col justify-between bg-slate-950/95 text-slate-100 select-none overflow-hidden"
      style={{ height: `${height}px` }}
    >
      {/* Top Search Bar */}
      <div className="p-2 border-b border-slate-800 flex items-center space-x-2">
        <div className="flex-1 bg-slate-900 rounded-xl px-3 py-1.5 flex items-center space-x-2 border border-slate-800">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search Emoji..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-slate-200 focus:outline-none w-full placeholder-slate-500"
          />
        </div>

        <button
          onClick={onBackspace}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
        >
          <Delete className="w-4 h-4" />
        </button>
      </div>

      {/* Emoji Scrollable Grid */}
      <div className="flex-1 p-2 overflow-y-auto grid grid-cols-7 sm:grid-cols-8 gap-1 content-start">
        {displayedEmojis.map((emoji, idx) => (
          <button
            key={idx}
            onClick={() => onEmojiSelect(emoji)}
            className="h-10 text-2xl flex items-center justify-center rounded-xl hover:bg-slate-800/80 active:scale-125 transition-all"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Bottom Category Selector & Return to ABC Bar */}
      <div className="h-11 bg-slate-900/90 border-t border-slate-800 px-3 flex items-center justify-between text-xs">
        <button
          onClick={onBackToAlpha}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold border border-slate-700 transition-colors"
        >
          ABC
        </button>

        <div className="flex items-center space-x-2 overflow-x-auto">
          {EMOJI_CATEGORIES.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveCategoryIdx(idx);
                setSearchQuery("");
              }}
              className={`p-1.5 rounded-lg text-base transition-all ${
                activeCategoryIdx === idx && !searchQuery
                  ? 'bg-slate-800 scale-110 shadow-sm border border-slate-700'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              {cat.icon}
            </button>
          ))}
        </div>

        <button
          onClick={onBackspace}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold border border-slate-700"
        >
          ⌫
        </button>
      </div>
    </div>
  );
};
