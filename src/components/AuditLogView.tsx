import React, { useState } from 'react';
import { History, Search, Filter, CheckCircle2, AlertOctagon, Clock, RefreshCw, MessageSquare, Mail } from 'lucide-react';
import { NotificationRecord, Scheduler } from '../types/vigilor';

interface AuditLogViewProps {
  notifications: NotificationRecord[];
  schedulers: Scheduler[];
  onAckNotification: (notificationId: string, status: 'ACKNOWLEDGED' | 'CONFLICT') => void;
  onClearLogs: () => void;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({
  notifications,
  schedulers,
  onAckNotification,
  onClearLogs,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchedulerFilter, setSelectedSchedulerFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

  const filteredNotifications = notifications.filter(record => {
    const matchesSearch = 
      record.schedulerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.schedulerFacility.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.eventSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.ruleName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesScheduler = selectedSchedulerFilter === 'ALL' || record.schedulerId === selectedSchedulerFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || record.ackStatus === selectedStatusFilter;

    return matchesSearch && matchesScheduler && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
            <History className="w-6 h-6 text-purple-400" />
            <span>Audit Trail & Delivery Receipts</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Complete, timestamped log of all outbound SMS/Email alerts and scheduler acknowledgments.
          </p>
        </div>

        <button
          onClick={onClearLogs}
          className="px-3.5 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-700 text-xs font-semibold transition-colors"
        >
          Reset Demo History
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by scheduler, event, or facility..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Scheduler Filter */}
        <div>
          <select
            value={selectedSchedulerFilter}
            onChange={e => setSelectedSchedulerFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">All Schedulers ({schedulers.length})</option>
            {schedulers.map(s => (
              <option key={s.id} value={s.id}>{s.fullName} ({s.facilityName})</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={selectedStatusFilter}
            onChange={e => setSelectedStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACKNOWLEDGED">Acknowledged 🟢</option>
            <option value="UNACKNOWLEDGED">Unacknowledged ⏳</option>
            <option value="CONFLICT">Flagged Conflict 🔴</option>
          </select>
        </div>
      </div>

      {/* Logs Table / Cards */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No notification records matching the selected criteria.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {filteredNotifications.map((record) => (
              <div key={record.id} className="p-5 hover:bg-slate-850/50 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-white text-sm">{record.schedulerName}</span>
                    <span className="text-xs text-slate-400">({record.schedulerFacility})</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      record.channel === 'SMS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-sky-500/20 text-sky-400'
                    }`}>
                      {record.channel}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5 ${
                      record.ackStatus === 'ACKNOWLEDGED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : record.ackStatus === 'CONFLICT'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {record.ackStatus === 'ACKNOWLEDGED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {record.ackStatus === 'CONFLICT' && <AlertOctagon className="w-3.5 h-3.5" />}
                      {record.ackStatus === 'UNACKNOWLEDGED' && <Clock className="w-3.5 h-3.5" />}
                      <span>{record.ackStatus}</span>
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-850 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Block: <strong className="text-slate-200">{record.eventSummary}</strong></span>
                    <span>Recipient: {record.recipientAddress}</span>
                  </div>
                  <p className="text-xs font-mono text-slate-300 whitespace-pre-line leading-relaxed">
                    {record.messageText}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400 pt-1">
                  <div>
                    Dispatched: {record.sentAt ? new Date(record.sentAt).toLocaleString() : 'Pending'}
                    {record.ackTimestamp && ` • Acknowledged: ${new Date(record.ackTimestamp).toLocaleTimeString()}`}
                  </div>

                  {record.ackStatus === 'UNACKNOWLEDGED' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onAckNotification(record.id, 'ACKNOWLEDGED')}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline"
                      >
                        Mark as Acknowledged
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => onAckNotification(record.id, 'CONFLICT')}
                        className="text-xs text-rose-400 hover:text-rose-300 font-semibold underline"
                      >
                        Mark as Conflict
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
