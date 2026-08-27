import React, { useState } from 'react';
import { Smartphone, Send, CheckCircle2, ShieldAlert, ArrowRight, CornerDownLeft, Sparkles, RefreshCw } from 'lucide-react';
import { Review } from '../../types/reputation';
import { ApiService } from '../../services/apiService';
import { PHYSICIAN_PROFILE } from '../../data/mockReviews';

interface SmsQuickActionSimProps {
  review: Review;
  onActionTriggered: (message: string) => void;
}

export const SmsQuickActionSim: React.FC<SmsQuickActionSimProps> = ({ review, onActionTriggered }) => {
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<{ sender: 'SENTINEL' | 'DOCTOR'; text: string; time: string }>>([
    {
      sender: 'SENTINEL',
      text: `[MedPulse Alert] Dr. Mohit: New 1-star on Google from ${review.authorName} ("${review.reviewText.slice(0, 55)}...").\n\nAI Drafted Reply:\n"Thank you for your feedback. At MultiCare Neuroscience Institute, we are committed to prompt, compassionate care. Call office at ${PHYSICIAN_PROFILE.phone}."\n\n• Reply 1 to Publish to Google\n• Reply 2 to Escalate to Tacoma Office Manager\n• Reply 3 to File ToS Dispute`,
      time: 'Just now'
    }
  ]);

  const handleSendReply = async (actionNum: '1' | '2' | '3') => {
    setIsExecuting(true);
    const newMessages = [
      ...messages,
      { sender: 'DOCTOR' as const, text: actionNum, time: 'Just now' }
    ];
    setMessages(newMessages);

    try {
      const result = await ApiService.executeSmsQuickAction(actionNum, review.id);
      
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'SENTINEL',
            text: `✓ ${result.message}\nAction executed automatically in the background. Review status updated in your dashboard.`,
            time: 'Just now'
          }
        ]);
        setIsExecuting(false);
        onActionTriggered(result.message);
      }, 700);

    } catch (err) {
      console.error(err);
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex items-start space-x-3 text-xs text-slate-300">
        <Smartphone className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-teal-300">Mobile SMS 1-Tap Quick Action Simulator for {PHYSICIAN_PROFILE.doctorCellPhone}:</span>
          <p className="text-slate-400 mt-0.5 leading-relaxed text-[11px]">
            When a new review drops while you are in surgery or hospital rounds, the autonomous sentinel texts your phone at <strong>(206) 650-3283</strong>. 
            You can respond, escalate, or dispute in <strong>5 seconds by texting 1, 2, or 3</strong> directly from your native iMessage/SMS app without logging in.
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-sm bg-slate-950 border-4 border-slate-700 rounded-[2.5rem] p-4 shadow-2xl space-y-3 flex flex-col justify-between min-h-[460px]">
          
          {/* Phone Header */}
          <div>
            <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-900"></div>
            </div>
            <div className="text-center pb-2 border-b border-slate-800">
              <span className="text-[10px] text-slate-300 font-bold block">Dr. Abdi Alex Mohit's Phone</span>
              <span className="text-[9px] text-teal-400 font-mono">(206) 650-3283 • Connected to Sentinel</span>
            </div>
          </div>

          {/* SMS Messages Feed */}
          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[300px] pr-1 no-scrollbar">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'DOCTOR' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`rounded-2xl p-3 text-xs leading-relaxed max-w-[88%] shadow-sm ${
                    m.sender === 'DOCTOR'
                      ? 'bg-blue-600 text-white rounded-tr-xs font-mono font-bold'
                      : 'bg-slate-800 text-slate-200 rounded-tl-xs border border-slate-700 whitespace-pre-line text-[11px]'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-500 mt-0.5 px-1">{m.time}</span>
              </div>
            ))}

            {isExecuting && (
              <div className="flex items-center space-x-1.5 text-[10px] text-teal-400 italic">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Executing API action in background...</span>
              </div>
            )}
          </div>

          {/* Quick Action Tap Buttons */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block text-center">
              Tap to Test SMS Action from (206) 650-3283:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => handleSendReply('1')}
                disabled={isExecuting}
                className="bg-slate-800 hover:bg-teal-600 text-white border border-slate-700 hover:border-teal-500 rounded-lg p-2 text-center text-xs font-bold transition disabled:opacity-50"
              >
                <span className="block text-[11px]">1</span>
                <span className="text-[9px] font-normal text-slate-300">Publish</span>
              </button>
              <button
                onClick={() => handleSendReply('2')}
                disabled={isExecuting}
                className="bg-slate-800 hover:bg-cyan-600 text-white border border-slate-700 hover:border-cyan-500 rounded-lg p-2 text-center text-xs font-bold transition disabled:opacity-50"
              >
                <span className="block text-[11px]">2</span>
                <span className="text-[9px] font-normal text-slate-300">Escalate</span>
              </button>
              <button
                onClick={() => handleSendReply('3')}
                disabled={isExecuting}
                className="bg-slate-800 hover:bg-rose-600 text-white border border-slate-700 hover:border-rose-500 rounded-lg p-2 text-center text-xs font-bold transition disabled:opacity-50"
              >
                <span className="block text-[11px]">3</span>
                <span className="text-[9px] font-normal text-slate-300">Dispute</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
