//
//  HapticAndSoundManager.swift
//  ErgosKeyboardExtension
//
//  Created for native iOS Haptics, Audio Keystroke Clicks, and Tactile Motors.
//

import UIKit
import AudioToolbox

public final class HapticAndSoundManager: NSObject, UIInputViewAudioFeedback {
    
    public static let shared = HapticAndSoundManager()
    
    // UIInputViewAudioFeedback requirement to allow keyboard clicks
    public var enableInputClicksWhenVisible: Bool {
        return true
    }
    
    private let lightImpact = UIImpactFeedbackGenerator(style: .light)
    private let mediumImpact = UIImpactFeedbackGenerator(style: .medium)
    private let selectionFeedback = UISelectionFeedbackGenerator()
    
    public override init() {
        super.init()
        lightImpact.prepare()
        mediumImpact.prepare()
        selectionFeedback.prepare()
    }
    
    /// Triggers native iOS mechanical keyboard click sound
    public func playStandardClick(isSoundEnabled: Bool) {
        guard isSoundEnabled else { return }
        UIDevice.current.playInputClick()
    }
    
    /// Triggers native tactile haptic pulse on iPhone Taptic Engine
    public func triggerHapticFeedback(isHapticEnabled: Bool, style: UIImpactFeedbackGenerator.FeedbackStyle = .light) {
        guard isHapticEnabled else { return }
        switch style {
        case .light:
            lightImpact.impactOccurred()
        case .medium:
            mediumImpact.impactOccurred()
        default:
            mediumImpact.impactOccurred()
        }
    }
}
