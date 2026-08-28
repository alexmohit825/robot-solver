import React, { useState } from 'react';
import { 
  Wrench, 
  Clock, 
  DollarSign, 
  Filter, 
  Search, 
  CheckCircle2, 
  Copy, 
  Ruler, 
  Sparkles,
  Layers,
  Award
} from 'lucide-react';
import { TOP_100_HANDHELD_SUITE } from '../data/top100HandheldInstruments';
import { HandheldInstrument, HandheldCategory } from '../types';

interface HandheldInstrumentsDeckProps {
  onSelectBlueprint: (title: string, rank: number, category: string, blueprint: any) => void;
}

export const HandheldInstrumentsDeck: React.FC<HandheldInstrumentsDeckProps> = ({
  onSelectBlueprint
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories: string[] = [
    'All',
    'Suctions & Fluidic Scavengers',
    'Rongeurs & Micro-Punches',
    'Probes & Micro-Dissectors',
    'Bipolar & Electrosurgical Tools',
    'Handheld Retractors & Specula',
    'Micro-Elevators & Curettes'
  ];

  const filteredInstruments = TOP_100_HANDHELD_SUITE.filter(inst => {
    const matchesSearch = 
      inst.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.clinicalAdvantage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.mechanicalInnovation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.primaryTarget.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || inst.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCopy = (inst: HandheldInstrument) => {
    const text = `
[LOW-CAPITAL SURGICAL HANDHELD INSTRUMENT BRIEF]
Rank: #${inst.rank} - ${inst.title}
Category: ${inst.category}
Primary Target: ${inst.primaryTarget}
Prototyping Cost: ${inst.estimatedPrototypingCost} | Lead Time: ${inst.prototypingLeadTimeDays} Days
Machining Method: ${inst.machiningMethod}
Materials: ${inst.materials}
Clinical Advantage: ${inst.clinicalAdvantage}
Mechanical Innovation: ${inst.mechanicalInnovation}
Ergonomic Handle: ${inst.ergonomicHandpieceDesign}
Patent Strategy: ${inst.patentStrategy}
`;
    navigator.clipboard.writeText(text);
    setCopiedId(inst.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              LOW-CAPITAL HANDHELD SURGICAL INSTRUMENTS (TOP 100 SUITE)
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Direct machine-shop prototypes for neurosurgery and spine: Suctions, Rongeurs, Probes, Bipolars, Retractors & Curettes ($300 - $1,400 prototype cost).
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1.5 rounded-lg border border-cyan-800/60 font-semibold">
          100 Machine-Shop Blueprints
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search suctions, rongeurs, probes, bipolars..."
              className="w-full bg-slate-950 border border-slate-800 pl-9 pr-4 py-2 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <span className="text-xs font-mono text-slate-400">
            Showing <strong className="text-white">{filteredInstruments.length}</strong> Handheld Blueprints
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-[11px] font-mono text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> CATEGORY:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${
                selectedCategory === cat 
                  ? 'bg-teal-950 text-teal-300 border border-teal-600 font-semibold shadow-inner' 
                  : 'bg-slate-950 text-slate-400 border border-slate-800/80 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Instruments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredInstruments.map((inst) => (
          <div 
            key={inst.id}
            className="bg-slate-900 border border-slate-800 hover:border-teal-500/60 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-all hover:shadow-xl hover:bg-slate-900/90 group"
          >
            {/* Card Header */}
            <div className="space-y-2 border-b border-slate-800/60 pb-3">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 font-bold">
                  INSTRUMENT #{inst.rank}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> {inst.prototypingLeadTimeDays} Days CNC Lead Time
                </span>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors leading-snug">
                {inst.title}
              </h3>

              <div className="text-[10px] font-mono text-amber-400">
                Target: {inst.primaryTarget}
              </div>
            </div>

            {/* Body: Clinical Advantage & Mechanical Detail */}
            <div className="space-y-2.5 flex-1 text-xs">
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-[10px] font-mono text-cyan-400 block font-bold">MECHANICAL INNOVATION:</span>
                <p className="text-slate-300 mt-0.5 leading-relaxed font-mono text-[11px]">
                  {inst.mechanicalInnovation}
                </p>
              </div>

              <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60">
                <span className="text-[10px] font-mono text-teal-400 block font-bold">CLINICAL / OR ADVANTAGE:</span>
                <p className="text-slate-300 mt-0.5 leading-relaxed text-[11px]">
                  {inst.clinicalAdvantage}
                </p>
              </div>

              <div className="text-[10px] font-mono text-slate-500">
                <span className="text-slate-400">Machining: </span>{inst.machiningMethod}
              </div>
            </div>

            {/* Footer: Prototyping Cost & Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between font-mono text-[10px] gap-2">
              <div className="text-slate-400">
                <span>Cost: <strong className="text-emerald-400">{inst.estimatedPrototypingCost}</strong></span>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => onSelectBlueprint(inst.title, inst.rank, inst.category, inst.blueprint)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-400 text-cyan-300 text-xs font-semibold flex items-center gap-1 transition-all"
                  title="View 2D CAD Orthographic Line Drawing"
                >
                  <Ruler className="w-3.5 h-3.5 text-cyan-400" />
                  <span>CAD Blueprint</span>
                </button>

                <button
                  onClick={() => handleCopy(inst)}
                  className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-teal-300 text-xs font-semibold flex items-center space-x-1 transition-all"
                >
                  {copiedId === inst.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === inst.id ? "Copied" : "Brief"}</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
