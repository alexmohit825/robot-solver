export type DeviceType = 'iphone-17-pro' | 'iphone-17-pro-max';

export type KeyboardLayoutMode = 'two-handed' | 'one-handed-right' | 'one-handed-left' | 'standard';

export type KeyboardLayer = 'alpha' | 'numeric' | 'symbol' | 'emoji';

export type ShiftState = 'off' | 'shift' | 'caps-lock';

export type SimulatedApp = 'messages' | 'safari' | 'mail' | 'notes' | 'search';

export type ReturnKeyStyle = 'return' | 'search' | 'go' | 'send' | 'done' | 'next';

export interface KeyDefinition {
  id: string;
  label: string;
  flickLabel?: string;
  altLabel?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  type: 'char' | 'space' | 'backspace' | 'shift' | 'mode' | 'return' | 'special' | 'gutter-action' | 'ai' | 'mic' | 'punct' | 'globe' | 'emoji';
  hand?: 'left' | 'right' | 'center';
}

export interface TouchContact {
  x: number;
  y: number;
  majorRadius: number;
  minorRadius: number;
  angle: number;
  pressure: number;
  timestamp: number;
}

export interface HitTestResult {
  selectedKey: KeyDefinition;
  traditionalKey: KeyDefinition;
  confidence: number;
  priorProb: number;
  spatialProb: number;
  contactPoint: { x: number; y: number };
  ellipseCentroid: { x: number; y: number };
  candidates: Array<{
    key: KeyDefinition;
    totalProb: number;
    spatialProb: number;
    priorProb: number;
  }>;
}

export interface LayoutConfig {
  device: DeviceType;
  mode: KeyboardLayoutMode;
  layer: KeyboardLayer;
  shiftState: ShiftState;
  activeApp: SimulatedApp;
  keyboardHeight: number;
  bottomGutterPadding: number;
  keyGutter: number;
  glyphFontSize: number;
  fingerRadiusMm: number;
  showDynamicHitboxes: boolean;
  showContactEllipse: boolean;
  showTraditionalHitboxes: boolean;
  showProbabilityHeatmap: boolean;
  showLanguagePriors: boolean;
  
  // Native iOS Keyboard Tools & Feedback Toggles
  hapticFeedbackEnabled: boolean;
  soundFeedbackEnabled: boolean;
  predictiveTextEnabled: boolean;
  checkSpellingEnabled: boolean;
  smartPunctuationEnabled: boolean;
  autoCapitalizationEnabled: boolean;

  // Apple Intelligence Configs
  appleIntelligenceEnabled: boolean;
  smartRepliesEnabled: boolean;
  autoProofreadEnabled: boolean;
  mashedWordRepairEnabled: boolean;
  showAiGlow: boolean;

  // Punctuation Layout
  includeInlinePunctuation: boolean;
}

export interface EmojiCategory {
  name: string;
  icon: string;
  emojis: string[];
}

export interface SmartReply {
  id: string;
  text: string;
  category: 'direct' | 'casual' | 'polite';
}

export type WritingToolTone = 'friendly' | 'professional' | 'concise';

export interface ChatAttachment {
  type: 'photo' | 'apple-cash' | 'location' | 'camera' | 'audio' | 'sticker';
  title?: string;
  subtitle?: string;
  amount?: string;
  imageUrl?: string;
  mapType?: 'apple' | 'google';
  coordinates?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'partner';
  text?: string;
  attachment?: ChatAttachment;
  timestamp: string;
}

export interface BenchmarkPhrase {
  target: string;
  category: 'common' | 'adjacent-error-heavy' | 'large-finger-stress';
}

export interface BenchmarkMetrics {
  totalKeystrokes: number;
  traditionalErrors: number;
  probabilisticErrors: number;
  errorReductionPercent: number;
  fatFingerInterceptions: number;
  averageOffsetPx: number;
}
