import React, { useState } from 'react';
import { Star, Download, Share2, Sparkles, Check, Stethoscope, Quote, Heart, MapPin } from 'lucide-react';
import { Review, SocialCardTheme } from '../../types/reputation';
import { PHYSICIAN_PROFILE } from '../../data/mockReviews';

interface SocialCardStudioProps {
  review: Review;
}

const THEMES: SocialCardTheme[] = [
  {
    id: 'NAVY_GOLD',
    name: 'Executive Navy & Gold',
    bgGradient: 'from-slate-900 via-slate-900 to-amber-950/40',
    cardBg: 'bg-slate-900',
    textColor: 'text-slate-100',
    accentColor: 'text-amber-400',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30'
  },
  {
    id: 'EMERALD_TEAL',
    name: 'Clinical Sage & Teal',
    bgGradient: 'from-slate-900 via-slate-900 to-teal-950/40',
    cardBg: 'bg-slate-900',
    textColor: 'text-slate-100',
    accentColor: 'text-teal-400',
    badgeBg: 'bg-teal-500/10 text-teal-300 border-teal-500/30'
  },
  {
    id: 'MIDNIGHT_CYAN',
    name: 'Modern Cyan & Slate',
    bgGradient: 'from-slate-950 via-slate-900 to-cyan-950/40',
    cardBg: 'bg-slate-900',
    textColor: 'text-slate-100',
    accentColor: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
  }
];

export const SocialCardStudio: React.FC<SocialCardStudioProps> = ({ review }) => {
  const [selectedTheme, setSelectedTheme] = useState<SocialCardTheme>(THEMES[0]);
  const [copied, setCopied] = useState<boolean>(false);

  const handleDownload = () => {
    alert('Social media card exported in high-resolution 1080x1080 PNG format for Dr. Mohit\'s channels!');
  };

  const handleShare = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Pillar 3: Social Media "Social Proof" Card Studio</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Transform 5-star patient surgical testimonials into high-converting branded visual quote cards for Instagram, LinkedIn, and Facebook.
          </p>
        </div>

        {/* Theme Selector */}
        <div className="flex items-center space-x-2">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                selectedTheme.id === theme.id
                  ? 'bg-slate-800 text-white border-teal-500 ring-1 ring-teal-500'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              {theme.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Preview & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Visual Card (7 cols) */}
        <div className="lg:col-span-7 flex justify-center">
          <div className={`w-full max-w-md aspect-square rounded-2xl p-8 border border-slate-700/80 bg-gradient-to-br ${selectedTheme.bgGradient} shadow-2xl flex flex-col justify-between relative overflow-hidden`}>
            
            {/* Background Quote Watermark */}
            <Quote className="w-32 h-32 text-slate-800/40 absolute -top-4 -right-4 pointer-events-none" />

            {/* Top Bar: Practice Badge & Platform */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
                  <Stethoscope className="w-4 h-4 text-teal-400" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">{PHYSICIAN_PROFILE.practiceName}</span>
                  <span className="text-[10px] text-slate-400">{PHYSICIAN_PROFILE.specialty.split('&')[0]} • Tacoma, WA</span>
                </div>
              </div>

              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${selectedTheme.badgeBg}`}>
                ⭐ Verified {review.platform} Review
              </span>
            </div>

            {/* Middle: Stars & Quote */}
            <div className="space-y-4 relative z-10 my-auto">
              <div className="flex items-center space-x-1 text-yellow-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 fill-yellow-400" />
                ))}
              </div>

              <blockquote className="text-sm sm:text-base font-medium text-slate-100 italic leading-relaxed">
                "{review.reviewText}"
              </blockquote>
            </div>

            {/* Bottom: Doctor Name & Reviewer Signature */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 relative z-10 text-xs">
              <div>
                <span className="font-semibold text-slate-300 block">{review.authorName}</span>
                <span className="text-[10px] text-slate-400">Tacoma Clinical Patient</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-teal-300 block">{PHYSICIAN_PROFILE.name}</span>
                <span className="text-[10px] text-slate-400">{PHYSICIAN_PROFILE.website.replace('https://', '')}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Controls (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Export & Social Publishing
          </h4>

          <div className="space-y-3">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3 text-xs text-slate-300 space-y-1">
              <span className="font-semibold text-teal-300">Format Presets:</span>
              <p className="text-[11px] text-slate-400">
                Instagram Square (1080x1080), LinkedIn Posts, Facebook Practice Page, Practice Website Testimonials.
              </p>
            </div>

            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white py-2.5 rounded-lg text-xs font-bold transition shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download 1080x1080 PNG Graphic</span>
            </button>

            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 py-2.5 rounded-lg text-xs font-medium transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Share Link Copied!' : 'Copy Social Media Share Link'}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
