import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RobotSolverView } from './components/robotic/RobotSolverView';
import { QRCodeModal } from './components/QRCodeModal';
import { PlatformType } from './data/roboticPlatforms';

export function App() {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('EXCELSIUS');
  const [activeSection, setActiveSection] = useState<'triage' | 'errors' | 'los'>('triage');
  const [isQRCodeOpen, setIsQRCodeOpen] = useState<boolean>(false);

  // Map header activeSection to RobotSolverView portal IDs
  const sectionToPortalMap: Record<'triage' | 'errors' | 'los', 'SYMPTOMS' | 'ERROR_CODES' | 'LINE_OF_SIGHT'> = {
    triage: 'SYMPTOMS',
    errors: 'ERROR_CODES',
    los: 'LINE_OF_SIGHT'
  };

  const portalToSectionMap: Record<'SYMPTOMS' | 'ERROR_CODES' | 'LINE_OF_SIGHT', 'triage' | 'errors' | 'los'> = {
    SYMPTOMS: 'triage',
    ERROR_CODES: 'errors',
    LINE_OF_SIGHT: 'los'
  };

  // Enforce document title and clean favicon dynamically
  useEffect(() => {
    document.title = 'Robot Solver | Spine Robotics Diagnostic & Error Resolver (ExcelsiusGPS & Mazor X)';
    
    // Force cache-busting on favicon
    const links = document.querySelectorAll("link[rel*='icon']");
    links.forEach((link: any) => {
      link.href = './icon.svg?v=' + Date.now();
    });
  }, [selectedPlatform, activeSection]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* 1. Master Robot Solver Top Bar & Navigation */}
      <Header 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        selectedPlatform={selectedPlatform}
        onOpenQRCode={() => setIsQRCodeOpen(true)}
      />

      {/* 2. Main Diagnostic & Solver Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <RobotSolverView 
          currentPlatform={selectedPlatform}
          onSelectPlatform={setSelectedPlatform}
          activePortal={sectionToPortalMap[activeSection]}
          onSelectPortal={(portal) => setActiveSection(portalToSectionMap[portal])}
        />
      </main>

      {/* 3. Standalone Mobile Safari QR Code Pairing Modal */}
      {isQRCodeOpen && (
        <QRCodeModal 
          onClose={() => setIsQRCodeOpen(false)}
        />
      )}

      {/* 4. Pure Robot Solver Clinical Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-5 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-300 font-semibold">Robot Solver v2.0</span>
            <span className="text-slate-600">•</span>
            <span>Intraoperative Error Management & Differential Diagnostics</span>
          </div>
          <p className="text-slate-400">
            Globus ExcelsiusGPS® & Medtronic Mazor X™ Stealth Edition • Zero Telemetry Lag
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
