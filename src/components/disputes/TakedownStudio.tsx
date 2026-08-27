import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, FileText, Send, Copy, Check, ExternalLink, RefreshCw, Scale, Info } from 'lucide-react';
import { Review, DisputeCase } from '../../types/reputation';
import { PHYSICIAN_PROFILE } from '../../data/mockReviews';
import { ApiService } from '../../services/apiService';

interface TakedownStudioProps {
  review?: Review;
  onDisputeSubmitted: (dispute: DisputeCase) => void;
  onOpenExtensionSim: () => void;
}

export const TakedownStudio: React.FC<TakedownStudioProps> = ({
  review,
  onDisputeSubmitted,
  onOpenExtensionSim
}) => {
  const [disputeCase, setDisputeCase] = useState<DisputeCase | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (review) {
      analyzeReview(review.id);
    }
  }, [review?.id]);

  const analyzeReview = async (reviewId: string) => {
    setIsAnalyzing(true);
    try {
      const result = await ApiService.analyzeViolations(reviewId);
      setDisputeCase(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyDossier = () => {
    if (!disputeCase) return;
    navigator.clipboard.writeText(disputeCase.appealDossier.formalStatement);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitDispute = async () => {
    if (!disputeCase) return;
    setIsSubmitting(true);
    try {
      const { dispute, extensionPayload } = await ApiService.submitDispute(disputeCase.id);
      setDisputeCase(dispute);
      onDisputeSubmitted(dispute);
      if (extensionPayload) {
        onOpenExtensionSim();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!review) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-3">
        <Scale className="w-10 h-10 text-slate-600 mx-auto" />
        <h3 className="text-sm font-bold text-slate-300">No Review Selected for Takedown Investigation</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Navigate to the Reputation Radar Inbox and click "Dispute Takedown" on any review containing vulgarity, competitor spam, or unverified claims.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Section Explainer Guide Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm flex items-start space-x-3.5">
        <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-xs text-slate-300 space-y-1">
          <h2 className="text-sm font-bold text-white">Dispute & Takedown Studio Guide</h2>
          <p className="text-slate-400 leading-relaxed">
            <strong>What this section does:</strong> When a negative review contains explicit profanity, defamatory accusations without medical facts, or commercial sabotage (e.g. steering patients to a competitor), it violates platform Terms of Service. This studio analyzes the review, highlights the exact policy violations, and auto-generates a formal, citation-backed legalistic takedown dossier to submit to platform moderation teams.
          </p>
        </div>
      </div>
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-800/40 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Platform Terms of Service Takedown Studio</span>
              <span className="text-[10px] uppercase font-semibold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/40">
                ToS Enforcement
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review #{review.platformReviewId} ({review.platform}) • Author: {review.authorName} • Practice: {PHYSICIAN_PROFILE.practiceName}
            </p>
          </div>
        </div>

        {disputeCase?.status === 'SUBMITTED' && (
          <div className="flex items-center space-x-2 bg-emerald-950/60 border border-emerald-800 px-3 py-1.5 rounded-lg text-xs text-emerald-300 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Appeal Dispatched to {review.platform}</span>
          </div>
        )}
      </div>

      {isAnalyzing ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <RefreshCw className="w-6 h-6 text-rose-400 animate-spin mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-slate-200">Scanning Platform Terms of Service...</h4>
          <p className="text-xs text-slate-500 mt-1">Cross-referencing review text against platform moderation policies.</p>
        </div>
      ) : disputeCase ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Violations & Evidence (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Target Review Snippet */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Target Review Text
              </label>
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-3 text-xs text-slate-200 italic leading-relaxed">
                "{review.reviewText}"
              </div>
            </div>

            {/* Identified Policy Violations */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Detected Platform Violations ({disputeCase.violations.length})</span>
              </h4>

              <div className="space-y-2.5">
                {disputeCase.violations.map((violation, idx) => (
                  <div key={idx} className="bg-slate-800/70 border border-slate-700/70 rounded-lg p-3 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-300">{violation.title}</span>
                      <span className="text-[10px] font-semibold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded">
                        {violation.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {violation.platformPolicyClause}
                    </p>
                    <div className="text-[11px] text-amber-300 bg-amber-950/20 border border-amber-800/40 rounded px-2 py-1">
                      Matched: {violation.matchedKeywords.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Formal Legalistic Appeal Dossier (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-teal-400" />
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Formal Takedown Appeal Dossier
                </h4>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 font-mono">
                Citing {review.platform} ToS
              </span>
            </div>

            {/* Appeal Text */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400">Subject Line</label>
              <input
                type="text"
                readOnly
                value={disputeCase.appealDossier.subject}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400">Petition Letter Body</label>
              <textarea
                rows={9}
                readOnly
                value={disputeCase.appealDossier.formalStatement}
                className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg p-3 font-mono leading-relaxed resize-none"
              />
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={handleCopyDossier}
                className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-lg text-xs font-medium transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Dossier Copied!' : 'Copy Takedown Letter'}</span>
              </button>

              <button
                onClick={handleSubmitDispute}
                disabled={isSubmitting || disputeCase.status === 'SUBMITTED'}
                className="flex items-center space-x-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm"
              >
                <Send className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-pulse' : ''}`} />
                <span>
                  {disputeCase.status === 'SUBMITTED' 
                    ? 'Dispute Dispatched & Logged' 
                    : review.platform === 'GOOGLE' 
                      ? 'Submit Dispute via Google API' 
                      : 'Dispatch Dispute via Directory Injector'}
                </span>
              </button>
            </div>

          </div>

        </div>
      ) : null}

    </div>
  );
};
