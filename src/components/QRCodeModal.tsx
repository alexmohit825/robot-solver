import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  Copy, 
  CheckCircle2, 
  Share2, 
  PlusSquare,
  Sparkles
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeModalProps {
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ onClose }) => {
  const [currentUrl, setCurrentUrl] = useState<string>('https://alexmohit825.github.io/robot-solver/');
  const [customUrl, setCustomUrl] = useState<string>('https://alexmohit825.github.io/robot-solver/');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = window.location.href.toLowerCase();
      setCurrentUrl(url);
      setCustomUrl(url);
    }
  }, []);

  const activeUrl = customUrl || currentUrl || 'https://alexmohit825.github.io/robot-solver/';

  const handleCopy = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                iPhone & iPad PWA Quick-Access QR
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Robot Solver • Standalone Mobile Safari Access
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 flex flex-col items-center text-center">
          
          {/* QR Code Container */}
          <div className="p-4 bg-white rounded-2xl shadow-xl border-4 border-cyan-400/40 relative group">
            <QRCodeSVG 
              value={activeUrl}
              size={200}
              level="H"
              includeMargin={false}
              imageSettings={{
                src: "./icon.svg",
                x: undefined,
                y: undefined,
                height: 40,
                width: 40,
                excavate: true,
              }}
            />
          </div>

          {/* URL Input / Config */}
          <div className="w-full space-y-2 text-left">
            <label className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>SCAN TARGET URL:</span>
              <button
                onClick={handleCopy}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[10px] cursor-pointer"
              >
                {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copied" : "Copy URL"}</span>
              </button>
            </label>
            <input 
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://alexmohit825.github.io/robot-solver/"
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 font-mono focus:outline-none focus:border-cyan-400"
            />
            <p className="text-[10px] text-slate-500 font-mono">
              Canonical URL: <span className="text-cyan-400">https://alexmohit825.github.io/robot-solver/</span>
            </p>
          </div>

          {/* iOS Safari "Add to Home Screen" Instructions */}
          <div className="w-full bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3 text-left font-mono text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold border-b border-slate-800/80 pb-1.5 text-[11px]">
              <Sparkles className="w-3.5 h-3.5" /> HOW TO INSTALL AS STANDALONE IPHONE APP:
            </div>

            <ol className="space-y-2 text-[11px] text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">1.</span>
                <span>Open your iPhone Camera and scan the QR code above to launch in Safari.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">2.</span>
                <span className="flex items-center gap-1">
                  Tap the <Share2 className="w-3 h-3 text-cyan-400 inline" /> <strong>Share button</strong> at the bottom of Safari.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">3.</span>
                <span className="flex items-center gap-1">
                  Select <PlusSquare className="w-3 h-3 text-amber-400 inline" /> <strong>"Add to Home Screen"</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">4.</span>
                <span>Tap <strong>Add</strong>. Robot Solver will launch as a full-screen native PWA with your custom robotic hand + spine icon!</span>
              </li>
            </ol>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
