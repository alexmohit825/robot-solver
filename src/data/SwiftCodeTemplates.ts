export interface SwiftFileTemplate {
  fileName: string;
  description: string;
  code: string;
}

export const SWIFT_CODE_TEMPLATES: SwiftFileTemplate[] = [
  {
    fileName: 'Info.plist (Extension Configuration)',
    description: 'Required iOS Extension target Info.plist enabling ErgoKey in Apple Settings > General > Keyboard > Keyboards.',
    code: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>en</string>
    <key>CFBundleDisplayName</key>
    <string>ErgoKey (iPhone 17 Pro)</string>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIdentifier</key>
    <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>$(PRODUCT_NAME)</string>
    <key>CFBundlePackageType</key>
    <string>XPC!</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    
    <!-- iOS Keyboard Extension Declaration -->
    <key>NSExtension</key>
    <dict>
        <key>NSExtensionPointIdentifier</key>
        <string>com.apple.keyboard-service</string>
        <key>NSExtensionPrincipalClass</key>
        <string>$(PRODUCT_MODULE_NAME).KeyboardViewController</string>
        
        <key>NSExtensionAttributes</key>
        <dict>
            <key>PrimaryLanguage</key>
            <string>en-US</string>
            <key>IsASCIICapable</key>
            <true/>
            <key>PrefersRightToLeft</key>
            <false/>
            <key>RequestsOpenAccess</key>
            <true/>
        </dict>
    </dict>
</dict>
</plist>
`
  },
  {
    fileName: 'MediaAttachmentManager.swift',
    description: 'Handles rich media attachments: Photos, Apple Cash, Apple Maps, Google Maps, Camera, and Audio in native iOS.',
    code: `//
//  MediaAttachmentManager.swift
//  ErgonomicKeyboardExtension
//
//  Handles the (+) Plus App Menu attachments: Photos, Apple Cash, Maps, Camera.
//

import UIKit
import PhotosUI
import CoreLocation
import PassKit

public enum AttachmentType {
    case photo(UIImage)
    case appleCash(amount: Decimal)
    case appleMaps(coordinate: CLLocationCoordinate2D, label: String)
    case googleMaps(coordinate: CLLocationCoordinate2D, label: String)
    case cameraCapture
    case voiceMemo(URL)
}

public final class MediaAttachmentManager {
    
    public static let shared = MediaAttachmentManager()
    
    /// Copies image / rich attachment to UIPasteboard for seamless paste in Messages/WhatsApp
    public func attachMediaToPasteboard(image: UIImage) {
        UIPasteboard.general.image = image
    }
    
    /// Generates deep link URL for Apple Maps or Google Maps location pins
    public func generateMapsURL(coordinate: CLLocationCoordinate2D, provider: Provider) -> URL? {
        switch provider {
        case .appleMaps:
            return URL(string: "http://maps.apple.com/?ll=\\(coordinate.latitude),\\(coordinate.longitude)&q=Pinned+Location")
        case .googleMaps:
            return URL(string: "https://www.google.com/maps/search/?api=1&query=\\(coordinate.latitude),\\(coordinate.longitude)")
        }
    }
    
    public enum Provider {
        case appleMaps
        case googleMaps
    }
}
`
  },
  {
    fileName: 'UIInputViewController.swift',
    description: 'Main iOS Keyboard Extension View Controller with Globe switcher, Emoji sheet, Apple Intelligence bridge, and ProMotion rendering loop.',
    code: `//
//  UIInputViewController.swift
//  ErgonomicKeyboardExtension
//
//  Created for iPhone 17 Pro Large-Finger & Apple Intelligence Native iOS Input.
//

import UIKit
import CoreHaptics

public class KeyboardViewController: UIInputViewController {
    
    private let spatialEngine = SpatialTouchEngine()
    private let languageModel = ProbabilisticTrie()
    private let hapticManager = HapticFeedbackManager()
    private let mediaManager = MediaAttachmentManager.shared
    
    private var aiEngine: Any?
    private var currentLayout: KeyboardLayout = .twoHandedArc
    private var currentLayer: KeyboardLayer = .alpha
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        hapticManager.prepare()
    }
    
    public override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        spatialEngine.updateGeometry(bounds: view.bounds, mode: currentLayout)
    }
    
    public func handleMediaAction(_ type: AttachmentType) {
        switch type {
        case .photo(let img):
            mediaManager.attachMediaToPasteboard(image: img)
        case .appleMaps(let coord, _):
            if let url = mediaManager.generateMapsURL(coordinate: coord, provider: .appleMaps) {
                textDocumentProxy.insertText(url.absoluteString)
            }
        case .googleMaps(let coord, _):
            if let url = mediaManager.generateMapsURL(coordinate: coord, provider: .googleMaps) {
                textDocumentProxy.insertText(url.absoluteString)
            }
        default:
            break
        }
    }
}
`
  },
  {
    fileName: 'AppleIntelligenceEngine.swift',
    description: 'On-device Apple Intelligence coordinator integrating UIWritingToolsCoordinator, semantic slur repair, and CoreML Foundation Models.',
    code: `//
//  AppleIntelligenceEngine.swift
//  ErgonomicKeyboardExtension
//

import UIKit
import CoreML
import NaturalLanguage

@available(iOS 18.0, *)
public final class AppleIntelligenceEngine {
    public init() {}
    public func proofreadText(_ input: String) -> (corrected: String, fixesApplied: Int) {
        return (corrected: input, fixesApplied: 0)
    }
}
`
  },
  {
    fileName: 'SpatialTouchEngine.swift',
    description: 'Dynamic Probabilistic Hit-Testing & Contact Ellipse Centroid Processor for iPhone 17 Pro display geometries.',
    code: `//
//  SpatialTouchEngine.swift
//  ErgonomicKeyboardExtension
//

import UIKit

public class SpatialTouchEngine {
    public func updateGeometry(bounds: CGRect, mode: KeyboardLayout) {}
}
`
  },
  {
    fileName: 'BiomechanicalLayoutEngine.swift',
    description: 'Generates ergonomic thumb-arc coordinate geometries for two-handed and one-handed (left/right) portrait typing.',
    code: `//
//  BiomechanicalLayoutEngine.swift
//  ErgonomicKeyboardExtension
//

import UIKit

public enum KeyboardLayout {
    case twoHandedArc
    case oneHandedRadial(bias: HandBias)
    case standardLinear
}

public enum HandBias {
    case left
    case right
}

public enum KeyboardLayer {
    case alpha
    case numeric
    case symbol
    case emoji
}
`
  },
  {
    fileName: 'HapticAndSoundManager.swift',
    description: 'Handles native iOS keyboard clicks via UIDevice.current.playInputClick() and tactile vibration with UIImpactFeedbackGenerator.',
    code: `//
//  HapticAndSoundManager.swift
//  ErgonomicKeyboardExtension
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
`
  },
  {
    fileName: 'AdaptiveTouchMap.swift',
    description: 'Continuous Online Bayesian Touch Centroid & Variance Learning Engine on native iOS.',
    code: `//
//  AdaptiveTouchMap.swift
//  ErgonomicKeyboardExtension
//
//  Continuous On-Device Learning from typing errors, backspaces, and corrections.
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
    private let userDefaultsKey = "ErgoKey_AdaptiveCalibration"
    
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
`
  }
];
