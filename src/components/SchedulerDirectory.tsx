import React, { useState } from 'react';
import { Users, Plus, Trash2, Edit2, Check, Mail, Building2, Send, CheckCircle2, UserCheck, Shield } from 'lucide-react';
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

  const startEdit = (s: Scheduler) => {
    setEditingId(s.id);
    setFormData({ ...s });
  };

  const startCreate = () => {
    const newScheduler: Scheduler = {
      id: `sched_${Date.now()}`,
      fullName: 'Surgery Scheduler',
      facilityName: 'Main Hospital OR Scheduling Desk',
      email: 'mohalex@gmail.com',
      roleTitle: 'OR Coordinator',
      isActive: true,
      notes: 'Receives automated schedule blackout notices from Dr. Mohit.'
    };
    setEditingId(newScheduler.id);
    setFormData(newScheduler);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(null);
  };

  const saveEdit = () => {
    if (!formData) return;
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

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
            <Users className="w-6 h-6 text-emerald-400" />
            <span>Surgery Scheduler Inboxes & Desks</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage the hospital OR desks and surgical coordinators who receive your automated blackout notices.
          </p>
        </div>

        <button
          onClick={startCreate}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/25"
        >
          <Plus className="w-4 h-4" />
          <span>Add Scheduler Inbox</span>
        </button>
      </div>

      {/* Inline Editor */}
      {formData && (
        <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-6 shadow-2xl space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              <span>{schedulers.some(s => s.id === formData.id) ? 'Edit Scheduler Contact' : 'Add New Scheduler'}</span>
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={cancelEdit}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-400 shadow-md"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Contact</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Scheduler Name / Contact Person
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                placeholder="e.g. Lead Surgery Scheduler"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Hospital / Facility OR Desk Name
              </label>
              <input
                type="text"
                value={formData.facilityName}
                onChange={e => setFormData({ ...formData, facilityName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                placeholder="e.g. Main Hospital OR Scheduling Desk"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Hospital Email Address (Receives Official Notices) *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                placeholder="scheduler@hospital.org"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Notes & Instructions
              </label>
              <input
                type="text"
                value={formData.notes || ''}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                placeholder="e.g. Primary coordinator for spine & neurosurgery block allocation."
              />
            </div>
          </div>
        </div>
      )}

      {/* List of Schedulers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schedulers.map(scheduler => (
          <div
            key={scheduler.id}
            className="bg-slate-900 rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/20">
                    {scheduler.fullName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{scheduler.fullName}</h3>
                    <p className="text-xs text-slate-400 flex items-center space-x-1">
                      <Building2 className="w-3 h-3 text-slate-500" />
                      <span>{scheduler.facilityName}</span>
                    </p>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  scheduler.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {scheduler.isActive ? 'Active Route' : 'Inactive'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1 text-slate-300">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{scheduler.email}</span>
                </div>
                {scheduler.notes && (
                  <p className="text-[11px] font-sans text-slate-400 pt-1 border-t border-slate-900">{scheduler.notes}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-850">
              <button
                onClick={() => onSendTestPing(scheduler)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-colors"
              >
                <Send className="w-3 h-3" />
                <span>Send Test Email</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => startEdit(scheduler)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 text-xs transition-colors"
                  title="Edit Scheduler"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteScheduler(scheduler.id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 bg-rose-500/10 text-xs transition-colors"
                  title="Delete Scheduler"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
