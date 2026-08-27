import React, { useState } from 'react';
import { Smartphone, Send, Sparkles, CheckCircle2, Copy, Check, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { Review, ReShareCampaign as CampaignType } from '../../types/reputation';
import { SchemaGenerator } from '../../services/schemaGenerator';
import { ApiService } from '../../services/apiService';

interface ReShareCampaignProps {
  review: Review;
  onCampaignSent: (campaign: CampaignType) => void;
}

export const ReShareCampaign: React.FC<ReShareCampaignProps> = ({ review, onCampaignSent }) => {
  const [targetPlatform, setTargetPlatform] = useState<string>('Healthgrades');
  const [recipientPhone, setRecipientPhone] = useState<string>(
    review.matchedPatientContact?.phone || '+1 (253) 892-4411'
  );
  const [recipientName, setRecipientName] = useState<string>(
    review.matchedPatientContact?.name || review.authorName
  );
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sentCampaign, setSentCampaign] = useState<CampaignType | null>(null);

  const { message, shortLink } = SchemaGenerator.buildReSharePrompt(review, targetPlatform);

  const handleSendPrompt = async () => {
    setIsSending(true);
    try {
      const result = await ApiService.sendReShareCampaign({
        reviewId: review.id,
        recipientName,
        recipientPhone,
        targetPlatform: targetPlatform as any,
        shortLink,
        messageText: message
      });
      setSentCampaign(result);
      onCampaignSent(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Info Callout */}
      <div className="bg-teal-950/30 border border-teal-800/40 rounded-xl p-4 flex items-start space-x-3 text-xs text-slate-300">
        <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-teal-300">Pillar 1: Compliant Multi-Platform Syndication:</span>
          <p className="text-slate-400 mt-0.5 leading-relaxed">
            Directly copying and posting a patient's review to another platform violates FTC anti-astroturfing regulations. 
            Instead, this system sends a personalized, 1-click invitation to your patient that pre-copies their exact positive review to their mobile clipboard and opens Healthgrades, RateMDs, or Vitals directly on the review submission form.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form: Configuration (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Re-Share Campaign Configurator
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Target Directory to Boost</label>
              <select
                value={targetPlatform}
                onChange={(e) => setTargetPlatform(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-teal-500"
              >
                <option value="Healthgrades">Healthgrades (High Tacoma Organic SEO Impact)</option>
                <option value="RateMDs">RateMDs (Physician Specialty Rankings)</option>
                <option value="Vitals">Vitals / WebMD Directory</option>
                <option value="Yelp">Yelp</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Patient Name</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Mobile Phone (SMS)</label>
                <input
                  type="text"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Personalized SMS Prompt</label>
              <div className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg p-3 whitespace-pre-line leading-relaxed font-sans">
                {message}
              </div>
            </div>

            <button
              onClick={handleSendPrompt}
              disabled={isSending || !!sentCampaign}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 disabled:opacity-50 text-white py-2.5 rounded-lg text-xs font-bold transition shadow-sm"
            >
              <Send className={`w-3.5 h-3.5 ${isSending ? 'animate-pulse' : ''}`} />
              <span>{sentCampaign ? 'Re-Share Prompt Dispatched (SMS Sent)' : 'Dispatch 1-Click Patient Re-Share Prompt'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Mobile View Preview (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="w-72 bg-slate-950 border-4 border-slate-700 rounded-[2.5rem] p-3.5 shadow-2xl space-y-3">
            {/* Phone Notch */}
            <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-900"></div>
            </div>

            <div className="text-center pb-2 border-b border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Messages • Dr. Mohit Clinic</span>
            </div>

            {/* SMS Bubble */}
            <div className="bg-teal-600/90 text-white rounded-2xl rounded-tr-xs p-3 text-xs leading-relaxed shadow-sm space-y-2">
              <p>{message}</p>
              <div className="bg-teal-700/80 rounded-lg p-2 border border-teal-500/40 flex items-center justify-between text-[10px]">
                <span className="truncate">{shortLink}</span>
                <ArrowRight className="w-3 h-3 shrink-0 ml-1" />
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-400 pt-2 flex items-center justify-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-teal-400" />
              <span>Patient Direct Copy-Paste Link</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
