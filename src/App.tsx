import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InnovationCardDeck } from './components/InnovationCardDeck';
import { HandheldInstrumentsDeck } from './components/HandheldInstrumentsDeck';
import { QuickWinToolsDeck } from './components/QuickWinToolsDeck';
import { ProcedureMatrixView } from './components/ProcedureMatrixView';
import { CrossSectionBottleneckView } from './components/CrossSectionBottleneckView';
import { PatentSubmissionStudio } from './components/PatentSubmissionStudio';
import { ExportModal } from './components/ExportModal';
import { InnovationDetailModal } from './components/InnovationDetailModal';
import { PatentAnalysisDrawer } from './components/PatentAnalysisDrawer';
import { PrototypeBlueprintModal } from './components/PrototypeBlueprintModal';
import { QRCodeModal } from './components/QRCodeModal';
import { RobotSolverView } from './components/robotic/RobotSolverView';
import { TOP_100_INNOVATIONS } from './data/top100Innovations';
import { TOP_100_HANDHELD_SUITE } from './data/top100HandheldInstruments';
import { QUICK_WIN_TOOLS } from './data/quickWinTools';
import { InnovationDossier, SurgeonReviewState, ReviewStatus, BlueprintSpec, KinematicParameters } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<'procedures' | 'bottlenecks' | 'portfolio' | 'handheld' | 'quickwins' | 'patent_studio' | 'export' | 'robot_solver'>('robot_solver');
  const [selectedInnovation, setSelectedInnovation] = useState<InnovationDossier | null>(null);
  const [selectedPatentInnovation, setSelectedPatentInnovation] = useState<InnovationDossier | null>(null);
  const [isQRCodeOpen, setIsQRCodeOpen] = useState<boolean>(false);
  
  // Enforce document title and clean favicon dynamically
  useEffect(() => {
    document.title = 'Robot Solver | Spine Robotics Diagnostic & Error Resolver (ExcelsiusGPS & Mazor X)';
    
    // Force cache-busting on favicon
    const links = document.querySelectorAll("link[rel*='icon']");
    links.forEach((link: any) => {
      link.href = './icon.svg?v=' + Date.now();
    });
  }, [activeTab]);

  // State for active blueprint modal
  const [activeBlueprint, setActiveBlueprint] = useState<{
    title: string;
    rank: number;
    category: string;
    blueprint: BlueprintSpec;
    parameters?: KinematicParameters;
  } | null>(null);

  // Persistent review states across sessions
  const [reviewStates, setReviewStates] = useState<Record<string, SurgeonReviewState>>(() => {
    const saved = localStorage.getItem('sie_surgeon_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved reviews', e);
      }
    }
    return {
      'inn-01': {
        status: 'shortlisted',
        surgeonNotes: 'High priority for our robotic prone lateral program. Eliminates line-of-sight fiducial bumps.',
        flaggedForPatentDraft: true,
        lastUpdated: new Date().toISOString()
      },
      'inn-02': {
        status: 'shortlisted',
        surgeonNotes: 'Directly addresses psoas plexus ischemia during prolonged lateral retractor deployment.',
        flaggedForPatentDraft: true,
        lastUpdated: new Date().toISOString()
      },
      'inn-21': {
        status: 'shortlisted',
        surgeonNotes: 'Essential for skull base and cervical foraminal osteophyte clearing without thermal dural injury.',
        flaggedForPatentDraft: true,
        lastUpdated: new Date().toISOString()
      },
      'inn-76': {
        status: 'shortlisted',
        surgeonNotes: 'Solves the L4-L5 iliac crest cage impaction problem. Mallet strike without pin shear.',
        flaggedForPatentDraft: true,
        lastUpdated: new Date().toISOString()
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('sie_surgeon_reviews', JSON.stringify(reviewStates));
  }, [reviewStates]);

  const handleUpdateReviewState = (id: string, updatedFields: Partial<SurgeonReviewState>) => {
    setReviewStates(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {
          status: 'unreviewed',
          surgeonNotes: '',
          flaggedForPatentDraft: false,
          lastUpdated: new Date().toISOString()
        }),
        ...updatedFields,
        lastUpdated: new Date().toISOString()
      }
    }));
  };

  const handleQuickStatusChange = (id: string, status: ReviewStatus) => {
    handleUpdateReviewState(id, {
      status,
      flaggedForPatentDraft: status === 'shortlisted' ? true : false
    });
  };

  const shortlistCount = Object.values(reviewStates).filter(
    r => r.status === 'shortlisted' || r.flaggedForPatentDraft
  ).length;

  const totalCatalogCount = TOP_100_INNOVATIONS.length + TOP_100_HANDHELD_SUITE.length + QUICK_WIN_TOOLS.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Telemetry Header */}
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        shortlistCount={shortlistCount}
        totalInnovationsCount={totalCatalogCount}
        onOpenQRCode={() => setIsQRCodeOpen(true)}
      />

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'robot_solver' && (
          <RobotSolverView />
        )}

        {activeTab === 'portfolio' && (
          <InnovationCardDeck 
            innovations={TOP_100_INNOVATIONS}
            reviewStates={reviewStates}
            onSelectInnovation={setSelectedInnovation}
            onSelectPatentAnalysis={setSelectedPatentInnovation}
            onSelectBlueprint={(inn) => {
              setActiveBlueprint({
                title: inn.title,
                rank: inn.rank,
                category: inn.category,
                blueprint: inn.blueprint,
                parameters: inn.parameters
              });
            }}
            onQuickStatusChange={handleQuickStatusChange}
          />
        )}

        {activeTab === 'handheld' && (
          <HandheldInstrumentsDeck 
            onSelectBlueprint={(title, rank, category, blueprint) => {
              setActiveBlueprint({
                title,
                rank,
                category,
                blueprint
              });
            }}
          />
        )}

        {activeTab === 'quickwins' && (
          <QuickWinToolsDeck 
            onSelectBlueprint={(title, rank, category, blueprint) => {
              setActiveBlueprint({
                title,
                rank,
                category,
                blueprint
              });
            }}
          />
        )}

        {activeTab === 'procedures' && (
          <ProcedureMatrixView 
            onSelectInnovation={setSelectedInnovation}
          />
        )}

        {activeTab === 'bottlenecks' && (
          <CrossSectionBottleneckView 
            onSelectInnovation={setSelectedInnovation}
          />
        )}

        {activeTab === 'patent_studio' && (
          <PatentSubmissionStudio 
            innovations={TOP_100_INNOVATIONS}
            reviewStates={reviewStates}
          />
        )}

        {activeTab === 'export' && (
          <ExportModal 
            innovations={TOP_100_INNOVATIONS}
            reviewStates={reviewStates}
            onSelectInnovation={setSelectedInnovation}
          />
        )}
      </main>

      {/* Detailed Honing Modal */}
      {selectedInnovation && (
        <InnovationDetailModal 
          innovation={selectedInnovation}
          reviewState={reviewStates[selectedInnovation.id] || {
            status: 'unreviewed',
            surgeonNotes: '',
            flaggedForPatentDraft: false,
            lastUpdated: new Date().toISOString()
          }}
          onUpdateReviewState={handleUpdateReviewState}
          onOpenPatentAnalysis={(inn) => {
            setSelectedPatentInnovation(inn);
          }}
          onClose={() => setSelectedInnovation(null)}
        />
      )}

      {/* Deep Patent Analysis Drawer */}
      {selectedPatentInnovation && (
        <PatentAnalysisDrawer 
          innovation={selectedPatentInnovation}
          onClose={() => setSelectedPatentInnovation(null)}
        />
      )}

      {/* Prototype Line Drawing / CAD Blueprint Modal */}
      {activeBlueprint && (
        <PrototypeBlueprintModal 
          title={activeBlueprint.title}
          rank={activeBlueprint.rank}
          category={activeBlueprint.category}
          blueprint={activeBlueprint.blueprint}
          parameters={activeBlueprint.parameters}
          onClose={() => setActiveBlueprint(null)}
        />
      )}

      {/* iPhone Safari QR Code Modal */}
      {isQRCodeOpen && (
        <QRCodeModal 
          onClose={() => setIsQRCodeOpen(false)}
        />
      )}

      {/* Persistent Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 text-center text-xs font-mono text-slate-500">
        <p>Robot Solver • Intraoperative Robotic Spine Error Resolver (ExcelsiusGPS® & Mazor X™ Stealth Edition) • Client-Side Encrypted</p>
      </footer>
    </div>
  );
}

export default App;
