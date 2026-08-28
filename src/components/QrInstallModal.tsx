import React from 'react';
import { QrCode, X, Smartphone, ArrowRight, Share, PlusSquare, ExternalLink } from 'lucide-react';

interface QrInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl?: string;
}

export const QrInstallModal: React.FC<QrInstallModalProps> = ({
  isOpen,
  onClose,
  appUrl = 'https://alexmohit825.github.io/vigilOR/',
}) => {
  if (!isOpen) return null;

  // High-resolution SVG QR code URL encoded for GitHub Pages app link
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(appUrl)}&color=0f172a&bgcolor=ffffff&qzone=2&margin=0`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 relative text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 pt-2">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <QrCode className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Scan with iPhone Camera</h2>
          <p className="text-xs text-slate-400">Instantly open and add VigilOR to your iPhone Home Screen</p>
        </div>

        {/* QR Code Container */}
        <div className="bg-white p-5 rounded-2xl shadow-xl inline-block border-4 border-emerald-500/30">
          <img
            src={qrCodeUrl}
            alt="Scan to open VigilOR on iPhone"
            className="w-56 h-56 mx-auto rounded-lg object-contain"
          />
        </div>

        {/* 3 Simple Instructions */}
        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 text-left space-y-2.5 text-xs text-slate-300">
          <div className="flex items-start space-x-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">1</span>
            <span>Open your <strong>iPhone Camera</strong> and point it at the QR code above.</span>
          </div>

          <div className="flex items-start space-x-2.5">
            <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">2</span>
            <span>Tap the yellow <strong>Safari link</strong> that appears on your screen.</span>
          </div>

          <div className="flex items-start space-x-2.5">
            <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">3</span>
            <span>In Safari, tap the <strong>Share button</strong> (square with arrow) $\rightarrow$ select <strong>"Add to Home Screen"</strong>.</span>
          </div>
        </div>

        {/* Direct Link Alternative */}
        <div className="pt-1">
          <a
            href={appUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center space-x-1"
          >
            <span>Or open directly: alexmohit825.github.io/vigilOR</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
