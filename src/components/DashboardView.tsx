import React from 'react';
import { ShieldCheck, ShieldAlert, Sliders, Users, PlayCircle, History, CheckCircle2, AlertOctagon, Clock, ArrowRight, Sparkles, Building2, Calendar, Mail, Check } from 'lucide-react';
import { ProtectionRule, Scheduler, NotificationRecord, SurgeonProfile, ICloudConnectionConfig } from '../types/vigilor';
import { formatTime12h, getDayName } from '../engine/ruleEvaluator';

interface DashboardViewProps {
  rules: ProtectionRule[];
  schedulers: Scheduler[];
  notifications: NotificationRecord[];
  profile: SurgeonProfile;
  icloudConfig: ICloudConnectionConfig;
  onNavigate: (tab: 'dashboard' | 'rules' | 'schedulers' | 'simulator' | 'audit') => void;
  onToggleRule: (ruleId: string) => void;
  onOpenICloudModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  rules,
  schedulers,
  notifications,
  profile,
  icloudConfig,
  onNavigate,
  onToggleRule,
  onOpenICloudModal,
}) => {
  const activeRulesCount = rules.filter(r => r.isActive).length;
  const activeSchedulersCount = schedulers.filter(s => s.isActive).length;
  const ackedCount = notifications.filter(n => n.ackStatus === 'ACKNOWLEDGED').length;
  const unackedCount = notifications.filter(n => n.ackStatus === 'UNACKNOWLEDGED').length;
  const ackRate = notifications.length > 0 ? Math.round((ackedCount / notifications.length) * 100) : 100;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 p-6 sm:p-8 border border-slate-800 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Autonomous Clinical Availability Sentinel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Dr. {profile.name}, <span className="text-slate-400 font-normal text-xl sm:text-2xl">{profile.title}</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              {profile.specialty} • {profile.primaryHospital}. VigilOR autonomously monitors your Apple Calendar and emails OR blackout notices directly to surgery scheduling desks whenever protected windows are blocked.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('simulator')}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/25"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Test in Simulator</span>
            </button>
            <button
              onClick={onOpenICloudModal}
              className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-medium text-sm transition-all"
            >
              <Calendar className="w-4 h-4 text-sky-400" />
              <span>CalDAV Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Rules */}
        <div 
          onClick={() => onNavigate('rules')}
          className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Active Protection Rules</span>
            <Sliders className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">{activeRulesCount}</span>
            <span className="text-xs text-slate-400">of {rules.length} enabled</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-400 font-medium">Wednesday 12–5 PM Monitored</p>
        </div>

        {/* Schedulers */}
        <div 
          onClick={() => onNavigate('schedulers')}
          className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Scheduler Email Inboxes</span>
            <Users className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">{activeSchedulersCount}</span>
            <span className="text-xs text-slate-400">configured</span>
          </div>
          <p className="mt-1 text-[11px] text-sky-400 font-medium">Direct Clinical Email Relay</p>
        </div>

        {/* Closed-Loop Ack Rate */}
        <div 
          onClick={() => onNavigate('audit')}
          className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Scheduler Ack Rate</span>
            <CheckCircle2 className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">{ackRate}%</span>
            <span className="text-xs text-slate-400">closed-loop</span>
          </div>
          <p className="mt-1 text-[11px] text-purple-400 font-medium">{ackedCount} acknowledged receipt</p>
        </div>

        {/* Total Notices */}
        <div 
          onClick={() => onNavigate('audit')}
          className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Notices Dispatched</span>
            <History className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">{notifications.length}</span>
            <span className="text-xs text-slate-400">total alerts</span>
          </div>
          <p className="mt-1 text-[11px] text-amber-400 font-medium">{unackedCount} pending ack</p>
        </div>
      </div>

      {/* Two Column Section: Active Rules & Scheduler Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Protection Rules */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Active Protection Rules</span>
            </h2>
            <button
              onClick={() => onNavigate('rules')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
            >
              <span>Manage Rules</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {rules.map(rule => {
              const daysFormatted = rule.daysOfWeek.map(d => getDayName(d)).join(', ');
              const timeFormatted = `${formatTime12h(rule.startTime)} – ${formatTime12h(rule.endTime)}`;

              return (
                <div
                  key={rule.id}
                  className="bg-slate-900 rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${rule.isActive ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                      <span className="font-bold text-white text-sm">{rule.name}</span>
                    </div>

                    <button
                      onClick={() => onToggleRule(rule.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        rule.isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {rule.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 font-mono">
                      📅 {daysFormatted}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 font-mono">
                      ⏰ {timeFormatted}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-purple-300 border border-slate-800 font-mono">
                      ⏳ {rule.debounceMinutes}m Buffer
                    </span>
                    {rule.maskEventDetails && (
                      <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-emerald-300 border border-slate-800">
                        🔒 Masked Title
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Schedulers Inboxes */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Users className="w-5 h-5 text-sky-400" />
              <span>Target Scheduler Inboxes</span>
            </h2>
            <button
              onClick={() => onNavigate('schedulers')}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center space-x-1"
            >
              <span>View Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {schedulers.map(scheduler => (
              <div
                key={scheduler.id}
                className="bg-slate-900 rounded-2xl p-4 border border-slate-800 flex items-center justify-between shadow-md"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-xs border border-sky-500/20">
                    {scheduler.fullName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">{scheduler.fullName}</div>
                    <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                      <Mail className="w-3 h-3 text-emerald-400" />
                      <span>{scheduler.email}</span>
                    </div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Email
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
