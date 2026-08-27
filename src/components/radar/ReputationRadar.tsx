import React, { useState } from 'react';
import { Star, Filter, Search, ShieldAlert, Sparkles, MessageSquare, Globe, AlertCircle, RefreshCw, Info, CheckCircle2 } from 'lucide-react';
import { Review, Platform } from '../../types/reputation';
import { PHYSICIAN_PROFILE } from '../../data/mockReviews';
import { ReviewCard } from './ReviewCard';
import { RootCauseAnalytics } from './RootCauseAnalytics';

interface ReputationRadarProps {
  reviews: Review[];
  onSelectReview: (review: Review, initialAction?: 'RESPOND' | 'DISPUTE_TAKEDOWN' | 'AMPLIFY_RESHARE') => void;
  onOpenDispute: (review: Review) => void;
  onOpenAmplify: (review: Review) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const ReputationRadar: React.FC<ReputationRadarProps> = ({
  reviews,
  onSelectReview,
  onOpenDispute,
  onOpenAmplify,
  onRefresh,
  isRefreshing
}) => {
  const [filterTab, setFilterTab] = useState<'ALL' | 'NEEDS_ACTION' | '5_STAR' | 'DISPUTE'>('ALL');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter reviews
  const filteredReviews = reviews.filter((r) => {
    // Tab filter
    if (filterTab === 'NEEDS_ACTION' && r.status !== 'NEEDS_ACTION') return false;
    if (filterTab === '5_STAR' && r.rating < 5) return false;
    if (filterTab === 'DISPUTE' && r.status !== 'DISPUTE_IN_PROGRESS' && r.suggestedAction !== 'DISPUTE_TAKEDOWN') return false;

    // Platform filter
    if (selectedPlatform !== 'ALL' && r.platform !== selectedPlatform) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = r.reviewText.toLowerCase().includes(q);
      const matchAuthor = r.authorName.toLowerCase().includes(q);
      const matchTag = r.operationalTags.some(t => t.toLowerCase().includes(q));
      if (!matchText && !matchAuthor && !matchTag) return false;
    }

    return true;
  });

  const urgentCount = reviews.filter(r => r.status === 'NEEDS_ACTION' && r.rating <= 2).length;

  return (
    <div className="space-y-6">

      {/* Section Explainer Guide Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm flex items-start space-x-3.5">
        <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-xs text-slate-300 space-y-1">
          <h2 className="text-sm font-bold text-white">Reputation Radar & Unified Inbox Guide</h2>
          <p className="text-slate-400 leading-relaxed">
            <strong>What this section does:</strong> This dashboard continuously scours the internet across Google Business, Healthgrades, Yelp, RateMDs, and Vitals to aggregate every online review of your neurosurgical practice in one place. It automatically highlights reviews needing attention, surfaces policy-violating spam for takedown, and identifies 5-star clinical reviews ready for cross-platform amplification.
          </p>
        </div>
      </div>
      
      {/* Top Scorecard & Platform Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Main Aggregate Score Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Aggregate Rating</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div className="my-2 flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-white tracking-tight">{PHYSICIAN_PROFILE.aggregateRating}</span>
            <div className="flex items-center text-yellow-400">
              <Star className="w-5 h-5 fill-yellow-400" />
            </div>
            <span className="text-xs text-slate-400 font-medium">/ 5.0</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
            <span>{PHYSICIAN_PROFILE.totalReviews} Total Verified Reviews</span>
            <span className="text-emerald-400 font-medium">+14 this month</span>
          </div>
        </div>

        {/* Platform Breakdown Strip (3 Cards) */}
        <div className="md:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              <span>Multi-Platform Ingestion Radar (Tacoma, WA)</span>
            </span>
            <button 
              onClick={onRefresh}
              disabled={isRefreshing}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-teal-400' : ''}`} />
              <span>{isRefreshing ? 'Scanning Platforms...' : 'Scan All Platforms'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Object.entries(PHYSICIAN_PROFILE.breakdown).map(([platform, data]) => (
              <div 
                key={platform}
                onClick={() => setSelectedPlatform(platform === selectedPlatform ? 'ALL' : platform)}
                className={`cursor-pointer rounded-lg p-3 border transition-all ${
                  selectedPlatform === platform
                    ? 'bg-slate-800 border-teal-500 ring-1 ring-teal-500/50'
                    : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-300 truncate">
                    {platform === 'GOOGLE' ? 'Google' : platform === 'HEALTHGRADES' ? 'Healthgrades' : platform === 'YELP' ? 'Yelp' : platform === 'RATEMDS' ? 'RateMDs' : 'Vitals'}
                  </span>
                  {data.directApi && (
                    <span className="text-[9px] text-teal-400 bg-teal-500/10 px-1 py-0.2 rounded font-semibold">API</span>
                  )}
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-lg font-bold text-white">{data.rating}</span>
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 inline" />
                </div>
                <span className="text-[10px] text-slate-400">{data.count} reviews</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Root-Cause Analytics Diagnostic Widget */}
      <RootCauseAnalytics reviews={reviews} />

      {/* Filter Toolbar & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Quick Filter Buttons */}
        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setFilterTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterTab === 'ALL'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            All Reviews ({reviews.length})
          </button>

          <button
            onClick={() => setFilterTab('NEEDS_ACTION')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              filterTab === 'NEEDS_ACTION'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-amber-300 hover:bg-amber-500/10'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Needs Action ({urgentCount})</span>
          </button>

          <button
            onClick={() => setFilterTab('5_STAR')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              filterTab === '5_STAR'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'text-slate-400 hover:text-teal-300 hover:bg-teal-500/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>5-Star Surgical Praise ({reviews.filter(r => r.rating === 5).length})</span>
          </button>

          <button
            onClick={() => setFilterTab('DISPUTE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              filterTab === 'DISPUTE'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-400 hover:text-rose-300 hover:bg-rose-500/10'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>ToS Violations / Takedowns</span>
          </button>
        </div>

        {/* Platform Dropdown & Search Input */}
        <div className="flex items-center space-x-2.5 w-full md:w-auto">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Platforms</option>
            <option value="GOOGLE">Google Business</option>
            <option value="HEALTHGRADES">Healthgrades</option>
            <option value="YELP">Yelp</option>
            <option value="RATEMDS">RateMDs</option>
            <option value="VITALS">Vitals / WebMD</option>
          </select>

          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search neurosurgery reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:border-teal-500 placeholder-slate-500"
            />
          </div>
        </div>

      </div>

      {/* Review List */}
      <div className="space-y-3.5">
        {filteredReviews.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <Filter className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-slate-300">No reviews found matching current filter</h4>
            <p className="text-xs text-slate-500 mt-1">Try clearing filters or search query to see all reviews.</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onSelectReview={onSelectReview}
              onOpenDispute={onOpenDispute}
              onOpenAmplify={onOpenAmplify}
            />
          ))
        )}
      </div>

    </div>
  );
};
