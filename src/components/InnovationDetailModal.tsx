import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  Mic, 
  MicOff, 
  Save, 
  Sliders, 
  FileCheck2, 
  Scale,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { InnovationDossier, SurgeonReviewState, KinematicParameters } from '../types';
import { KinematicDiagram } from './KinematicDiagram';

interface InnovationDetailModalProps {
  innovation: InnovationDossier;
  reviewState: SurgeonReviewState;
  onUpdateReviewState: (id: string, state: Partial<SurgeonReviewState>) => void;
  onOpenPatentAnalysis: (innovation: InnovationDossier) => void;
  onClose: () => void;
}

export const InnovationDetailModal: React.FC<InnovationDetailModalProps> = ({
  innovation,
  reviewState,
  onUpdateReviewState,
  onOpenPatentAnalysis,
  onClose
}) => {
  const [params, setParams] = useState<KinematicParameters>({
    ...innovation.parameters,
    ...(reviewState.customParameters || {})
  });

  const [notes, setNotes] = useState<string>(reviewState.surgeonNotes || '');
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>(reviewState.voiceDictationTranscript || '');
  const [status, setStatus] = useState(reviewState.status);
  const [isPatentFlagged, setIsPatentFlagged] = useState(reviewState.flaggedForPatentDraft);
  const [aiSynthesizedFeedback, setAiSynthesizedFeedback] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleParamChange = <K extends keyof KinematicParameters>(key: K, value: KinematicParameters[K]) => {
    setParams(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleVoiceSimulate = () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      setTimeout(() => {
        const sampleDictations = [
          `"Increase the bayonet offset to +40 degrees so my hand completely clears the exoscope 3D beam. Also ensure the tip has a quick-release detachable mechanism for rapid ultrasonic cleaning in the OR."`,
          `"The reach needs to be at least 140mm for deep L5-S1 corridor access. Verify that the outer sleeve is carbon-composite to prevent fluoroscopy scatter when driving pedicle screws under live O-arm."`,
          `"Excellent concept. Let's add a dual saline flush channel right at the cutting horn to continuously scavenge bone slurry without needing a separate suction wand."`
        ];
        const randomDictation = sampleDictations[Math.floor(Math.random() * sampleDictations.length)];
        setVoiceTranscript(randomDictation);
        setIsRecordingVoice(false);
        setAiSynthesizedFeedback(`AI Engineering Synthesis: Adapted mechanical tolerance to ±0.05 mm and verified line-of-sight clearance at +40° offset.`);
      }, 1500);
    }
  };

  const handleSaveHoning = () => {
    onUpdateReviewState(innovation.id, {
      customParameters: params,
      surgeonNotes: notes,
      voiceDictationTranscript: voiceTranscript,
      status: status,
      flaggedForPatentDraft: isPatentFlagged
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header with Back Button */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-cyan-950/90 text-cyan-300 border border-cyan-600/80 hover:bg-cyan-900 hover:text-white flex items-center gap-1.5 font-mono text-xs font-bold shadow-lg transition-all cursor-pointer"
              title="Return to Main Portfolio"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>← Back to Home</span>
            </button>

            <span className="w-9 h-9 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/80 font-mono font-bold flex items-center justify-center text-sm shadow-inner">
              #{innovation.rank}
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {innovation.category}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60 font-mono">
                  Donor: {innovation.donorField}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5 line-clamp-1">
                {innovation.title}
              </h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Top Grid: Kinematic Schematic & Clinical Translation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Interactive Diagram & Parametric Sliders */}
            <div className="lg:col-span-6 space-y-4">
              <KinematicDiagram 
                diagramType={innovation.diagramType}
                parameters={params}
                title={innovation.title}
              />

              {/* Parametric Honing Sliders */}
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-cyan-400 border-b border-slate-800 pb-2">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Sliders className="w-3.5 h-3.5" /> SURGEON PARAMETRIC HONING
                  </span>
                  <span className="text-slate-500">Live Geometry Recalculation</span>
                </div>

                {/* Shaft Length Slider */}
                {params.shaftLengthMinMax[1] > 0 && (
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-400">Working Shaft Reach:</span>
                      <span className="text-cyan-400 font-bold">{params.shaftLengthMm} mm</span>
                    </div>
                    <input 
                      type="range"
                      min={params.shaftLengthMinMax[0]}
                      max={params.shaftLengthMinMax[1]}
                      value={params.shaftLengthMm}
                      onChange={(e) => handleParamChange('shaftLengthMm', Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                      <span>{params.shaftLengthMinMax[0]}mm (Tubular MIS)</span>
                      <span>{params.shaftLengthMinMax[1]}mm (Deep Oblique/Sellar)</span>
                    </div>
                  </div>
                )}

                {/* Bayonet Angle Slider */}
                {params.bayonetAngleMinMax[1] > 0 && (
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-400">Bayonet Line-of-Sight Offset:</span>
                      <span className="text-amber-400 font-bold">+{params.bayonetAngleDeg}°</span>
                    </div>
                    <input 
                      type="range"
                      min={params.bayonetAngleMinMax[0]}
                      max={params.bayonetAngleMinMax[1]}
                      value={params.bayonetAngleDeg}
                      onChange={(e) => handleParamChange('bayonetAngleDeg', Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                      <span>{params.bayonetAngleMinMax[0]}° (Minimal)</span>
                      <span>{params.bayonetAngleMinMax[1]}° (Steep 3D Exoscope Clearing)</span>
                    </div>
                  </div>
                )}

                {/* Toggle Controls: Radiolucent & Fluidics */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <label className="flex items-center space-x-2 text-xs font-mono text-slate-300 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={params.isRadiolucent}
                      onChange={(e) => handleParamChange('isRadiolucent', e.target.checked)}
                      className="rounded border-slate-700 bg-slate-800 text-cyan-400 focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <span>Carbon-PEEK Radiolucent</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs font-mono text-slate-300 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={params.hasIrrigationSuctionChannel}
                      onChange={(e) => handleParamChange('hasIrrigationSuctionChannel', e.target.checked)}
                      className="rounded border-slate-700 bg-slate-800 text-cyan-400 focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <span>Integrated Dual Saline Flush</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Master Critic Scorecard & Translation Delta */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Clinical Bottleneck & Mechanical Translation */}
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-3">
                <div>
                  <span className="text-[10px] font-mono text-rose-400 block font-bold uppercase">Physical Clinical Bottleneck:</span>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {innovation.clinicalProblemStatement}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono text-cyan-400 block font-bold uppercase">Cross-Disciplinary Mechanical Delta:</span>
                  <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                    {innovation.mechanicalDelta}
                  </p>
                </div>
              </div>

              {/* Master Surgeon Critic Scorecard */}
              <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-2">
                  <span className="text-teal-400 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> 25-YR SURGEON CRITIC SCORECARD
                  </span>
                  <span className="text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60">
                    APPROVED FOR PROTO-CAD
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">DURAL SAFETY:</span>
                    <span className="text-slate-200 font-semibold">{innovation.masterCriticVerdict.duralSafetyRating}</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">LINE-OF-SIGHT SCORE:</span>
                    <span className="text-cyan-300 font-semibold">{innovation.masterCriticVerdict.lineOfSightScore}</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">O-ARM X-RAY ARTIFACT:</span>
                    <span className="text-amber-300 font-semibold">{innovation.masterCriticVerdict.radiologicalScatterIndex}</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">HAPTIC FEEL:</span>
                    <span className="text-emerald-300 font-semibold">{innovation.masterCriticVerdict.tactileHapticFeedback}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 italic bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/60">
                  "{innovation.masterCriticVerdict.criticNotes}"
                </p>
              </div>

              {/* Action Button: Deep Patent Analysis Modal */}
              <button
                onClick={() => onOpenPatentAnalysis(innovation)}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500/20 to-amber-600/10 hover:from-amber-500/30 hover:to-amber-600/20 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-amber-500/5 cursor-pointer"
              >
                <Scale className="w-4 h-4 text-amber-400" />
                <span>EXPAND DEEP PATENT CLAIMS & PRIOR ART ANALYSIS</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          </div>

          {/* Bottom Section: Voice Dictation & Surgeon Review Studio */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> SURGEON DICTATION & CUSTOM HONING NOTES
              </span>
              <button
                onClick={handleVoiceSimulate}
                disabled={isRecordingVoice}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
                  isRecordingVoice 
                    ? 'bg-rose-500 text-white animate-pulse' 
                    : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700'
                }`}
              >
                {isRecordingVoice ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{isRecordingVoice ? "Listening to OR Audio..." : "Dictate Surgeon Note (Voice)"}</span>
              </button>
            </div>

            {voiceTranscript && (
              <div className="bg-cyan-950/30 border border-cyan-800/60 p-3 rounded-lg text-xs font-mono text-cyan-300">
                <span className="text-cyan-400 font-bold block text-[10px] mb-1">TRANSCRIBED SURGEON DICTATION:</span>
                <p className="italic">{voiceTranscript}</p>
              </div>
            )}

            {aiSynthesizedFeedback && (
              <div className="bg-emerald-950/30 border border-emerald-800/60 p-3 rounded-lg text-xs font-mono text-emerald-300 flex items-start gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-emerald-400 font-bold block text-[10px]">REAL-TIME PARAMETRIC RECALCULATION:</span>
                  <p>{aiSynthesizedFeedback}</p>
                </div>
              </div>
            )}

            <textarea 
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter custom intraoperative requirements, prototype milling notes, or clinical trial constraints..."
              className="w-full bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

        </div>

        {/* Modal Footer with Actions and BACK button */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 sticky bottom-0 z-10">
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-mono font-bold rounded-lg flex items-center space-x-1 transition-all cursor-pointer border border-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Back</span>
            </button>

            <span className="text-xs font-mono text-slate-400 hidden sm:inline">Status:</span>
            <button
              onClick={() => setStatus('shortlisted')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                status === 'shortlisted'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-amber-300'
              }`}
            >
              ★ Shortlist for Prototype
            </button>
            <button
              onClick={() => setStatus('refining')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                status === 'refining'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-cyan-300'
              }`}
            >
              ⚙ Active Honing
            </button>
            <button
              onClick={() => setStatus('rejected')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                status === 'rejected'
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-rose-300'
              }`}
            >
              ✕ Archive
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 text-xs font-mono text-amber-300 cursor-pointer">
              <input 
                type="checkbox"
                checked={isPatentFlagged}
                onChange={(e) => setIsPatentFlagged(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-amber-400 focus:ring-0 w-4 h-4 cursor-pointer"
              />
              <span>Flag for Patent Attorney</span>
            </label>

            <button
              onClick={handleSaveHoning}
              className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold rounded-lg text-xs font-mono flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
