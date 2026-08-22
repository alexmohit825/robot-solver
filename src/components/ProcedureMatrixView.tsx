import React, { useState } from 'react';
import { 
  Layers, 
  ChevronRight, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  Tag, 
  ArrowRight,
  ShieldAlert,
  Cpu
} from 'lucide-react';
import { PROCEDURES } from '../data/procedures';
import { TOP_100_INNOVATIONS } from '../data/top100Innovations';
import { SurgicalProcedure, ProceduralStep, InnovationDossier } from '../types';

interface ProcedureMatrixViewProps {
  onSelectInnovation: (innovation: InnovationDossier) => void;
}

export const ProcedureMatrixView: React.FC<ProcedureMatrixViewProps> = ({
  onSelectInnovation
}) => {
  const [selectedProcedure, setSelectedProcedure] = useState<SurgicalProcedure>(PROCEDURES[0]);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const activeStep: ProceduralStep = selectedProcedure.steps[activeStepIndex] || selectedProcedure.steps[0];

  // Find innovations that match this step
  const matchingInnovations = TOP_100_INNOVATIONS.filter(inn => 
    activeStep.relevantInnovationIds.includes(inn.id)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Column: Procedure Selector Tree */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4" /> ROUTINE SPINE & NEUROSURGERY REGISTRY
            </h3>
            <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-400">
              {PROCEDURES.length} Procedures
            </span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {PROCEDURES.map((proc) => {
              const isSelected = proc.id === selectedProcedure.id;
              return (
                <button
                  key={proc.id}
                  onClick={() => {
                    setSelectedProcedure(proc);
                    setActiveStepIndex(0);
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-500/80 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {proc.shortCode}
                    </span>
                    <span className="text-amber-400">{proc.subspecialty}</span>
                  </div>

                  <h4 className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                    {proc.name}
                  </h4>

                  <div className="flex items-center space-x-3 text-[10px] font-mono text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {proc.typicalDurationMinutes} min
                    </span>
                    <span>•</span>
                    <span>{proc.steps.length} Operative Phases</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Operative Stage Flow & Cross-Discipline Matcher */}
      <div className="lg:col-span-8 space-y-5">
        
        {/* Active Procedure Header */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-mono">
                {selectedProcedure.subspecialty}
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight mt-1">
                {selectedProcedure.name}
              </h2>
            </div>
            <div className="text-right text-xs font-mono text-slate-400">
              <span>Target: <strong className="text-slate-200">{selectedProcedure.anatomicalRegion}</strong></span>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedProcedure.description}
          </p>
        </div>

        {/* 5-Stage Procedural Ribbon Stepper */}
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
          <div className="text-[11px] font-mono text-slate-400 mb-2 uppercase tracking-wider flex items-center justify-between">
            <span>SURGICAL LIFECYCLE TIMELINE</span>
            <span className="text-cyan-400">Select Phase to Inspect Innovations</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {selectedProcedure.steps.map((step, idx) => {
              const isActive = idx === activeStepIndex;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-2.5 rounded-lg border text-left transition-all relative overflow-hidden ${
                    isActive
                      ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className={isActive ? "text-cyan-400 font-bold" : "text-slate-500"}>
                      STAGE {idx + 1}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  </div>
                  <div className="text-[11px] font-bold truncate leading-tight">
                    {step.phase.split('&')[0]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Detailed Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl space-y-5">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block">
                STAGE {activeStepIndex + 1}: {activeStep.phase}
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                {activeStep.stepName}
              </h3>
            </div>
          </div>

          {/* Current Standard vs The Acute Bottleneck */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-xl space-y-1.5">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Standard Surgical Practice:</span>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                {activeStep.standardPractice}
              </p>
            </div>

            <div className="bg-rose-950/20 border border-rose-900/40 p-3.5 rounded-xl space-y-1.5">
              <span className="text-[10px] font-mono text-rose-400 font-bold block uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Acute Clinical Bottleneck:
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-mono">
                {activeStep.clinicalBottleneck}
              </p>
            </div>

          </div>

          {/* Cross-Disciplinary Innovations Mapped to this Stage */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> CROSS-DISCIPLINARY INNOVATIONS FOR THIS STEP ({matchingInnovations.length})
              </h4>
              <span className="text-[10px] font-mono text-slate-400">Derived from Non-Spine Industries</span>
            </div>

            {matchingInnovations.length === 0 ? (
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center text-xs font-mono text-slate-500">
                No direct single-tool match for this isolated step. Scoured across broader portfolio.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matchingInnovations.map((inn) => (
                  <div 
                    key={inn.id}
                    className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 hover:border-cyan-500/60 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                          RANK #{inn.rank}
                        </span>
                        <span className="text-amber-400">{inn.donorField}</span>
                      </div>

                      <h5 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {inn.title}
                      </h5>

                      <p className="text-[11px] text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                        {inn.mechanicalDelta}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-emerald-400">
                        FDA Score: {inn.regulatoryPathway.transferabilityScore}/100
                      </span>

                      <button
                        onClick={() => onSelectInnovation(inn)}
                        className="text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                      >
                        <span>Hone Specs</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
