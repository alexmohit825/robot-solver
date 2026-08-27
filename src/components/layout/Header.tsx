import React from 'react';
import { ShieldCheck, Sparkles, Bell, Globe, Activity, Stethoscope, MapPin, Bot } from 'lucide-react';
import { PHYSICIAN_PROFILE } from '../../data/mockReviews';

interface HeaderProps {
  urgentCount: number;
  onOpenExtensionSim: () => void;
  onOpenAutopilot: () => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({ urgentCount, onOpenExtensionSim, onOpenAutopilot }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 px-6 py-3.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-slate-800 to-teal-950 border border-teal-500/40 flex items-center justify-center shadow-lg shadow-teal-950/50 p-1.5">
            <img src="/apple-touch-icon-v3.svg?v=3.5" alt="MedPulse Rep" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-teal-200 bg-clip-text text-transparent">
                MedPulse Rep
              </h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                MultiCare Edition
              </span>
            </div>
            <p className="text-xs text-slate-400">Autonomous Physician Reputation & Mitigation Suite</p>
          </div>
        </div>

        {/* Doctor Info & Status Chips */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Doctor Pill - MultiCare Neuroscience Institute */}
          <div className="flex items-center space-x-2 bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs">
            <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-bold text-slate-100">{PHYSICIAN_PROFILE.name}</span>
            <span className="text-slate-400 hidden sm:inline">| {PHYSICIAN_PROFILE.practiceName}</span>
            <span className="text-teal-400 text-[10px] font-semibold flex items-center space-x-1 pl-1 border-l border-slate-700">
              <MapPin className="w-3 h-3 text-teal-400 inline" />
              <span>Tacoma, WA</span>
            </span>
          </div>

          {/* Autopilot Sentinel Badge */}
          <button
            onClick={onOpenAutopilot}
            className="flex items-center space-x-1.5 bg-teal-950/60 border border-teal-500/40 hover:bg-teal-900/50 rounded-lg px-2.5 py-1.5 text-xs text-teal-300 transition font-medium"
            title="Open 24/7 Background Autopilot Hub"
          >
            <Bot className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            <span className="font-semibold">Autopilot 24/7</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </button>

          {/* Directory Injector Bridge */}
          <button 
            onClick={onOpenExtensionSim}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 transition"
            title="Open Directory Form Injector Bridge"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-medium">Directory Injector</span>
          </button>

          {/* Notifications Alert */}
          {urgentCount > 0 && (
            <div className="flex items-center space-x-1.5 bg-amber-500/20 border border-amber-500/40 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-medium">
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>{urgentCount} Needs Attention</span>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
