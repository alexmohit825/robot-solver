import React, { useState } from 'react';
import { History, CheckCircle2, AlertOctagon, Clock, Search, Filter, Trash2, Mail, ExternalLink } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filtered = notifications.filter(record => {
    const matchesSearch = 
      record.schedulerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.eventSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.ruleName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      statusFilter === 'ALL' ||
      (statusFilter === 'ACKNOWLEDGED' && record.ackStatus === 'ACKNOWLEDGED') ||
      (statusFilter === 'CONFLICT' && record.ackStatus === 'CONFLICT') ||
      (statusFilter === 'UNACKNOWLEDGED' && record.ackStatus === 'UNACKNOWLEDGED');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
            <History className="w-6 h-6 text-emerald-400" />
            <span>Clinical Notice Audit Log & Receipts</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Complete timestamped record of all OR blackout notices dispatched to hospital schedulers with acknowledgment receipts.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={onClearLogs}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700 text-xs font-semibold transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset History</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by scheduler name, email, or rule..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
        >
          <option value="ALL">All Statuses ({notifications.length})</option>
          <option value="ACKNOWLEDGED">Acknowledged 🟢</option>
          <option value="UNACKNOWLEDGED">Pending Acknowledgment ⏳</option>
          <option value="CONFLICT">Flagged Conflict 🔴</option>
        </select>
      </div>

      {/* Audit Log Entries */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl">
            No notices recorded matching your filter. Use the simulator or add a calendar event to generate alerts.
          </div>
        ) : (
          filtered.map(record => {
            const isAcked = record.ackStatus === 'ACKNOWLEDGED';
            const isConflict = record.ackStatus === 'CONFLICT';

            return (
              <div
                key={record.id}
                className="bg-slate-900 rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{record.emailSubject}</div>
                      <div className="text-xs text-slate-400">
                        Recipient: <strong className="text-slate-300">{record.schedulerName}</strong> &lt;{record.recipientEmail}&gt; ({record.schedulerFacility})
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-center flex items-center space-x-1.5 ${
                    isAcked
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : isConflict
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {isAcked ? <CheckCircle2 className="w-3.5 h-3.5" /> : isConflict ? <AlertOctagon className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    <span>{record.ackStatus}</span>
                  </div>
                </div>

                {/* Email Snippet */}
                <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-850 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {record.emailText}
                </div>

                {/* Footer Timestamps & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-850 text-[11px] text-slate-400">
                  <div>
                    <span>Dispatched: {record.sentAt ? new Date(record.sentAt).toLocaleString() : 'Pending'}</span>
                    {record.ackTimestamp && (
                      <span className="ml-3 text-emerald-400">
                        • Confirmed: {new Date(record.ackTimestamp).toLocaleString()}
                      </span>
                    )}
                  </div>

                  {record.ackStatus === 'UNACKNOWLEDGED' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onAckNotification(record.id, 'ACKNOWLEDGED')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition-colors"
                      >
                        ✓ Mark Confirmed
                      </button>
                      <button
                        onClick={() => onAckNotification(record.id, 'CONFLICT')}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-bold transition-colors"
                      >
                        ✕ Mark Conflict
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
