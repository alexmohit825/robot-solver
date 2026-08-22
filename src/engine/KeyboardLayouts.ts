import { DeviceType, KeyDefinition, KeyboardLayoutMode, KeyboardLayer, SimulatedApp } from '../types/keyboard';

export interface LayoutDimensions {
  screenWidth: number;
  screenHeight: number;
  keyboardHeight: number;
  bottomSafePadding: number;
  gutter: number;
}

export function getDeviceDimensions(device: DeviceType): { width: number; height: number } {
  switch (device) {
    case 'iphone-17-pro-max':
      return { width: 440, height: 956 };
    case 'iphone-17-pro':
    default:
      return { width: 402, height: 874 };
  }
}

function getReturnKeyLabel(app: SimulatedApp = 'messages'): string {
  switch (app) {
    case 'safari':
      return 'go';
    case 'search':
      return 'search';
    case 'mail':
      return 'next';
    case 'notes':
      return 'return';
    case 'messages':
    default:
      return 'return';
  }
}

/**
 * Generates key coordinates based on layout mode, active layer (alpha, numeric, symbol),
 * active simulated app environment (Messages, Safari, Mail, Notes, Search),
 * device scale, gutter spacing, and inline punctuation placement.
 */
export function generateKeyboardLayout(
  mode: KeyboardLayoutMode,
  device: DeviceType = 'iphone-17-pro',
  layer: KeyboardLayer = 'alpha',
  keyboardHeight: number = 285,
  bottomPadding: number = 26,
  gutter: number = 5,
  includeInlinePunctuation: boolean = true,
  activeApp: SimulatedApp = 'messages'
): KeyDefinition[] {
  const { width: W } = getDeviceDimensions(device);
  const H = keyboardHeight;
  const usableH = H - bottomPadding;
  const returnLabel = getReturnKeyLabel(activeApp);

  if (layer === 'numeric') {
    return generateNumericSheet(W, usableH, gutter, returnLabel);
  }
  if (layer === 'symbol') {
    return generateSymbolSheet(W, usableH, gutter, returnLabel);
  }

  switch (mode) {
    case 'two-handed':
      return generateTwoHandedArcLayout(W, usableH, gutter, includeInlinePunctuation, returnLabel, activeApp);
    case 'one-handed-right':
      return generateOneHandedRadialLayout(W, usableH, gutter, 'right', includeInlinePunctuation, returnLabel, activeApp);
    case 'one-handed-left':
      return generateOneHandedRadialLayout(W, usableH, gutter, 'left', includeInlinePunctuation, returnLabel, activeApp);
    case 'standard':
    default:
      return generateStandardLinearLayout(W, usableH, gutter, includeInlinePunctuation, returnLabel, activeApp);
  }
}

// -------------------------------------------------------------
// 1. TWO-HANDED ERGONOMIC THUMB-ARC (ALPHA LAYER)
// -------------------------------------------------------------
function generateTwoHandedArcLayout(
  W: number,
  H: number,
  gutter: number,
  includePunct: boolean,
  returnLabel: string,
  activeApp: SimulatedApp
): KeyDefinition[] {
  const keys: KeyDefinition[] = [];
  const rowHeight = (H - 4 * gutter) / 4;

  const row1Left = [
    { label: 'Q', flick: '1' },
    { label: 'W', flick: '2' },
    { label: 'E', flick: '3' },
    { label: 'R', flick: '4' },
    { label: 'T', flick: '5' }
  ];
  const row1Right = [
    { label: 'Y', flick: '6' },
    { label: 'U', flick: '7' },
    { label: 'I', flick: '8' },
    { label: 'O', flick: '9' },
    { label: 'P', flick: '0' }
  ];

  const centerGutter = Math.max(30, W * (includePunct ? 0.105 : 0.085));
  const halfWidth = (W - centerGutter - 12 * gutter) / 2;
  const keyW1 = halfWidth / 5;

  // Row 1 Left
  row1Left.forEach((k, i) => {
    const arcY = Math.sin((i / 4) * Math.PI * 0.5) * 4;
    keys.push({
      id: `key-${k.label.toLowerCase()}`,
      label: k.label,
      flickLabel: k.flick,
      x: gutter + i * (keyW1 + gutter),
      y: gutter * 2 + arcY,
      width: keyW1,
      height: rowHeight * 0.95,
      rotation: -6 + i * 1.5,
      type: 'char',
      hand: 'left'
    });
  });

  // Row 1 Right
  row1Right.forEach((k, i) => {
    const arcY = Math.sin(((4 - i) / 4) * Math.PI * 0.5) * 4;
    const startX = W / 2 + centerGutter / 2 + gutter;
    keys.push({
      id: `key-${k.label.toLowerCase()}`,
      label: k.label,
      flickLabel: k.flick,
      x: startX + i * (keyW1 + gutter),
      y: gutter * 2 + arcY,
      width: keyW1,
      height: rowHeight * 0.95,
      rotation: (i - 2) * 1.5 + 4,
      type: 'char',
      hand: 'right'
    });
  });

  // Center Quick-Access in Row 1 Center
  if (includePunct) {
    keys.push({
      id: 'key-inline-colon',
      label: activeApp === 'safari' ? '/' : ':',
      flickLabel: activeApp === 'safari' ? ':' : ';',
      x: W / 2 - (centerGutter * 0.88) / 2,
      y: gutter * 2,
      width: centerGutter * 0.88,
      height: rowHeight * 0.95,
      type: 'punct',
      hand: 'center'
    });
  }

  // Row 2: Left (A S D F G) and Right (H J K L)
  const row2Left = [
    { label: 'A', flick: '@' },
    { label: 'S', flick: '#' },
    { label: 'D', flick: '$' },
    { label: 'F', flick: '%' },
    { label: 'G', flick: '&' }
  ];
  const row2Right = [
    { label: 'H', flick: '*' },
    { label: 'J', flick: '-' },
    { label: 'K', flick: '+' },
    { label: 'L', flick: '=' }
  ];

  const keyW2Left = halfWidth / 5;
  const keyW2Right = halfWidth / 4.2;

  row2Left.forEach((k, i) => {
    const arcY = Math.sin((i / 4) * Math.PI * 0.5) * 3;
    keys.push({
      id: `key-${k.label.toLowerCase()}`,
      label: k.label,
      flickLabel: k.flick,
      x: gutter * 1.5 + i * (keyW2Left + gutter),
      y: rowHeight + gutter * 2 + arcY,
      width: keyW2Left,
      height: rowHeight * 0.95,
      rotation: -4 + i * 1.2,
      type: 'char',
      hand: 'left'
    });
  });

  row2Right.forEach((k, i) => {
    const arcY = Math.sin(((3 - i) / 3) * Math.PI * 0.5) * 3;
    const startX = W / 2 + centerGutter / 2 + gutter;
    keys.push({
      id: `key-${k.label.toLowerCase()}`,
      label: k.label,
      flickLabel: k.flick,
      x: startX + i * (keyW2Right + gutter),
      y: rowHeight + gutter * 2 + arcY,
      width: keyW2Right,
      height: rowHeight * 0.95,
      rotation: (i - 1.5) * 1.5 + 3,
      type: 'char',
      hand: 'right'
    });
  });

  // Center Quick-Access: Period (.) in Row 2 Center
  keys.push({
    id: 'key-inline-period',
    label: activeApp === 'safari' ? '.com' : '.',
    flickLabel: activeApp === 'safari' ? '.' : '!',
    x: W / 2 - (centerGutter * 0.88) / 2,
    y: rowHeight + gutter * 2,
    width: centerGutter * 0.88,
    height: rowHeight * 0.95,
    type: 'punct',
    hand: 'center'
  });

  // Row 3: Left (Shift, Z X C V) and Right (B N M, Backspace)
  const shiftW = keyW1 * 1.3;
  keys.push({
    id: 'key-shift',
    label: '⇧',
    x: gutter,
    y: rowHeight * 2 + gutter * 2,
    width: shiftW,
    height: rowHeight * 0.95,
    type: 'shift',
    hand: 'left'
  });

  const row3Left = [
    { label: 'Z', flick: '_' },
    { label: 'X', flick: '/' },
    { label: 'C', flick: ':' },
    { label: 'V', flick: ';' }
  ];
  const keyW3Left = (halfWidth - shiftW) / 4;
  row3Left.forEach((k, i) => {
    keys.push({
      id: `key-${k.label.toLowerCase()}`,
      label: k.label,
      flickLabel: k.flick,
      x: gutter + shiftW + gutter + i * (keyW3Left + gutter),
      y: rowHeight * 2 + gutter * 2,
      width: keyW3Left,
      height: rowHeight * 0.95,
      type: 'char',
      hand: 'left'
    });
  });

  const row3Right = [
    { label: 'B', flick: '(' },
    { label: 'N', flick: ')' },
    { label: 'M', flick: '?' }
  ];
  const backspaceW = keyW1 * 1.4;
  const keyW3Right = (halfWidth - backspaceW) / 3;
  const startX3Right = W / 2 + centerGutter / 2 + gutter;

  row3Right.forEach((k, i) => {
    keys.push({
      id: `key-${k.label.toLowerCase()}`,
      label: k.label,
      flickLabel: k.flick,
      x: startX3Right + i * (keyW3Right + gutter),
      y: rowHeight * 2 + gutter * 2,
      width: keyW3Right,
      height: rowHeight * 0.95,
      type: 'char',
      hand: 'right'
    });
  });

  keys.push({
    id: 'key-backspace',
    label: '⌫',
    x: W - backspaceW - gutter,
    y: rowHeight * 2 + gutter * 2,
    width: backspaceW,
    height: rowHeight * 0.95,
    type: 'backspace',
    hand: 'right'
  });

  // Center Quick-Access: Comma (,) in Row 3 Center
  keys.push({
    id: 'key-inline-comma',
    label: ',',
    flickLabel: '?',
    x: W / 2 - (centerGutter * 0.88) / 2,
    y: rowHeight * 2 + gutter * 2,
    width: centerGutter * 0.88,
    height: rowHeight * 0.95,
    type: 'punct',
    hand: 'center'
  });

  // Row 4: Mode Switch (123), Globe (🌐), Emoji (😀), AI, Space Left, Space Right, Mic, Return/Go/Search
  const modeW = W * 0.12;
  const iconW = W * 0.085;
  const returnW = W * 0.16;
  const spaceTotalW = W - modeW - 4 * iconW - returnW - 10 * gutter;
  const spaceW = spaceTotalW / 2;

  keys.push({
    id: 'key-mode',
    label: '123',
    x: gutter,
    y: rowHeight * 3 + gutter * 2,
    width: modeW,
    height: rowHeight * 0.95,
    type: 'mode',
    hand: 'left'
  });

  keys.push({
    id: 'key-globe',
    label: '🌐',
    x: gutter + modeW + gutter,
    y: rowHeight * 3 + gutter * 2,
    width: iconW,
    height: rowHeight * 0.95,
    type: 'globe',
    hand: 'left'
  });

  keys.push({
    id: 'key-emoji',
    label: '😀',
    x: gutter + modeW + gutter + iconW + gutter,
    y: rowHeight * 3 + gutter * 2,
    width: iconW,
    height: rowHeight * 0.95,
    type: 'emoji',
    hand: 'left'
  });

  keys.push({
    id: 'key-ai-toggle',
    label: '✨',
    altLabel: 'AI',
    x: gutter + modeW + gutter + 2 * iconW + 2 * gutter,
    y: rowHeight * 3 + gutter * 2,
    width: iconW,
    height: rowHeight * 0.95,
    type: 'ai',
    hand: 'left'
  });

  keys.push({
    id: 'key-space-left',
    label: 'space',
    x: gutter + modeW + 3 * iconW + 4 * gutter,
    y: rowHeight * 3 + gutter * 2,
    width: spaceW,
    height: rowHeight * 0.95,
    type: 'space',
    hand: 'left'
  });

  keys.push({
    id: 'key-space-right',
    label: 'space',
    x: gutter + modeW + 3 * iconW + 4 * gutter + spaceW + gutter,
    y: rowHeight * 3 + gutter * 2,
    width: spaceW,
    height: rowHeight * 0.95,
    type: 'space',
    hand: 'right'
  });

  keys.push({
    id: 'key-mic',
    label: '🎤',
    altLabel: 'Dictation',
    x: gutter + modeW + 3 * iconW + 5 * gutter + 2 * spaceW + gutter,
    y: rowHeight * 3 + gutter * 2,
    width: iconW,
    height: rowHeight * 0.95,
    type: 'mic',
    hand: 'right'
  });

  // Dynamic Return Key (return, go, search, next)
  keys.push({
    id: 'key-return',
    label: returnLabel,
    x: W - returnW - gutter,
    y: rowHeight * 3 + gutter * 2,
    width: returnW,
    height: rowHeight * 0.95,
    type: 'return',
    hand: 'right'
  });

  return keys;
}

// -------------------------------------------------------------
// 2. ONE-HANDED RADIAL LAYOUT
// -------------------------------------------------------------
function generateOneHandedRadialLayout(
  W: number,
  H: number,
  gutter: number,
  bias: 'left' | 'right',
  includePunct: boolean,
  returnLabel: string,
  activeApp: SimulatedApp
): KeyDefinition[] {
  const keys: KeyDefinition[] = [];
  const isRight = bias === 'right';
  const effectiveW = W * 0.84;
  const startXOffset = isRight ? W - effectiveW - gutter : gutter;
  const rowHeight = (H - 4 * gutter) / 4;

  const r1Chars = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const keyW1 = (effectiveW - 11 * gutter) / 10;

  r1Chars.forEach((ch, i) => {
    const idxFromPivot = isRight ? 9 - i : i;
    const radialCurveY = Math.sin((idxFromPivot / 9) * Math.PI * 0.45) * 12;
    const rotationAngle = (isRight ? 1 : -1) * (-8 + (idxFromPivot / 9) * 16);

    keys.push({
      id: `key-${ch.toLowerCase()}`,
      label: ch,
      flickLabel: `${(i + 1) % 10}`,
      x: startXOffset + gutter + i * (keyW1 + gutter),
      y: gutter * 2 + radialCurveY,
      width: keyW1,
      height: rowHeight * 0.95,
      rotation: rotationAngle,
      type: 'char',
      hand: bias
    });
  });

  const r2Chars = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const keyW2 = (effectiveW - 10 * gutter) / 9;
  r2Chars.forEach((ch, i) => {
    const idxFromPivot = isRight ? 8 - i : i;
    const radialCurveY = Math.sin((idxFromPivot / 8) * Math.PI * 0.4) * 8;
    const rotationAngle = (isRight ? 1 : -1) * (-6 + (idxFromPivot / 8) * 12);

    keys.push({
      id: `key-${ch.toLowerCase()}`,
      label: ch,
      flickLabel: ['@', '#', '$', '%', '&', '*', '-', '+', '='][i],
      x: startXOffset + gutter * 1.5 + i * (keyW2 + gutter),
      y: rowHeight + gutter * 2 + radialCurveY,
      width: keyW2,
      height: rowHeight * 0.95,
      rotation: rotationAngle,
      type: 'char',
      hand: bias
    });
  });

  const r3Chars = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];
  const sideKeyW = keyW2 * 1.25;
  const keyW3 = (effectiveW - 2 * sideKeyW - 9 * gutter) / 7;

  keys.push({
    id: 'key-shift',
    label: '⇧',
    x: startXOffset + gutter,
    y: rowHeight * 2 + gutter * 2,
    width: sideKeyW,
    height: rowHeight * 0.95,
    type: 'shift',
    hand: bias
  });

  r3Chars.forEach((ch, i) => {
    const flickMap: Record<string, string> = {
      Z: '_', X: '/', C: ':', V: ';', B: '(', N: ')', M: '?'
    };
    keys.push({
      id: `key-${ch.toLowerCase()}`,
      label: ch,
      flickLabel: flickMap[ch],
      x: startXOffset + gutter + sideKeyW + gutter + i * (keyW3 + gutter),
      y: rowHeight * 2 + gutter * 2,
      width: keyW3,
      height: rowHeight * 0.95,
      type: 'char',
      hand: bias
    });
  });

  keys.push({
    id: 'key-backspace',
    label: '⌫',
    x: startXOffset + effectiveW - sideKeyW,
    y: rowHeight * 2 + gutter * 2,
    width: sideKeyW,
    height: rowHeight * 0.95,
    type: 'backspace',
    hand: bias
  });

  // Row 4: Mode (123), Globe, Emoji, Comma, Period, Colon, Space, Return
  const modeW = effectiveW * 0.12;
  const iconW = effectiveW * 0.085;
  const punctKeyW = effectiveW * 0.075;
  const returnW = effectiveW * 0.18;
  const spaceW = effectiveW - modeW - 2 * iconW - 3 * punctKeyW - returnW - 9 * gutter;

  keys.push({
    id: 'key-mode',
    label: '123',
    x: startXOffset + gutter,
    y: rowHeight * 3 + gutter * 2,
    width: modeW,
    height: rowHeight * 0.95,
    type: 'mode',
    hand: bias
  });

  keys.push({
    id: 'key-globe',
    label: '🌐',
    x: startXOffset + gutter + modeW + gutter,
    y: rowHeight * 3 + gutter * 2,
    width: iconW,
    height: rowHeight * 0.95,
    type: 'globe',
    hand: bias
  });

  keys.push({
    id: 'key-emoji',
    label: '😀',
    x: startXOffset + gutter + modeW + gutter + iconW + gutter,
    y: rowHeight * 3 + gutter * 2,
    width: iconW,
    height: rowHeight * 0.95,
    type: 'emoji',
    hand: bias
  });

  keys.push({
    id: 'key-inline-comma',
    label: ',',
    x: startXOffset + gutter + modeW + 2 * iconW + 3 * gutter,
    y: rowHeight * 3 + gutter * 2,
    width: punctKeyW,
    height: rowHeight * 0.95,
    type: 'punct',
    hand: bias
  });

  keys.push({
    id: 'key-inline-period',
    label: activeApp === 'safari' ? '.com' : '.',
    flickLabel: '!',
    x: startXOffset + gutter + modeW + 2 * iconW + 3 * gutter + punctKeyW + gutter,
    y: rowHeight * 3 + gutter * 2,
    width: punctKeyW,
    height: rowHeight * 0.95,
    type: 'punct',
    hand: bias
  });

  keys.push({
    id: 'key-inline-colon',
    label: activeApp === 'safari' ? '/' : ':',
    flickLabel: '?',
    x: startXOffset + gutter + modeW + 2 * iconW + 3 * gutter + 2 * punctKeyW + 2 * gutter,
    y: rowHeight * 3 + gutter * 2,
    width: punctKeyW,
    height: rowHeight * 0.95,
    type: 'punct',
    hand: bias
  });

  keys.push({
    id: 'key-space',
    label: 'space',
    x: startXOffset + gutter + modeW + 2 * iconW + 3 * gutter + 3 * punctKeyW + 3 * gutter,
    y: rowHeight * 3 + gutter * 2,
    width: spaceW,
    height: rowHeight * 0.95,
    type: 'space',
    hand: bias
  });

  keys.push({
    id: 'key-return',
    label: returnLabel,
    x: startXOffset + effectiveW - returnW,
    y: rowHeight * 3 + gutter * 2,
    width: returnW,
    height: rowHeight * 0.95,
    type: 'return',
    hand: bias
  });

  const swapBtnX = isRight ? gutter : W - (W - effectiveW - gutter * 2);
  keys.push({
    id: 'key-hand-swap',
    label: isRight ? '◀' : '▶',
    altLabel: 'Swap',
    x: swapBtnX,
    y: rowHeight * 1.5,
    width: W - effectiveW - gutter * 3,
    height: rowHeight * 1.6,
    type: 'special'
  });

  return keys;
}

// -------------------------------------------------------------
// 3. STANDARD LINEAR BASELINE
// -------------------------------------------------------------
function generateStandardLinearLayout(
  W: number,
  H: number,
  gutter: number,
  includePunct: boolean,
  returnLabel: string,
  activeApp: SimulatedApp
): KeyDefinition[] {
  const keys: KeyDefinition[] = [];
  const rowHeight = (H - 4 * gutter) / 4;

  const r1Chars = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const keyW1 = (W - 11 * gutter) / 10;
  r1Chars.forEach((ch, i) => {
    keys.push({
      id: `key-${ch.toLowerCase()}`,
      label: ch,
      flickLabel: `${(i + 1) % 10}`,
      x: gutter + i * (keyW1 + gutter),
      y: gutter * 2,
      width: keyW1,
      height: rowHeight * 0.95,
      type: 'char'
    });
  });

  const r2Chars = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const keyW2 = (W - 10 * gutter) / 9.5;
  const r2Offset = (W - (9 * keyW2 + 8 * gutter)) / 2;
  r2Chars.forEach((ch, i) => {
    keys.push({
      id: `key-${ch.toLowerCase()}`,
      label: ch,
      flickLabel: ['@', '#', '$', '%', '&', '*', '-', '+', '='][i],
      x: r2Offset + i * (keyW2 + gutter),
      y: rowHeight + gutter * 2,
      width: keyW2,
      height: rowHeight * 0.95,
      type: 'char'
    });
  });

  const r3Chars = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];
  const sideW = W * 0.13;
  const keyW3 = (W - 2 * sideW - 9 * gutter) / 7;

  keys.push({
    id: 'key-shift',
    label: '⇧',
    x: gutter,
    y: rowHeight * 2 + gutter * 2,
    width: sideW,
    height: rowHeight * 0.95,
    type: 'shift'
  });

  r3Chars.forEach((ch, i) => {
    const flickMap: Record<string, string> = {
      Z: '_', X: '/', C: ':', V: ';', B: '(', N: ')', M: '?'
    };
    keys.push({
      id: `key-${ch.toLowerCase()}`,
      label: ch,
      flickLabel: flickMap[ch],
      x: gutter + sideW + gutter + i * (keyW3 + gutter),
      y: rowHeight * 2 + gutter * 2,
      width: keyW3,
      height: rowHeight * 0.95,
      type: 'char'
    });
  });

  keys.push({
    id: 'key-backspace',
    label: '⌫',
    x: W - sideW - gutter,
    y: rowHeight * 2 + gutter * 2,
    width: sideW,
    height: rowHeight * 0.95,
    type: 'backspace'
  });

  const modeW = W * 0.12;
  const iconW = W * 0.085;
  const punctW = W * 0.075;
  const returnW = W * 0.18;
  const spaceW = W - modeW - 2 * iconW - 3 * punctW - returnW - 9 * gutter;

  keys.push({
    id: 'key-mode',
    label: '123',
    x: gutter,
    y: rowHeight * 3 + gutter * 2,
    width: modeW,
    height: rowHeight * 0.95,
    type: 'mode'
  });

  keys.push({
    id: 'key-globe',
    label: '🌐',
    x: gutter + modeW + gutter,
    y: rowHeight * 3 + gutter * 2,
    width: iconW,
    height: rowHeight * 0.95,
    type: 'globe'
  });

  keys.push({
    id: 'key-emoji',
    label: '😀',
    x: gutter + modeW + gutter + iconW + gutter,
    y: rowHeight * 3 + gutter * 2,
    width: iconW,
    height: rowHeight * 0.95,
    type: 'emoji'
  });

  keys.push({
    id: 'key-inline-comma',
    label: ',',
    x: gutter + modeW + 2 * iconW + 3 * gutter,
    y: rowHeight * 3 + gutter * 2,
    width: punctW,
    height: rowHeight * 0.95,
    type: 'punct'
  });

  keys.push({
    id: 'key-inline-period',
    label: activeApp === 'safari' ? '.com' : '.',
    flickLabel: '!',
    x: gutter + modeW + 2 * iconW + 3 * gutter + punctW + gutter,
    y: rowHeight * 3 + gutter * 2,
    width: punctW,
    height: rowHeight * 0.95,
    type: 'punct'
  });

  keys.push({
    id: 'key-inline-colon',
    label: activeApp === 'safari' ? '/' : ':',
    flickLabel: '?',
    x: gutter + modeW + 2 * iconW + 3 * gutter + 2 * punctW + 2 * gutter,
    y: rowHeight * 3 + gutter * 2,
    width: punctW,
    height: rowHeight * 0.95,
    type: 'punct'
  });

  keys.push({
    id: 'key-space',
    label: 'space',
    x: gutter + modeW + 2 * iconW + 3 * gutter + 3 * punctW + 3 * gutter,
    y: rowHeight * 3 + gutter * 2,
    width: spaceW,
    height: rowHeight * 0.95,
    type: 'space'
  });

  keys.push({
    id: 'key-return',
    label: returnLabel,
    x: W - returnW - gutter,
    y: rowHeight * 3 + gutter * 2,
    width: returnW,
    height: rowHeight * 0.95,
    type: 'return'
  });

  return keys;
}

// -------------------------------------------------------------
// 4. NUMERIC SHEET (123 LAYER)
// -------------------------------------------------------------
function generateNumericSheet(
  W: number,
  H: number,
  gutter: number,
  returnLabel: string
): KeyDefinition[] {
  const keys: KeyDefinition[] = [];
  const rowHeight = (H - 4 * gutter) / 4;

  const r1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const keyW1 = (W - 11 * gutter) / 10;
  r1.forEach((ch, i) => {
    keys.push({
      id: `num-${ch}`,
      label: ch,
      x: gutter + i * (keyW1 + gutter),
      y: gutter * 2,
      width: keyW1,
      height: rowHeight * 0.95,
      type: 'char'
    });
  });

  const r2 = ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'];
  const keyW2 = (W - 11 * gutter) / 10;
  r2.forEach((ch, i) => {
    keys.push({
      id: `sym1-${i}`,
      label: ch,
      x: gutter + i * (keyW2 + gutter),
      y: rowHeight + gutter * 2,
      width: keyW2,
      height: rowHeight * 0.95,
      type: 'char'
    });
  });

  const sideW = W * 0.14;
  keys.push({
    id: 'key-symbol-shift',
    label: '#+=',
    x: gutter,
    y: rowHeight * 2 + gutter * 2,
    width: sideW,
    height: rowHeight * 0.95,
    type: 'special'
  });

  const r3 = ['.', ',', '?', '!', "'"];
  const keyW3 = (W - 2 * sideW - 7 * gutter) / 5;
  r3.forEach((ch, i) => {
    keys.push({
      id: `sym2-${i}`,
      label: ch,
      x: gutter + sideW + gutter + i * (keyW3 + gutter),
      y: rowHeight * 2 + gutter * 2,
      width: keyW3,
      height: rowHeight * 0.95,
      type: 'punct'
    });
  });

  keys.push({
    id: 'key-backspace',
    label: '⌫',
    x: W - sideW - gutter,
    y: rowHeight * 2 + gutter * 2,
    width: sideW,
    height: rowHeight * 0.95,
    type: 'backspace'
  });

  const abcW = W * 0.16;
  const iconW = W * 0.09;
  const returnW = W * 0.20;
  const spaceW = W - abcW - 2 * iconW - returnW - 6 * gutter;

  keys.push({
    id: 'key-mode-abc',
    label: 'ABC',
    x: gutter,
    y: rowHeight * 3 + gutter * 2,
    width: abcW,
    height: rowHeight * 0.95,
    type: 'mode'
  });

  keys.push({
    id: 'key-globe',
    label: '🌐',
    x: gutter + abcW + gutter,
    y: rowHeight * 3 + gutter * 2,
    width: iconW,
    height: rowHeight * 0.95,
    type: 'globe'
  });

  keys.push({
    id: 'key-emoji',
    label: '😀',
    x: gutter + abcW + iconW + 2 * gutter,
    y: rowHeight * 3 + gutter * 2,
    width: iconW,
    height: rowHeight * 0.95,
    type: 'emoji'
  });

  keys.push({
    id: 'key-space',
    label: 'space',
    x: gutter + abcW + 2 * iconW + 3 * gutter,
    y: rowHeight * 3 + gutter * 2,
    width: spaceW,
    height: rowHeight * 0.95,
    type: 'space'
  });

  keys.push({
    id: 'key-return',
    label: returnLabel,
    x: W - returnW - gutter,
    y: rowHeight * 3 + gutter * 2,
    width: returnW,
    height: rowHeight * 0.95,
    type: 'return'
  });

  return keys;
}

// -------------------------------------------------------------
// 5. ADVANCED SYMBOL SHEET (#+= LAYER)
// -------------------------------------------------------------
function generateSymbolSheet(
  W: number,
  H: number,
  gutter: number,
  returnLabel: string
): KeyDefinition[] {
  const keys: KeyDefinition[] = [];
  const rowHeight = (H - 4 * gutter) / 4;

  const r1 = ['[', ']', '{', '}', '#', '%', '^', '*', '+', '='];
  const keyW1 = (W - 11 * gutter) / 10;
  r1.forEach((ch, i) => {
    keys.push({
      id: `adv1-${i}`,
      label: ch,
      x: gutter + i * (keyW1 + gutter),
      y: gutter * 2,
      width: keyW1,
      height: rowHeight * 0.95,
      type: 'char'
    });
  });

  const r2 = ['_', '\\', '|', '~', '<', '>', '€', '£', '¥', '•'];
  const keyW2 = (W - 11 * gutter) / 10;
  r2.forEach((ch, i) => {
    keys.push({
      id: `adv2-${i}`,
      label: ch,
      x: gutter + i * (keyW2 + gutter),
      y: rowHeight + gutter * 2,
      width: keyW2,
      height: rowHeight * 0.95,
      type: 'char'
    });
  });

  const sideW = W * 0.14;
  keys.push({
    id: 'key-numeric-shift',
    label: '123',
    x: gutter,
    y: rowHeight * 2 + gutter * 2,
    width: sideW,
    height: rowHeight * 0.95,
    type: 'special'
  });

  const r3 = ['.', ',', '?', '!', "'"];
  const keyW3 = (W - 2 * sideW - 7 * gutter) / 5;
  r3.forEach((ch, i) => {
    keys.push({
      id: `adv3-${i}`,
      label: ch,
      x: gutter + sideW + gutter + i * (keyW3 + gutter),
      y: rowHeight * 2 + gutter * 2,
      width: keyW3,
      height: rowHeight * 0.95,
      type: 'punct'
    });
  });

  keys.push({
    id: 'key-backspace',
    label: '⌫',
    x: W - sideW - gutter,
    y: rowHeight * 2 + gutter * 2,
    width: sideW,
    height: rowHeight * 0.95,
    type: 'backspace'
  });

  const abcW = W * 0.16;
  const iconW = W * 0.09;
  const returnW = W * 0.20;
  const spaceW = W - abcW - 2 * iconW - returnW - 6 * gutter;

  keys.push({
    id: 'key-mode-abc',
    label: 'ABC',
    x: gutter,
    y: rowHeight * 3 + gutter * 2,
    width: abcW,
    height: rowHeight * 0.95,
    type: 'mode'
  });

  keys.push({
    id: 'key-globe',
    label: '🌐',
    x: gutter + abcW + gutter,
    y: rowHeight * 3 + gutter * 2,
    width: iconW,
    height: rowHeight * 0.95,
    type: 'globe'
  });

  keys.push({
    id: 'key-emoji',
    label: '😀',
    x: gutter + abcW + iconW + 2 * gutter,
    y: rowHeight * 3 + gutter * 2,
    width: iconW,
    height: rowHeight * 0.95,
    type: 'emoji'
  });

  keys.push({
    id: 'key-space',
    label: 'space',
    x: gutter + abcW + 2 * iconW + 3 * gutter,
    y: rowHeight * 3 + gutter * 2,
    width: spaceW,
    height: rowHeight * 0.95,
    type: 'space'
  });

  keys.push({
    id: 'key-return',
    label: returnLabel,
    x: W - returnW - gutter,
    y: rowHeight * 3 + gutter * 2,
    width: returnW,
    height: rowHeight * 0.95,
    type: 'return'
  });

  return keys;
}
