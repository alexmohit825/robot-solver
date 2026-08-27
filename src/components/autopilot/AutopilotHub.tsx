import React, { useState, useEffect } from 'react';
import { Bot, ShieldCheck, Zap, Activity, Clock, CheckCircle2, AlertTriangle, RefreshCw, Smartphone, Radio, Settings, Info, Cloud, Users, Check, Globe, Server, Bell, Phone, Save } from 'lucide-react';
import { Review, AutopilotConfig, AutopilotActivityLog } from '../../types/reputation';
import { ApiService } from '../../services/apiService';
import { PHYSICIAN_PROFILE } from '../../data/mockReviews';
import { DailyBriefingCard } from './DailyBriefingCard';
import { SmsQuickActionSim } from './SmsQuickActionSim';
import { RegionalCompetitorRadar } from './RegionalCompetitorRadar';

interface AutopilotHubProps {
  reviews: Review[];
  onActionTriggered: (message: string) => void;
}

export const AutopilotHub: React.FC<AutopilotHubProps> = ({ reviews, onActionTriggered }) => {
  const [config, setConfig] = useState<AutopilotConfig | null>(null);
  const [logs, setLogs] = useState<AutopilotActivityLog[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SETTINGS' | 'SMS_SIM' | 'ALIASES' | 'CLOUD_DEPLOY' | 'BENCHMARKS'>('OVERVIEW');
  
  // Doctor phone & alert state
  const [doctorPhone, setDoctorPhone] = useState<string>('+1 (253) 555-0199');
  const [briefingTime, setBriefingTime] = useState<string>('07:30 AM');
  const [phoneSaved, setPhoneSaved] = useState<boolean>(false);

  useEffect(() => {
    loadAutopilotState();
  }, []);

  const loadAutopilotState = async () => {
    const currentConfig = await ApiService.getAutopilotConfig();
    setConfig(currentConfig);
    setDoctorPhone(currentConfig.doctorNotificationPhone);
    const activityLogs = await ApiService.getActivityLogs();
    setLogs(activityLogs);
  };

  const handleToggleAutopilot = async () => {
    if (!config) return;
    const updated = await ApiService.updateAutopilotConfig({ isEnabled: !config.isEnabled });
    setConfig(updated);
  };

  const handleModeChange = async (mode: 'GUARDED' | 'DEFENSIVE' | 'FULL_AUTOPILOT') => {
    if (!config) return;
    const updated = await ApiService.updateAutopilotConfig({ mode });
    setConfig(updated);
  };

  const handleSavePhoneSettings = async () => {
    if (!config) return;
    const updated = await ApiService.updateAutopilotConfig({ doctorNotificationPhone: doctorPhone });
    setConfig(updated);
    setPhoneSaved(true);
    setTimeout(() => setPhoneSaved(false), 3000);
    onActionTriggered(`Notification settings updated. Live SMS alerts will dispatch to ${doctorPhone}.`);
  };

  const handleTriggerManualScan = async () => {
    setIsScanning(true);
    try {
      const result = await ApiService.triggerBackgroundScan();
      setLogs(result.logs);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const targetReviewForSms = reviews.find(r => r.rating <= 2) || reviews[0];

  return (
    <div className="space-y-6">

      {/* Section Explainer Guide Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm flex items-start space-x-3.5">
        <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-xs text-slate-300 space-y-1">
          <h2 className="text-sm font-bold text-white">Autonomous Background Sentinel & Multi-Alias Engine Guide</h2>
          <p className="text-slate-400 leading-relaxed">
            <strong>What this section does:</strong> Operates 24/7 in the cloud to protect your reputation. It automatically tracks reviews across all your name variations (<strong>Abdi Mohit, Alex Mohit, Abdi Alex Mohit</strong>), auto-submits formal takedown petitions for vulgar spam, auto-dispatches 1-click re-share links to happy post-op surgical patients, and sends actionable <strong>1-tap SMS alerts</strong> to your personal phone (<code>{doctorPhone}</code>) so you can approve responses in seconds between surgeries.
          </p>
        </div>
      </div>

      {/* Top Banner: Master Autopilot Switch */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-teal-500/30 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
            config?.isEnabled 
              ? 'bg-teal-500/20 border-teal-500/40 text-teal-400' 
              : 'bg-slate-800 border-slate-700 text-slate-500'
          }`}>
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white">24/7 Background Sentinel & Autopilot Engine</h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                config?.isEnabled 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {config?.isEnabled ? '● AUTOPILOT ACTIVE' : '○ PAUSED'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuous multi-alias monitoring (Abdi Mohit / Alex Mohit) & SMS quick actions to {doctorPhone}.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleTriggerManualScan}
            disabled={isScanning}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-lg text-xs font-semibold transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-teal-400' : ''}`} />
            <span>{isScanning ? 'Scanning All Aliases...' : 'Trigger Multi-Alias Scan'}</span>
          </button>

          <button
            onClick={handleToggleAutopilot}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm ${
              config?.isEnabled
                ? 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800'
                : 'bg-teal-600 hover:bg-teal-500 text-white'
            }`}
          >
            {config?.isEnabled ? 'Pause Autopilot' : 'Enable Autopilot'}
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'OVERVIEW'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-teal-400" />
          <span>Autopilot Operations</span>
        </button>

        <button
          onClick={() => setActiveTab('SETTINGS')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'SETTINGS'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings className="w-3.5 h-3.5 text-amber-400" />
          <span>Doctor Phone & Notification Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('ALIASES')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'ALIASES'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span>Multi-Name Alias Resolution</span>
        </button>

        <button
          onClick={() => setActiveTab('SMS_SIM')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'SMS_SIM'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 text-teal-400" />
          <span>Mobile SMS 1-Tap Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('CLOUD_DEPLOY')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'CLOUD_DEPLOY'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cloud className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero-Cost Cloud Architecture</span>
        </button>

        <button
          onClick={() => setActiveTab('BENCHMARKS')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'BENCHMARKS'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-yellow-400" />
          <span>Regional Market Benchmarking</span>
        </button>
      </div>

      {/* Tab 1: Overview & Controls */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          
          {/* Daily 30-Second Executive Audio Briefing */}
          <DailyBriefingCard reviews={reviews} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Autonomous Rules & Safety Tiers (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Safety Tiers */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>Autonomy Safety Tier</span>
                </h3>

                <div className="space-y-2">
                  <button
                    onClick={() => handleModeChange('GUARDED')}
                    className={`w-full p-3 rounded-lg border text-left transition-all text-xs ${
                      config?.mode === 'GUARDED'
                        ? 'bg-teal-500/10 border-teal-500 text-white ring-1 ring-teal-500'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>Tier 1: Guarded Autopilot (Recommended)</span>
                      {config?.mode === 'GUARDED' && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Scans & drafts in background. Dispatches SMS 1-tap notifications to {doctorPhone} for confirmation.
                    </p>
                  </button>

                  <button
                    onClick={() => handleModeChange('DEFENSIVE')}
                    className={`w-full p-3 rounded-lg border text-left transition-all text-xs ${
                      config?.mode === 'DEFENSIVE'
                        ? 'bg-teal-500/10 border-teal-500 text-white ring-1 ring-teal-500'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>Tier 2: Defensive Autopilot</span>
                      {config?.mode === 'DEFENSIVE' && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Auto-files disputes for vulgarity & auto-sends 5-star re-share SMS prompts without manual clicks.
                    </p>
                  </button>

                  <button
                    onClick={() => handleModeChange('FULL_AUTOPILOT')}
                    className={`w-full p-3 rounded-lg border text-left transition-all text-xs ${
                      config?.mode === 'FULL_AUTOPILOT'
                        ? 'bg-teal-500/10 border-teal-500 text-white ring-1 ring-teal-500'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>Tier 3: Full Autopilot</span>
                      {config?.mode === 'FULL_AUTOPILOT' && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Auto-publishes standard de-escalating replies for wait-time reviews within 15 minutes of posting.
                    </p>
                  </button>
                </div>
              </div>

              {/* Active Rules Checklist */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Active Background Policy Rules
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between bg-slate-800/60 border border-slate-700 rounded-lg p-2.5">
                    <span className="text-slate-200">Multi-Alias Ingestion (6 Names)</span>
                    <span className="text-teal-400 font-bold text-[11px]">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-800/60 border border-slate-700 rounded-lg p-2.5">
                    <span className="text-slate-200">Auto-Dispute Profanity & Harassment</span>
                    <span className="text-teal-400 font-bold text-[11px]">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-800/60 border border-slate-700 rounded-lg p-2.5">
                    <span className="text-slate-200">Auto-Dispatch 5-Star Re-Share SMS</span>
                    <span className="text-teal-400 font-bold text-[11px]">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-800/60 border border-slate-700 rounded-lg p-2.5">
                    <span className="text-slate-200">SMS 1-Tap Quick Action Dispatch</span>
                    <span className="text-teal-400 font-bold text-[11px]">ACTIVE</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Live Background Execution Activity Log (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-teal-400" />
                  <span>Autonomous Execution Activity Log</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">Running every 60 min</span>
              </div>

              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {logs.map((log) => (
                  <div key={log.id} className="bg-slate-800/60 border border-slate-700/70 rounded-lg p-3.5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{log.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        log.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {log.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{log.description}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Automated Daemon</span>
                      {log.platform && <span className="font-semibold text-slate-400">Target: {log.platform}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Tab 2: Doctor Phone & Notification Settings */}
      {activeTab === 'SETTINGS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Phone className="w-4 h-4 text-teal-400" />
              <span>Doctor Mobile Phone & Alert Delivery Configuration</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Configure where the 24/7 background sentinel sends your instant 1-tap SMS alerts and daily 30-second executive audio briefings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Phone Config Card */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 space-y-4">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                Primary Physician Mobile Phone (SMS)
              </span>
              
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-400 block">
                  Your Personal Cell Number for 1-Tap Text Approvals
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={doctorPhone}
                    onChange={(e) => setDoctorPhone(e.target.value)}
                    placeholder="+1 (253) 555-0199"
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs font-mono rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Used exclusively to receive review alerts and send replies (1 to publish, 2 to escalate, 3 to dispute).
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-400 block">
                  Daily 30-Second Audio Briefing Delivery Time
                </label>
                <select
                  value={briefingTime}
                  onChange={(e) => setBriefingTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-teal-500"
                >
                  <option value="06:30 AM">06:30 AM (Early Pre-Op)</option>
                  <option value="07:00 AM">07:00 AM (Hospital Rounds)</option>
                  <option value="07:30 AM">07:30 AM (Before First Surgery)</option>
                  <option value="08:00 AM">08:00 AM (Clinic Opening)</option>
                  <option value="06:00 PM">06:00 PM (Evening Post-Op Briefing)</option>
                </select>
              </div>

              <button
                onClick={handleSavePhoneSettings}
                className="flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition shadow-sm"
              >
                {phoneSaved ? <Check className="w-3.5 h-3.5 text-white" /> : <Save className="w-3.5 h-3.5" />}
                <span>{phoneSaved ? 'Phone Number Saved & Active!' : 'Save Notification Preferences'}</span>
              </button>
            </div>

            {/* Delivery Channels Explainer */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 space-y-3">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                How Briefings & Alerts Are Delivered
              </span>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-900/80 border border-slate-700/80 rounded-lg p-3 space-y-1">
                  <span className="font-bold text-teal-300 block flex items-center space-x-1.5">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>1. SMS Audio Link at {briefingTime}</span>
                  </span>
                  <p className="text-[11px] text-slate-400">
                    A text arrives on your phone with a 1-tap link to listen to your synthesized 28-second summary on your commute or between rounds.
                  </p>
                </div>

                <div className="bg-slate-900/80 border border-slate-700/80 rounded-lg p-3 space-y-1">
                  <span className="font-bold text-cyan-300 block flex items-center space-x-1.5">
                    <Bell className="w-3.5 h-3.5" />
                    <span>2. Urgent SMS Quick Action Triggers</span>
                  </span>
                  <p className="text-[11px] text-slate-400">
                    When a new review drops, you receive a text with the AI draft and can text <code>1</code> to publish to Google directly.
                  </p>
                </div>

                <div className="bg-slate-900/80 border border-slate-700/80 rounded-lg p-3 space-y-1">
                  <span className="font-bold text-emerald-300 block flex items-center space-x-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    <span>3. In-App Audio Playback</span>
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Listen to the daily briefing anytime directly on the Autopilot Hub dashboard.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 3: Multi-Name Alias Resolution */}
      {activeTab === 'ALIASES' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Users className="w-4 h-4 text-teal-400" />
              <span>Multi-Alias Entity Disambiguation Engine</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Physicians often have directory profiles registered under different legal name variations. 
              The crawler links all aliases into a single unified dashboard anchored to your National Provider Identifier (NPI: <strong>{PHYSICIAN_PROFILE.npi}</strong>).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Recognized Aliases Card */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 space-y-3">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                Tracked Name Variations in Tacoma, WA
              </span>
              <div className="space-y-2">
                {PHYSICIAN_PROFILE.recognizedAliases.map((alias, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-900/80 border border-slate-700/80 rounded-lg px-3 py-2 text-xs">
                    <span className="font-semibold text-teal-300">"{alias}"</span>
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>Active Matcher</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Profile Mapping */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 space-y-3">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                Directory Profile Name Mappings
              </span>
              <div className="space-y-2.5 text-xs">
                {Object.entries(PHYSICIAN_PROFILE.breakdown).map(([platform, data]) => (
                  <div key={platform} className="bg-slate-900/80 border border-slate-700/80 rounded-lg p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{platform}</span>
                      <span className="text-[11px] text-yellow-400 font-bold">{data.rating} ⭐ ({data.count})</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Indexed under: <strong className="text-slate-200">{data.matchedAs}</strong>
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 4: Mobile SMS Quick Action Simulator */}
      {activeTab === 'SMS_SIM' && (
        <SmsQuickActionSim
          review={targetReviewForSms}
          onActionTriggered={onActionTriggered}
        />
      )}

      {/* Tab 5: Zero-Cost Cloud Deployment Architecture */}
      {activeTab === 'CLOUD_DEPLOY' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Cloud className="w-4 h-4 text-emerald-400" />
              <span>Optimal Zero-to-Near-Zero Cost Cloud Deployment Blueprint</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              To run this 24/7 background sentinel without needing your computer turned on, here is the recommended serverless architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Hosting Layer */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">1. Web Dashboard Hosting</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">$0 / mo</span>
              </div>
              <p className="text-xs font-semibold text-teal-300">Vercel or Cloudflare Pages</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Hosts your React web app on global edge CDNs. Free SSL certificates, zero server maintenance, custom domain support (e.g. <code>reputation.mohitneurosurgery.com</code>).
              </p>
            </div>

            {/* Database & Auth */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">2. Database & Storage</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">$0 / mo</span>
              </div>
              <p className="text-xs font-semibold text-cyan-300">Supabase (PostgreSQL)</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Free 500MB PostgreSQL database with Row-Level Security, real-time webhooks, and encrypted credential storage for your Google API tokens.
              </p>
            </div>

            {/* 24/7 Background Sentinel Daemon */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">3. 24/7 Background Workers</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">~$1 / mo</span>
              </div>
              <p className="text-xs font-semibold text-amber-300">Cloudflare Cron Triggers + Twilio</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Runs the hourly background crawlers for free. Twilio sends SMS 1-tap alerts to your phone at $0.0079 per text (less than $1/month for doctor review volumes).
              </p>
            </div>

          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs text-slate-300 flex items-center justify-between">
            <span><strong>Total Estimated Cloud Operating Cost:</strong> $0.00 – $1.50 per month</span>
            <span className="text-emerald-400 font-bold">100% Serverless & Maintenance-Free</span>
          </div>
        </div>
      )}

      {/* Tab 6: Regional Competitor Benchmarking */}
      {activeTab === 'BENCHMARKS' && (
        <RegionalCompetitorRadar />
      )}

    </div>
  );
};
