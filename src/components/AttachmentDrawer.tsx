import React, { useState } from 'react';
import { ChatAttachment } from '../types/keyboard';
import {
  Camera,
  Image,
  DollarSign,
  MapPin,
  Mic,
  Smile,
  Navigation,
  X,
  Send,
  Check
} from 'lucide-react';

interface AttachmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSendAttachment: (attachment: ChatAttachment) => void;
}

export const AttachmentDrawer: React.FC<AttachmentDrawerProps> = ({
  isOpen,
  onClose,
  onSendAttachment
}) => {
  const [cashAmount, setCashAmount] = useState<string>("25");
  const [showCashComposer, setShowCashComposer] = useState<boolean>(false);
  const [showLocationComposer, setShowLocationComposer] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSendPhoto = () => {
    onSendAttachment({
      type: 'photo',
      title: 'Photo Attachment',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80'
    });
    onClose();
  };

  const handleSendCamera = () => {
    onSendAttachment({
      type: 'camera',
      title: 'Captured with iPhone 17 Pro Camera',
      imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80'
    });
    onClose();
  };

  const handleSendAppleCash = () => {
    onSendAttachment({
      type: 'apple-cash',
      amount: `$${cashAmount}.00`,
      title: 'Apple Cash Payment',
      subtitle: 'Sent securely on-device'
    });
    setShowCashComposer(false);
    onClose();
  };

  const handleSendLocation = (mapType: 'apple' | 'google') => {
    onSendAttachment({
      type: 'location',
      title: mapType === 'apple' ? 'Apple Maps Location' : 'Google Maps Location',
      subtitle: '1 Infinite Loop, Cupertino, CA 95014',
      mapType,
      coordinates: '37.3318° N, 122.0312° W'
    });
    setShowLocationComposer(false);
    onClose();
  };

  const handleSendAudio = () => {
    onSendAttachment({
      type: 'audio',
      title: 'Voice Memo (0:08)',
      subtitle: 'Recorded via AI Mic'
    });
    onClose();
  };

  const handleSendSticker = () => {
    onSendAttachment({
      type: 'sticker',
      title: '✨ Genmoji Sticker',
      imageUrl: '🎉'
    });
    onClose();
  };

  return (
    <div className="absolute inset-x-0 bottom-0 z-40 bg-slate-950/95 backdrop-blur-2xl rounded-t-[36px] border-t border-slate-700/80 p-5 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          iMessage &amp; Keyboard Apps
        </span>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Cash Composer Sub-View */}
      {showCashComposer ? (
        <div className="space-y-4 py-2">
          <div className="text-center space-y-1">
            <p className="text-xs text-slate-400">Send with Apple Cash</p>
            <div className="text-4xl font-black text-emerald-400 font-mono">
              ${cashAmount}.00
            </div>
          </div>

          {/* Quick Amount Pills */}
          <div className="flex justify-center space-x-2">
            {["10", "25", "50", "100"].map((amt) => (
              <button
                key={amt}
                onClick={() => setCashAmount(amt)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  cashAmount === amt
                    ? 'bg-emerald-600 text-white border-emerald-400'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              onClick={() => setShowCashComposer(false)}
              className="flex-1 py-2.5 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold border border-slate-800"
            >
              Back
            </button>
            <button
              onClick={handleSendAppleCash}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-600/30"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send ${cashAmount}.00</span>
            </button>
          </div>
        </div>
      ) : showLocationComposer ? (
        /* Location Maps Sub-View */
        <div className="space-y-4 py-2">
          <div className="text-center space-y-1">
            <p className="text-xs text-slate-300 font-bold">Share Pin Location</p>
            <p className="text-[11px] text-slate-400">1 Infinite Loop, Cupertino, CA</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSendLocation('apple')}
              className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex flex-col items-center space-y-2 group transition-all"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Navigation className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200">Apple Maps</span>
              <span className="text-[10px] text-slate-400">Native Apple Pin</span>
            </button>

            <button
              onClick={() => handleSendLocation('google')}
              className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex flex-col items-center space-y-2 group transition-all"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-amber-500 to-emerald-500 flex items-center justify-center text-white shadow-md">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200">Google Maps</span>
              <span className="text-[10px] text-slate-400">Google Pin Link</span>
            </button>
          </div>

          <button
            onClick={() => setShowLocationComposer(false)}
            className="w-full py-2.5 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold border border-slate-800"
          >
            Back
          </button>
        </div>
      ) : (
        /* Standard Vertical / Grid iOS Plus Apps Drawer */
        <div className="grid grid-cols-4 gap-3 py-1">
          {/* Camera */}
          <button
            onClick={handleSendCamera}
            className="flex flex-col items-center space-y-1.5 group"
          >
            <div className="w-13 h-13 p-3 rounded-2xl bg-gradient-to-b from-slate-700 to-slate-800 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-medium text-slate-300">Camera</span>
          </button>

          {/* Photos */}
          <button
            onClick={handleSendPhoto}
            className="flex flex-col items-center space-y-1.5 group"
          >
            <div className="w-13 h-13 p-3 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Image className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-medium text-slate-300">Photos</span>
          </button>

          {/* Apple Cash */}
          <button
            onClick={() => setShowCashComposer(true)}
            className="flex flex-col items-center space-y-1.5 group"
          >
            <div className="w-13 h-13 p-3 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-600 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-medium text-slate-300">Apple Cash</span>
          </button>

          {/* Location (Apple & Google Maps) */}
          <button
            onClick={() => setShowLocationComposer(true)}
            className="flex flex-col items-center space-y-1.5 group"
          >
            <div className="w-13 h-13 p-3 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-medium text-slate-300">Location</span>
          </button>

          {/* Audio Message */}
          <button
            onClick={handleSendAudio}
            className="flex flex-col items-center space-y-1.5 group"
          >
            <div className="w-13 h-13 p-3 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-600 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Mic className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-medium text-slate-300">Audio</span>
          </button>

          {/* Stickers */}
          <button
            onClick={handleSendSticker}
            className="flex flex-col items-center space-y-1.5 group"
          >
            <div className="w-13 h-13 p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Smile className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-medium text-slate-300">Stickers</span>
          </button>
        </div>
      )}
    </div>
  );
};
