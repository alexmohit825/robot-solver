import React, { useState } from 'react';
import { ShieldCheck, X, Send, CheckCircle2, AlertOctagon, RefreshCw, Key, Phone, Cloud, Smartphone } from 'lucide-react';
import { TwilioConfig, ICloudConnectionConfig, SurgeonProfile } from '../types/vigilor';

interface LiveDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  twilioConfig: TwilioConfig;
  onSaveTwilioConfig: (config: TwilioConfig) => void;
  icloudConfig: ICloudConnectionConfig;
  profile: SurgeonProfile;
}

export const LiveDiagnosticsModal: React.FC<LiveDiagnosticsModalProps> = ({
  isOpen,
  onClose,
  twilioConfig,
  onSaveTwilioConfig,
  icloudConfig,
  profile,
}) => {
  const [formData, setFormData] = useState<TwilioConfig>({ ...twilioConfig });
  const [authTokenInput, setAuthTokenInput] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [testResult, setTestResult] = useState<{ status: 'SUCCESS' | 'ERROR'; message: string; sid?: string } | null>(null);

  if (!isOpen) return null;

  const handleSendLiveTestSms = async () => {
    if (!formData.accountSid || !formData.fromPhoneNumber || !formData.targetPhoneNumber) {
      setTestResult({
        status: 'ERROR',
        message: 'Please provide your Twilio Account SID, From Number, and Cell Phone Number.'
      });
      return;
    }

    if (!authTokenInput) {
      setTestResult({
        status: 'ERROR',
        message: 'Please paste your 32-character Twilio Auth Token from your Twilio Console to authenticate the live SMS.'
      });
      return;
    }

    setIsSending(true);
    setTestResult(null);

    try {
      const basicAuth = btoa(`${formData.accountSid}:${authTokenInput.trim()}`);
      const params = new URLSearchParams();
      params.append('From', formData.fromPhoneNumber.trim());
      params.append('To', formData.targetPhoneNumber.trim());
      params.append('Body', `[VigilOR Live Test]\nDr. ${profile.name}, your surgical availability sentinel is online and connected via Twilio number ${formData.fromPhoneNumber}!`);

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${formData.accountSid.trim()}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
      });

      const data = await response.json();

      if (response.ok && data.sid) {
        const updated = {
          ...formData,
          authTokenMasked: '••••••••••••••••••••••••••••••••',
          isVerified: true,
          lastTestedAt: new Date().toISOString()
        };
        setFormData(updated);
        onSaveTwilioConfig(updated);

        setTestResult({
          status: 'SUCCESS',
          message: `Live SMS successfully dispatched via Twilio! Status: "${data.status}". Message SID: ${data.sid}`,
          sid: data.sid
        });
      } else {
        setTestResult({
          status: 'ERROR',
          message: `Twilio Error (${data.code || response.status}): ${data.message || 'Authentication failed. Please verify your Auth Token and Account SID.'}`
        });
      }
    } catch (err: any) {
      // If browser CORS intercepts the raw Twilio endpoint
      setTestResult({
        status: 'ERROR',
        message: `Network/CORS Notice: ${err.message || 'Direct browser dispatch was blocked by browser security.'} Please verify your Auth Token is saved in Netlify Environment Variables.`
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Live Twilio SMS Gateway</h2>
            <p className="text-xs text-slate-400">Send an actual live text message to your iPhone right now</p>
          </div>
        </div>

        {/* Credentials Form */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Twilio Account SID
            </label>
            <input
              type="text"
              value={formData.accountSid}
              onChange={e => setFormData({ ...formData, accountSid: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Twilio Auth Token *
              </label>
              <a
                href="https://console.twilio.com"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-sky-400 hover:underline font-semibold"
              >
                Find on Twilio Console ↗
              </a>
            </div>
            <div className="relative">
              <input
                type="password"
                value={authTokenInput}
                onChange={e => setAuthTokenInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                placeholder="Paste your 32-character Auth Token here"
              />
              <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                From Twilio Number
              </label>
              <input
                type="text"
                value={formData.fromPhoneNumber}
                onChange={e => setFormData({ ...formData, fromPhoneNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                To Your Mobile Phone
              </label>
              <input
                type="text"
                value={formData.targetPhoneNumber}
                onChange={e => setFormData({ ...formData, targetPhoneNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Live Result Feedback */}
        {testResult && (
          <div className={`p-4 rounded-2xl border text-xs flex items-start space-x-2.5 ${
            testResult.status === 'SUCCESS'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
              : 'bg-rose-500/15 border-rose-500/30 text-rose-200'
          }`}>
            {testResult.status === 'SUCCESS' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertOctagon className="w-5 h-5 text-rose-400 flex-shrink-0" />
            )}
            <div className="space-y-1">
              <p className="font-semibold">{testResult.message}</p>
              {testResult.sid && (
                <p className="text-[10px] opacity-75 font-mono">Twilio Message ID: {testResult.sid}</p>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750"
          >
            Close
          </button>

          <button
            onClick={handleSendLiveTestSms}
            disabled={isSending || !authTokenInput}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-40"
          >
            <Send className={`w-3.5 h-3.5 ${isSending ? 'animate-bounce' : ''}`} />
            <span>{isSending ? 'Sending Live SMS via Twilio...' : 'Send Live Test SMS Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
