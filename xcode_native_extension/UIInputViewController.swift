//
//  UIInputViewController.swift
//  ErgosKeyboardExtension
//
//  Main iOS Keyboard Extension View Controller for iPhone 17 Pro.
//

import UIKit
import CoreHaptics

public class KeyboardViewController: UIInputViewController {
    
    // MARK: - Core Engines
    private let spatialEngine = SpatialTouchEngine()
    private let languageModel = ProbabilisticTrie()
    private let adaptiveMap = AdaptiveTouchMap.shared
    private let soundHapticManager = HapticAndSoundManager.shared
    private let mediaManager = MediaAttachmentManager.shared
    
    // Apple Intelligence Foundation Bridge (iOS 18/19)
    private var aiEngine: Any?
    
    // MARK: - State & Layout
    private var currentLayout: KeyboardLayout = .twoHandedArc
    private var currentLayer: KeyboardLayer = .alpha
    private var isAIEnabled: Bool = true
    
    // Keystroke Error Tracking
    private var lastKeystroke: (key: KeyDefinition, touchLocation: CGPoint, timestamp: Date)?
    private var lastBackspaceTime: Date?
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupAppleIntelligence()
    }
    
    public override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        // Responsive recalculation for iPhone 17 Pro (402pt) & 17 Pro Max (440pt)
        spatialEngine.updateGeometry(bounds: view.bounds, mode: currentLayout)
    }
    
    private func setupUI() {
        view.backgroundColor = UIColor(red: 0.08, green: 0.10, blue: 0.14, alpha: 1.0)
    }
    
    private func setupAppleIntelligence() {
        if #available(iOS 18.0, *) {
            self.aiEngine = AppleIntelligenceEngine()
        }
    }
    
    // MARK: - Touch Handling with Capacitive Ellipse & Adaptive Learning
    public override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
        guard let touch = touches.first else { return }
        let location = touch.location(in: view)
        let majorRadius = touch.majorRadius
        let tolerance = touch.majorRadiusTolerance
        let context = textDocumentProxy.documentContextBeforeInput ?? ""
        
        let result = spatialEngine.evaluateHit(
            point: location,
            majorRadius: majorRadius,
            tolerance: tolerance,
            context: context
        )
        
        processKeyHit(key: result.selectedKey, touchLocation: location)
    }
    
    private func processKeyHit(key: KeyDefinition, touchLocation: CGPoint) {
        soundHapticManager.playStandardClick(isSoundEnabled: true)
        soundHapticManager.triggerHapticFeedback(isHapticEnabled: true, style: .light)
        
        switch key.type {
        case .character(let char):
            // Check if user is correcting a recent backspace mistake
            if let last = lastKeystroke, let bTime = lastBackspaceTime, Date().timeIntervalSince(bTime) < 2.5 {
                adaptiveMap.recordCorrection(mistakenKey: last.key, correctedKey: key, initialTouch: last.touchLocation)
                lastBackspaceTime = nil
            } else {
                adaptiveMap.recordKeystroke(key: key, touchLocation: touchLocation)
            }
            
            lastKeystroke = (key: key, touchLocation: touchLocation, timestamp: Date())
            textDocumentProxy.insertText(char)
            
        case .backspace:
            lastBackspaceTime = Date()
            textDocumentProxy.deleteBackward()
            
        case .space:
            lastKeystroke = (key: key, touchLocation: touchLocation, timestamp: Date())
            textDocumentProxy.insertText(" ")
            
        case .returnKey:
            textDocumentProxy.insertText("\n")
            
        case .globeTrigger:
            if needsInputModeSwitchKey {
                advanceToNextInputMode()
            }
            
        default:
            break
        }
    }
}
