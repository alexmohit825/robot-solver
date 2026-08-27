import React, { useState } from 'react';
import { Volume2, Play, Pause, Sparkles, RefreshCw, Headphones } from 'lucide-react';
import { Review } from '../../types/reputation';
import { AiEngine } from '../../services/aiEngine';

interface DailyBriefingCardProps {
  reviews: Review[];
}

export const DailyBriefingCard: React.FC<DailyBriefingCardProps> = ({ reviews }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);

  const briefing = AiEngine.generateDailyBriefing(reviews);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      setPlaybackProgress(0);
      const interval = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 100;
          }
          return prev + 5;
        });
      }, 300);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <span>Daily 30-Second Executive Audio Briefing</span>
              <span className="text-[9px] bg-teal-500/20 text-teal-300 px-1.5 py-0.2 rounded font-semibold">
                AI Synthesized
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">{briefing.date} • MultiCare Neuroscience Institute</p>
          </div>
        </div>

        <button
          onClick={togglePlay}
          className="flex items-center space-x-1.5 bg-teal-600 hover:bg-teal-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
          <span>{isPlaying ? 'Pause Audio' : 'Play Briefing'}</span>
        </button>
      </div>

      {/* Audio Progress Bar */}
      {isPlaying && (
        <div className="space-y-1">
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-400 h-1.5 rounded-full transition-all" style={{ width: `${playbackProgress}%` }}></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Playing briefing audio...</span>
            <span>{briefing.audioSeconds}s</span>
          </div>
        </div>
      )}

      {/* Text Transcript */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 text-xs text-slate-300 leading-relaxed italic">
        "{briefing.text}"
      </div>
    </div>
  );
};
