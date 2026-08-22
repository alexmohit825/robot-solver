import React, { useState } from 'react';
import { 
  Scale, 
  CheckCircle2, 
  Circle, 
  FileText, 
  Download, 
  Copy, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  DollarSign, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { InnovationDossier, SurgeonReviewState } from '../types';

interface PatentSubmissionStudioProps {
  innovations: InnovationDossier[];
  reviewStates: Record<string, SurgeonReviewState>;
}

export const PatentSubmissionStudio: React.FC<PatentSubmissionStudioProps> = ({
  innovations,
  reviewStates
}) => {
  const shortlistedItems = innovations.filter(
    item => reviewStates[item.id]?.status === 'shortlisted' || reviewStates[item.id]?.flaggedForPatentDraft
  );

  const [selectedInnovationId, setSelectedInnovationId] = useState<string>(
    shortlistedItems[0]?.id || innovations[0].id
  );

  const [entityStatus, setEntityStatus] = useState<'micro' | 'small' | 'large'>('micro');
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Interactive Checklist State
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    title: true,
    background: true,
    summary: true,
    drawings_desc: true,
    detailed_spec: true,
    claims: true,
    abstract: true,
    cad_drawings: false,
    inventor_oath: false,
    fee_transmittal: false
  });

  const toggleCheck = (key: string) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const selectedItem = innovations.find(i => i.id === selectedInnovationId) || innovations[0];
  const userNotes = reviewStates[selectedItem.id]?.surgeonNotes || '';
  const patent = selectedItem.deepPatentAnalysis;

  // Fee calculation (USPTO Micro vs Small vs Standard)
  const feeEstimates = {
    micro: { provisional: '$75', nonProvisional: '$400', searchExam: '$420', total: '$895' },
    small: { provisional: '$150', nonProvisional: '$800', searchExam: '$840', total: '$1,790' },
    large: { provisional: '$300', nonProvisional: '$1,600', searchExam: '$1,680', total: '$3,580' }
  };

  // Compile formal USPTO Specification Draft
  const generatedDraftText = `
UNITED STATES PATENT APPLICATION (37 CFR 1.77 SPECIFICATION)

TITLE OF THE INVENTION:
${selectedItem.patentStatus.draftPatentTitle}

INVENTOR(S):
[Master Surgeon Inventor Name], MD

CROSS-REFERENCE TO RELATED APPLICATIONS:
This application claims the benefit of U.S. Provisional Application No. 63/XXX,XXX filed [Date].

BACKGROUND OF THE INVENTION
1. Field of the Invention:
The present disclosure relates generally to surgical instrumentation, and more specifically to cross-disciplinary mechanical systems for spine, skull base, and neurosurgical procedures.

2. Description of the Related Art:
${selectedItem.clinicalProblemStatement}
Conventional instrumentation fails due to rigid straight geometries, excessive line-of-sight occlusion under exoscopes, or failure to manage focal tissue pressures.

BRIEF SUMMARY OF THE INVENTION:
To address the aforementioned limitations, the present invention provides ${selectedItem.title}. 
In accordance with one embodiment: ${selectedItem.mechanicalDelta}
The device utilizes kinematic principles of ${selectedItem.kinematicPrinciple}, achieving safe working tolerances with a primary material of ${selectedItem.parameters.primaryMaterial}.

BRIEF DESCRIPTION OF THE DRAWINGS:
FIG. 1 is an isometric side perspective view of the surgical device showing the bayoneted offset angle of +${selectedItem.parameters.bayonetAngleDeg} degrees clearing an exoscopic field of view.
FIG. 2 is an exploded mechanical schematic illustrating the internal kinematic actuation mechanism.
FIG. 3 is a cross-sectional view taken along the working corridor at a depth of ${selectedItem.parameters.shaftLengthMm}mm.

DETAILED DESCRIPTION OF PREFERRED EMBODIMENTS:
Referring to FIGS. 1-3, the instrument comprises a working shaft of ${selectedItem.parameters.shaftLengthMm} mm configured for narrow surgical corridors. 
The handpiece includes an ergonomic grip offset by +${selectedItem.parameters.bayonetAngleDeg}° to maintain an un-occluded line of sight.
${userNotes ? `SURGEON SPECIFICATION REFINEMENT: ${userNotes}` : ''}

CLAIMS (35 U.S.C. § 112):
${patent?.draftIndependentClaim || '1. A surgical instrument comprising an articulating bayonet shaft...'}

${patent?.draftDependentClaims.join('\n\n') || ''}

ABSTRACT OF THE DISCLOSURE:
A surgical instrument for spine and neurosurgical procedures comprising ${selectedItem.mechanicalDelta}. The instrument clears exoscope visual corridors and provides reliable mechanical actuation in deep narrow corridors.
`;

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(generatedDraftText);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalChecklist = Object.keys(checklist).length;
  const progressPercent = Math.round((completedCount / totalChecklist) * 100);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              PATENT SUBMISSION STUDIO & USPTO FILING ASSISTANT
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Draft formal 37 CFR 1.77 patent applications, verify checklist readiness, and manage 12-month provisional-to-nonprovisional priority clocks.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-slate-400">Select Invention:</span>
          <select
            value={selectedInnovationId}
            onChange={(e) => setSelectedInnovationId(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400 font-mono"
          >
            {innovations.map((i) => (
              <option key={i.id} value={i.id}>
                #{i.rank}: {i.title.slice(0, 32)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Checklist & Fee Calculator vs AI Application Drafter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Checklist & USPTO Strategy */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Readiness Progress Bar */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-cyan-400 font-bold">USPTO FILING READINESS</span>
              <span className="text-white font-bold">{progressPercent}% Completed</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Interactive USPTO Checklist */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
              USPTO APPLICATION REQUIREMENTS (37 CFR 1.77)
            </h3>

            <div className="space-y-2 text-xs font-mono">
              {[
                { id: 'title', label: '1. Title of the Invention' },
                { id: 'background', label: '2. Background of the Invention & Clinical Need' },
                { id: 'summary', label: '3. Brief Summary of the Invention' },
                { id: 'drawings_desc', label: '4. Description of Drawings (FIG. 1, 2, 3)' },
                { id: 'detailed_spec', label: '5. Detailed Description of Embodiments' },
                { id: 'claims', label: '6. Independent & Dependent Claims Structure' },
                { id: 'abstract', label: '7. Abstract of the Disclosure (< 150 words)' },
                { id: 'cad_drawings', label: '8. Formal Vector CAD Drawings (Black & White)' },
                { id: 'inventor_oath', label: '9. Inventor Declaration & Assignment (AIA/01)' },
                { id: 'fee_transmittal', label: '10. USPTO Fee Transmittal Sheet (SB/06)' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:bg-slate-900 transition-colors text-left"
                >
                  <span className={checklist[item.id] ? "text-slate-200" : "text-slate-500"}>
                    {item.label}
                  </span>
                  {checklist[item.id] ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-600 shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* USPTO Fee Estimator */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" /> USPTO FILING FEE ESTIMATOR
              </span>
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-md border border-slate-800 text-[10px]">
                <button
                  onClick={() => setEntityStatus('micro')}
                  className={`px-2 py-0.5 rounded ${entityStatus === 'micro' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                >
                  Micro Entity (75% Off)
                </button>
                <button
                  onClick={() => setEntityStatus('small')}
                  className={`px-2 py-0.5 rounded ${entityStatus === 'small' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                >
                  Small
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">PROVISIONAL FILING:</span>
                <span className="text-emerald-400 font-bold">{feeEstimates[entityStatus].provisional}</span>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">NON-PROVISIONAL TOTAL:</span>
                <span className="text-white font-bold">{feeEstimates[entityStatus].total}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: AI Formal Patent Application Drafter */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl space-y-4 flex flex-col h-full">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                  AI-COMPILED FORMAL SPECIFICATION DRAFT
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  {selectedItem.patentStatus.draftPatentTitle}
                </h3>
              </div>

              <button
                onClick={handleCopyDraft}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 text-xs font-mono font-semibold flex items-center space-x-1.5 transition-all shadow"
              >
                {copiedDraft ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDraft ? "Copied Application" : "Copy Complete Draft"}</span>
              </button>
            </div>

            {/* Application Specification Preview Box */}
            <div className="flex-1 bg-slate-950 border border-slate-800 p-4 rounded-xl overflow-y-auto max-h-[560px] font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed">
              {generatedDraftText}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
              <span>Formatted per 37 CFR 1.77 USPTO standards</span>
              <span className="text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Ready for Patent Attorney Review
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
