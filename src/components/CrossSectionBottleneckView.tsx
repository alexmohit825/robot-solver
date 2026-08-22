import React, { useState } from 'react';
import { 
  GitFork, 
  AlertCircle, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  Activity, 
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { BOTTLENECKS } from '../data/bottlenecks';
import { PROCEDURES } from '../data/procedures';
import { TOP_100_INNOVATIONS } from '../data/top100Innovations';
import { CrossSectionalBottleneck, InnovationDossier } from '../types';

interface CrossSectionBottleneckViewProps {
  onSelectInnovation: (innovation: InnovationDossier) => void;
}

export const CrossSectionBottleneckView: React.FC<CrossSectionBottleneckViewProps> = ({
  onSelectInnovation
}) => {
  const [selectedBottleneck, setSelectedBottleneck] = useState<CrossSectionalBottleneck>(BOTTLENECKS[0]);

  // Resolve affected procedures
  const affectedProcedures = PROCEDURES.filter(p => 
    selectedBottleneck.affectedProcedureIds.includes(p.id)
  );

  // Resolve solving innovations
  const solvingInnovations = TOP_100_INNOVATIONS.filter(inn => 
    selectedBottleneck.solvedByInnovationIds.includes(inn.id)
  );

  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              CROSS-SECTIONAL BOTTLENECK CLUSTER ENGINE
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Identifies identical mechanical, optical, and ergonomic limitations that recur across disparate spine and neurosurgical operations.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Bottlenecks List & Synthesis Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Bottlenecks Heatmap Matrix */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider px-1">
            CLUSTERED CROSS-SECTIONAL LIMITATIONS ({BOTTLENECKS.length})
          </h3>

          <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
            {BOTTLENECKS.map((bn) => {
              const isSelected = bn.id === selectedBottleneck.id;
              return (
                <button
                  key={bn.id}
                  onClick={() => setSelectedBottleneck(bn)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-500/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
                      : 'bg-slate-900/80 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {bn.category}
                    </span>
                    <span className="text-cyan-400 font-bold">
                      {bn.frequencyScore} Multiplier
                    </span>
                  </div>

                  <h4 className={`text-xs font-bold leading-snug ${isSelected ? 'text-amber-300' : 'text-slate-200'}`}>
                    {bn.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {bn.clinicalImpactSummary}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-3 pt-2 border-t border-slate-800/60">
                    <span>Severity: <strong className="text-rose-400">{bn.severityRating}/5</strong></span>
                    <span>Affects <strong>{bn.affectedProcedureIds.length}</strong> Routine Procs</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Multi-Procedure Impact & Breakthrough Solutions */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Active Bottleneck Deep-Dive */}
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                  {selectedBottleneck.category}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {selectedBottleneck.title}
                </h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-rose-950/80 text-rose-300 border border-rose-800 font-mono font-semibold">
                High Friction
              </span>
            </div>

            {/* Core Physics & Clinical Cost */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[10px]">UNDERLYING PHYSICAL CONSTRAINT:</span>
                <p className="text-slate-200 leading-relaxed font-sans text-xs">
                  {selectedBottleneck.physicalConstraint}
                </p>
              </div>

              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-rose-400 block text-[10px]">CLINICAL & COMPLICATION RISK:</span>
                <p className="text-slate-200 leading-relaxed font-sans text-xs">
                  {selectedBottleneck.clinicalImpactSummary}
                </p>
              </div>
            </div>

            {/* Affected Procedures Matrix */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> RECURS ACROSS THESE ROUTINE PROCEDURES ({affectedProcedures.length})
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {affectedProcedures.map((proc) => (
                  <div key={proc.id} className="bg-slate-950/80 border border-slate-800/80 p-2.5 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 block">{proc.shortCode}</span>
                      <span className="text-xs font-bold text-slate-200">{proc.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-2">{proc.subspecialty.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Solutions: Cross-Disciplinary Innovations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> CROSS-SECTIONAL INNOVATION DESIGNS ({solvingInnovations.length})
              </h4>
              <span className="text-[10px] font-mono text-slate-400">High-Leverage Multi-Procedure Solutions</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {solvingInnovations.map((inn) => (
                <div 
                  key={inn.id}
                  className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-3 hover:border-cyan-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2 text-[10px] font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                        RANK #{inn.rank}
                      </span>
                      <span className="text-amber-400 font-semibold">{inn.donorField}</span>
                    </div>

                    <h5 className="text-sm font-bold text-white">
                      {inn.title}
                    </h5>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {inn.mechanicalDelta}
                    </p>
                  </div>

                  <div className="shrink-0 flex sm:flex-col items-end gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                      FDA Score: {inn.regulatoryPathway.transferabilityScore}/100
                    </span>

                    <button
                      onClick={() => onSelectInnovation(inn)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 text-xs font-mono font-semibold rounded-lg flex items-center space-x-1 transition-all"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Inspect Dossier</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
