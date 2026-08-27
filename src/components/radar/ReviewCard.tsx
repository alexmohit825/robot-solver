import React from 'react';
import { Star, AlertTriangle, ShieldAlert, Sparkles, MessageSquare, ExternalLink, CheckCircle2, Clock, Building2, User, Tag, Check, AlertCircle, FileText, Send } from 'lucide-react';
import { Review, Platform } from '../../types/reputation';

interface ReviewCardProps {
  review: Review;
  onSelectReview: (review: Review, initialAction?: 'RESPOND' | 'DISPUTE_TAKEDOWN' | 'AMPLIFY_RESHARE') => void;
  onOpenDispute: (review: Review) => void;
  onOpenAmplify: (review: Review) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onSelectReview,
  onOpenDispute,
  onOpenAmplify
}) => {
  const getPlatformBadge = (platform: Platform) => {
    switch (platform) {
      case 'GOOGLE':
        return { name: 'Google Business', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: 'G' };
      case 'HEALTHGRADES':
        return { name: 'Healthgrades', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: 'HG' };
      case 'YELP':
        return { name: 'Yelp', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20', icon: 'Y' };
      case 'RATEMDS':
        return { name: 'RateMDs', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: 'RM' };
      case 'VITALS':
        return { name: 'Vitals / WebMD', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', icon: 'V' };
      default:
        return { name: platform, bg: 'bg-slate-700 text-slate-300 border-slate-600', icon: '★' };
    }
  };

  const getTagBadge = (tag: string) => {
    switch (tag) {
      case 'WAIT_TIME':
        return { label: '⏱️ Wait Time', style: 'bg-amber-500/10 text-amber-300 border-amber-500/20' };
      case 'FRONT_DESK':
        return { label: '🏢 Front Desk', style: 'bg-purple-500/10 text-purple-300 border-purple-500/20' };
      case 'BILLING':
        return { label: '💳 Billing', style: 'bg-rose-500/10 text-rose-300 border-rose-500/20' };
      case 'BEDSIDE_MANNER':
        return { label: '🩺 Bedside Manner', style: 'bg-teal-500/10 text-teal-300 border-teal-500/20' };
      case 'CLINICAL_OUTCOME':
        return { label: '✨ Surgical Outcome', style: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' };
      default:
        return { label: tag, style: 'bg-slate-700/50 text-slate-300 border-slate-600' };
    }
  };

  const getResolutionStatusBadge = () => {
    switch (review.status) {
      case 'PUBLISHED':
        return {
          label: '✓ Addressed: Response Published Live',
          description: `Physician reply published directly to ${review.platform}.`,
          bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
          icon: CheckCircle2,
          isAddressed: true
        };
      case 'DISPUTE_IN_PROGRESS':
        return {
          label: '🛡️ Addressed: ToS Takedown Petition Dispatched',
          description: `Formal legalistic appeal filed with ${review.platform} trust & safety team. Under review for removal.`,
          bg: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
          icon: ShieldAlert,
          isAddressed: true
        };
      case 'AMPLIFIED':
        return {
          label: '🚀 Addressed: 5-Star Re-Share SMS Sent',
          description: `Patient sent 1-click invitation to copy-paste review onto Healthgrades & Vitals.`,
          bg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40',
          icon: Sparkles,
          isAddressed: true
        };
      case 'DRAFTED':
        return {
          label: '📝 In Progress: Draft Ready in Injector',
          description: `AI response prepared and queued for 1-click directory injection.`,
          bg: 'bg-teal-500/15 text-teal-300 border-teal-500/40',
          icon: FileText,
          isAddressed: false
        };
      default:
        return {
          label: '⚠️ Pending: Needs Physician Attention',
          description: `Review is unaddressed. Recommended action: ${review.suggestedAction === 'DISPUTE_TAKEDOWN' ? 'File Takedown Dispute' : review.suggestedAction === 'AMPLIFY_RESHARE' ? 'Amplify to other sites' : 'AI Respond'}.`,
          bg: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
          icon: AlertCircle,
          isAddressed: false
        };
    }
  };

  const platformBadge = getPlatformBadge(review.platform);
  const statusBadge = getResolutionStatusBadge();
  const isNegative = review.rating <= 2;
  const isPositive = review.rating >= 4;
  const hasProfanity = review.reviewText.toLowerCase().includes('f***ing') || review.reviewText.toLowerCase().includes('scam');
  const StatusIcon = statusBadge.icon;

  return (
    <div className={`bg-slate-900/90 border rounded-xl p-4 sm:p-5 transition-all shadow-sm hover:shadow-md ${
      statusBadge.isAddressed
        ? 'border-emerald-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/10'
        : isNegative 
          ? 'border-amber-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/10' 
          : 'border-slate-800 hover:border-teal-500/40'
    }`}>
      
      {/* Top Row: Platforms, Aliases, and Prominent Checkmark / Status Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-800/80">
        <div className="flex items-center flex-wrap gap-2">
          {/* Platform Tag */}
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border flex items-center space-x-1.5 ${platformBadge.bg}`}>
            <span className="font-bold">{platformBadge.icon}</span>
            <span>{platformBadge.name}</span>
          </span>

          {/* Star Rating */}
          <div className="flex items-center space-x-0.5 bg-slate-800/80 px-2 py-1 rounded-md border border-slate-700">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-3.5 h-3.5 ${
                  s <= review.rating 
                    ? review.rating <= 2 ? 'text-amber-400 fill-amber-400' : 'text-yellow-400 fill-yellow-400'
                    : 'text-slate-600'
                }`}
              />
            ))}
            <span className="text-xs font-bold text-slate-200 ml-1.5">{review.rating}.0</span>
          </div>

          {/* Matched Alias Tag */}
          {review.matchedAlias && (
            <span className="text-[10px] bg-slate-800 text-teal-300 border border-slate-700 px-2 py-0.5 rounded font-mono hidden sm:inline-flex items-center space-x-1">
              <Tag className="w-2.5 h-2.5 text-teal-400" />
              <span>Matched: "{review.matchedAlias}"</span>
            </span>
          )}
        </div>

        {/* Resolution Status Badge with Checkmark */}
        <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg border text-xs font-bold ${statusBadge.bg}`}>
          <StatusIcon className="w-3.5 h-3.5 shrink-0" />
          <span>{statusBadge.label}</span>
        </div>
      </div>

      {/* Author & Timestamp */}
      <div className="flex items-center space-x-2 text-xs text-slate-400 mb-2">
        <div className="flex items-center space-x-1">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-300">{review.authorName}</span>
        </div>
        <span>•</span>
        <span>Published {new Date(review.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>

      {/* Review Body Text */}
      <p className="text-sm text-slate-200 leading-relaxed mb-3.5">
        "{review.reviewText}"
      </p>

      {/* Where This Review Stands Explainer Bar */}
      <div className="mb-3.5 bg-slate-950/70 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 flex items-start space-x-2">
        <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">Where this review stands: </span>
          <span className="text-slate-400">{statusBadge.description}</span>
        </div>
      </div>

      {/* Existing Response Callout */}
      {review.existingResponse && (
        <div className="mb-3.5 bg-slate-800/60 border border-slate-700/60 rounded-lg p-3 text-xs text-slate-300">
          <div className="flex items-center justify-between text-teal-400 font-semibold mb-1">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Published Physician Response ({review.existingResponse.publishedVia.replace('_', ' ')})</span>
            </span>
            <span className="text-slate-400 text-[11px]">
              {new Date(review.existingResponse.publishedAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-slate-300 italic">"{review.existingResponse.text}"</p>
        </div>
      )}

      {/* Bottom Row: Operational Tags & Action CTAs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
        {/* Operational Vector Tags */}
        <div className="flex flex-wrap gap-1.5">
          {review.operationalTags.map((tag) => {
            const badge = getTagBadge(tag);
            return (
              <span key={tag} className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${badge.style}`}>
                {badge.label}
              </span>
            );
          })}
          {hasProfanity && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center space-x-1">
              <ShieldAlert className="w-3 h-3" />
              <span>ToS Violation Flag</span>
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {isNegative && (
            <>
              {hasProfanity || review.suggestedAction === 'DISPUTE_TAKEDOWN' ? (
                <button
                  onClick={() => onOpenDispute(review)}
                  className="flex items-center space-x-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>{review.status === 'DISPUTE_IN_PROGRESS' ? 'View Takedown Dossier' : 'Dispute Takedown'}</span>
                </button>
              ) : null}

              <button
                onClick={() => onSelectReview(review, 'RESPOND')}
                className="flex items-center space-x-1.5 bg-teal-600 hover:bg-teal-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{review.existingResponse ? 'Edit Response' : 'AI Respond'}</span>
              </button>
            </>
          )}

          {isPositive && (
            <button
              onClick={() => onOpenAmplify(review)}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
              <span>{review.status === 'AMPLIFIED' ? 'Amplify Again' : 'Amplify & Re-Share'}</span>
            </button>
          )}

          {!isNegative && !isPositive && (
            <button
              onClick={() => onSelectReview(review, 'RESPOND')}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition"
            >
              <span>View Details</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
