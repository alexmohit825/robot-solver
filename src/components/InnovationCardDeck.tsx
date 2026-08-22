import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  Sliders, 
  ChevronRight,
  Sparkles,
  Scale,
  Ruler
} from 'lucide-react';
import { InnovationDossier, SurgeonReviewState, ReviewStatus } from '../types';

interface InnovationCardDeckProps {
  innovations: InnovationDossier[];
  reviewStates: Record<string, SurgeonReviewState>;
  onSelectInnovation: (innovation: InnovationDossier) => void;
  onSelectPatentAnalysis: (innovation: InnovationDossier) => void;
  onSelectBlueprint: (innovation: InnovationDossier) => void;
  onQuickStatusChange: (id: string, status: ReviewStatus) => void;
}

export const InnovationCardDeck: React.FC<InnovationCardDeckProps> = ({
  innovations,
  reviewStates,
  onSelectInnovation,
  onSelectPatentAnalysis,
  onSelectBlueprint,
  onQuickStatusChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rank' | 'multiplier' | 'transferability'>('rank');

  const categories: string[] = [
    'All',
    'Access & Retraction',
    'Drills & Cavitation',
    'Tables & Patient Positioning',
    'Visualization & Optics',
    'Maneuvering & Micro-Instruments',
    'Closure & Dural Repair'
  ];

  const filteredInnovations = innovations.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.donorField.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.donorDeviceOrigin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mechanicalDelta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.clinicalProblemStatement.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    const itemStatus = reviewStates[item.id]?.status || 'unreviewed';
    const matchesStatus = 
      selectedStatusFilter === 'All' ||
      (selectedStatusFilter === 'shortlisted' && itemStatus === 'shortlisted') ||
      (selectedStatusFilter === 'refining' && itemStatus === 'refining') ||
      (selectedStatusFilter === 'unreviewed' && itemStatus === 'unreviewed');

    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'rank') return a.rank - b.rank;
    if (sortBy === 'multiplier') return b.crossSectionalMultiplier - a.crossSectionalMultiplier;
    if (sortBy === 'transferability') return b.regulatoryPathway.transferabilityScore - a.regulatoryPathway.transferabilityScore;
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Portfolio Controls Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-4">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by mechanism, donor field, or clinical bottleneck..."
              className="w-full bg-slate-950 border border-slate-800 pl-9 pr-4 py-2 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Quick Filters: Status & Sort */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono w-full md:w-auto">
            {/* Status Filter */}
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setSelectedStatusFilter('All')}
                className={`px-2.5 py-1 rounded transition-all ${
                  selectedStatusFilter === 'All' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({innovations.length})
              </button>
              <button
                onClick={() => setSelectedStatusFilter('shortlisted')}
                className={`px-2.5 py-1 rounded transition-all ${
                  selectedStatusFilter === 'shortlisted' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-amber-300'
                }`}
              >
                ⭐ Shortlist
              </button>
              <button
                onClick={() => setSelectedStatusFilter('refining')}
                className={`px-2.5 py-1 rounded transition-all ${
                  selectedStatusFilter === 'refining' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800' : 'text-slate-400 hover:text-white'
                }`}
              >
                In Honing
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-slate-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-cyan-400 text-xs font-mono"
              >
                <option value="rank">Rank (#1 to #100)</option>
                <option value="multiplier">Cross-Procedure Leverage</option>
                <option value="transferability">FDA Transferability Score</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
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
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-semibold shadow-inner' 
                  : 'bg-slate-950 text-slate-400 border border-slate-800/80 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
        <span>Showing <strong className="text-white">{filteredInnovations.length}</strong> Innovation Design Dossiers</span>
        <span className="text-amber-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Complete 100-Idea Deep Surgical Architecture
        </span>
      </div>

      {/* Innovation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredInnovations.map((item) => {
          const status = reviewStates[item.id]?.status || 'unreviewed';
          const isShortlisted = status === 'shortlisted';
          const isFlagged = reviewStates[item.id]?.flaggedForPatentDraft;

          return (
            <div 
              key={item.id}
              className={`group bg-slate-900/80 border rounded-xl flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:border-cyan-500/50 ${
                isShortlisted 
                  ? 'border-amber-500/60 shadow-lg shadow-amber-500/5 bg-slate-900/95 ring-1 ring-amber-500/20' 
                  : 'border-slate-800/80 hover:bg-slate-900'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 space-y-2.5 border-b border-slate-800/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-md bg-slate-950 text-cyan-400 border border-slate-800 font-mono font-bold text-xs flex items-center justify-center">
                      #{item.rank}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {isFlagged && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                        IP DRAFT
                      </span>
                    )}
                    <button
                      onClick={() => onQuickStatusChange(item.id, isShortlisted ? 'unreviewed' : 'shortlisted')}
                      className={`p-1.5 rounded-lg border transition-all ${
                        isShortlisted 
                          ? 'bg-amber-500 text-slate-950 border-amber-400' 
                          : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-amber-300 hover:border-slate-700'
                      }`}
                      title={isShortlisted ? "Remove from IP Shortlist" : "Add to IP Shortlist"}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug line-clamp-2">
                  {item.title}
                </h3>

                <div className="text-[11px] font-mono text-slate-400 bg-slate-950/70 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-amber-400 font-semibold block text-[10px]">DONOR FIELD ORIGIN:</span>
                  <span className="text-slate-300">{item.donorField}</span>
                  <span className="text-slate-500 block text-[10px] truncate mt-0.5">{item.donorDeviceOrigin}</span>
                </div>
              </div>

              {/* Card Body: Mechanical Delta */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">Mechanical Adaptation:</span>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-3 leading-relaxed">
                    {item.mechanicalDelta}
                  </p>
                </div>

                {/* Badges / Matrix Telemetry */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 text-[10px] font-mono">
                  <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-500">Cross-Section:</span>
                    <span className="text-cyan-400 font-bold">{item.crossSectionalMultiplier} Procs</span>
                  </div>
                  <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-500">FDA Score:</span>
                    <span className="text-emerald-400 font-bold">{item.regulatoryPathway.transferabilityScore}/100</span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Action Buttons (Blueprint, Patent, Hone) */}
              <div className="p-3 bg-slate-950/50 border-t border-slate-800/80 flex items-center justify-between gap-1.5">
                <button
                  onClick={() => onSelectBlueprint(item)}
                  className="px-2 py-1.5 bg-slate-900 border border-slate-800 hover:border-cyan-500/80 text-cyan-300 text-xs font-mono rounded-lg flex items-center space-x-1 transition-all"
                  title="View 2D CAD Prototype Line Drawing"
                >
                  <Ruler className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Blueprint</span>
                </button>

                <button
                  onClick={() => onSelectPatentAnalysis(item)}
                  className="px-2 py-1.5 bg-slate-900 border border-slate-800 hover:border-amber-500/80 text-amber-300 text-xs font-mono rounded-lg flex items-center space-x-1 transition-all"
                  title="Expand Deep Patent Landscape & Claims"
                >
                  <Scale className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Patent</span>
                </button>

                <button
                  onClick={() => onSelectInnovation(item)}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 text-xs font-mono font-semibold rounded-lg flex items-center space-x-1 transition-all"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Hone</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
