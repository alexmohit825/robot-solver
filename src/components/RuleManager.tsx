import React, { useState } from 'react';
import { Sliders, Plus, Trash2, Edit2, Check, Shield, Clock, Calendar, Users, Eye, EyeOff, Tag, Filter } from 'lucide-react';
import { ProtectionRule, Scheduler, DayOfWeek } from '../types/vigilor';
import { getDayName, formatTime12h } from '../engine/ruleEvaluator';

interface RuleManagerProps {
  rules: ProtectionRule[];
  schedulers: Scheduler[];
  onSaveRules: (rules: ProtectionRule[]) => void;
}

const ALL_DAYS: DayOfWeek[] = [0, 1, 2, 3, 4, 5, 6];

export const RuleManager: React.FC<RuleManagerProps> = ({
  rules,
  schedulers,
  onSaveRules,
}) => {
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProtectionRule | null>(null);
  const [keywordInput, setKeywordInput] = useState<string>('');

  const startEdit = (rule: ProtectionRule) => {
    setEditingRuleId(rule.id);
    setFormData({ ...rule, excludedKeywords: rule.excludedKeywords || [] });
  };

  const startCreate = () => {
    const newRule: ProtectionRule = {
      id: `rule_${Date.now()}`,
      name: 'Wednesday Afternoon OR Protection',
      isActive: true,
      daysOfWeek: [3], // Wednesday default
      startTime: '12:00',
      endTime: '17:00',
      debounceMinutes: 3,
      maskEventDetails: true,
      assignedSchedulerIds: [],
      excludedKeywords: ['#surgery', '#orcase', 'Clinic', 'Grand Rounds'],
      monitoredCalendarFolder: 'Personal',
      createdAt: new Date().toISOString()
    };
    setEditingRuleId(newRule.id);
    setFormData(newRule);
  };

  const cancelEdit = () => {
    setEditingRuleId(null);
    setFormData(null);
  };

  const saveEdit = () => {
    if (!formData) return;
    const existingIndex = rules.findIndex(r => r.id === formData.id);
    let updatedRules: ProtectionRule[];

    if (existingIndex >= 0) {
      updatedRules = rules.map(r => r.id === formData.id ? formData : r);
    } else {
      updatedRules = [...rules, formData];
    }

    onSaveRules(updatedRules);
    setEditingRuleId(null);
    setFormData(null);
  };

  const deleteRule = (ruleId: string) => {
    const updated = rules.filter(r => r.id !== ruleId);
    onSaveRules(updated);
    if (editingRuleId === ruleId) {
      cancelEdit();
    }
  };

  const toggleDay = (day: DayOfWeek) => {
    if (!formData) return;
    const days = formData.daysOfWeek.includes(day)
      ? formData.daysOfWeek.filter(d => d !== day)
      : [...formData.daysOfWeek, day].sort();
    setFormData({ ...formData, daysOfWeek: days.length > 0 ? days : [day] });
  };

  const toggleSchedulerAssignment = (schedulerId: string) => {
    if (!formData) return;
    const assigned = formData.assignedSchedulerIds.includes(schedulerId)
      ? formData.assignedSchedulerIds.filter(id => id !== schedulerId)
      : [...formData.assignedSchedulerIds, schedulerId];
    setFormData({ ...formData, assignedSchedulerIds: assigned });
  };

  const addExcludedKeyword = () => {
    if (!formData || !keywordInput.trim()) return;
    const current = formData.excludedKeywords || [];
    if (!current.includes(keywordInput.trim())) {
      setFormData({
        ...formData,
        excludedKeywords: [...current, keywordInput.trim()]
      });
    }
    setKeywordInput('');
  };

  const removeExcludedKeyword = (kw: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      excludedKeywords: (formData.excludedKeywords || []).filter(k => k !== kw)
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Rule button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
            <Sliders className="w-6 h-6 text-emerald-400" />
            <span>Protection Rules & Availability Windows</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Define which days and times should remain protected from surgical cases when blocked on your iOS calendar.
          </p>
        </div>

        <button
          onClick={startCreate}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/25"
        >
          <Plus className="w-4 h-4" />
          <span>Add Protection Rule</span>
        </button>
      </div>

      {/* Editor Modal / Inline Form */}
      {formData && (
        <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-6 shadow-2xl space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span>{rules.some(r => r.id === formData.id) ? 'Edit Protection Rule' : 'Create New Protection Rule'}</span>
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
                className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-400 shadow-md"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Rule</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rule Name */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Rule Title
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 font-medium text-sm"
                placeholder="e.g. Wednesday Afternoon OR Protection"
              />
            </div>

            {/* Days of the week picker */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Protected Days of the Week
              </label>
              <div className="grid grid-cols-7 gap-2">
                {ALL_DAYS.map(day => {
                  const isSelected = formData.daysOfWeek.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`py-3 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                        isSelected
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400'
                          : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                      }`}
                    >
                      <span className="text-[10px] opacity-75">{getDayName(day, true)}</span>
                      <span>{getDayName(day).substring(0, 3)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Start & End Time */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Start Time (Protected Window)
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                End Time (Protected Window)
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 font-mono text-sm"
              />
            </div>

            {/* Debounce Minutes */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Debounce Buffer (Noise Reduction)
              </label>
              <select
                value={formData.debounceMinutes}
                onChange={e => setFormData({ ...formData, debounceMinutes: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 text-sm"
              >
                <option value={0}>Instant (0 minutes delay)</option>
                <option value={3}>3 minutes (Recommended - holds while adjusting)</option>
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
              </select>
            </div>

            {/* Privacy Masking */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Privacy & Title Masking
              </label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, maskEventDetails: !formData.maskEventDetails })}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  formData.maskEventDetails
                    ? 'bg-slate-950 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {formData.maskEventDetails ? <EyeOff className="w-4 h-4 text-emerald-400" /> : <Eye className="w-4 h-4 text-slate-500" />}
                  <span>{formData.maskEventDetails ? 'Mask Title (Send "Personal Block")' : 'Expose Exact Calendar Title'}</span>
                </div>
                <span className="text-xs font-bold underline">{formData.maskEventDetails ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            {/* Keyword Exclusions (Ignore False Positives like Clinic / Surgery) */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                <Filter className="w-3.5 h-3.5 text-emerald-400" />
                <span>Exclude Events Containing Keywords (Prevents False Alarms)</span>
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={e => setKeywordInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addExcludedKeyword(); } }}
                  placeholder="e.g. Clinic, Grand Rounds, Surgery, #orcase"
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={addExcludedKeyword}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-bold border border-slate-700"
                >
                  Add Filter
                </button>
              </div>

              {formData.excludedKeywords && formData.excludedKeywords.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.excludedKeywords.map(kw => (
                    <span
                      key={kw}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-xs"
                    >
                      <Tag className="w-3 h-3 text-slate-400" />
                      <span>{kw}</span>
                      <button
                        type="button"
                        onClick={() => removeExcludedKeyword(kw)}
                        className="text-slate-400 hover:text-rose-400 ml-1 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Multi-Scheduler Routing */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Target Schedulers (Multi-Recipient Routing)
                </label>
                <span className="text-xs text-slate-400">
                  {formData.assignedSchedulerIds.length === 0
                    ? 'Broadcasting to ALL active schedulers'
                    : `Assigned to ${formData.assignedSchedulerIds.length} scheduler(s)`}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {schedulers.map(scheduler => {
                  const isAssigned = formData.assignedSchedulerIds.includes(scheduler.id);
                  const isBroadcast = formData.assignedSchedulerIds.length === 0;
                  return (
                    <button
                      key={scheduler.id}
                      type="button"
                      onClick={() => toggleSchedulerAssignment(scheduler.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between ${
                        isAssigned
                          ? 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-sm'
                          : isBroadcast
                          ? 'bg-slate-950/70 border-slate-800 text-slate-300'
                          : 'bg-slate-950/30 border-slate-850 text-slate-500 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-xs text-white">{scheduler.fullName}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[180px]">{scheduler.facilityName}</div>
                      </div>
                      <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-bold ${
                        isAssigned ? 'bg-emerald-500 text-white' : 'border border-slate-700'
                      }`}>
                        {isAssigned ? '✓' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List of Existing Rules */}
      <div className="space-y-3">
        {rules.map(rule => {
          const daysFormatted = rule.daysOfWeek.map(d => getDayName(d)).join(', ');
          const timeFormatted = `${formatTime12h(rule.startTime)} – ${formatTime12h(rule.endTime)}`;

          return (
            <div
              key={rule.id}
              className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className={`w-3 h-3 rounded-full ${rule.isActive ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                  <h3 className="text-base font-bold text-white">{rule.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    rule.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {rule.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-slate-800/80 text-emerald-400 text-xs font-semibold border border-slate-700">
                    📅 {daysFormatted}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-slate-800/80 text-sky-400 text-xs font-semibold border border-slate-700">
                    ⏰ {timeFormatted}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-slate-800/80 text-purple-400 text-xs font-semibold border border-slate-700">
                    ⏳ {rule.debounceMinutes}m Buffer
                  </span>
                  {rule.maskEventDetails && (
                    <span className="px-3 py-1 rounded-lg bg-slate-800/80 text-slate-300 text-xs font-semibold border border-slate-700">
                      🔒 Masked Details
                    </span>
                  )}
                  {rule.excludedKeywords && rule.excludedKeywords.length > 0 && (
                    <span className="px-3 py-1 rounded-lg bg-slate-800/80 text-amber-400 text-xs font-semibold border border-slate-700">
                      🛡️ {rule.excludedKeywords.length} Keyword Filter{rule.excludedKeywords.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400">
                  Target Schedulers: {rule.assignedSchedulerIds.length === 0
                    ? 'Broadcast to ALL active schedulers'
                    : schedulers.filter(s => rule.assignedSchedulerIds.includes(s.id)).map(s => s.fullName).join(', ')}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 self-end md:self-center">
                <button
                  onClick={() => startEdit(rule)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => deleteRule(rule.id)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 text-xs font-medium transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
