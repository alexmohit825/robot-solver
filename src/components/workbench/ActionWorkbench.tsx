import React, { useState } from 'react';
import { MessageSquare, ShieldAlert, StickyNote, Star, ArrowLeft, Building2, User, Globe, AlertTriangle, Info } from 'lucide-react';
import { Review } from '../../types/reputation';
import { AiResponseEditor } from './AiResponseEditor';
import { InternalNotesTab } from './InternalNotesTab';

interface ActionWorkbenchProps {
  review: Review;
  onBack: () => void;
  onOpenDispute: (review: Review) => void;
  onResponsePublished: (reviewId: string, text: string, method: 'DIRECT_API' | 'COMPANION_EXTENSION') => void;
  onNoteAdded: (review: Review) => void;
  onOpenExtensionSim: () => void;
}

export const ActionWorkbench: React.FC<ActionWorkbenchProps> = ({
  review,
  onBack,
  onOpenDispute,
  onResponsePublished,
  onNoteAdded,
  onOpenExtensionSim
}) => {
  const [activeTab, setActiveTab] = useState<'RESPONSE' | 'NOTES'>('RESPONSE');

  const isNegative = review.rating <= 2;
  const hasProfanity = review.reviewText.toLowerCase().includes('f***ing') || review.reviewText.toLowerCase().includes('scam');

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Radar Inbox</span>
        </button>

        {hasProfanity && (
          <button
            onClick={() => onOpenDispute(review)}
            className="flex items-center space-x-1.5 bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Switch to ToS Dispute Studio</span>
          </button>
        )}
      </div>

      {/* Section Explainer Guide Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex items-start space-x-3.5">
        <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-xs text-slate-300 space-y-1">
          <h2 className="text-sm font-bold text-white">Action & Mitigation Workbench Guide</h2>
          <p className="text-slate-400 leading-relaxed">
            <strong>What this section does:</strong> This workspace helps you review the full context of a patient's review and draft an empathetic, legally safe response using an AI co-pilot. For Google, you can publish directly with 1 click. For directories like Healthgrades or Yelp, you can dispatch the text directly into the directory form injector.
          </p>
        </div>
      </div>

      {/* Main Split-View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Full Review Context & Patient Data (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            {/* Header / Platform / Rating */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  {review.platform} Review
                </span>
                <div className="flex items-center space-x-1 mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= review.rating 
                          ? review.rating <= 2 ? 'text-amber-400 fill-amber-400' : 'text-yellow-400 fill-yellow-400'
                          : 'text-slate-600'
                      }`}
                    />
                  ))}
                  <span className="text-sm font-bold text-white ml-1.5">{review.rating}.0</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-medium text-slate-300 block">{review.authorName}</span>
                <span className="text-[11px] text-slate-500">
                  {new Date(review.publishedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </span>
              </div>
            </div>

            {/* Review Full Text */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Public Review Text
              </label>
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-3.5 text-sm text-slate-200 leading-relaxed italic">
                "{review.reviewText}"
              </div>
            </div>

            {/* Operational Vector Tags */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Detected Operational Areas
              </label>
              <div className="flex flex-wrap gap-1.5">
                {review.operationalTags.map((t) => (
                  <span key={t} className="text-xs bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-md font-medium">
                    {t.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>

            {/* Matched Patient Information (if identified in clinic contact registry) */}
            {review.matchedPatientContact && (
              <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-3.5 space-y-2">
                <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Matched Patient Record (Tacoma Clinic)</span>
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Patient Name</span>
                    <span className="font-medium">{review.matchedPatientContact.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Contact Phone</span>
                    <span className="font-medium">{review.matchedPatientContact.phone}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 text-[10px] block">Last Clinical Encounter</span>
                    <span className="font-medium">{review.matchedPatientContact.lastVisitDate}</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Workbench Actions (AI Response, Notes) (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          
          {/* Tabs */}
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab('RESPONSE')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'RESPONSE'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
              <span>AI Response Co-Pilot</span>
            </button>

            <button
              onClick={() => setActiveTab('NOTES')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'NOTES'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <StickyNote className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tacoma Staff Notes ({(review.internalNotes || []).length})</span>
            </button>
          </div>

          {/* Active Tab View */}
          {activeTab === 'RESPONSE' && (
            <AiResponseEditor
              review={review}
              onResponsePublished={onResponsePublished}
              onOpenExtensionSim={onOpenExtensionSim}
            />
          )}

          {activeTab === 'NOTES' && (
            <InternalNotesTab
              review={review}
              onNoteAdded={onNoteAdded}
            />
          )}

        </div>

      </div>
    </div>
  );
};
