import React, { useState } from 'react';
import { 
  Zap, 
  Clock, 
  Filter, 
  Search, 
  CheckCircle2, 
  Copy, 
  Ruler, 
  Scale
} from 'lucide-react';
import { QUICK_WIN_TOOLS } from '../data/quickWinTools';
import { QuickWinTool } from '../types';

interface QuickWinToolsDeckProps {
  onSelectBlueprint: (title: string, rank: number, category: string, blueprint: any) => void;
}

export const QuickWinToolsDeck: React.FC<QuickWinToolsDeckProps> = ({
  onSelectBlueprint
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Ergonomic Grips', 'Vision & Anti-Glare', 'Suction & Fluidics', 'Dural Fixation', 'Cable & OR Flow', 'Lighting & Optical'];

  const filteredTools = QUICK_WIN_TOOLS.filter(tool => {
    const matchesSearch = 
      tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.ergonomicPayoff.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.immediateMechanism.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesTime = selectedTimeFilter === 'All' || tool.timeToORImplementation.includes(selectedTimeFilter);

    return matchesSearch && matchesCategory && matchesTime;
  });

  const handleCopy = (tool: QuickWinTool) => {
    const text = `
[QUICK-WIN SURGICAL TOOL PROTOTYPE BRIEF]
Title: #${tool.rank} - ${tool.title}
Category: ${tool.category} | Time to OR: ${tool.timeToORImplementation}
Design Effort: ${tool.designEffortScore} | Estimated Cost: ${tool.estimatedPrototypingCost}
Patent Strategy: ${tool.patentRecommendation}
Immediate Mechanism: ${tool.immediateMechanism}
Ergonomic Payoff: ${tool.ergonomicPayoff}
Target Specialties: ${tool.affectedSpecialties.join(', ')}
`;
    navigator.clipboard.writeText(text);
    setCopiedId(tool.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              RAPID-ADOPTION INTRAOP TOOLS (TOP 100 MINIMAL DESIGN EFFORT)
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              High-impact, low-friction surgical accessories and ergonomics modifiers that can be 3D printed or molded in &lt; 30–60 days.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800/60">
          ✓ Complete 100-Tool Quick-Win Portfolio
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search 100 quick-win accessories..."
              className="w-full bg-slate-950 border border-slate-800 pl-9 pr-4 py-2 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-slate-500">Timeline:</span>
            {['All', '< 30 Days', '60 Days', '90 Days'].map(t => (
              <button
                key={t}
                onClick={() => setSelectedTimeFilter(t)}
                className={`px-2.5 py-1 rounded transition-all ${
                  selectedTimeFilter === t ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

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
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-semibold' 
                  : 'bg-slate-950 text-slate-400 border border-slate-800/80 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTools.map((tool) => (
          <div 
            key={tool.id}
            className="bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-all hover:shadow-xl hover:bg-slate-900/90 group"
          >
            {/* Header */}
            <div className="space-y-2 border-b border-slate-800/60 pb-3">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                  QUICK-WIN #{tool.rank}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> {tool.timeToORImplementation.split(' ')[0]} {tool.timeToORImplementation.split(' ')[1]}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                {tool.title}
              </h3>

              {/* Patent Strategy Tag */}
              <div className="text-[10px] font-mono text-slate-400">
                <span className={tool.patentRecommendation.includes('PROVISIONAL') ? 'text-emerald-400' : 'text-cyan-400'}>
                  {tool.patentRecommendation.includes('PROVISIONAL') ? '★ File Provisional' : '⚡ Public Domain Free'}
                </span>
              </div>
            </div>

            {/* Immediate Mechanism & Ergonomic Payoff */}
            <div className="space-y-2.5 flex-1 text-xs">
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-[10px] font-mono text-cyan-400 block font-bold">IMMEDIATE MECHANISM:</span>
                <p className="text-slate-300 mt-0.5 leading-relaxed font-mono text-[11px]">
                  {tool.immediateMechanism}
                </p>
              </div>

              <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60">
                <span className="text-[10px] font-mono text-emerald-400 block font-bold">SURGEON ERGONOMIC PAYOFF:</span>
                <p className="text-slate-300 mt-0.5 leading-relaxed text-[11px]">
                  {tool.ergonomicPayoff}
                </p>
              </div>
            </div>

            {/* Footer: Prototyping Cost & Action */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between font-mono text-[10px] gap-2">
              <div className="text-slate-400">
                <span>Cost: <strong className="text-emerald-400">{tool.estimatedPrototypingCost}</strong></span>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => onSelectBlueprint(tool.title, tool.rank, tool.category, tool.blueprint)}
                  className="px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-400 text-cyan-300 text-xs font-semibold flex items-center gap-1 transition-all"
                  title="View 2D CAD Line Drawing"
                >
                  <Ruler className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Blueprint</span>
                </button>

                <button
                  onClick={() => handleCopy(tool)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-xs font-semibold flex items-center space-x-1 transition-all"
                >
                  {copiedId === tool.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === tool.id ? "Copied" : "Brief"}</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
