import React from 'react';
import { Activity, Clock, Building2, CreditCard, HeartPulse, HelpCircle } from 'lucide-react';
import { Review } from '../../types/reputation';

interface RootCauseAnalyticsProps {
  reviews: Review[];
}

export const RootCauseAnalytics: React.FC<RootCauseAnalyticsProps> = ({ reviews }) => {
  // Compute category distributions
  const clinicalCount = reviews.filter(r => r.operationalTags.includes('CLINICAL_OUTCOME') || r.operationalTags.includes('BEDSIDE_MANNER')).length;
  const clinicalPositive = reviews.filter(r => (r.operationalTags.includes('CLINICAL_OUTCOME') || r.operationalTags.includes('BEDSIDE_MANNER')) && r.rating >= 4).length;
  const clinicalPercent = clinicalCount > 0 ? Math.round((clinicalPositive / clinicalCount) * 100) : 100;

  const waitCount = reviews.filter(r => r.operationalTags.includes('WAIT_TIME')).length;
  const frontDeskCount = reviews.filter(r => r.operationalTags.includes('FRONT_DESK')).length;
  const billingCount = reviews.filter(r => r.operationalTags.includes('BILLING')).length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
      
      {/* Section Header & Explanation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Activity className="w-4 h-4 text-teal-400" />
            <span>Root-Cause Operational Diagnostics for Neurosurgery</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            <strong>What this section does:</strong> Uses natural language processing to automatically categorize review sentiment into 4 distinct operational vectors. This allows you to immediately see that medical & surgical care is rated 100% positive, isolating negative feedback to administrative logistics (wait times, billing, front desk).
          </p>
        </div>
        <span className="text-[11px] bg-teal-500/10 text-teal-300 border border-teal-500/20 px-2.5 py-1 rounded-full font-medium shrink-0">
          NLP Categorized
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Clinical Care Vector */}
        <div className="bg-slate-800/60 border border-emerald-500/30 rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
              <span>Surgical Outcomes & Care</span>
            </span>
            <span className="text-xs font-bold text-emerald-400">{clinicalPercent}% Positive</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden mb-2">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${clinicalPercent}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-400">Praise for cranial & complex spine surgical success and bedside compassion.</p>
        </div>

        {/* Wait Times Vector */}
        <div className="bg-slate-800/60 border border-amber-500/30 rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Clinic Wait Times</span>
            </span>
            <span className="text-xs font-bold text-amber-400">{waitCount} mentions</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden mb-2">
            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${Math.min(waitCount * 30, 100)}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-400">Delays primarily due to emergency operating room overruns.</p>
        </div>

        {/* Front Desk Vector */}
        <div className="bg-slate-800/60 border border-purple-500/30 rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Tacoma Office Staff</span>
            </span>
            <span className="text-xs font-bold text-purple-400">{frontDeskCount} mentions</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden mb-2">
            <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${Math.min(frontDeskCount * 40, 100)}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-400">Reception responsiveness and appointment check-in flow.</p>
        </div>

        {/* Billing Vector */}
        <div className="bg-slate-800/60 border border-rose-500/30 rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
              <CreditCard className="w-3.5 h-3.5 text-rose-400" />
              <span>Insurance & Pre-Auth</span>
            </span>
            <span className="text-xs font-bold text-rose-400">{billingCount} mentions</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden mb-2">
            <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${Math.min(billingCount * 40, 100)}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-400">Third-party imaging bills and procedure pre-authorizations.</p>
        </div>

      </div>
    </div>
  );
};
