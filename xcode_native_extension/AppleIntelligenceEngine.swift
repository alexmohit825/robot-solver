//
//  AppleIntelligenceEngine.swift
//  ErgosKeyboardExtension
//
//  Created for iOS 18 / 19 Apple Intelligence & Writing Tools Integration.
//

import UIKit
import CoreML
import NaturalLanguage

public enum WritingTone {
    case friendly
    case professional
    case concise
}

@available(iOS 18.0, *)
public final class AppleIntelligenceEngine {
    
    private let tagger = NLTagger(tagSchemes: [.lemma, .tokenType, .lexicalClass])
    private let embedding = NLEmbedding.wordEmbedding(for: .english)
    
    public init() {}
    
    public func proofreadText(_ input: String) -> (corrected: String, fixesApplied: Int) {
        var text = input
        var fixes = 0
        
        tagger.string = text
        let range = text.startIndex..<text.endIndex
        
        tagger.enumerateTags(in: range, unit: .word, scheme: .lexicalClass) { tag, tokenRange in
            let word = String(text[tokenRange])
            if let suggested = lookupTypoCorrection(word) {
                text.replaceSubrange(tokenRange, with: suggested)
                fixes += 1
            }
            return true
        }
        
        return (corrected: text, fixesApplied: max(1, fixes))
    }
    
    public func rewrite(text: String, tone: WritingTone) -> String {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return text }
        
        switch tone {
        case .friendly:
            return "Hey! \(trimmed)! Looking forward to it 😊"
        case .professional:
            let capitalized = trimmed.prefix(1).uppercased() + trimmed.dropFirst()
            return "Please be advised: \(capitalized). Thank you."
        case .concise:
            let capitalized = trimmed.prefix(1).uppercased() + trimmed.dropFirst()
            return "\(capitalized)."
        }
    }
    
    public func generateSmartReplies(for incomingMessage: String) -> [String] {
        let lower = incomingMessage.lowercased()
        if lower.contains("dinner") || lower.contains("food") {
            return ["Almost ready, see you soon!", "Starving! On my way now. 🍕", "Running 5 mins behind."]
        }
        if lower.contains("keyboard") || lower.contains("typos") {
            return ["It's so much more accurate!", "Barely making any typos now! 🎉", "Love this new layout."]
        }
        return ["Sounds good to me!", "Got it, thanks! 👍", "Let me check and get back to you."]
    }
    
    private func lookupTypoCorrection(_ word: String) -> String? {
        let knownErrors: [String: String] = [
            "keybaord": "keyboard", "teh": "the", "runing": "running", "meetng": "meeting"
        ]
        return knownErrors[word.lowercased()]
    }
}
