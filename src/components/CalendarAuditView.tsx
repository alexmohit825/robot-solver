import React, { useState } from 'react';
import { Calendar, Upload, Search, Send, CheckCircle2, AlertOctagon, Clock, ShieldCheck, FileText, Sparkles, Filter, RefreshCw, Mail, ArrowRight, UserCheck, History, AlertCircle } from 'lucide-react';
import { ProtectionRule, Scheduler, SurgeonProfile, NotificationRecord, CalendarEvent } from '../types/vigilor';
import { parseIcsCalendar } from '../engine/icsParser';
import { scanCalendarForConflicts, dispatchConflictNotice, generateSamplePreExistingCalendar, PreExistingConflictItem } from '../engine/historicalScanner';

interface CalendarAuditViewProps {
  rules: ProtectionRule[];
  schedulers: Scheduler[];
  profile: SurgeonProfile;
  onRecordNotification: (notification: NotificationRecord) => void;
  onNavigate: (tab: 'dashboard' | 'rules' | 'schedulers' | 'simulator' | 'audit' | 'calendar-audit') => void;
}

export const CalendarAuditView: React.FC<CalendarAuditViewProps> = ({
  rules,
  schedulers,
  profile,
  onRecordNotification,
  onNavigate,
}) => {
  const [conflictList, setConflictList] = useState<PreExistingConflictItem[]>(() => {
    const initialEvents = generateSamplePreExistingCalendar();
    return scanCalendarForConflicts(initialEvents, rules, schedulers, profile);
  });
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isDispatchingAll, setIsDispatchingAll] = useState<boolean>(false);
  const [dispatchProgress, setDispatchProgress] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'UPCOMING' | 'ALL' | 'PAST' | 'DISPATCHED'>('UPCOMING');

  // Handle .ics file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file.name);
    setIsScanning(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const parsedEvents = parseIcsCalendar(content, 'Apple iCalendar');
        const detected = scanCalendarForConflicts(parsedEvents, rules, schedulers, profile);
        setConflictList(detected);
      }
      setIsScanning(false);
    };
    reader.readAsText(file);
  };

  // Run Scan on sample pre-existing calendar
  const handleScanSampleCalendar = () => {
    setIsScanning(true);
    setTimeout(() => {
      const events = generateSamplePreExistingCalendar();
      const detected = scanCalendarForConflicts(events, rules, schedulers, profile);
      setConflictList(detected);
      setIsScanning(false);
    }, 600);
  };

  // Dispatch individual conflict notice (strictly blocked if past)
  const handleDispatchSingle = async (item: PreExistingConflictItem) => {
    if (item.isPast) return;

    const records = await dispatchConflictNotice(item, profile);
    records.forEach(r => onRecordNotification(r));

    setConflictList(prev => prev.map(c => {
      if (c.id === item.id) {
        return {
          ...c,
          status: 'DISPATCHED',
          dispatchedAt: new Date().toISOString()
        };
      }
      return c;
    }));
  };

  // Dispatch all pending UPCOMING conflicts in batch (Past events strictly excluded)
  const handleDispatchAll = async () => {
    const pendingUpcoming = conflictList.filter(c => !c.isPast && c.status === 'PENDING_DISPATCH');
    if (pendingUpcoming.length === 0) return;

    setIsDispatchingAll(true);
    setDispatchProgress(`Preparing batch dispatch for ${pendingUpcoming.length} upcoming appointments (past events excluded)...`);

    let sentCount = 0;
    for (const item of pendingUpcoming) {
      setDispatchProgress(`Dispatching notice for ${item.eventDateFormatted} (${sentCount + 1}/${pendingUpcoming.length})...`);
      const records = await dispatchConflictNotice(item, profile);
      records.forEach(r => onRecordNotification(r));
      sentCount++;
      // Brief pause to avoid rate limits
      await new Promise(res => setTimeout(res, 400));
    }

    setConflictList(prev => prev.map(c => {
      if (!c.isPast && c.status === 'PENDING_DISPATCH') {
        return {
          ...c,
          status: 'DISPATCHED',
          dispatchedAt: new Date().toISOString()
        };
      }
      return c;
    }));

    setIsDispatchingAll(false);
    setDispatchProgress(`🎉 Batch dispatch complete! Dispatched official OR blackout notices for all ${pendingUpcoming.length} upcoming appointments to Emily & Richona.`);
    setTimeout(() => setDispatchProgress(null), 6000);
  };

  const filtered = conflictList.filter(item => {
    if (filterMode === 'UPCOMING') return !item.isPast;
    if (filterMode === 'PAST') return item.isPast;
    if (filterMode === 'DISPATCHED') return item.status === 'DISPATCHED';
    return true;
  });

  const upcomingPendingCount = conflictList.filter(c => !c.isPast && c.status === 'PENDING_DISPATCH').length;
  const upcomingDispatchedCount = conflictList.filter(c => !c.isPast && c.status === 'DISPATCHED').length;
  const pastCount = conflictList.filter(c => c.isPast).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-emerald-950/40 p-6 sm:p-8 border border-slate-800 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Historical Calendar Audit & Backfill Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Pre-Existing Appointment Audit
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              Identifies Wednesday afternoon appointments created in Apple Calendar prior to app deployment. <strong className="text-emerald-300 font-semibold">Strict Rule:</strong> Past appointments are kept for audit history only; alerts are dispatched exclusively for upcoming future dates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDispatchAll}
              disabled={isDispatchingAll || upcomingPendingCount === 0}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-40"
            >
              <Send className={`w-4 h-4 ${isDispatchingAll ? 'animate-bounce' : ''}`} />
              <span>{isDispatchingAll ? 'Dispatching Batch...' : `Dispatch Upcoming (${upcomingPendingCount} Pending)`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress / Status Feedback */}
      {dispatchProgress && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs font-semibold flex items-center space-x-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{dispatchProgress}</span>
        </div>
      )}

      {/* 2-Column Controls & Import */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: File Upload & Scan Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-5 shadow-xl">
            <h2 className="text-base font-bold text-white flex items-center space-x-2 pb-3 border-b border-slate-800">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>1. Ingest Apple iCalendar (.ics)</span>
            </h2>

            {/* Drag & Drop / File Input */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Import Apple Calendar Export
              </label>
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-2xl cursor-pointer bg-slate-950/60 hover:bg-slate-950 transition-all text-center group">
                <FileText className="w-8 h-8 text-slate-500 group-hover:text-emerald-400 transition-colors mb-2" />
                <span className="text-xs font-bold text-slate-300 group-hover:text-white">
                  {selectedFile ? `Selected: ${selectedFile}` : 'Choose or Drag .ics file'}
                </span>
                <span className="text-[11px] text-slate-500 mt-1">
                  Export from Apple Calendar (File &gt; Export &gt; Export...)
                </span>
                <input
                  type="file"
                  accept=".ics,text/calendar"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Preset Fast Scan Button */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Quick Historical Scan
              </label>
              <button
                onClick={handleScanSampleCalendar}
                disabled={isScanning}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-emerald-400' : ''}`} />
                <span>{isScanning ? 'Scanning Calendar...' : 'Scan Pre-Existing Wednesday Appointments'}</span>
              </button>
            </div>

            {/* Safety Filter Policy Box */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-850 space-y-2 text-xs">
              <div className="font-bold text-sky-300 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>Past Date Suppression Policy</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                VigilOR automatically enforces that appointments prior to today are marked as completed history. No emails will ever be dispatched to MultiCare coordinators for past events.
              </p>
            </div>

            {/* Target Schedulers Callout */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-850 space-y-2 text-xs">
              <div className="font-bold text-white flex items-center space-x-1.5">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Recipients for Upcoming Alerts:</span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-300">
                {schedulers.map(s => (
                  <li key={s.id} className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span><strong>{s.fullName}</strong> &lt;{s.email}&gt;</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Identified Conflicts Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Wednesday Blocked Windows ({filtered.length})</span>
              </h2>
              <p className="text-xs text-slate-400">
                {upcomingPendingCount} upcoming pending • {upcomingDispatchedCount} upcoming sent • {pastCount} past (suppressed)
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold overflow-x-auto no-scrollbar">
              <button
                onClick={() => setFilterMode('UPCOMING')}
                className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap ${
                  filterMode === 'UPCOMING' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Upcoming ({upcomingPendingCount + upcomingDispatchedCount})
              </button>
              <button
                onClick={() => setFilterMode('PAST')}
                className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap ${
                  filterMode === 'PAST' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Past ({pastCount})
              </button>
              <button
                onClick={() => setFilterMode('DISPATCHED')}
                className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap ${
                  filterMode === 'DISPATCHED' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Dispatched ({upcomingDispatchedCount})
              </button>
              <button
                onClick={() => setFilterMode('ALL')}
                className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap ${
                  filterMode === 'ALL' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({conflictList.length})
              </button>
            </div>
          </div>

          {/* List of Detected Conflicts */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl">
                No appointments matching this filter.
              </div>
            ) : (
              filtered.map(item => {
                const isDispatched = item.status === 'DISPATCHED';

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl p-4 sm:p-5 border transition-all space-y-3 shadow-md ${
                      item.isPast
                        ? 'bg-slate-900/50 border-slate-850 opacity-75'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            item.isPast
                              ? 'bg-slate-800 text-slate-400 border-slate-700'
                              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          }`}>
                            📅 {item.eventDateFormatted}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {item.timeWindowFormatted}
                          </span>
                          {item.isPast && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                              Historical (Past)
                            </span>
                          )}
                        </div>
                        <div className="text-white font-bold text-sm mt-1.5">
                          {item.sanitizedSummary}
                        </div>
                        <div className="text-slate-400 text-xs font-mono">
                          Original Title: <span className="text-slate-300">{item.originalSummary}</span>
                        </div>
                      </div>

                      {/* Action / Status Button */}
                      <div className="self-start sm:self-center">
                        {item.isPast ? (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                            <span>Past (No Alert Sent)</span>
                          </span>
                        ) : isDispatched ? (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Dispatched</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleDispatchSingle(item)}
                            className="flex items-center space-x-1 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all"
                          >
                            <Send className="w-3 h-3" />
                            <span>Dispatch Notice</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Target: {item.targetSchedulers.map(s => s.fullName.split(' ')[0]).join(' & ')}</span>
                      <span>{item.isPast ? 'Audit History Only' : item.ruleName}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
