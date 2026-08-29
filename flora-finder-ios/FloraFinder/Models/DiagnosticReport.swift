import Foundation
import SwiftUI

/// Represents a clinical plant pathology diagnosis returned by Gemini Multimodal or on-device triage.
public struct DiagnosticReport: Identifiable, Codable, Equatable {
    public let id: UUID
    public let conditionName: String
    public let pathogenCategory: PathogenCategory
    public let severity: SeverityLevel
    public let confidenceScore: Double
    public let primarySymptoms: [String]
    public let treatmentProtocol: [TreatmentStep]
    public let preventionTips: [String]
    public let requiresImmediateQuarantine: Bool
    public let timestamp: Date

    public init(
        id: UUID = UUID(),
        conditionName: String,
        pathogenCategory: PathogenCategory,
        severity: SeverityLevel,
        confidenceScore: Double,
        primarySymptoms: [String],
        treatmentProtocol: [TreatmentStep],
        preventionTips: [String],
        requiresImmediateQuarantine: Bool,
        timestamp: Date = Date()
    ) {
        self.id = id
        self.conditionName = conditionName
        self.pathogenCategory = pathogenCategory
        self.severity = severity
        self.confidenceScore = confidenceScore
        self.primarySymptoms = primarySymptoms
        self.treatmentProtocol = treatmentProtocol
        self.preventionTips = preventionTips
        self.requiresImmediateQuarantine = requiresImmediateQuarantine
        self.timestamp = timestamp
    }

    public static let sampleDiagnostic = DiagnosticReport(
        conditionName: "Powdery Mildew (Erysiphales)",
        pathogenCategory: .fungal,
        severity: .moderate,
        confidenceScore: 0.94,
        primarySymptoms: [
            "White talcum-powder-like spots on upper leaf surfaces",
            "Leaf distortion and curling at outer margins",
            "Premature yellowing (chlorosis) and leaf drop"
        ],
        treatmentProtocol: [
            TreatmentStep(stepNumber: 1, title: "Isolate Specimen", instruction: "Move plant at least 6 feet away from other houseplants to halt airborne spore transfer."),
            TreatmentStep(stepNumber: 2, title: "Prune Infected Foliage", instruction: "Sterilize shears with 70% isopropyl alcohol and cut heavily infected leaves at petiole base."),
            TreatmentStep(stepNumber: 3, title: "Apply Organic Fungicide", instruction: "Spray neem oil solution or potassium bicarbonate (1 tsp/gallon water) across all foliage, including undersides.")
        ],
        preventionTips: [
            "Avoid overhead watering; irrigate strictly at the soil line.",
            "Increase ambient air circulation with a low-speed fan.",
            "Ensure minimum 4 hours of bright indirect sunlight daily."
        ],
        requiresImmediateQuarantine: true
    )
}

public enum PathogenCategory: String, Codable, CaseIterable {
    case fungal = "Fungal Infection"
    case bacterial = "Bacterial Blight"
    case pest = "Pest / Insect Infestation"
    case environmental = "Environmental / Abiotic Stress"
    case nutrient = "Nutrient Deficiency"
    case healthy = "Healthy Specimen"

    public var iconName: String {
        switch self {
        case .fungal: return "waveform.path.ecg"
        case .bacterial: return "allergens"
        case .pest: return "ant.fill"
        case .environmental: return "sun.max.trianglebadge.exclamationmark.fill"
        case .nutrient: return "drop.triangle.fill"
        case .healthy: return "checkmark.seal.fill"
        }
    }
}

public enum SeverityLevel: String, Codable, CaseIterable {
    case healthy = "Optimal Health"
    case mild = "Mild / Early Stage"
    case moderate = "Moderate Impact"
    case severe = "Critical / Severe"

    public var color: Color {
        switch self {
        case .healthy: return .green
        case .mild: return .blue
        case .moderate: return .orange
        case .severe: return .red
        }
    }
}

public struct TreatmentStep: Identifiable, Codable, Equatable {
    public let id: UUID
    public let stepNumber: Int
    public let title: String
    public let instruction: String

    public init(id: UUID = UUID(), stepNumber: Int, title: String, instruction: String) {
        self.id = id
        self.stepNumber = stepNumber
        self.title = title
        self.instruction = instruction
    }
}
