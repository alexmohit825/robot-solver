import React, { useState } from 'react';
import { Sparkles, Smartphone, Globe, Share2, Star, Info } from 'lucide-react';
import { Review, ReShareCampaign as CampaignType } from '../../types/reputation';
import { ReShareCampaign } from './ReShareCampaign';
import { SeoWidgetPreview } from './SeoWidgetPreview';
import { SocialCardStudio } from './SocialCardStudio';

interface AmplificationHubProps {
  reviews: Review[];
  selectedReview?: Review;
  onSelectReview: (review: Review) => void;
  onCampaignSent: (campaign: CampaignType) => void;
}

export const AmplificationHub: React.FC<AmplificationHubProps> = ({
  reviews,
  selectedReview,
  onSelectReview,
  onCampaignSent
}) => {
  const [activePillar, setActivePillar] = useState<'RESHARE' | 'WIDGET' | 'SOCIAL'>('RESHARE');

  const fiveStarReviews = reviews.filter((r) => r.rating === 5);
  const currentReview = selectedReview || fiveStarReviews[0] || reviews[0];

  return (
    <div className="space-y-6">

      {/* Section Explainer Guide Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm flex items-start space-x-3.5">
        <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-xs text-slate-300 space-y-1">
          <h2 className="text-sm font-bold text-white">Positive Review Amplification Studio Guide</h2>
          <p className="text-slate-400 leading-relaxed">
            <strong>What this section does:</strong> This studio amplifies your authentic 5-star neurosurgical patient praise across the web without violating FTC anti-astroturfing rules. It provides 3 compliant pillars: (1) 1-Click Patient SMS prompts to copy their review onto Healthgrades/Vitals, (2) Website SEO Widget with Schema.org JSON-LD to display gold stars in Google search, and (3) Branded social media quote cards.
          </p>
        </div>
      </div>
      
      {/* 5-Star Review Selector Ribbon */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Select 5-Star Patient Review to Amplify ({fiveStarReviews.length} available)
        </label>
        <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar">
          {fiveStarReviews.map((r) => (
            <button
              key={r.id}
              onClick={() => onSelectReview(r)}
              className={`p-3 rounded-lg border text-left min-w-[260px] max-w-[280px] transition-all shrink-0 ${
                currentReview?.id === r.id
                  ? 'bg-teal-500/10 border-teal-500 ring-1 ring-teal-500'
                  : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-200">{r.authorName}</span>
                <span className="text-[10px] text-teal-400 font-medium">via {r.platform}</span>
              </div>
              <div className="flex items-center text-yellow-400 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3 h-3 fill-yellow-400" />
                ))}
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                "{r.reviewText}"
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 3-Pillar Tab Switcher */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActivePillar('RESHARE')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
            activePillar === 'RESHARE'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-4 h-4 text-teal-400" />
          <span>Pillar 1: 1-Click Patient Re-Share SMS</span>
        </button>

        <button
          onClick={() => setActivePillar('WIDGET')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
            activePillar === 'WIDGET'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>Pillar 2: Website SEO Widget & Schema.org</span>
        </button>

        <button
          onClick={() => setActivePillar('SOCIAL')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
            activePillar === 'SOCIAL'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Share2 className="w-4 h-4 text-amber-400" />
          <span>Pillar 3: Social Media Quote Cards</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activePillar === 'RESHARE' && currentReview && (
        <ReShareCampaign review={currentReview} onCampaignSent={onCampaignSent} />
      )}

      {activePillar === 'WIDGET' && (
        <SeoWidgetPreview reviews={reviews} />
      )}

      {activePillar === 'SOCIAL' && currentReview && (
        <SocialCardStudio review={currentReview} />
      )}

    </div>
  );
};
