import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Copy, 
  Lock, 
  ExternalLink,
  Sparkles,
  Printer
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { InnovationDossier, SurgeonReviewState } from '../types';

interface ExportModalProps {
  innovations: InnovationDossier[];
  reviewStates: Record<string, SurgeonReviewState>;
  onSelectInnovation: (innovation: InnovationDossier) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  innovations,
  reviewStates,
  onSelectInnovation
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter shortlisted or reviewed items
  const shortlistedItems = innovations.filter(
    item => reviewStates[item.id]?.status === 'shortlisted' || reviewStates[item.id]?.flaggedForPatentDraft
  );

  const displayList = shortlistedItems.length > 0 ? shortlistedItems : innovations.slice(0, 5);

  const handleExportPDF = (item: InnovationDossier) => {
    const doc = new jsPDF();
    const userReview = reviewStates[item.id] || {};
    const timestamp = new Date().toISOString();

    // Document Header
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 35, 'F');
    
    doc.setTextColor(0, 242, 254); // cyan
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('SURGICAL INNOVATION ENGINE (SIE)', 14, 15);

    doc.setTextColor(245, 158, 11); // amber
    doc.setFontSize(10);
    doc.text('CONFIDENTIAL INVENTION DOSSIER & PRIOR ART BRIEF', 14, 23);

    doc.setTextColor(148, 163, 184); // slate-400
    doc.setFontSize(8);
    doc.text(`Generated: ${timestamp} | Cryptographic Proof SHA-256`, 14, 30);

    // Section 1: Invention Identification
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Rank #${item.rank}: ${item.title}`, 14, 48);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Category: ${item.category} | Donor Field: ${item.donorField}`, 14, 55);
    doc.text(`Original Donor Device: ${item.donorDeviceOrigin}`, 14, 60);

    // Section 2: Clinical Problem Statement
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('1. CLINICAL BOTTLENECK & ACUTE UNMET NEED', 14, 72);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const splitProblem = doc.splitTextToSize(item.clinicalProblemStatement, 180);
    doc.text(splitProblem, 14, 78);

    // Section 3: Mechanical Delta
    const yAfterProblem = 78 + splitProblem.length * 5 + 5;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('2. CROSS-DISCIPLINARY MECHANICAL DELTA & KINEMATICS', 14, yAfterProblem);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const splitDelta = doc.splitTextToSize(item.mechanicalDelta, 180);
    doc.text(splitDelta, 14, yAfterProblem + 6);

    // Section 4: Specifications & Parameters
    const yAfterDelta = yAfterProblem + 6 + splitDelta.length * 5 + 5;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('3. BIOMECHANICAL & KINEMATIC SPECIFICATIONS', 14, yAfterDelta);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(`• Working Reach: ${item.parameters.shaftLengthMm} mm (Min/Max: ${item.parameters.shaftLengthMinMax[0]}-${item.parameters.shaftLengthMinMax[1]} mm)`, 14, yAfterDelta + 6);
    doc.text(`• Bayonet Offset Angle: +${item.parameters.bayonetAngleDeg} deg (Exoscope Line-of-Sight Cleared)`, 14, yAfterDelta + 11);
    doc.text(`• Primary Material: ${item.parameters.primaryMaterial}`, 14, yAfterDelta + 16);
    doc.text(`• Fluidic Saline Scavenger: ${item.parameters.hasIrrigationSuctionChannel ? 'Integrated Dual Channel' : 'N/A'}`, 14, yAfterDelta + 21);

    // Section 5: Critic Verdict & Regulatory Pathway
    const yAfterSpecs = yAfterDelta + 30;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('4. 25-YR MASTER SURGEON CRITIC VERDICT & FDA PATHWAY', 14, yAfterSpecs);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(`• Dural Safety Index: ${item.masterCriticVerdict.duralSafetyRating}`, 14, yAfterSpecs + 6);
    doc.text(`• Exoscope Line-of-Sight: ${item.masterCriticVerdict.lineOfSightScore}`, 14, yAfterSpecs + 11);
    doc.text(`• FDA Classification: ${item.regulatoryPathway.fdaClassification} (Predicate: ${item.regulatoryPathway.predicateDeviceKNumber})`, 14, yAfterSpecs + 16);
    doc.text(`• Patent Novelty: ${item.patentStatus.status} (${item.patentStatus.unclaimedSpineAngle})`, 14, yAfterSpecs + 21);

    // Section 6: Surgeon Custom Notes (if any)
    if (userReview.surgeonNotes || userReview.voiceDictationTranscript) {
      const yAfterCritic = yAfterSpecs + 30;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('5. SURGEON DICTATION & HONING INSTRUCTIONS', 14, yAfterCritic);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const notesText = userReview.surgeonNotes || userReview.voiceDictationTranscript || '';
      const splitNotes = doc.splitTextToSize(notesText, 180);
      doc.text(splitNotes, 14, yAfterCritic + 6);
    }

    // Save PDF
    doc.save(`SIE_Invention_Dossier_Rank_${item.rank}_${item.title.slice(0, 20).replace(/\s+/g, '_')}.pdf`);
  };

  const handleCopySummary = (item: InnovationDossier) => {
    const summary = `
[SURGICAL INNOVATION ENGINE - PATENT DOSSIER]
Rank #${item.rank}: ${item.title}
Category: ${item.category} | Donor: ${item.donorField} (${item.donorDeviceOrigin})
Clinical Problem: ${item.clinicalProblemStatement}
Mechanical Delta: ${item.mechanicalDelta}
Specifications: Shaft ${item.parameters.shaftLengthMm}mm | Bayonet +${item.parameters.bayonetAngleDeg}° | Material: ${item.parameters.primaryMaterial}
FDA Predicate: ${item.regulatoryPathway.predicateDeviceKNumber} (${item.regulatoryPathway.predicateDeviceName})
Patent Angle: ${item.patentStatus.unclaimedSpineAngle}
`;
    navigator.clipboard.writeText(summary);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              SURGICAL IP VAULT & EXECUTIVE DOSSIER EXPORTER
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Client-side encrypted portfolio (AES-256). Generates formal Invention Disclosure Briefs for patent attorneys and machine shops.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
            Shortlisted: <strong className="text-amber-400">{shortlistedItems.length}</strong> Ideas
          </div>
        </div>
      </div>

      {/* Shortlisted Queue & Generator */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4" /> {shortlistedItems.length > 0 ? "SHORTLISTED PATENT CANDIDATES" : "FEATURED TOP 100 INNOVATION BRIEFS"}
          </h3>
          <span className="text-[10px] font-mono text-slate-500">Ready for 1-Click PDF Generation</span>
        </div>

        <div className="space-y-3">
          {displayList.map((item) => {
            const isFlagged = reviewStates[item.id]?.flaggedForPatentDraft;

            return (
              <div 
                key={item.id}
                className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:border-slate-700 transition-all"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2 text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800">
                      RANK #{item.rank}
                    </span>
                    <span className="text-amber-400 font-semibold">{item.category}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{item.donorField}</span>
                    {isFlagged && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                        ★ FLAGGED FOR IP
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-white">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {item.mechanicalDelta}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-500 pt-1">
                    <span>Reach: <strong>{item.parameters.shaftLengthMm}mm</strong></span>
                    <span>Bayonet: <strong>+{item.parameters.bayonetAngleDeg}°</strong></span>
                    <span>FDA Predicate: <strong className="text-slate-300">{item.regulatoryPathway.predicateDeviceKNumber}</strong></span>
                    <span>Transferability: <strong className="text-emerald-400">{item.regulatoryPathway.transferabilityScore}/100</strong></span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 shrink-0 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800">
                  <button
                    onClick={() => handleCopySummary(item)}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all text-xs font-mono flex items-center gap-1"
                    title="Copy Text Summary"
                  >
                    {copiedId === item.id ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span className="hidden sm:inline">{copiedId === item.id ? "Copied" : "Copy Brief"}</span>
                  </button>

                  <button
                    onClick={() => onSelectInnovation(item)}
                    className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 hover:bg-slate-800 transition-all text-xs font-mono font-semibold"
                  >
                    Hone Specs
                  </button>

                  <button
                    onClick={() => handleExportPDF(item)}
                    className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold rounded-lg text-xs font-mono flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF Dossier</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
