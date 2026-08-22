import { SmartReply, WritingToolTone } from '../types/keyboard';

export class AppleIntelligenceModel {
  /**
   * Generates conversational Smart Replies based on the partner's incoming message
   */
  public generateSmartReplies(incomingMessage: string): SmartReply[] {
    const lower = incomingMessage.toLowerCase();

    if (lower.includes('keyboard') || lower.includes('typos') || lower.includes('feel')) {
      return [
        { id: '1', text: "It's so much more accurate!", category: 'direct' },
        { id: '2', text: "Barely making any typos now! 🎉", category: 'casual' },
        { id: '3', text: "The large finger mode is amazing.", category: 'polite' }
      ];
    }

    if (lower.includes('dinner') || lower.includes('lunch') || lower.includes('food') || lower.includes('eat')) {
      return [
        { id: '1', text: "Almost ready, see you soon!", category: 'direct' },
        { id: '2', text: "Starving! On my way now. 🍕", category: 'casual' },
        { id: '3', text: "Running about 5 minutes behind.", category: 'polite' }
      ];
    }

    if (lower.includes('where') || lower.includes('running late') || lower.includes('arrive')) {
      return [
        { id: '1', text: "Just parked outside!", category: 'direct' },
        { id: '2', text: "In traffic, be there in 10!", category: 'casual' },
        { id: '3', text: "On the train right now.", category: 'polite' }
      ];
    }

    // Default smart conversational replies
    return [
      { id: '1', text: "Sounds good to me!", category: 'direct' },
      { id: '2', text: "Got it, thanks! 👍", category: 'casual' },
      { id: '3', text: "Let me check and get back to you.", category: 'polite' }
    ];
  }

  /**
   * Apple Intelligence Writing Tool: Proofread & Fix Typos
   */
  public proofreadAndCorrect(text: string): { corrected: string; changesCount: number } {
    if (!text.trim()) return { corrected: text, changesCount: 0 };

    let result = text;
    let changes = 0;

    // Common large-finger substitutions and texting slang expansion
    const typoReplacements: [RegExp, string][] = [
      [/\bim\b/gi, "I'm"],
      [/\bidk\b/gi, "I don't know"],
      [/\bomw\b/gi, "on my way"],
      [/\bthx\b/gi, "thanks"],
      [/\bpls\b/gi, "please"],
      [/\bcant\b/gi, "can't"],
      [/\bdont\b/gi, "don't"],
      [/\bwont\b/gi, "won't"],
      [/\bruning\b/gi, "running"],
      [/\bmeetng\b/gi, "meeting"],
      [/\btonite\b/gi, "tonight"],
      [/\btomoro\b/gi, "tomorrow"],
      [/\bkeybaord\b/gi, "keyboard"],
      [/\befficiency\b/gi, "efficiency"],
      [/\baccurcy\b/gi, "accuracy"],
      [/\bteh\b/gi, "the"],
      [/\bfo\b/gi, "for"],
      [/\bsoo\b/gi, "soon"],
      [/\bse\b/gi, "see"]
    ];

    for (const [regex, replacement] of typoReplacements) {
      if (regex.test(result)) {
        result = result.replace(regex, replacement);
        changes++;
      }
    }

    // Capitalize first letter of sentence
    result = result.replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, prefix, char) => {
      changes++;
      return prefix + char.toUpperCase();
    });

    // Ensure terminal punctuation if missing
    if (result.length > 3 && !/[.!?]$/.test(result.trim())) {
      result = result.trim() + ".";
      changes++;
    }

    return { corrected: result, changesCount: Math.max(1, changes) };
  }

  /**
   * Apple Intelligence Writing Tool: Tone Rewrite
   */
  public rewriteTone(text: string, tone: WritingToolTone): string {
    const clean = text.trim().replace(/[.!?]+$/, "");
    if (!clean) return text;

    switch (tone) {
      case 'friendly':
        return `Hey! ${clean}! Looking forward to it 😊`;
      case 'professional':
        return `Please be advised: ${clean.charAt(0).toUpperCase() + clean.slice(1)}. Thank you.`;
      case 'concise':
        return `${clean.charAt(0).toUpperCase() + clean.slice(1)}.`;
    }
  }

  /**
   * Apple Intelligence Mashed-Word Disentangler
   * Separates continuous unspaced strings typed with large fingers
   */
  public disentangleMashedWords(input: string): string {
    const dictionary = [
      "thanks", "for", "reaching", "out", "will", "call", "you", "back", "soon",
      "hey", "are", "ready", "dinner", "tonight", "please", "let", "me", "know",
      "on", "my", "way", "see", "at", "the", "coffee", "shop", "tomorrow", "morning",
      "how", "is", "it", "going", "love", "this", "new", "keyboard", "so", "much",
      "large", "fingers", "make", "texting", "easy", "now", "running", "late"
    ];

    const tokens = input.split(/\s+/);
    const resolvedTokens: string[] = [];

    for (const token of tokens) {
      const lower = token.toLowerCase().replace(/[^a-z]/g, "");
      if (lower.length > 8) {
        // Attempt dynamic segmentation
        let segmented = "";
        let remaining = lower;
        let foundWord = true;

        while (remaining.length > 0 && foundWord) {
          foundWord = false;
          // Try longest prefix matching against dictionary
          for (let len = Math.min(12, remaining.length); len >= 2; len--) {
            const prefix = remaining.slice(0, len);
            if (dictionary.includes(prefix)) {
              segmented += (segmented ? " " : "") + prefix;
              remaining = remaining.slice(len);
              foundWord = true;
              break;
            }
          }
        }

        if (remaining.length === 0 && segmented) {
          resolvedTokens.push(segmented);
          continue;
        }
      }
      resolvedTokens.push(token);
    }

    const output = resolvedTokens.join(" ");
    return output.charAt(0).toUpperCase() + output.slice(1);
  }

  /**
   * Simulates AI Dictation stream with punctuation auto-repair
   */
  public getSimulatedDictationPhrases(): string[] {
    return [
      "Hey I just tested the large finger keyboard layout and it is super smooth.",
      "On my way to the restaurant right now see you in five minutes.",
      "The dynamic hit boxes make typing so much faster without having to backspace.",
      "Can you send me the address again thanks."
    ];
  }
}
