import React, { useState } from 'react';
import { PlayCircle, ShieldCheck, ShieldAlert, Sparkles, MessageSquare, Mail, CheckCircle2, AlertOctagon, Send, Clock, UserCheck } from 'lucide-react';
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
  const [startTime, setStartTime] = useState<string>('13:00');
  const [endTime, setEndTime] = useState<string>('16:00');
  const [eventTitle, setEventTitle] = useState<string>('Personal: Dentist Appointment');
  const [simulatedNotifications, setSimulatedNotifications] = useState<NotificationRecord[]>([]);
  const [hasDispatched, setHasDispatched] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Construct Mock Event on the Selected Day
  const now = new Date();
  const mockEventDate = new Date(now);
  const currentDay = now.getDay();
  // Find next occurrence of selected day
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
      setFeedbackMessage('ℹ️ No notification sent: This time block is outside your protected OR window.');
      setTimeout(() => setFeedbackMessage(null), 4000);
      return;
    }

    const records = prepareNotifications(mockEvent, evaluation, profile, false);
    setSimulatedNotifications(records);
    setHasDispatched(true);
    setFeedbackMessage('✅ Live Alert Dispatched: Schedulers notified via SMS/Email.');
    setTimeout(() => setFeedbackMessage(null), 4000);

    // Also persist into app's main log
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
          <span>'What-If' Simulation & Closed-Loop Sandbox</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Test calendar event scenarios and preview the exact multi-scheduler alerts that will be dispatched via SMS and Email.
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
                    setStartTime('13:00');
                    setEndTime('16:00');
                    setEventTitle('Personal: Dentist Appointment');
                    setHasDispatched(false);
                  }}
                  className={`p-3 rounded-xl border text-xs text-left font-semibold transition-all ${
                    selectedDay === 3
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-md ring-1 ring-emerald-500'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  ⚡ Wed Afternoon (1-4 PM)
                  <span className="block text-[10px] opacity-70 font-normal">Triggers OR Alert 🟢</span>
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
                      ? 'bg-sky-500/20 border-sky-500/50 text-sky-300 shadow-md ring-1 ring-sky-500'
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
                placeholder="e.g. Flight to Conference"
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
                  {evaluation.isMatch ? 'Protected OR Block Conflict Detected! 🟢' : 'No Conflict (Open Schedule) ⚪'}
                </div>
                <p className="opacity-90">{evaluation.reason}</p>
                {evaluation.isMatch && (
                  <p className="text-[11px] text-emerald-400 font-semibold pt-1">
                    🎯 Targeted Recipients: {evaluation.targetSchedulers.map(s => s.fullName).join(', ')}
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
              <span>{evaluation.isMatch ? 'Simulate Trigger & Dispatch to Schedulers' : 'Test Scan (No Overlap)'}</span>
            </button>
          </div>
        </div>

        {/* Right 7 Cols: Live Multi-Scheduler Phone & Email Previews */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-white font-bold text-base">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                <span>2. Outbound SMS & Closed-Loop Preview</span>
              </div>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                hasDispatched ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {hasDispatched ? '🟢 Live Triggered' : '⚪ Preview Mode'}
              </span>
            </div>

            {/* Live Cards */}
            <div className="space-y-4">
              {evaluation.targetSchedulers.map(scheduler => {
                const record = simulatedNotifications.find(n => n.schedulerId === scheduler.id);
                const isAcked = record?.ackStatus === 'ACKNOWLEDGED';
                const isConflict = record?.ackStatus === 'CONFLICT';

                return (
                  <div
                    key={scheduler.id}
                    className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-4 shadow-lg"
                  >
                    {/* Scheduler Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
                          {scheduler.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{scheduler.fullName}</div>
                          <div className="text-xs text-slate-400">{scheduler.facilityName}</div>
                        </div>
                      </div>

                      {/* Interactive ACK Badge */}
                      {record && (
                        <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1 ${
                          isAcked
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : isConflict
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                        }`}>
                          {isAcked ? <CheckCircle2 className="w-3 h-3" /> : isConflict ? <AlertOctagon className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          <span>{record.ackStatus}</span>
                        </div>
                      )}
                    </div>

                    {/* Outbound SMS Bubble Mockup */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>SMS Payload ({scheduler.phone})</span>
                      </div>
                      <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-xs font-mono text-slate-200 leading-relaxed">
                        <p className="text-emerald-400 font-bold">[VigilOR Sentinel Alert]</p>
                        <p className="mt-1">{profile.name} has placed a calendar block for <span className="text-emerald-300 font-bold">{evaluation.formattedTimeWindow || 'Wednesday from 1:00 PM to 4:00 PM'}</span>.</p>
                        <p>Block details: <span className="text-amber-300">{evaluation.sanitizedSummary || 'Dr. A. Alex Mohit Personal Block'}</span>.</p>
                        <p className="text-rose-300 font-semibold">Please do NOT schedule surgical cases during this window.</p>
                        <p className="mt-2 text-sky-400 underline">https://vigilor.app/ack/{record?.id || 'demo_link'}</p>
                      </div>
                    </div>

                    {/* Interactive Closed-Loop Simulation Buttons */}
                    {record && record.ackStatus === 'UNACKNOWLEDGED' && (
                      <div className="pt-3 border-t border-slate-850 space-y-2">
                        <p className="text-[11px] text-slate-400">
                          Simulate scheduler one-click response from link:
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleInteractiveAck(record.id, 'ACKNOWLEDGED')}
                            className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-md"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirm: Block Placed</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInteractiveAck(record.id, 'CONFLICT')}
                            className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-rose-600/80 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shadow-md"
                          >
                            <AlertOctagon className="w-3.5 h-3.5" />
                            <span>Flag Conflict: Case Pending</span>
                          </button>
                        </div>
                      </div>
                    )}
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
