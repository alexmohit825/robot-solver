import React, { useState, useEffect, useMemo } from 'react';
import {
  DeviceType,
  HitTestResult,
  KeyboardLayoutMode,
  KeyboardLayer,
  LayoutConfig,
  ShiftState,
  SmartReply,
  ChatMessage,
  ChatAttachment,
  SimulatedApp
} from '../types/keyboard';
import { ErgonomicKeyboard } from './ErgonomicKeyboard';
import { EmojiPicker } from './EmojiPicker';
import { AttachmentDrawer } from './AttachmentDrawer';
import { AppleIntelligenceRibbon } from './AppleIntelligenceRibbon';
import { LanguagePriorModel } from '../engine/LanguagePriorModel';
import { SpatialHitEngine } from '../engine/SpatialHitEngine';
import { AppleIntelligenceModel } from '../engine/AppleIntelligenceModel';
import { AudioHapticEngine } from '../engine/AudioHapticEngine';
import {
  Wifi,
  Battery,
  Signal,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Cpu,
  Mic,
  Globe,
  Plus,
  Send,
  MapPin,
  DollarSign,
  Play,
  Navigation,
  MessageSquare,
  Compass,
  Mail,
  FileText,
  Search,
  Lock,
  ArrowRight
} from 'lucide-react';

interface DeviceFrameProps {
  config: LayoutConfig;
  priorModel: LanguagePriorModel;
  spatialEngine: SpatialHitEngine;
  aiModel: AppleIntelligenceModel;
  onLayoutModeChange: (mode: KeyboardLayoutMode) => void;
  onDeviceChange: (device: DeviceType) => void;
  onLayerChange: (layer: KeyboardLayer) => void;
  onShiftChange: (shift: ShiftState) => void;
  onAppChange: (app: SimulatedApp) => void;
  onToggleAI: () => void;
  onOpenSettingsModal: () => void;
  lastHitResult: HitTestResult | null;
  onHitEvaluated: (result: HitTestResult) => void;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  config,
  priorModel,
  spatialEngine,
  aiModel,
  onLayoutModeChange,
  onDeviceChange,
  onLayerChange,
  onShiftChange,
  onAppChange,
  onToggleAI,
  onOpenSettingsModal,
  lastHitResult,
  onHitEvaluated
}) => {
  // App-specific text states
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'partner',
      text: "Are you still getting typos on your phone? How does the new large-finger keyboard feel on the 17 Pro?",
      timestamp: '9:40 AM'
    }
  ]);
  const [typedText, setTypedText] = useState<string>("Hey! The keyboard feels ");
  const [safariUrl, setSafariUrl] = useState<string>("apple.com/iphone-17-pro");
  const [emailBody, setEmailBody] = useState<string>("Hi team,\n\nThe new ergonomic keyboard extension is ready for universal iOS testing across all apps.\n\nBest,\nAlex");
  const [notesText, setNotesText] = useState<string>("Project Roadmap:\n1. Large-finger hit testing\n2. Apple Intelligence integration\n3. Universal app compatibility");
  const [searchQuery, setSearchQuery] = useState<string>("Apple Intelligence features");

  const [predictions, setPredictions] = useState<string[]>([]);
  const [smartReplies, setSmartReplies] = useState<SmartReply[]>([]);
  const [hapticPing, setHapticPing] = useState<boolean>(false);
  const [isDictating, setIsDictating] = useState<boolean>(false);
  const [globeToast, setGlobeToast] = useState<string | null>(null);
  const [isAttachmentOpen, setIsAttachmentOpen] = useState<boolean>(false);

  // Active current text based on selected app
  const getCurrentActiveText = () => {
    switch (config.activeApp) {
      case 'safari': return safariUrl;
      case 'mail': return emailBody;
      case 'notes': return notesText;
      case 'search': return searchQuery;
      case 'messages':
      default:
        return typedText;
    }
  };

  const updateCurrentActiveText = (updater: (prev: string) => string) => {
    switch (config.activeApp) {
      case 'safari': setSafariUrl(updater); break;
      case 'mail': setEmailBody(updater); break;
      case 'notes': setNotesText(updater); break;
      case 'search': setSearchQuery(updater); break;
      case 'messages':
      default:
        setTypedText(updater); break;
    }
  };

  const activeText = getCurrentActiveText();

  useEffect(() => {
    const nextWords = priorModel.getWordPredictions(activeText, 3);
    setPredictions(nextWords);
  }, [activeText, priorModel]);

  useEffect(() => {
    if (config.appleIntelligenceEnabled && config.smartRepliesEnabled && config.activeApp === 'messages') {
      const partnerText = messages[messages.length - 1]?.text || "";
      const replies = aiModel.generateSmartReplies(partnerText);
      setSmartReplies(replies);
    } else {
      setSmartReplies([]);
    }
  }, [messages, config.appleIntelligenceEnabled, config.smartRepliesEnabled, config.activeApp, aiModel]);

  const audioHapticEngine = useMemo(() => new AudioHapticEngine(), []);

  const handleKeyPress = (char: string) => {
    // 1. Audio & Haptic Feedback
    if (config.soundFeedbackEnabled) {
      if (char === 'SPACE' || char === 'DOUBLE_SPACE_PERIOD') {
        audioHapticEngine.playKeyClick('space');
      } else if (char === 'BACKSPACE') {
        audioHapticEngine.playKeyClick('backspace');
      } else if (char === 'RETURN') {
        audioHapticEngine.playKeyClick('return');
      } else {
        audioHapticEngine.playKeyClick('char');
      }
    }

    if (config.hapticFeedbackEnabled) {
      audioHapticEngine.triggerHaptic(12);
      setHapticPing(true);
      setTimeout(() => setHapticPing(false), 120);
    }

    // 2. Character Execution
    if (char === 'BACKSPACE') {
      updateCurrentActiveText((prev) => prev.slice(0, -1));
    } else if (char === 'SPACE') {
      updateCurrentActiveText((prev) => prev + " ");
    } else if (char === 'DOUBLE_SPACE_PERIOD') {
      if (config.smartPunctuationEnabled) {
        updateCurrentActiveText((prev) => {
          const trimmed = prev.endsWith(" ") ? prev.slice(0, -1) : prev;
          return trimmed + ". ";
        });
        if (config.autoCapitalizationEnabled) {
          onShiftChange('shift');
        }
      } else {
        updateCurrentActiveText((prev) => prev + " ");
      }
    } else if (char === 'RETURN') {
      if (config.activeApp === 'messages') {
        handleSendMessage();
      } else {
        updateCurrentActiveText((prev) => prev + "\n");
      }
    } else {
      updateCurrentActiveText((prev) => prev + char);
    }
  };

  const handleSendMessage = () => {
    if (!typedText.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: 'user',
        text: typedText,
        timestamp: '9:41 AM'
      }
    ]);
    setTypedText("");
  };

  const handleSendAttachment = (attachment: ChatAttachment) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `att-${Date.now()}`,
        sender: 'user',
        attachment,
        timestamp: '9:41 AM'
      }
    ]);
  };

  const handleEmojiSelect = (emoji: string) => {
    updateCurrentActiveText((prev) => prev + emoji);
  };

  const handleSuggestionClick = (word: string) => {
    updateCurrentActiveText((prev) => {
      const tokens = prev.trimEnd().split(/\s+/);
      tokens.pop();
      tokens.push(word);
      return tokens.join(" ") + " ";
    });
  };

  const handleSmartReplyClick = (replyText: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `sr-${Date.now()}`,
        sender: 'user',
        text: replyText,
        timestamp: '9:41 AM'
      }
    ]);
  };

  const handleGlobeTapped = () => {
    setGlobeToast("🌐 ErgoKey — English (US) Active");
    setTimeout(() => setGlobeToast(null), 2000);
  };

  const handleTriggerDictation = () => {
    if (isDictating) return;
    setIsDictating(true);
    const phrases = aiModel.getSimulatedDictationPhrases();
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

    let currentIdx = 0;
    const words = randomPhrase.split(" ");
    updateCurrentActiveText(() => "");

    const interval = setInterval(() => {
      if (currentIdx < words.length) {
        updateCurrentActiveText((prev) => (prev ? prev + " " : "") + words[currentIdx]);
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsDictating(false);
      }
    }, 280);
  };

  const isProMax = config.device === 'iphone-17-pro-max';
  const frameWidth = isProMax ? 440 : 402;
  const frameHeight = isProMax ? 956 : 874;

  return (
    <div className="flex flex-col items-center">
      {/* App Switcher Ribbon */}
      <div className="mb-3 flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl shadow-lg">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
          Test App:
        </span>
        {[
          { id: 'messages', label: 'Messages', icon: MessageSquare },
          { id: 'safari', label: 'Safari', icon: Compass },
          { id: 'mail', label: 'Mail', icon: Mail },
          { id: 'notes', label: 'Notes', icon: FileText },
          { id: 'search', label: 'Search', icon: Search }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = config.activeApp === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onAppChange(item.id as SimulatedApp)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* iPhone 17 Pro Titanium Chassis */}
      <div
        className={`relative bg-slate-950 rounded-[54px] p-2.5 shadow-2xl transition-all duration-500 select-none overflow-hidden ${
          config.appleIntelligenceEnabled && config.showAiGlow
            ? 'ring-4 ring-purple-500/80 shadow-[0_0_50px_rgba(236,72,153,0.35)]'
            : 'border-[5px] border-slate-700/80 ring-1 ring-white/10'
        }`}
        style={{
          width: `${frameWidth + 20}px`,
          height: `${frameHeight + 20}px`
        }}
      >
        {/* Apple Intelligence Animated Iridescent Perimeter Edge */}
        {config.appleIntelligenceEnabled && config.showAiGlow && (
          <div className="absolute inset-0 rounded-[52px] pointer-events-none p-[2px] bg-gradient-to-tr from-pink-500 via-purple-500 via-cyan-400 to-amber-400 opacity-90 animate-pulse" />
        )}

        {/* Dynamic Island */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-40 flex items-center justify-between px-3.5 shadow-md">
          <div className={`w-2.5 h-2.5 rounded-full ${config.appleIntelligenceEnabled ? 'bg-purple-400 animate-ping' : 'bg-emerald-500/80 animate-pulse'}`} />
          <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700" />
        </div>

        {/* Globe Keyboard Switcher Toast */}
        {globeToast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-cyan-500/80 text-cyan-300 text-xs font-bold px-4 py-1.5 rounded-full shadow-2xl z-50 flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>{globeToast}</span>
          </div>
        )}

        {/* Screen Bezel & Container */}
        <div
          className="relative w-full h-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-[46px] overflow-hidden flex flex-col justify-between"
          style={{ width: `${frameWidth}px`, height: `${frameHeight}px` }}
        >
          {/* iOS Status Bar */}
          <div className="pt-3.5 px-7 flex justify-between items-center text-xs font-semibold text-slate-300 z-30">
            <span>9:41</span>
            <div className="flex items-center space-x-2 text-slate-300">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

          {/* DYNAMIC APP VIEWPORT */}
          <div className="flex-1 px-4 pt-7 pb-2 flex flex-col justify-end overflow-y-auto space-y-2.5">
            {/* 1. APP: MESSAGES / iMESSAGE */}
            {config.activeApp === 'messages' && (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    {msg.text && (
                      <div
                        className={`max-w-[85%] text-xs px-3.5 py-2 rounded-2xl shadow-sm ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-tr-sm'
                            : 'bg-slate-800/90 text-slate-200 rounded-tl-sm border border-slate-700/60'
                        }`}
                      >
                        {msg.sender === 'partner' && (
                          <p className="text-[10px] text-indigo-400 font-bold mb-0.5">Alex (Friend)</p>
                        )}
                        <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                      </div>
                    )}

                    {msg.attachment && (
                      <div className="max-w-[85%] rounded-2xl overflow-hidden shadow-lg border border-slate-700/80 bg-slate-900">
                        {(msg.attachment.type === 'photo' || msg.attachment.type === 'camera') && (
                          <div>
                            <img src={msg.attachment.imageUrl} alt="Attached" className="w-56 h-36 object-cover" />
                            <div className="p-2 bg-slate-950 text-[10px] text-slate-400 flex items-center justify-between">
                              <span>{msg.attachment.title}</span>
                              <span className="text-cyan-400 font-bold">17 Pro HDR</span>
                            </div>
                          </div>
                        )}
                        {msg.attachment.type === 'apple-cash' && (
                          <div className="p-3 bg-gradient-to-r from-emerald-600 to-green-700 text-white flex items-center space-x-3 w-52">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                              <DollarSign className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-black font-mono">{msg.attachment.amount}</p>
                              <p className="text-[9px] text-emerald-100 uppercase tracking-wider">Apple Cash Sent</p>
                            </div>
                          </div>
                        )}
                        {msg.attachment.type === 'location' && (
                          <div className="w-56 bg-slate-950">
                            <div className="h-24 bg-gradient-to-tr from-blue-900/60 via-slate-800 to-emerald-900/60 flex items-center justify-center relative">
                              <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg animate-bounce">
                                <MapPin className="w-4 h-4" />
                              </div>
                              <span className="absolute bottom-1 right-2 text-[9px] bg-black/60 px-1.5 py-0.5 rounded text-white font-mono">
                                {msg.attachment.mapType === 'apple' ? 'Apple Maps' : 'Google Maps'}
                              </span>
                            </div>
                            <div className="p-2.5 space-y-0.5">
                              <p className="text-xs font-bold text-white flex items-center space-x-1">
                                <Navigation className="w-3 h-3 text-cyan-400" />
                                <span>{msg.attachment.title}</span>
                              </p>
                              <p className="text-[10px] text-slate-400 truncate">{msg.attachment.subtitle}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {config.appleIntelligenceEnabled && smartReplies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 py-1 animate-in fade-in slide-in-from-left duration-200">
                    <span className="text-[10px] font-bold text-purple-300 flex items-center space-x-1 mr-1">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span>Smart Replies:</span>
                    </span>
                    {smartReplies.map((reply) => (
                      <button
                        key={reply.id}
                        onClick={() => handleSmartReplyClick(reply.text)}
                        className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-purple-950/70 border border-purple-500/50 text-purple-200 hover:bg-purple-900 transition-colors shadow-sm"
                      >
                        {reply.text}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center space-x-1.5 pt-1">
                  <button
                    onClick={() => setIsAttachmentOpen((prev) => !prev)}
                    className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 bg-slate-900 border border-slate-700/80 rounded-2xl px-3 py-1.5 flex items-center justify-between">
                    <div className="text-xs text-white whitespace-pre-wrap break-words flex-1">
                      {typedText || <span className="text-slate-500">iMessage</span>}
                      <span className="inline-block w-0.5 h-3.5 bg-cyan-400 ml-0.5 animate-pulse align-middle" />
                    </div>
                    {typedText.trim() && (
                      <button onClick={handleSendMessage} className="p-1 rounded-full bg-blue-600 text-white ml-1.5">
                        <Send className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* 2. APP: SAFARI WEB BROWSER */}
            {config.activeApp === 'safari' && (
              <div className="space-y-3 flex-1 flex flex-col justify-between py-2">
                <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span className="text-white font-semibold">apple.com</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">iPhone 17 Pro — Titanium Design</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Explore next-generation Apple Intelligence, 6.3-inch Super Retina display, and native ErgoKey precision hit testing.
                  </p>
                </div>

                <div className="bg-slate-900 border border-cyan-500/60 rounded-2xl p-2.5 flex items-center space-x-2 shadow-lg">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <div className="flex-1 text-xs text-white font-mono truncate">
                    {safariUrl}
                    <span className="inline-block w-0.5 h-3.5 bg-cyan-400 ml-0.5 animate-pulse align-middle" />
                  </div>
                  <button className="px-2 py-1 bg-cyan-600 text-slate-950 text-[10px] font-bold rounded-lg uppercase">
                    Go
                  </button>
                </div>
              </div>
            )}

            {/* 3. APP: APPLE MAIL */}
            {config.activeApp === 'mail' && (
              <div className="space-y-2 flex-1 flex flex-col justify-start py-2">
                <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between border-b border-slate-800/80 pb-1 text-slate-400">
                    <span>To:</span>
                    <span className="text-cyan-300 font-semibold">sarah.cook@apple.com</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-1 text-slate-400">
                    <span>Subject:</span>
                    <span className="text-white font-bold">ErgoKey iOS Universal Testing</span>
                  </div>
                </div>

                <div className="flex-1 bg-slate-950/60 rounded-2xl p-3 border border-slate-800/80 text-xs text-slate-200 whitespace-pre-wrap">
                  {emailBody}
                  <span className="inline-block w-0.5 h-3.5 bg-cyan-400 ml-0.5 animate-pulse align-middle" />
                </div>
              </div>
            )}

            {/* 4. APP: NOTES */}
            {config.activeApp === 'notes' && (
              <div className="space-y-2 flex-1 flex flex-col justify-start py-2">
                <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-xs text-amber-400 font-bold">
                  <span>📁 Notes</span>
                  <span className="text-slate-400 text-[10px]">Today at 9:41 AM</span>
                </div>
                <div className="flex-1 bg-slate-950/80 rounded-2xl p-3 border border-slate-800 text-xs text-amber-100/90 whitespace-pre-wrap font-sans leading-relaxed">
                  {notesText}
                  <span className="inline-block w-0.5 h-3.5 bg-amber-400 ml-0.5 animate-pulse align-middle" />
                </div>
              </div>
            )}

            {/* 5. APP: SPOTLIGHT SEARCH */}
            {config.activeApp === 'search' && (
              <div className="space-y-2.5 flex-1 flex flex-col justify-start py-2">
                <div className="bg-slate-900 border border-purple-500/60 rounded-2xl p-2.5 flex items-center space-x-2 shadow-lg">
                  <Search className="w-4 h-4 text-purple-400" />
                  <div className="flex-1 text-xs text-white font-medium truncate">
                    {searchQuery}
                    <span className="inline-block w-0.5 h-3.5 bg-purple-400 ml-0.5 animate-pulse align-middle" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Top Results</p>
                  <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                    <span className="text-slate-200">Apple Intelligence Overview</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                    <span className="text-slate-200">ErgoKey Precision Calibration</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </div>
              </div>
            )}

            {/* Voice Dictation Live Overlay */}
            {isDictating && (
              <div className="p-2 bg-slate-900/90 border border-cyan-500 rounded-xl flex items-center justify-between text-xs text-cyan-300 animate-pulse">
                <div className="flex items-center space-x-2">
                  <Mic className="w-4 h-4 text-cyan-400" />
                  <span>Listening (Apple Intelligence On-Device)...</span>
                </div>
                <div className="flex space-x-1">
                  <div className="w-1 h-3 bg-cyan-400 animate-bounce" />
                  <div className="w-1 h-4 bg-cyan-400 animate-bounce delay-75" />
                  <div className="w-1 h-2 bg-cyan-400 animate-bounce delay-150" />
                </div>
              </div>
            )}

            {/* Live Probabilistic Telemetry HUD */}
            <div className="bg-slate-950/80 backdrop-blur-md rounded-xl p-2 border border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${hapticPing ? 'bg-cyan-400 scale-125' : 'bg-slate-600'} transition-all`} />
                <span className="font-mono text-slate-300">
                  {lastHitResult ? (
                    <>
                      Target: <span className="text-cyan-400 font-bold uppercase">{lastHitResult.selectedKey.label}</span>
                      {lastHitResult.selectedKey.label !== lastHitResult.traditionalKey.label && (
                        <span className="text-amber-400 ml-1 font-semibold">
                          (Saved from '{lastHitResult.traditionalKey.label}')
                        </span>
                      )}
                    </>
                  ) : (
                    `App: ${config.activeApp.toUpperCase()} | Layer: ${config.layer.toUpperCase()}`
                  )}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {lastHitResult && config.layer === 'alpha' && (
                  <>
                    <span className="text-emerald-400 font-mono">
                      Conf: {(lastHitResult.confidence * 100).toFixed(0)}%
                    </span>
                    <span className="text-purple-400 font-mono">
                      Prior: {(lastHitResult.priorProb * 100).toFixed(0)}%
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Apple Intelligence Floating Ribbon */}
          <AppleIntelligenceRibbon
            currentText={activeText}
            onTextUpdated={(newText) => updateCurrentActiveText(() => newText)}
            isEnabled={config.appleIntelligenceEnabled}
            onToggleEnabled={onToggleAI}
            aiModel={aiModel}
          />

          {/* iOS Smart Prediction Ribbon (on Alpha Layer) */}
          {config.predictiveTextEnabled && config.layer === 'alpha' && (
            <div className="h-9 bg-slate-950/90 backdrop-blur border-t border-slate-800/80 px-2 flex items-center justify-around space-x-1.5 z-20">
              {predictions.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(word)}
                  className={`flex-1 py-1 px-2 text-center text-xs font-medium rounded-md transition-colors ${
                    idx === 0
                      ? 'text-white bg-slate-800/90 font-semibold border border-slate-700 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  "{word}"
                </button>
              ))}
              <button
                onClick={() => updateCurrentActiveText(() => "")}
                title="Clear text"
                className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Mount Keyboard or Emoji Picker */}
          <div className="w-full relative z-10 bg-slate-950/95 border-t border-slate-800">
            {config.layer === 'emoji' ? (
              <EmojiPicker
                onEmojiSelect={handleEmojiSelect}
                onBackToAlpha={() => onLayerChange('alpha')}
                onBackspace={() => handleKeyPress('BACKSPACE')}
                height={config.keyboardHeight}
              />
            ) : (
              <ErgonomicKeyboard
                config={config}
                currentText={activeText}
                priorModel={priorModel}
                spatialEngine={spatialEngine}
                onKeyTriggered={handleKeyPress}
                onHitEvaluated={onHitEvaluated}
                shiftState={config.shiftState}
                onShiftChange={onShiftChange}
                onLayoutModeChange={onLayoutModeChange}
                onLayerChange={onLayerChange}
                onToggleAI={onToggleAI}
                onTriggerDictation={handleTriggerDictation}
                onGlobeTapped={handleGlobeTapped}
                onEmojiTapped={() => onLayerChange('emoji')}
              />
            )}

            {/* iOS Home Indicator Bar */}
            <div className="w-full flex justify-center pb-2 pt-1 pointer-events-none">
              <div className="w-32 h-1 bg-slate-400/60 rounded-full" />
            </div>
          </div>

          {/* Attachment App Drawer Modal (in Messages) */}
          <AttachmentDrawer
            isOpen={isAttachmentOpen}
            onClose={() => setIsAttachmentOpen(false)}
            onSendAttachment={handleSendAttachment}
          />
        </div>
      </div>

      {/* Frame Status Badges */}
      <div className="mt-4 flex items-center space-x-2 text-xs text-slate-400">
        <button
          onClick={onOpenSettingsModal}
          className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-semibold transition-colors"
        >
          <Cpu className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
          <span>iOS Settings Setup</span>
        </button>

        <span className={`inline-flex items-center px-2.5 py-1 rounded-full border transition-all ${
          config.appleIntelligenceEnabled
            ? 'bg-purple-950/60 border-purple-500 text-purple-300'
            : 'bg-slate-800 border-slate-700 text-slate-400'
        }`}>
          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
          {config.appleIntelligenceEnabled ? 'Apple Intelligence Active' : 'AI Offline'}
        </span>
      </div>
    </div>
  );
};
