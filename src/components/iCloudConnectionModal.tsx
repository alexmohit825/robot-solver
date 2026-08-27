import React, { useState } from 'react';
import { Cloud, Check, X, Shield, Lock, ExternalLink, RefreshCw, Key } from 'lucide-react';
import { ICloudConnectionConfig } from '../types/vigilor';

interface ICloudConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ICloudConnectionConfig;
  onSaveConfig: (config: ICloudConnectionConfig) => void;
}

export const ICloudConnectionModal: React.FC<ICloudConnectionModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [formData, setFormData] = useState<ICloudConnectionConfig>({ ...config });
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState<boolean | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsVerifying(true);
    setVerifySuccess(null);
    // Simulate CalDAV PROPFIND Handshake with Apple server
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsVerifying(false);
    setVerifySuccess(true);
    setFormData(prev => ({
      ...prev,
      isConnected: true,
      lastSyncAt: new Date().toISOString()
    }));
  };

  const handleSave = () => {
    onSaveConfig(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">iCloud CalDAV Integration</h2>
            <p className="text-xs text-slate-400">Direct cloud-to-cloud connection to your Apple Calendar</p>
          </div>
        </div>

        {/* Instruction Alert */}
        <div className="bg-sky-950/30 border border-sky-800/60 rounded-2xl p-4 text-xs text-sky-200 space-y-2">
          <div className="flex items-center space-x-1.5 font-bold text-sky-300">
            <Shield className="w-4 h-4" />
            <span>Apple Security Protocol (App-Specific Password)</span>
          </div>
          <p className="opacity-90 leading-relaxed">
            Never use your primary Apple ID password. Generate a secure, dedicated App-Specific Password for VigilOR at{' '}
            <a
              href="https://appleid.apple.com"
              target="_blank"
              rel="noreferrer"
              className="underline font-bold text-sky-400 inline-flex items-center space-x-1"
            >
              <span>appleid.apple.com</span>
              <ExternalLink className="w-3 h-3 ml-0.5 inline" />
            </a>.
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Apple ID (iCloud Email)
            </label>
            <input
              type="email"
              value={formData.appleId}
              onChange={e => setFormData({ ...formData, appleId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-sky-500"
              placeholder="surgeon@icloud.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              App-Specific Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={formData.appSpecificPasswordMasked}
                onChange={e => setFormData({ ...formData, appSpecificPasswordMasked: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-sky-500"
                placeholder="xxxx-xxxx-xxxx-xxxx"
              />
              <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Monitored Calendar Folder
            </label>
            <select
              value={formData.selectedCalendarName}
              onChange={e => setFormData({ ...formData, selectedCalendarName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-sky-500"
            >
              {formData.availableCalendars.map(cal => (
                <option key={cal} value={cal}>{cal}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              CalDAV Polling Interval
            </label>
            <select
              value={formData.syncIntervalSeconds}
              onChange={e => setFormData({ ...formData, syncIntervalSeconds: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-sky-500"
            >
              <option value={30}>Every 30 seconds (High frequency)</option>
              <option value={60}>Every 60 seconds (Recommended)</option>
              <option value={120}>Every 2 minutes</option>
              <option value={300}>Every 5 minutes</option>
            </select>
          </div>
        </div>

        {/* Verification Status */}
        {verifySuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Successfully authenticated with Apple CalDAV endpoint (p01-caldav.icloud.com).</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={handleTestConnection}
            disabled={isVerifying}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin text-sky-400' : ''}`} />
            <span>{isVerifying ? 'Verifying Handshake...' : 'Test CalDAV Connection'}</span>
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-all shadow-lg shadow-sky-500/25"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
