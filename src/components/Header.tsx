import React from 'react';
import { 
  Radio, 
  Activity, 
  AlertTriangle, 
  Search, 
  Eye, 
  QrCode, 
  Github, 
  ShieldCheck
} from 'lucide-react';
import { PlatformType } from '../data/roboticPlatforms';

interface HeaderProps {
  activeSection: 'triage' | 'errors' | 'los';
  setActiveSection: (section: 'triage' | 'errors' | 'los') => void;
  selectedPlatform: PlatformType;
  onOpenQRCode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  setActiveSection,
  selectedPlatform,
  onOpenQRCode
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      {/* Top Banner / Identity Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Branding & Subtitle */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
            <Radio className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                ROBOT SOLVER
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-semibold">
                  v2.0
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
              <span className="text-cyan-400 font-medium">Intraoperative Spine Robotics Engine</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">Globus ExcelsiusGPS® & Medtronic Mazor X™</span>
            </p>
          </div>
        </div>

        {/* Global Action & Telemetry Badges */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
          {/* Active Platform Telemetry Badge */}
          <div className={`px-3 py-1.5 rounded-lg border flex items-center space-x-2 transition-all ${
            selectedPlatform === 'EXCELSIUS'
              ? 'bg-cyan-950/80 text-cyan-300 border-cyan-700/80 shadow-sm shadow-cyan-500/10'
              : 'bg-amber-950/80 text-amber-300 border-amber-700/80 shadow-sm shadow-amber-500/10'
          }`}>
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span className="text-slate-400">Target Platform:</span>
            <span className="font-bold uppercase tracking-wider">
              {selectedPlatform === 'EXCELSIUS' ? 'ExcelsiusGPS®' : 'Mazor X™'}
            </span>
          </div>

          {/* iPhone Safari QR Modal */}
          <button
            onClick={onOpenQRCode}
            className="px-3 py-1.5 rounded-lg bg-slate-900 text-cyan-300 border border-slate-700 hover:border-cyan-500/60 hover:bg-slate-800 flex items-center space-x-1.5 transition-all font-semibold shadow-sm"
            title="Scan QR Code to open directly on iPhone Safari"
          >
            <QrCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>📱 iPhone PWA</span>
          </button>

          {/* GitHub Repo Button */}
          <a
            href="https://github.com/alexmohit825/robot-solver"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 flex items-center space-x-1.5 transition-all font-medium"
            title="View source repository on GitHub"
          >
            <Github className="w-3.5 h-3.5 text-slate-400" />
            <span>GitHub</span>
          </a>

          {/* Live OR Verification Status */}
          <div className="bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>OR Safe Mode</span>
          </div>
        </div>
      </div>

      {/* Primary Navigation Ribbon - PURE ROBOT SOLVER */}
      <div className="bg-slate-900/60 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 py-2 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800">
          {/* 1. Diagnostic Triage Portal */}
          <button
            onClick={() => setActiveSection('triage')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeSection === 'triage'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-sm shadow-rose-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <AlertTriangle className={`w-4 h-4 ${activeSection === 'triage' ? 'text-rose-400' : 'text-slate-500'}`} />
            <span>🚨 "The Robot Is Way Off" (Symptom Triage)</span>
          </button>

          {/* 2. Error Code Resolver */}
          <button
            onClick={() => setActiveSection('errors')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeSection === 'errors'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Search className={`w-4 h-4 ${activeSection === 'errors' ? 'text-amber-400' : 'text-slate-500'}`} />
            <span>🔍 Software Error Codes (Excelsius & Mazor X)</span>
          </button>

          {/* 3. Line of Sight & Geometry Guide */}
          <button
            onClick={() => setActiveSection('los')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeSection === 'los'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Eye className={`w-4 h-4 ${activeSection === 'los' ? 'text-cyan-400' : 'text-slate-500'}`} />
            <span>📐 Line of Sight & 3D Tracking Envelope</span>
          </button>
        </div>
      </div>
    </header>
  );
};
