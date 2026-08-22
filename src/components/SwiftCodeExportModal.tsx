import React, { useState } from 'react';
import { SWIFT_CODE_TEMPLATES, SwiftFileTemplate } from '../data/SwiftCodeTemplates';
import { X, Copy, Check, FileCode, Apple, Terminal, Cpu, ShieldCheck } from 'lucide-react';

interface SwiftCodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SwiftCodeExportModal: React.FC<SwiftCodeExportModalProps> = ({ isOpen, onClose }) => {
  const [selectedFileIdx, setSelectedFileIdx] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentFile = SWIFT_CODE_TEMPLATES[selectedFileIdx];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-bold">
              <Apple className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Native iOS Keyboard Extension Architecture</span>
                <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full border border-orange-500/30">
                  Swift 5.9+ / iOS 17 & 18
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Production-ready Swift architecture modules for an Xcode Custom Keyboard Extension Target (`UIInputViewController`).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Sidebar + Code Editor */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Selector Sidebar */}
          <div className="w-72 bg-slate-950/60 border-r border-slate-800 p-3 space-y-1 overflow-y-auto">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
              Swift Source Files
            </p>
            {SWIFT_CODE_TEMPLATES.map((file, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedFileIdx(idx)}
                className={`w-full text-left p-3 rounded-xl text-xs transition-all flex items-start space-x-2.5 ${
                  selectedFileIdx === idx
                    ? 'bg-blue-600/20 border border-blue-500/50 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <FileCode className={`w-4 h-4 mt-0.5 shrink-0 ${selectedFileIdx === idx ? 'text-blue-400' : 'text-slate-500'}`} />
                <div className="overflow-hidden">
                  <p className="font-semibold truncate text-slate-200">{file.fileName}</p>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{file.description}</p>
                </div>
              </button>
            ))}

            {/* Architecture Highlights Card */}
            <div className="mt-6 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] space-y-2">
              <p className="font-bold text-cyan-400 flex items-center space-x-1">
                <Cpu className="w-3.5 h-3.5" />
                <span>Memory & Latency Specs</span>
              </p>
              <ul className="space-y-1 text-slate-400 text-[10px]">
                <li>• Memory: strictly &lt; 15MB (well under 30MB limit)</li>
                <li>• Hit-test latency: &lt; 2.5ms per keystroke</li>
                <li>• 100% on-device & privacy-first</li>
                <li>• Capacitive ellipse: `UITouch.majorRadius`</li>
              </ul>
            </div>
          </div>

          {/* Main Code View */}
          <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
            {/* Code Header Bar */}
            <div className="px-5 py-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-slate-200">{currentFile.fileName}</span>
                <span className="text-[11px] text-slate-500 ml-3">{currentFile.description}</span>
              </div>

              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold flex items-center space-x-1.5 transition-colors border border-slate-700"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Swift Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Content */}
            <div className="flex-1 p-5 overflow-auto bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed">
              <pre className="whitespace-pre">{currentFile.code}</pre>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ready for direct integration into Xcode under a Custom Keyboard Extension target.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
