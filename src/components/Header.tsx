import React from 'react';
import { 
  Layers, 
  Cpu, 
  ShieldCheck, 
  FileText, 
  Award, 
  Zap, 
  Scale, 
  QrCode,
  GitFork,
  Wrench
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'procedures' | 'bottlenecks' | 'portfolio' | 'handheld' | 'quickwins' | 'patent_studio' | 'export';
  setActiveTab: (tab: 'procedures' | 'bottlenecks' | 'portfolio' | 'handheld' | 'quickwins' | 'patent_studio' | 'export') => void;
  shortlistCount: number;
  totalInnovationsCount: number;
  onOpenQRCode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  shortlistCount,
  totalInnovationsCount,
  onOpenQRCode
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Banner / Status Line */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Branding & Master Operator Persona */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
            <Cpu className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                SURGICAL INNOVATION ENGINE <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-mono">v1.4</span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
              <span>Cross-Disciplinary R&D</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400">Master Surgeon Curation Studio & Patent Center</span>
            </p>
          </div>
        </div>

        {/* Global Action & Metric Badges */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
          
          {/* iPhone QR Code Quick Access Button */}
          <button
            onClick={onOpenQRCode}
            className="px-3 py-1.5 rounded-lg bg-cyan-950/80 text-cyan-300 border border-cyan-700/80 hover:bg-cyan-900 flex items-center space-x-1.5 shadow-md shadow-cyan-500/10 transition-all font-semibold"
            title="Scan QR Code to open on iPhone Safari"
          >
            <QrCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>📱 iPhone Safari QR</span>
          </button>

          <div className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center space-x-2">
            <Award className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-slate-400">Total Portfolio:</span>
            <span className="text-white font-semibold">300 Instruments</span>
          </div>

          <button
            onClick={() => setActiveTab('patent_studio')}
            className={`px-3 py-1.5 rounded-lg border flex items-center space-x-2 transition-all ${
              activeTab === 'patent_studio'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-cyan-400" />
            <span>Patent Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`px-3 py-1.5 rounded-lg border flex items-center space-x-2 transition-all ${
              shortlistCount > 0 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Shortlist:</span>
            <span className="font-bold text-white px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-300">
              {shortlistCount}
            </span>
          </button>
        </div>
      </div>

      {/* Navigation Ribbon Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 overflow-x-auto">
        <nav className="flex space-x-6 min-w-max">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'portfolio'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Top 100 Frontier Innovations</span>
          </button>

          <button
            onClick={() => setActiveTab('handheld')}
            className={`py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'handheld'
                ? 'border-teal-400 text-teal-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Wrench className="w-4 h-4 text-teal-400" />
            <span>Top 100 Handheld Instruments (Low-Capital)</span>
          </button>

          <button
            onClick={() => setActiveTab('quickwins')}
            className={`py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'quickwins'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Top 100 Quick-Win Accessories</span>
          </button>

          <button
            onClick={() => setActiveTab('procedures')}
            className={`py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'procedures'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Top-Down Procedure Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('bottlenecks')}
            className={`py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'bottlenecks'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <GitFork className="w-4 h-4" />
            <span>Cross-Section Bottlenecks</span>
          </button>

          <button
            onClick={() => setActiveTab('patent_studio')}
            className={`py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'patent_studio'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Patent Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'export'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Invention Dossier & Export</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
