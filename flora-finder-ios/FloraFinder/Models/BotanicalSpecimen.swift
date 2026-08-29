import Foundation
import SwiftUI

/// Represents a botanical specimen identified by the on-device Vision/CoreML engine or Gemini API.
public struct BotanicalSpecimen: Identifiable, Codable, Equatable {
    public let id: UUID
    public let commonName: String
    public let scientificName: String
    public let family: String
    public let confidence: Double // 0.0 - 1.0
    public let nativeRegion: String
    public let petToxicity: PetToxicity
    public let lightRequirement: LightRequirement
    public let waterFrequencyDays: Int
    public let soilType: String
    public let summaryDescription: String
    public let identifiedOrgan: PlantOrgan
    public let timestamp: Date
    public var latitude: Double?
    public var longitude: Double?

    public init(
        id: UUID = UUID(),
        commonName: String,
        scientificName: String,
        family: String,
        confidence: Double,
        nativeRegion: String,
        petToxicity: PetToxicity,
        lightRequirement: LightRequirement,
        waterFrequencyDays: Int,
        soilType: String,
        summaryDescription: String,
        identifiedOrgan: PlantOrgan = .leaf,
        timestamp: Date = Date(),
        latitude: Double? = nil,
        longitude: Double? = nil
    ) {
        self.id = id
        self.commonName = commonName
        self.scientificName = scientificName
        self.family = family
        self.confidence = confidence
        self.nativeRegion = nativeRegion
        self.petToxicity = petToxicity
        self.lightRequirement = lightRequirement
        self.waterFrequencyDays = waterFrequencyDays
        self.soilType = soilType
        self.summaryDescription = summaryDescription
        self.identifiedOrgan = identifiedOrgan
        self.timestamp = timestamp
        self.latitude = latitude
        self.longitude = longitude
    }

    public static let sampleMonstera = BotanicalSpecimen(
        commonName: "Swiss Cheese Plant",
        scientificName: "Monstera deliciosa",
        family: "Araceae",
        confidence: 0.96,
        nativeRegion: "Tropical Rainforests of Southern Mexico & Central America",
        petToxicity: .toxicToPets(reason: "Contains insoluble calcium oxalates which cause oral irritation in cats & dogs"),
        lightRequirement: .brightIndirect,
        waterFrequencyDays: 7,
        soilType: "Peat-based, chunky aroid mix with perlite & orchid bark",
        summaryDescription: "Famous for its natural fenestrations (leaf holes), Monstera deliciosa is an epiphytic vine that climbs trees using aerial roots.",
        identifiedOrgan: .leaf
    )
}

public enum PlantOrgan: String, Codable, CaseIterable {
    case leaf = "Leaf"
    case flower = "Flower"
    case fruit = "Fruit"
    case bark = "Bark / Stem"
    case seedling = "Whole Plant"
}

public enum PetToxicity: Codable, Equatable {
    case safeForPets
    case toxicToPets(reason: String)
    case unknown

    public var isSafe: Bool {
        if case .safeForPets = self { return true }
        return false
    }

    public var displayLabel: String {
        switch self {
        case .safeForPets:
            return "Pet Safe (Non-Toxic)"
        case .toxicToPets:
            return "Toxic to Cats & Dogs"
        case .unknown:
            return "Toxicity Data Unknown"
        }
    }

    public var badgeColor: Color {
        switch self {
        case .safeForPets: return .green
        case .toxicToPets: return .red
        case .unknown: return .orange
        }
    }
}

public enum LightRequirement: String, Codable, CaseIterable {
    case directSun = "Direct Full Sunlight (6+ hrs)"
    case brightIndirect = "Bright Indirect Sunlight (4-6 hrs)"
    case mediumIndirect = "Medium Filtered Light"
    case lowLight = "Low / Shaded Ambient Light"

    public var iconName: String {
        switch self {
        case .directSun: return "sun.max.fill"
        case .brightIndirect: return "sun.and.horizon.fill"
        case .mediumIndirect: return "cloud.sun.fill"
        case .lowLight: return "cloud.fill"
        }
    }
}
