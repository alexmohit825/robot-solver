import React, { useState } from 'react';
import { PlayCircle, ShieldCheck, ShieldAlert, Sparkles, Mail, CheckCircle2, AlertOctagon, Send, Clock, UserCheck, Check } from 'lucide-react';
import { ProtectionRule, Scheduler, CalendarEvent, SurgeonProfile, NotificationRecord, DayOfWeek } from '../types/vigilor';
import { evaluateEventAgainstAllRules, getDayName, formatTime12h } from '../engine/ruleEvaluator';
import { prepareNotifications } from '../engine/dispatcher';

interface SimulatorPlaygroundProps {
  rules: ProtectionRule[];
  schedulers: Scheduler[];
  profile: SurgeonProfile;
  onRecordNotification: (notification: NotificationRecord) => void;
  onAckNotification: (notificationId: string, status: 'ACKNOWLEDGED' | 'CONFLICT') => void;
}

export const SimulatorPlayground: React.FC<SimulatorPlaygroundProps> = ({
  rules,
  schedulers,
  profile,
  onRecordNotification,
  onAckNotification,
}) => {
  // Simulator State
  const [selectedDay, setSelectedDay] = useState<number>(3); // Wednesday default
  const [startTime, setStartTime] = useState<string>('12:00');
  const [endTime, setEndTime] = useState<string>('17:00');
  const [eventTitle, setEventTitle] = useState<string>('Personal: Academic Research & Admin');
  const [simulatedNotifications, setSimulatedNotifications] = useState<NotificationRecord[]>([]);
  const [hasDispatched, setHasDispatched] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Construct Mock Event
  const now = new Date();
  const mockEventDate = new Date(now);
  const currentDay = now.getDay();
  const diffDays = (selectedDay - currentDay + 7) % 7;
  mockEventDate.setDate(now.getDate() + diffDays);

  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  const eventStart = new Date(mockEventDate);
  eventStart.setHours(startH, startM, 0, 0);

  const eventEnd = new Date(mockEventDate);
  eventEnd.setHours(endH, endM, 0, 0);

  const mockEvent: CalendarEvent = {
    uid: `sim_evt_${Date.now()}`,
    summary: eventTitle,
    start: eventStart,
    end: eventEnd,
    calendarName: 'Personal'
  };

  // Run Rule Evaluation in Real Time
  const evaluation = evaluateEventAgainstAllRules(mockEvent, rules, schedulers, profile.name);

  const handleTestDispatch = () => {
    if (!evaluation.isMatch) {
      setFeedbackMessage('ℹ️ No email dispatched: This time slot does not conflict with protected OR blocks.');
      setTimeout(() => setFeedbackMessage(null), 4000);
      return;
    }

    const records = prepareNotifications(mockEvent, evaluation, profile, false);
    setSimulatedNotifications(records);
    setHasDispatched(true);
    setFeedbackMessage('✅ Clinical Email Dispatched: Schedulers notified via official OR notice.');
    setTimeout(() => setFeedbackMessage(null), 4000);

    records.forEach(r => onRecordNotification(r));
  };

  const handleInteractiveAck = (recordId: string, status: 'ACKNOWLEDGED' | 'CONFLICT') => {
    setSimulatedNotifications(prev => prev.map(r => {
      if (r.id === recordId) {
        return {
          ...r,
          ackStatus: status,
          ackTimestamp: new Date().toISOString()
        };
      }
      return r;
    }));
    onAckNotification(recordId, status);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
          <PlayCircle className="w-6 h-6 text-emerald-400" />
          <span>Clinical Email Simulation & Acknowledgment Sandbox</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Test calendar event triggers and preview the exact official email notice that lands in your surgery schedulers' inboxes.
        </p>
      </div>

      {feedbackMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold animate-fadeIn">
          {feedbackMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Event Playground Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-5 shadow-xl">
            <div className="flex items-center space-x-2 text-white font-bold text-base pb-3 border-b border-slate-800">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>1. Create Simulated Calendar Event</span>
            </div>

            {/* Quick Scenario Preset Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Test Scenarios</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDay(3);
                    setStartTime('12:00');
                    setEndTime('17:00');
                    setEventTitle('Personal: Academic Research');
                    setHasDispatched(false);
                  }}
                  className={`p-3 rounded-xl border text-xs text-left font-semibold transition-all ${
                    selectedDay === 3
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 ring-1 ring-emerald-500'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  ⚡ Wed Afternoon (12-5 PM)
                  <span className="block text-[10px] opacity-70 font-normal">Triggers OR Email 🟢</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedDay(2);
                    setStartTime('10:00');
                    setEndTime('11:30');
                    setEventTitle('Department Meeting');
                    setHasDispatched(false);
                  }}
                  className={`p-3 rounded-xl border text-xs text-left font-semibold transition-all ${
                    selectedDay === 2
                      ? 'bg-sky-500/20 border-sky-500/50 text-sky-300 ring-1 ring-sky-500'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  ⚡ Tuesday Morning (10-11:30 AM)
                  <span className="block text-[10px] opacity-70 font-normal">Ignored (Open Time) ⚪</span>
                </button>
              </div>
            </div>

            {/* Day Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Day of the Week</label>
              <div className="grid grid-cols-7 gap-1.5">
                {[0, 1, 2, 3, 4, 5, 6].map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => { setSelectedDay(day); setHasDispatched(false); }}
                    className={`py-2.5 px-1 rounded-xl text-xs font-bold transition-all ${
                      selectedDay === day
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400'
                        : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {getDayName(day as DayOfWeek).substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Controls */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={e => { setStartTime(e.target.value); setHasDispatched(false); }}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={e => { setEndTime(e.target.value); setHasDispatched(false); }}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Event Title */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">Calendar Event Title</label>
              <input
                type="text"
                value={eventTitle}
                onChange={e => { setEventTitle(e.target.value); setHasDispatched(false); }}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                placeholder="e.g. Personal: Academic Research"
              />
            </div>

            {/* Real-time Match Indicator */}
            <div className={`p-4 rounded-xl border flex items-start space-x-3 transition-all ${
              evaluation.isMatch
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}>
              {evaluation.isMatch ? (
                <ShieldAlert className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 text-xs">
                <div className="font-bold text-sm text-white">
                  {evaluation.isMatch ? 'Protected OR Block Overlap Detected! 🟢' : 'No Conflict (Open Schedule) ⚪'}
                </div>
                <p className="opacity-90">{evaluation.reason}</p>
                {evaluation.isMatch && (
                  <p className="text-[11px] text-emerald-400 font-semibold pt-1">
                    🎯 Targeted Email Inboxes: {evaluation.targetSchedulers.map(s => s.fullName).join(', ')}
                  </p>
                )}
              </div>
            </div>

            {/* Dispatch Action */}
            <button
              type="button"
              onClick={handleTestDispatch}
              className={`w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
                evaluation.isMatch
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/25 cursor-pointer'
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 cursor-pointer'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>{evaluation.isMatch ? 'Simulate Trigger & Dispatch Email' : 'Test Scan (No Overlap)'}</span>
            </button>
          </div>
        </div>

        {/* Right 7 Cols: Live Clinical Email Inbox Mockup */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-white font-bold text-base">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>2. Surgery Scheduler Inbox Preview</span>
              </div>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                hasDispatched ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {hasDispatched ? '🟢 Live Triggered' : '⚪ Preview Mode'}
              </span>
            </div>

            {/* Email Card Preview */}
            <div className="space-y-4">
              {evaluation.targetSchedulers.map(scheduler => {
                const record = simulatedNotifications.find(n => n.schedulerId === scheduler.id);
                const isAcked = record?.ackStatus === 'ACKNOWLEDGED';
                const isConflict = record?.ackStatus === 'CONFLICT';

                return (
                  <div
                    key={scheduler.id}
                    className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl space-y-0"
                  >
                    {/* Email Header Bar */}
                    <div className="bg-slate-900/90 p-4 border-b border-slate-800 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold">From: <strong className="text-white">Dr. {profile.name}</strong> &lt;{profile.officeEmail}&gt;</span>
                        {record && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isAcked ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {record.ackStatus}
                          </span>
                        )}
                      </div>
                      <div className="text-slate-400 font-semibold">To: <strong className="text-emerald-300">{scheduler.fullName}</strong> &lt;{scheduler.email}&gt;</div>
                      <div className="text-slate-200 font-bold text-sm pt-1">
                        Subject: [OR Block Notice] Dr. {profile.name} - Protected Window ({evaluation.formattedTimeWindow || 'Wednesday from 12:00 PM to 5:00 PM'})
                      </div>
                    </div>

                    {/* Email Body */}
                    <div className="p-5 bg-white text-slate-800 space-y-4 text-xs">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                        <div className="font-bold text-slate-900 text-sm">🛡️ VigilOR Surgical Schedule Sentinel</div>
                        <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full text-[11px] border border-emerald-200">
                          OFFICIAL OR BLACKOUT NOTICE
                        </span>
                      </div>

                      <p className="leading-relaxed">
                        Dear <strong>{scheduler.fullName}</strong> ({scheduler.facilityName}),
                      </p>

                      <p className="leading-relaxed">
                        Please be advised that Dr. {profile.name} has scheduled a protected schedule block on his calendar:
                      </p>

                      <div className="bg-slate-100 rounded-xl p-3.5 border border-slate-200 space-y-1.5">
                        <div><strong>Protected Window:</strong> <span className="text-emerald-700 font-bold">{evaluation.formattedTimeWindow || 'Wednesday from 12:00 PM to 5:00 PM'}</span></div>
                        <div><strong>Block Type:</strong> <span className="text-slate-900 font-semibold">{evaluation.sanitizedSummary || 'Dr. A. Alex Mohit Personal Block'}</span></div>
                        <div><strong>Facility:</strong> {profile.primaryHospital}</div>
                      </div>

                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 font-semibold leading-relaxed">
                        ⚠️ <strong>Action Required:</strong> Please hold the OR schedule clear and do NOT book surgical cases during this protected window.
                      </div>

                      {/* Interactive Email Button */}
                      <div className="text-center pt-2">
                        {record && record.ackStatus === 'UNACKNOWLEDGED' ? (
                          <div className="space-y-2">
                            <p className="text-[11px] text-slate-500">Simulate scheduler action from email:</p>
                            <div className="flex justify-center space-x-2">
                              <button
                                type="button"
                                onClick={() => handleInteractiveAck(record.id, 'ACKNOWLEDGED')}
                                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                              >
                                ✓ Confirm: Block Placed in OR System
                              </button>
                              <button
                                type="button"
                                onClick={() => handleInteractiveAck(record.id, 'CONFLICT')}
                                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all"
                              >
                                ✕ Flag Conflict
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span className="inline-block px-4 py-2 rounded-lg bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                            ✓ Block Acknowledged & Confirmed by Scheduler
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
