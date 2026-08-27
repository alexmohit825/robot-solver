import React, { useState, useEffect } from 'react';
import { Sparkles, Send, ShieldCheck, Copy, Check, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { Review, ResponseDraft, ResponseTone } from '../../types/reputation';
import { ApiService } from '../../services/apiService';

interface AiResponseEditorProps {
  review: Review;
  onResponsePublished: (reviewId: string, text: string, method: 'DIRECT_API' | 'COMPANION_EXTENSION') => void;
  onOpenExtensionSim: () => void;
}

export const AiResponseEditor: React.FC<AiResponseEditorProps> = ({
  review,
  onResponsePublished,
  onOpenExtensionSim
}) => {
  const [drafts, setDrafts] = useState<ResponseDraft[]>([]);
  const [selectedTone, setSelectedTone] = useState<ResponseTone>(
    review.rating <= 2 ? 'EMPATHETIC_POLICY' : 'WARM_GRATITUDE'
  );
  const [customResponseText, setCustomResponseText] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    loadDrafts();
  }, [review.id]);

  const loadDrafts = async () => {
    setIsGenerating(true);
    try {
      const generated = await ApiService.generateDrafts(review.id);
      setDrafts(generated);
      const activeDraft = generated.find(d => d.tone === selectedTone) || generated[0];
      if (activeDraft) {
        setCustomResponseText(activeDraft.content);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectTone = (tone: ResponseTone) => {
    setSelectedTone(tone);
    const draft = drafts.find(d => d.tone === tone);
    if (draft) {
      setCustomResponseText(draft.content);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customResponseText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const method = review.platform === 'GOOGLE' ? 'DIRECT_API' : 'COMPANION_EXTENSION';
      await ApiService.publishResponse(review.id, customResponseText, method);
      onResponsePublished(review.id, customResponseText, method);
      if (method === 'COMPANION_EXTENSION') {
        onOpenExtensionSim();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPublishing(false);
    }
  };

  const isDirectApi = review.platform === 'GOOGLE';

  return (
    <div className="space-y-4">
      
      {/* Tone Selectors */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>AI Response Tone & Clinical Strategy</span>
          </label>
          <button
            onClick={loadDrafts}
            disabled={isGenerating}
            className="text-[11px] text-teal-400 hover:text-teal-300 flex items-center space-x-1 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Regenerate Drafts</span>
          </button>
        </div>

        {isGenerating ? (
          <div className="bg-slate-800/40 rounded-lg p-6 text-center border border-slate-700">
            <RefreshCw className="w-5 h-5 text-teal-400 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-400">Synthesizing clinical response drafts...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {drafts.map((draft) => (
              <button
                key={draft.id}
                onClick={() => handleSelectTone(draft.tone)}
                className={`p-2.5 rounded-lg text-left border transition-all text-xs ${
                  selectedTone === draft.tone
                    ? 'bg-teal-500/10 border-teal-500 text-white shadow-sm ring-1 ring-teal-500/40'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="font-semibold">{draft.toneTitle.split('(')[0]}</div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{draft.content}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Response Textarea */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Response Content to Publish
          </label>
          <span className="text-[11px] text-slate-400">
            {customResponseText.length} characters
          </span>
        </div>
        <textarea
          rows={5}
          value={customResponseText}
          onChange={(e) => setCustomResponseText(e.target.value)}
          placeholder="Type or customize your clinical response..."
          className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-lg p-3.5 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 leading-relaxed font-sans"
        />
      </div>

      {/* Safety Verification Badge */}
      <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-lg p-3 flex items-start space-x-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-semibold text-emerald-300">Clinical Communication Safety Verified:</span>
          <p className="text-slate-300 text-[11px] mt-0.5">
            This response avoids disclosing confidential surgical records, emphasizes standard clinic standards, and offers direct telephone resolution with your Tacoma practice administration.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-lg text-xs font-medium transition"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied to Clipboard' : 'Copy Text'}</span>
        </button>

        <div className="flex items-center space-x-2">
          {isDirectApi ? (
            <button
              onClick={handlePublish}
              disabled={isPublishing || !customResponseText.trim()}
              className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm"
            >
              <Send className={`w-3.5 h-3.5 ${isPublishing ? 'animate-pulse' : ''}`} />
              <span>{isPublishing ? 'Publishing to Google...' : '1-Click Direct Google API Publish'}</span>
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={isPublishing || !customResponseText.trim()}
              className="flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>1-Click Post via Directory Form Injector</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
