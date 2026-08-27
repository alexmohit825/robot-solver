import React from 'react';
import { ShieldCheck, ShieldAlert, PauseCircle, Play, Clock, AlertTriangle } from 'lucide-react';
import { ProtectionRule, Scheduler } from '../types/vigilor';
import { getDayName, formatTime12h } from '../engine/ruleEvaluator';

interface SentinelBannerProps {
  isPaused: boolean;
  onTogglePause: () => void;
  rules: ProtectionRule[];
  schedulers: Scheduler[];
  lastSyncTime: string | null;
}

export const SentinelBanner: React.FC<SentinelBannerProps> = ({
  isPaused,
  onTogglePause,
  rules,
  schedulers,
  lastSyncTime,
}) => {
  const activeRules = rules.filter(r => r.isActive);
  const activeSchedulers = schedulers.filter(s => s.isActive);

  return (
    <div className={`border-b transition-colors ${
      isPaused
        ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
        : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status & Description */}
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isPaused ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400 animate-pulse'
            }`}>
              {isPaused ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm tracking-wide">
                  {isPaused ? 'SENTINEL PAUSED' : 'SENTINEL ACTIVE & MONITORING'}
                </span>
                <span className={`inline-block w-2 h-2 rounded-full ${
                  isPaused ? 'bg-amber-400' : 'bg-emerald-400'
                }`} />
              </div>
              <p className="text-xs opacity-80">
                {isPaused
                  ? 'Alerts are temporarily paused. Events scheduled now will not trigger notifications.'
                  : `Watching ${activeRules.length} active OR protection rule${activeRules.length === 1 ? '' : 's'} across ${activeSchedulers.length} scheduler contact${activeSchedulers.length === 1 ? '' : 's'}.`}
              </p>
            </div>
          </div>

          {/* Quick Controls & Stats */}
          <div className="flex items-center space-x-4 self-end sm:self-center">
            {lastSyncTime && (
              <div className="hidden lg:flex items-center space-x-1.5 text-xs opacity-70">
                <Clock className="w-3.5 h-3.5" />
                <span>Last CalDAV sync: {new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
            )}

            <button
              onClick={onTogglePause}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all shadow-sm ${
                isPaused
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-amber-600/80 hover:bg-amber-500 text-white'
              }`}
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Resume Monitoring</span>
                </>
              ) : (
                <>
                  <PauseCircle className="w-3.5 h-3.5" />
                  <span>Snooze / Pause Alerts</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
