import React, { useState } from 'react';
import { X, ShieldCheck, ExternalLink, Play, CheckCircle2, RefreshCw, Globe, Send, FileText, Info } from 'lucide-react';
import { ExtensionActionPayload } from '../../types/reputation';
import { ApiService } from '../../services/apiService';

interface ExtensionSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  onActionComplete: () => void;
}

export const ExtensionSimulator: React.FC<ExtensionSimulatorProps> = ({
  isOpen,
  onClose,
  onActionComplete
}) => {
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  if (!isOpen) return null;

  const queue = ApiService.getExtensionQueue();
  const currentAction = queue[0];

  const handleExecuteAction = async () => {
    if (!currentAction) return;
    setIsExecuting(true);
    await new Promise(r => setTimeout(r, 1200)); // browser automation execution
    ApiService.completeExtensionAction(currentAction.actionId);
    setIsExecuting(false);
    onActionComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-slate-800/90 border-b border-slate-700 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Directory Form Injector Bridge</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Ready & Connected
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Automated form injection for Healthgrades, Yelp, RateMDs & Vitals portals</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">

          {/* Section Guide */}
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3.5 flex items-start space-x-2.5 text-xs text-slate-300">
            <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <p className="text-slate-300 leading-relaxed text-[11px]">
              <strong>How this works:</strong> Because directories like Healthgrades, Yelp, and RateMDs lack public reply APIs, this injector runs within your authenticated browser session to directly fill the reply or takedown form on the directory portal without requiring manual typing.
            </p>
          </div>
          
          {queue.length === 0 ? (
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-8 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-200">Injector Queue is Empty</h4>
              <p className="text-xs text-slate-400">
                All approved clinical responses and takedown petitions have been dispatched to their respective directory portals.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Browser Address Bar */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 flex items-center space-x-2 text-xs font-mono text-slate-300">
                <Globe className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="text-slate-500">https://</span>
                <span className="text-teal-300 truncate">{currentAction.targetUrl.replace('https://', '')}</span>
              </div>

              {/* Action Description */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center space-x-1.5">
                    {currentAction.actionType === 'FILL_REPLY' ? (
                      <>
                        <Send className="w-3.5 h-3.5 text-teal-400" />
                        <span>Injecting Approved Physician Response</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-3.5 h-3.5 text-rose-400" />
                        <span>Injecting Formal Takedown Appeal</span>
                      </>
                    )}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">
                    {currentAction.targetPlatform}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Target Review:</span>
                  <p className="text-xs text-slate-200 italic">{currentAction.reviewSnippet}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Payload to Inject into Portal Form:</span>
                  <div className="bg-slate-900 border border-slate-700/80 rounded-lg p-3 text-xs text-slate-300 leading-relaxed font-sans max-h-36 overflow-y-auto">
                    {currentAction.textToInject}
                  </div>
                </div>
              </div>

              {/* Execute Button */}
              <button
                onClick={handleExecuteAction}
                disabled={isExecuting}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 disabled:opacity-50 text-white py-3 rounded-xl text-xs font-bold transition shadow-lg shadow-teal-900/30"
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Auto-filling Form & Submitting to {currentAction.targetPlatform}...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>1-Click Auto-Fill & Submit to {currentAction.targetPlatform}</span>
                  </>
                )}
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
