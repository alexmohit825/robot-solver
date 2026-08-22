//
//  AdaptiveTouchMap.swift
//  ErgosKeyboardExtension
//
//  Continuous Online Bayesian Touch Centroid & Variance Learning Engine on native iOS.
//

import UIKit

public struct KeyCalibration: Codable {
    public var offsetX: CGFloat
    public var offsetY: CGFloat
    public var varianceX: CGFloat
    public var varianceY: CGFloat
    public var sampleCount: Int
    public var correctionCount: Int
}

public final class AdaptiveTouchMap {
    public static let shared = AdaptiveTouchMap()
    
    private var calibrations: [String: KeyCalibration] = [:]
    private let learningRate: CGFloat = 0.20
    private let userDefaultsKey = "ErgosKey_AdaptiveCalibration"
    
    public init() {
        loadPersistedCalibrations()
    }
    
    /// Returns personalized adjusted center for key
    public func adjustedCenter(for key: KeyDefinition) -> CGPoint {
        let baseCenter = CGPoint(x: key.frame.midX, y: key.frame.midY)
        guard let cal = calibrations[key.identifier], cal.sampleCount >= 2 else {
            return baseCenter
        }
        return CGPoint(x: baseCenter.x + cal.offsetX, y: baseCenter.y + cal.offsetY)
    }
    
    /// Records normal keystroke and shifts key centroid via Exponential Moving Average
    public func recordKeystroke(key: KeyDefinition, touchLocation: CGPoint) {
        let baseCenter = CGPoint(x: key.frame.midX, y: key.frame.midY)
        let diffX = touchLocation.x - baseCenter.x
        let diffY = touchLocation.y - baseCenter.y
        
        var cal = calibrations[key.identifier] ?? KeyCalibration(
            offsetX: 0, offsetY: 0, varianceX: key.frame.width * 0.45, varianceY: key.frame.height * 0.50, sampleCount: 0, correctionCount: 0
        )
        
        let alpha = min(learningRate, 1.0 / CGFloat(cal.sampleCount + 1))
        cal.offsetX = cal.offsetX + alpha * (diffX - cal.offsetX)
        cal.offsetY = cal.offsetY + alpha * (diffY - cal.offsetY)
        cal.sampleCount += 1
        
        calibrations[key.identifier] = cal
        persistCalibrations()
    }
    
    /// Triggered when user backspaces mistakenKey and immediately types correctedKey
    public func recordCorrection(mistakenKey: KeyDefinition, correctedKey: KeyDefinition, initialTouch: CGPoint) {
        let baseCenter = CGPoint(x: correctedKey.frame.midX, y: correctedKey.frame.midY)
        let trueIntentDiffX = initialTouch.x - baseCenter.x
        let trueIntentDiffY = initialTouch.y - baseCenter.y
        
        var cal = calibrations[correctedKey.identifier] ?? KeyCalibration(
            offsetX: 0, offsetY: 0, varianceX: correctedKey.frame.width * 0.55, varianceY: correctedKey.frame.height * 0.60, sampleCount: 0, correctionCount: 0
        )
        
        let correctionAlpha = min(0.40, learningRate * 1.8)
        cal.offsetX = cal.offsetX + correctionAlpha * (trueIntentDiffX - cal.offsetX)
        cal.offsetY = cal.offsetY + correctionAlpha * (trueIntentDiffY - cal.offsetY)
        cal.sampleCount += 1
        cal.correctionCount += 1
        
        calibrations[correctedKey.identifier] = cal
        persistCalibrations()
    }
    
    private func persistCalibrations() {
        if let data = try? JSONEncoder().encode(calibrations) {
            UserDefaults.standard.set(data, forKey: userDefaultsKey)
        }
    }
    
    private func loadPersistedCalibrations() {
        if let data = UserDefaults.standard.data(forKey: userDefaultsKey),
           let decoded = try? JSONDecoder().decode([String: KeyCalibration].self, from: data) {
            self.calibrations = decoded
        }
    }
}
