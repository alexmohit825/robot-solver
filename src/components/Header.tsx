import React from 'react';
import { ShieldCheck, ShieldAlert, RefreshCw, Calendar, Users, Sliders, PlayCircle, History, Cloud, User, Mail } from 'lucide-react';
import { ICloudConnectionConfig, SurgeonProfile, EmailRelayConfig } from '../types/vigilor';

interface HeaderProps {
  activeTab: 'dashboard' | 'rules' | 'schedulers' | 'simulator' | 'audit';
  setActiveTab: (tab: 'dashboard' | 'rules' | 'schedulers' | 'simulator' | 'audit') => void;
  isPaused: boolean;
  isSyncing: boolean;
  onManualSync: () => void;
  icloudConfig: ICloudConnectionConfig;
  onOpenICloudModal: () => void;
  profile: SurgeonProfile;
  onOpenProfileModal: () => void;
  onOpenEmailModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isPaused,
  isSyncing,
  onManualSync,
  icloudConfig,
  onOpenICloudModal,
  profile,
  onOpenProfileModal,
  onOpenEmailModal,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white">Vigil<span className="text-emerald-400">OR</span></span>
                <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Email Sentinel
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Autonomous OR Schedule Sentinel & Clinical Email Relay</p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/50">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('rules')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'rules'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Protection Rules</span>
            </button>

            <button
              onClick={() => setActiveTab('schedulers')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'schedulers'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Scheduler Inboxes</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'simulator'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <PlayCircle className="w-4 h-4" />
              <span>Email Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'audit'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Audit Logs</span>
            </button>
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center space-x-2">
            {/* Test Email Relay Button */}
            <button
              onClick={onOpenEmailModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-300 font-bold transition-all shadow-sm"
              title="Test Clinical Email Relay"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Test Email Relay</span>
            </button>

            {/* Surgeon Profile Button */}
            <button
              onClick={onOpenProfileModal}
              className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs text-slate-200 transition-colors"
              title="Edit Surgeon Profile & Credentials"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                {profile.name.split(' ').filter(n => n.length > 0).map(n => n[0]).join('').substring(0, 2)}
              </div>
              <span className="hidden lg:inline font-semibold">{profile.name}</span>
            </button>

            {/* iCloud Status Pill */}
            <button
              onClick={onOpenICloudModal}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs text-slate-300 transition-colors"
              title="iCloud CalDAV Settings"
            >
              <Cloud className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden xl:inline font-medium">iCloud:</span>
              <span className="text-emerald-400 font-semibold">Active</span>
            </button>

            {/* Sync Button */}
            <button
              onClick={onManualSync}
              disabled={isSyncing}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all disabled:opacity-50"
              title="Trigger CalDAV Delta Sync"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto space-x-1 py-2 border-t border-slate-800 no-scrollbar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-emerald-500 text-white' : 'text-slate-400'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'rules' ? 'bg-emerald-500 text-white' : 'text-slate-400'
            }`}
          >
            Rules
          </button>
          <button
            onClick={() => setActiveTab('schedulers')}
            className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'schedulers' ? 'bg-emerald-500 text-white' : 'text-slate-400'
            }`}
          >
            Inboxes
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'simulator' ? 'bg-emerald-500 text-white' : 'text-slate-400'
            }`}
          >
            Email Simulator
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'audit' ? 'bg-emerald-500 text-white' : 'text-slate-400'
            }`}
          >
            Audit Logs
          </button>
        </div>
      </div>
    </header>
  );
};
