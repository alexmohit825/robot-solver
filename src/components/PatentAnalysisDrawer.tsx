import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  ShieldCheck, 
  Scale, 
  Copy, 
  CheckCircle2, 
  AlertCircle,
  Award,
  BookOpen,
  AlertTriangle,
  Zap,
  ArrowLeft
} from 'lucide-react';
import { InnovationDossier } from '../types';

interface PatentAnalysisDrawerProps {
  innovation: InnovationDossier;
  onClose: () => void;
}

export const PatentAnalysisDrawer: React.FC<PatentAnalysisDrawerProps> = ({
  innovation,
  onClose
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const patent = innovation.deepPatentAnalysis;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const recommendation = patent?.filingRecommendation || 'RECOMMENDED: FILE PROVISIONAL PATENT';
  const isProceed = recommendation.includes('FILE PROVISIONAL');
  const isPublicDomain = recommendation.includes('PUBLIC DOMAIN');
  const isCaution = recommendation.includes('CAUTION');

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header with Back Button */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-amber-950/90 text-amber-300 border border-amber-600/80 hover:bg-amber-900 hover:text-white flex items-center gap-1.5 font-mono text-xs font-bold shadow-lg transition-all cursor-pointer"
              title="Return to Main Portfolio"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>← Back to Home</span>
            </button>

            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono font-bold">
                  PATENT ANALYSIS & PRIOR ART DOSSIER
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Rank #{innovation.rank}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5 line-clamp-1">
                {innovation.title}
              </h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* PATENT RECOMMENDATION DECISION BANNER */}
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            isProceed 
              ? 'bg-emerald-950/30 border-emerald-500/60 text-emerald-300' 
              : isPublicDomain 
                ? 'bg-cyan-950/30 border-cyan-500/60 text-cyan-300' 
                : 'bg-rose-950/30 border-rose-500/60 text-rose-300'
          }`}>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {isProceed && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                {isPublicDomain && <Zap className="w-5 h-5 text-cyan-400 shrink-0" />}
                {isCaution && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />}
                <span className="font-mono font-bold text-sm tracking-wider uppercase">
                  AI PATENT RECOMMENDATION: {recommendation}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-7">
                {patent.filingRecommendationRationale}
              </p>
            </div>
            
            <span className="shrink-0 text-xs font-mono font-bold px-3 py-1 rounded bg-slate-900 border border-slate-700">
              {isProceed ? 'Priority High' : isPublicDomain ? 'Zero License Fee' : 'Design Work Required'}
            </span>
          </div>

          {/* Telemetry: USPTO Classes & FTO Score */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px]">USPTO / CPC CLASS CODES</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {patent.usptoClassCodes.map(code => (
                  <span key={code} className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold">
                    {code}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px]">FREEDOM TO OPERATE (FTO)</span>
              <span className="text-emerald-400 font-bold text-sm block mt-1">
                {patent.freedomToOperateAssessment}
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px]">COMMERCIAL EXCLUSIVITY</span>
              <span className="text-amber-400 font-bold text-sm block mt-1">
                {patent.commercialExclusivityPotential}
              </span>
            </div>
          </div>

          {/* Section 1: Draft Independent & Dependent Claims */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> DRAFT PATENT CLAIMS (35 U.S.C. § 112)
              </h3>
              <button
                onClick={() => handleCopy(`${patent.draftIndependentClaim}\n\n${patent.draftDependentClaims.join('\n')}`, 'claims')}
                className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'claims' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'claims' ? 'Copied' : 'Copy Claims'}</span>
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800/80">
                <span className="text-cyan-400 font-bold block mb-1">INDEPENDENT CLAIM 1:</span>
                <p className="text-slate-200 leading-relaxed">
                  {patent.draftIndependentClaim}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-slate-400 font-bold block text-[11px]">DEPENDENT CLAIMS:</span>
                {patent.draftDependentClaims.map((dep, idx) => (
                  <div key={idx} className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/60 text-slate-300 leading-relaxed">
                    {dep}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Prior Art Landscape & Closest Patents */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <BookOpen className="w-4 h-4" /> CLOSEST PRIOR ART CITATIONS & WHITE-SPACE DIFFERENTIATION
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {patent.closestPriorArtPatents.map((pa) => (
                <div key={pa.patentNumber} className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 font-bold">{pa.patentNumber}</span>
                    <span className="text-slate-500 text-[10px]">{pa.filingDate} {pa.isExpired ? '(Expired)' : '(Active)'}</span>
                  </div>
                  <h4 className="text-slate-200 font-bold">{pa.title}</h4>
                  <div className="text-[11px] text-slate-400">
                    <span className="text-slate-500 block text-[10px]">ORIGIN:</span>
                    {pa.donorIndustry}
                  </div>
                  <div className="bg-slate-950/80 p-2 rounded border border-slate-800/80 text-[11px] text-amber-300">
                    <span className="text-slate-500 block text-[10px]">DIFFERENTIATION DELTA:</span>
                    {pa.keyDifference}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: 35 U.S.C. § 103 (Non-Obviousness) & § 102 (Novelty) Defenses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
              <h4 className="text-cyan-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> 35 U.S.C. § 103 NON-OBVIOUSNESS DEFENSE
              </h4>
              <p className="text-slate-300 leading-relaxed font-sans text-xs">
                {patent.section103NonObviousnessArgument}
              </p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
              <h4 className="text-emerald-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> 35 U.S.C. § 102 NOVELTY BOUNDARY
              </h4>
              <p className="text-slate-300 leading-relaxed font-sans text-xs">
                {patent.section102NoveltyBoundary}
              </p>
            </div>
          </div>

        </div>

        {/* Footer with Back Button */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between sticky bottom-0 z-10">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-mono font-bold rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Home Page</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            Close Patent View
          </button>
        </div>

      </div>
    </div>
  );
};
