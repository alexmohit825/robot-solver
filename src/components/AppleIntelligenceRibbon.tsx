import React, { useState } from 'react';
import { AppleIntelligenceModel } from '../engine/AppleIntelligenceModel';
import { WritingToolTone } from '../types/keyboard';
import { Sparkles, Wand2, Check, Smile, Briefcase, Zap, Scissors, ChevronUp, ChevronDown } from 'lucide-react';

interface AppleIntelligenceRibbonProps {
  currentText: string;
  onTextUpdated: (newText: string) => void;
  isEnabled: boolean;
  onToggleEnabled: () => void;
  aiModel: AppleIntelligenceModel;
}

export const AppleIntelligenceRibbon: React.FC<AppleIntelligenceRibbonProps> = ({
  currentText,
  onTextUpdated,
  isEnabled,
  onToggleEnabled,
  aiModel
}) => {
  const [isToolsOpen, setIsToolsOpen] = useState<boolean>(false);
  const [activeFeedback, setActiveFeedback] = useState<string | null>(null);

  const triggerFeedback = (message: string) => {
    setActiveFeedback(message);
    setTimeout(() => setActiveFeedback(null), 1800);
  };

  const handleProofread = () => {
    const { corrected, changesCount } = aiModel.proofreadAndCorrect(currentText);
    onTextUpdated(corrected);
    triggerFeedback(`Fixed ${changesCount} typos & formatting`);
    setIsToolsOpen(false);
  };

  const handleMashedWordRepair = () => {
    const fixed = aiModel.disentangleMashedWords(currentText);
    onTextUpdated(fixed);
    triggerFeedback("Disentangled unspaced words");
    setIsToolsOpen(false);
  };

  const handleToneRewrite = (tone: WritingToolTone) => {
    const rewritten = aiModel.rewriteTone(currentText, tone);
    onTextUpdated(rewritten);
    triggerFeedback(`Rewritten in ${tone} tone`);
    setIsToolsOpen(false);
  };

  return (
    <div className="relative w-full z-30">
      {/* Active Action Feedback Banner */}
      {activeFeedback && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-cyan-500/60 text-cyan-300 text-[11px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center space-x-1.5 animate-in fade-in slide-in-from-bottom-2 duration-150 whitespace-nowrap z-50">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>{activeFeedback}</span>
        </div>
      )}

      {/* Writing Tools Popover Menu */}
      {isToolsOpen && isEnabled && (
        <div className="absolute bottom-full mb-1.5 left-2 right-2 bg-slate-950/95 border border-purple-500/50 rounded-2xl p-3 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-150 z-40 space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <span className="text-xs font-bold text-white flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Apple Intelligence Writing Tools</span>
            </span>
            <button
              onClick={() => setIsToolsOpen(false)}
              className="text-[10px] text-slate-400 hover:text-slate-200"
            >
              Done
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {/* Proofread */}
            <button
              onClick={handleProofread}
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-left flex items-center space-x-2 text-xs text-slate-200 transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <div>
                <p className="font-semibold text-[11px]">Proofread</p>
                <p className="text-[9px] text-slate-400">Fix typos & grammar</p>
              </div>
            </button>

            {/* Mashed Word Repair */}
            <button
              onClick={handleMashedWordRepair}
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-left flex items-center space-x-2 text-xs text-slate-200 transition-colors"
            >
              <Scissors className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div>
                <p className="font-semibold text-[11px]">Mashed-Word Fix</p>
                <p className="text-[9px] text-slate-400">Separate unspaced words</p>
              </div>
            </button>

            {/* Tone: Friendly */}
            <button
              onClick={() => handleToneRewrite('friendly')}
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-left flex items-center space-x-2 text-xs text-slate-200 transition-colors"
            >
              <Smile className="w-3.5 h-3.5 text-pink-400 shrink-0" />
              <div>
                <p className="font-semibold text-[11px]">Friendly</p>
                <p className="text-[9px] text-slate-400">Warm & casual</p>
              </div>
            </button>

            {/* Tone: Concise */}
            <button
              onClick={() => handleToneRewrite('concise')}
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-left flex items-center space-x-2 text-xs text-slate-200 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-semibold text-[11px]">Concise</p>
                <p className="text-[9px] text-slate-400">Direct & short</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Main Intelligence Ribbon Bar */}
      <div className={`h-8 px-2 flex items-center justify-between border-t transition-all ${
        isEnabled
          ? 'bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-cyan-950/40 border-purple-500/40 shadow-inner'
          : 'bg-slate-950 border-slate-800/60'
      }`}>
        {/* Toggle Button with Apple Intelligence Logo / Glow */}
        <button
          onClick={onToggleEnabled}
          className={`px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center space-x-1.5 transition-all ${
            isEnabled
              ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 text-white shadow-md shadow-purple-500/30'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className={`w-3 h-3 ${isEnabled ? 'animate-pulse' : ''}`} />
          <span>Apple Intelligence</span>
        </button>

        {/* Quick Writing Tools Trigger (when enabled) */}
        {isEnabled ? (
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setIsToolsOpen((prev) => !prev)}
              className="px-2 py-0.5 rounded-md bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-[10px] font-semibold border border-purple-500/30 flex items-center space-x-1 transition-colors"
            >
              <Wand2 className="w-3 h-3 text-purple-400" />
              <span>Writing Tools</span>
              {isToolsOpen ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronUp className="w-2.5 h-2.5" />}
            </button>

            <button
              onClick={handleProofread}
              title="One-tap auto proofread"
              className="px-2 py-0.5 rounded-md bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-[10px] font-semibold flex items-center space-x-1"
            >
              <Check className="w-2.5 h-2.5" />
              <span>Fix</span>
            </button>
          </div>
        ) : (
          <span className="text-[10px] text-slate-500">Tap to activate AI safety net</span>
        )}
      </div>
    </div>
  );
};
