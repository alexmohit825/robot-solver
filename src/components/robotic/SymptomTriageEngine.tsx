import React, { useState, useEffect } from 'react';
import { PlatformType } from '../../data/roboticPlatforms';
import { ROBOTIC_SYMPTOM_TREES } from '../../data/roboticSymptomTrees';
import { 
  AlertTriangle, 
  HelpCircle, 
  RotateCcw, 
  CheckCircle2, 
  ChevronRight, 
  ShieldAlert, 
  Compass, 
  Crosshair, 
  FileCheck2 
} from 'lucide-react';

interface SymptomTriageEngineProps {
  currentPlatform: PlatformType;
}

export const SymptomTriageEngine: React.FC<SymptomTriageEngineProps> = ({
  currentPlatform
}) => {
  const platformTrees = ROBOTIC_SYMPTOM_TREES.filter(t => t.platform === currentPlatform);
  const [selectedTreeId, setSelectedTreeId] = useState<string>(platformTrees[0]?.id || '');
  const [currentNodeId, setCurrentNodeId] = useState<string>('root');
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const updatedTrees = ROBOTIC_SYMPTOM_TREES.filter(t => t.platform === currentPlatform);
    if (updatedTrees.length > 0) {
      setSelectedTreeId(updatedTrees[0].id);
      setCurrentNodeId('root');
      setHistory([]);
    }
  }, [currentPlatform]);

  const activeTree = platformTrees.find(t => t.id === selectedTreeId) || platformTrees[0];
  const currentNode = activeTree?.nodes[currentNodeId];

  const handleSelectOption = (nextNodeId?: string) => {
    if (nextNodeId) {
      setHistory(prev => [...prev, currentNodeId]);
      setCurrentNodeId(nextNodeId);
    }
  };

  const handleReset = () => {
    setCurrentNodeId('root');
    setHistory([]);
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentNodeId(prev);
    }
  };

  if (!activeTree || !currentNode) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
        No active diagnostic trees available for this platform.
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <Compass className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-semibold tracking-wider text-amber-400 uppercase">Intraoperative Triage</span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400">Clinical Differential Engine</span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {activeTree.symptomTitle}
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {history.length > 0 && (
            <button
              onClick={handleBack}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-mono transition-colors"
            >
              ← Step Back
            </button>
          )}
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-mono flex items-center space-x-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Flow</span>
          </button>
        </div>
      </div>

      <div className="py-6">
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Diagnostic Checkpoint</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
            {currentNode.question}
          </h4>
          {currentNode.contextHint && (
            <p className="mt-2 text-sm text-slate-400 font-mono bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 flex items-start space-x-2">
              <span className="text-amber-400 font-bold">OR Tip:</span>
              <span>{currentNode.contextHint}</span>
            </p>
          )}
        </div>

        <div className="space-y-3">
          {currentNode.options.map((opt, idx) => {
            const hasResolution = Boolean(opt.resolution);
            return (
              <div key={idx}>
                {!hasResolution ? (
                  <button
                    onClick={() => handleSelectOption(opt.nextNodeId)}
                    className="w-full text-left p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/60 hover:bg-slate-800/60 transition-all group flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                        <span>{opt.label}</span>
                      </div>
                      {opt.description && (
                        <p className="text-xs text-slate-400 mt-1 font-mono">{opt.description}</p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1" />
                  </button>
                ) : (
                  <div className={`p-6 rounded-2xl border ${
                    opt.resolution?.isCritical 
                      ? 'bg-rose-950/30 border-rose-500/40 ring-1 ring-rose-500/20' 
                      : 'bg-emerald-950/30 border-emerald-500/40 ring-1 ring-emerald-500/20'
                  }`}>
                    <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-800">
                      <div className="flex items-center space-x-2.5">
                        {opt.resolution?.isCritical ? (
                          <ShieldAlert className="w-6 h-6 text-rose-400" />
                        ) : (
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        )}
                        <div>
                          <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                            opt.resolution?.isCritical ? 'text-rose-400' : 'text-emerald-400'
                          }`}>
                            {opt.resolution?.isCritical ? 'CRITICAL ROOT CAUSE IDENTIFIED' : 'VERIFIED RESOLUTION PROTOCOL'}
                          </span>
                          <h4 className="text-lg font-bold text-white">{opt.resolution?.title}</h4>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                        opt.resolution?.isCritical 
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {opt.resolution?.isCritical ? 'ACTION REQUIRED' : 'RESOLVABLE IN-SITU'}
                      </span>
                    </div>

                    <div className="my-4">
                      <p className="text-sm text-slate-200 leading-relaxed">
                        {opt.resolution?.diagnosis}
                      </p>
                    </div>

                    <div className="bg-slate-950/90 rounded-xl p-4 border border-slate-800/80 mb-4">
                      <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                        <FileCheck2 className="w-4 h-4" />
                        <span>Step-by-Step Resolution Actions</span>
                      </div>
                      <ol className="space-y-2 text-xs sm:text-sm text-slate-200">
                        {opt.resolution?.criticalActions.map((action, aIdx) => (
                          <li key={aIdx} className="flex items-start space-x-2.5">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-xs font-mono font-bold mt-0.5">
                              {aIdx + 1}
                            </span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                      <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                        <div className="text-emerald-400 font-bold flex items-center space-x-1 mb-1">
                          <Crosshair className="w-3.5 h-3.5" />
                          <span>VERIFICATION CHECK</span>
                        </div>
                        <p className="text-slate-300">{opt.resolution?.verificationCheck}</p>
                      </div>

                      <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                        <div className="text-amber-400 font-bold flex items-center space-x-1 mb-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>ESCALATION FALLBACK</span>
                        </div>
                        <p className="text-slate-300">{opt.resolution?.escalationFallback}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
