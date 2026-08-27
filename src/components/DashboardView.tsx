import React from 'react';
import { Shield, Clock, Users, CheckCircle2, AlertTriangle, ArrowRight, Bell, Calendar, Sparkles, MessageSquare, Mail, Plus, Cloud } from 'lucide-react';
import { ProtectionRule, Scheduler, NotificationRecord, SurgeonProfile, ICloudConnectionConfig } from '../types/vigilor';
import { getDayName, formatTime12h } from '../engine/ruleEvaluator';

interface DashboardViewProps {
  rules: ProtectionRule[];
  schedulers: Scheduler[];
  notifications: NotificationRecord[];
  profile: SurgeonProfile;
  icloudConfig: ICloudConnectionConfig;
  onNavigate: (tab: 'rules' | 'schedulers' | 'simulator' | 'audit') => void;
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
  const activeRules = rules.filter(r => r.isActive);
  const activeSchedulers = schedulers.filter(s => s.isActive);
  
  const totalSent = notifications.length;
  const totalAcked = notifications.filter(n => n.ackStatus === 'ACKNOWLEDGED').length;
  const ackRate = totalSent > 0 ? Math.round((totalAcked / totalSent) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 rounded-2xl p-6 border border-slate-700/60 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{profile.specialty} Sentinel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Dr. {profile.name}, {profile.title}
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              VigilOR is safeguarding your clinical availability. Whenever you schedule a block during protected hours (e.g. Wednesday afternoons), automated notices will be routed to your surgery scheduling team.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!icloudConfig.isConnected ? (
              <button
                onClick={onOpenICloudModal}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all shadow-lg shadow-sky-500/25"
              >
                <Cloud className="w-4 h-4" />
                <span>Connect iCloud Calendar</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('simulator')}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/25"
              >
                <span>Test in Simulator</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            
            <button
              onClick={() => onNavigate('rules')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 font-medium text-sm transition-colors"
            >
              Adjust Protected Windows
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{activeRules.length}</div>
            <div className="text-xs text-slate-400 font-medium">Protected OR Rules</div>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{activeSchedulers.length}</div>
            <div className="text-xs text-slate-400 font-medium">Configured Schedulers</div>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{totalSent}</div>
            <div className="text-xs text-slate-400 font-medium">Outbound Alerts Sent</div>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{totalSent > 0 ? `${ackRate}%` : '100%'}</div>
            <div className="text-xs text-slate-400 font-medium">Acknowledgment Rate</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Rules + Multi-Scheduler Directory Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Protection Rules */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span>Active Protection Rules</span>
            </h2>
            <button
              onClick={() => onNavigate('rules')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              <span>Edit Rules</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {rules.map((rule) => {
              const daysFormatted = rule.daysOfWeek.map(d => getDayName(d)).join(', ');
              const timeFormatted = `${formatTime12h(rule.startTime)} – ${formatTime12h(rule.endTime)}`;
              
              return (
                <div
                  key={rule.id}
                  className={`p-5 rounded-xl border transition-all ${
                    rule.isActive
                      ? 'bg-slate-900/90 border-slate-700/80 shadow-md'
                      : 'bg-slate-950/50 border-slate-850 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${rule.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                        <h3 className="font-semibold text-white text-base">{rule.name}</h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                          📅 {daysFormatted}
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-medium">
                          ⏰ {timeFormatted}
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-medium">
                          ⏳ {rule.debounceMinutes}m debounce buffer
                        </span>
                        {rule.maskEventDetails && (
                          <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium">
                            🔒 Title Masked
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 pt-1">
                        Target Schedulers: {rule.assignedSchedulerIds.length === 0 
                          ? 'Broadcast to all active schedulers' 
                          : `${rule.assignedSchedulerIds.length} designated contact(s)`}
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rule.isActive}
                        onChange={() => onToggleRule(rule.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Schedulers Directory Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Users className="w-5 h-5 text-sky-400" />
              <span>Surgery Schedulers</span>
            </h2>
            <button
              onClick={() => onNavigate('schedulers')}
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center space-x-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {schedulers.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 text-center space-y-3">
                <Users className="w-8 h-8 text-slate-600 mx-auto" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-300">No Schedulers Added Yet</p>
                  <p className="text-[11px] text-slate-500">Add your surgical scheduling coordinator's phone or email.</p>
                </div>
                <button
                  onClick={() => onNavigate('schedulers')}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 text-xs font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Scheduler</span>
                </button>
              </div>
            ) : (
              schedulers.map((scheduler) => (
                <div
                  key={scheduler.id}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white text-sm">{scheduler.fullName}</h3>
                      <p className="text-xs text-slate-400">{scheduler.facilityName || 'Primary Facility'}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      scheduler.preferredChannel === 'BOTH'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : scheduler.preferredChannel === 'SMS'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    }`}>
                      {scheduler.preferredChannel}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex flex-col space-y-1 text-xs text-slate-300">
                    {scheduler.phone && (
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-3 h-3 text-emerald-400" />
                        <span>{scheduler.phone}</span>
                      </div>
                    )}
                    {scheduler.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-3 h-3 text-sky-400" />
                        <span className="truncate">{scheduler.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Alerts Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Bell className="w-5 h-5 text-purple-400" />
            <span>Recent Dispatched Alerts</span>
          </h2>
          {notifications.length > 0 && (
            <button
              onClick={() => onNavigate('audit')}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center space-x-1"
            >
              <span>View Full Audit Log</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-500">
            No outbound alerts dispatched yet. Once an event is scheduled on Wednesday afternoon (or your custom rule), alerts will be logged here.
          </div>
        ) : (
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
            {notifications.slice(0, 3).map((record) => (
              <div key={record.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-850/50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white text-sm">{record.schedulerName}</span>
                    <span className="text-xs text-slate-400">({record.schedulerFacility})</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      record.channel === 'SMS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-sky-500/20 text-sky-400'
                    }`}>
                      {record.channel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono">
                    {record.eventSummary}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Triggered by: {record.ruleName} • {record.sentAt ? new Date(record.sentAt).toLocaleString() : 'Pending'}
                  </p>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    record.ackStatus === 'ACKNOWLEDGED'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : record.ackStatus === 'CONFLICT'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{record.ackStatus}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
