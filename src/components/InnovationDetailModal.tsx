import React, { useState } from 'react';
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
  ArrowRight
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
        setAiSynthesizedFeedback("AI Assistant: Captured OR clinical guidance. Updated parametric constraints: Bayonet angle adjusted, fluidic suction sleeve activated, and material spec updated.");
      }, 1500);
    } else {
      setIsRecordingVoice(false);
    }
  };

  const handleSaveHoning = () => {
    onUpdateReviewState(innovation.id, {
      status,
      customParameters: params,
      surgeonNotes: notes,
      voiceDictationTranscript: voiceTranscript,
      flaggedForPatentDraft: isPatentFlagged,
      lastUpdated: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between bg-slate-950/50">
          <div className="flex items-start space-x-3">
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
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-1">
                {innovation.title}
              </h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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
                      <span>{params.bayonetAngleMinMax[0]}° (Straight)</span>
                      <span>{params.bayonetAngleMinMax[1]}° (Full Exoscope Clearance)</span>
                    </div>
                  </div>
                )}

                {/* Material Selection */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">Primary Material</label>
                    <select 
                      value={params.primaryMaterial}
                      onChange={(e) => handleParamChange('primaryMaterial', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-cyan-400 font-mono"
                    >
                      {params.availableMaterials.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">Fluidic Channel</label>
                    <button
                      type="button"
                      onClick={() => handleParamChange('hasIrrigationSuctionChannel', !params.hasIrrigationSuctionChannel)}
                      className={`w-full py-1.5 px-2 rounded-lg text-xs font-mono border text-center transition-all ${
                        params.hasIrrigationSuctionChannel 
                          ? 'bg-cyan-950 text-cyan-300 border-cyan-700' 
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {params.hasIrrigationSuctionChannel ? '✓ Dual Flush Active' : '✕ No Flush Channel'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Clinical Translation & Critic Reality Matrix */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Problem & Mechanical Delta */}
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-3">
                <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  The Clinical Problem & Mechanical Solution
                </h4>
                <div>
                  <span className="text-[11px] font-mono text-slate-400 block">Acute OR Limitation:</span>
                  <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">
                    {innovation.clinicalProblemStatement}
                  </p>
                </div>
                <div className="border-t border-slate-800/80 pt-2">
                  <span className="text-[11px] font-mono text-cyan-400 block">Cross-Disciplinary Mechanical Delta:</span>
                  <p className="text-xs text-slate-200 mt-0.5 leading-relaxed font-mono">
                    {innovation.mechanicalDelta}
                  </p>
                </div>
              </div>

              {/* 25-Year Master Surgeon Critic Matrix */}
              <div className="bg-slate-950/80 border border-emerald-900/40 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> 25-YR MASTER SURGEON CRITIC VERDICT
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono font-semibold border border-emerald-800/60">
                    APPROVED (PASS)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Dural Safety Index:</span>
                    <span className="text-emerald-400 font-semibold">{innovation.masterCriticVerdict.duralSafetyRating}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Line-of-Sight Clearance:</span>
                    <span className="text-cyan-400 font-semibold">{innovation.masterCriticVerdict.lineOfSightScore}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Radiological Scatter:</span>
                    <span className="text-slate-200">{innovation.masterCriticVerdict.radiologicalScatterIndex}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Tactile Haptics:</span>
                    <span className="text-amber-300">{innovation.masterCriticVerdict.tactileHapticFeedback}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 italic bg-slate-900/80 p-2.5 rounded-lg border-l-2 border-emerald-500 font-sans">
                  "{innovation.masterCriticVerdict.criticNotes}"
                </p>
              </div>

              {/* IP White-Space & FDA Regulatory Predicate */}
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-cyan-400 font-bold border-b border-slate-800 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5" /> IP & REGULATORY CLEARANCE
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenPatentAnalysis(innovation)}
                    className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded hover:bg-amber-500/30 flex items-center gap-1 text-[11px] transition-all"
                  >
                    <Scale className="w-3 h-3 text-amber-400" />
                    <span>Expand Patent Claims</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-500 block text-[10px]">FDA CLASSIFICATION</span>
                    <span className="text-slate-200">{innovation.regulatoryPathway.fdaClassification}</span>
                    <span className="text-slate-400 block text-[10px] mt-1">Predicate: {innovation.regulatoryPathway.predicateDeviceKNumber} ({innovation.regulatoryPathway.predicateDeviceName})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">PATENT STATUS</span>
                    <span className="text-emerald-400 font-semibold">{innovation.patentStatus.status}</span>
                    <span className="text-slate-400 block text-[10px] mt-1">{innovation.patentStatus.unclaimedSpineAngle}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Surgeon Voice Dictation & Curation Actions */}
          <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold text-slate-200 flex items-center gap-2">
                <Mic className="w-4 h-4 text-cyan-400" /> SURGEON CLINICAL DICTATION & HONING NOTES
              </h4>
              <button
                type="button"
                onClick={handleVoiceSimulate}
                className={`px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                  isRecordingVoice 
                    ? 'bg-rose-500 text-white animate-pulse' 
                    : 'bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900'
                }`}
              >
                {isRecordingVoice ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isRecordingVoice ? 'Listening to OR Dictation...' : 'Simulate Voice Dictation'}</span>
              </button>
            </div>

            {voiceTranscript && (
              <div className="bg-cyan-950/30 border border-cyan-800/60 p-2.5 rounded-lg text-xs font-mono text-cyan-200">
                <span className="text-cyan-400 font-bold block mb-1">DICTATION TRANSCRIPT:</span>
                {voiceTranscript}
              </div>
            )}

            {aiSynthesizedFeedback && (
              <div className="bg-emerald-950/30 border border-emerald-800/60 p-2.5 rounded-lg text-xs font-mono text-emerald-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{aiSynthesizedFeedback}</span>
              </div>
            )}

            <textarea 
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your direct surgical notes, design refinements, or prototyping instructions..."
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:border-cyan-400 font-mono resize-none"
            />
          </div>
        </div>

        {/* Modal Footer / Triage Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-400">SURGEON TRIAGE:</span>
            <button
              onClick={() => setStatus('shortlisted')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                status === 'shortlisted'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
              }`}
            >
              ⭐ Shortlist for IP
            </button>
            <button
              onClick={() => setStatus('refining')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                status === 'refining'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
              }`}
            >
              ✏️ In Refinement
            </button>
            <button
              onClick={() => setStatus('rejected')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                status === 'rejected'
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-rose-300'
              }`}
            >
              ✕ Archive / Reject
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
              <span>Flag for Patent Attorney Dossier</span>
            </label>

            <button
              onClick={handleSaveHoning}
              className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold rounded-lg text-xs font-mono flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Dossier</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
