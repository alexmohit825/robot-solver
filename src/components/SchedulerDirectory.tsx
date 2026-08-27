import React, { useState } from 'react';
import { Users, Plus, Trash2, Edit2, Check, Phone, Mail, Building, Send, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import { Scheduler } from '../types/vigilor';

interface SchedulerDirectoryProps {
  schedulers: Scheduler[];
  onSaveSchedulers: (schedulers: Scheduler[]) => void;
  onSendTestPing: (scheduler: Scheduler) => void;
}

export const SchedulerDirectory: React.FC<SchedulerDirectoryProps> = ({
  schedulers,
  onSaveSchedulers,
  onSendTestPing,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Scheduler | null>(null);
  const [testSentFeedback, setTestSentFeedback] = useState<string | null>(null);

  const startEdit = (scheduler: Scheduler) => {
    setEditingId(scheduler.id);
    setFormData({ ...scheduler });
  };

  const startCreate = () => {
    const newScheduler: Scheduler = {
      id: `sched_${Date.now()}`,
      fullName: '',
      facilityName: '',
      phone: '',
      email: '',
      preferredChannel: 'BOTH',
      isActive: true,
      notes: ''
    };
    setEditingId(newScheduler.id);
    setFormData(newScheduler);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(null);
  };

  const saveEdit = () => {
    if (!formData || !formData.fullName) return;
    const existingIndex = schedulers.findIndex(s => s.id === formData.id);
    let updated: Scheduler[];

    if (existingIndex >= 0) {
      updated = schedulers.map(s => s.id === formData.id ? formData : s);
    } else {
      updated = [...schedulers, formData];
    }

    onSaveSchedulers(updated);
    setEditingId(null);
    setFormData(null);
  };

  const deleteScheduler = (id: string) => {
    const updated = schedulers.filter(s => s.id !== id);
    onSaveSchedulers(updated);
    if (editingId === id) {
      cancelEdit();
    }
  };

  const handleTestPing = (scheduler: Scheduler) => {
    onSendTestPing(scheduler);
    setTestSentFeedback(scheduler.id);
    setTimeout(() => {
      setTestSentFeedback(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
            <Users className="w-6 h-6 text-sky-400" />
            <span>Surgery Schedulers & Contacts</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Add your surgical scheduling coordinators who should receive automated OR block notices via SMS or Email.
          </p>
        </div>

        <button
          onClick={startCreate}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all shadow-lg shadow-sky-500/25"
        >
          <Plus className="w-4 h-4" />
          <span>Add Surgery Scheduler</span>
        </button>
      </div>

      {/* Editor Modal / Form */}
      {formData && (
        <div className="bg-slate-900 border-2 border-sky-500/50 rounded-2xl p-6 shadow-2xl space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Users className="w-5 h-5 text-sky-400" />
              <span>{schedulers.some(s => s.id === formData.id) ? 'Edit Scheduler Contact' : 'Add New Surgery Scheduler'}</span>
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={cancelEdit}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={!formData.fullName || (!formData.phone && !formData.email)}
                className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-sky-500 hover:bg-sky-400 disabled:opacity-50 shadow-md"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Contact</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Scheduler Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500 text-sm"
                placeholder="e.g. Maria Gonzalez"
              />
            </div>

            {/* Facility Name */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Hospital / Facility / Department
              </label>
              <input
                type="text"
                value={formData.facilityName}
                onChange={e => setFormData({ ...formData, facilityName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500 text-sm"
                placeholder="e.g. Main Hospital OR Scheduling Desk"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Mobile Phone (SMS Alerts)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500 font-mono text-sm"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Email Address (Email Alerts)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500 text-sm"
                placeholder="scheduler@hospital.org"
              />
            </div>

            {/* Preferred Channel */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Notification Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['SMS', 'EMAIL', 'BOTH'] as const).map(channel => (
                  <button
                    key={channel}
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredChannel: channel })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      formData.preferredChannel === channel
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                        : 'bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {channel === 'BOTH' ? 'SMS + Email' : channel}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Toggle */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Status
              </label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  formData.isActive
                    ? 'bg-slate-950 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <span>{formData.isActive ? 'Active (Receives Alerts)' : 'Disabled (Inactive)'}</span>
                <span className="text-xs font-bold underline">{formData.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedulers Cards Grid */}
      {schedulers.length === 0 && !formData ? (
        <div className="bg-slate-900 rounded-3xl p-12 border border-slate-800 text-center space-y-4 max-w-xl mx-auto shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto border border-sky-500/20">
            <Users className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white">Add Your First Surgery Scheduler</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Enter your scheduler's name, phone number, and/or email address. You can add multiple schedulers across multiple surgical centers.
            </p>
          </div>
          <button
            onClick={startCreate}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs transition-all shadow-lg shadow-sky-500/25"
          >
            <Plus className="w-4 h-4" />
            <span>Add Scheduler Contact</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {schedulers.map(scheduler => (
            <div
              key={scheduler.id}
              className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{scheduler.fullName}</h3>
                    <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-0.5">
                      <Building className="w-3 h-3 text-slate-500" />
                      <span className="truncate max-w-[200px]">{scheduler.facilityName || 'Primary Facility'}</span>
                    </div>
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

                <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs text-slate-300">
                  {scheduler.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-mono">{scheduler.phone}</span>
                    </div>
                  )}
                  {scheduler.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3.5 h-3.5 text-sky-400" />
                      <span className="truncate">{scheduler.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleTestPing(scheduler)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    testSentFeedback === scheduler.id
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white'
                  }`}
                >
                  {testSentFeedback === scheduler.id ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ping Sent!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-sky-400" />
                      <span>Send Test Ping</span>
                    </>
                  )}
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => startEdit(scheduler)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="Edit Scheduler"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteScheduler(scheduler.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete Scheduler"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
