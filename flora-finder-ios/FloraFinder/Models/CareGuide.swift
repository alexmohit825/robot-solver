import Foundation
import SwiftUI

/// Structured plant care requirements and localized environmental targets.
public struct CareGuide: Identifiable, Codable, Equatable {
    public let id: UUID
    public let targetLuxMin: Double
    public let targetLuxMax: Double
    public let temperatureMinCelsius: Double
    public let temperatureMaxCelsius: Double
    public let targetHumidityPercentMin: Double
    public let targetHumidityPercentMax: Double
    public let soilPhRange: String
    public let wateringTechnique: String
    public let fertilizationSchedule: String
    public let propagationMethod: String

    public init(
        id: UUID = UUID(),
        targetLuxMin: Double = 1500,
        targetLuxMax: Double = 5000,
        temperatureMinCelsius: Double = 18.0,
        temperatureMaxCelsius: Double = 29.0,
        targetHumidityPercentMin: Double = 60.0,
        targetHumidityPercentMax: Double = 80.0,
        soilPhRange: String = "5.5 - 7.0 (Slightly Acidic)",
        wateringTechnique: String = "Allow top 2-3 inches of soil to dry out completely before deep soaking. Drain saucer to avoid root rot.",
        fertilizationSchedule: String = "Balanced liquid fertilizer (20-20-20) diluted to half-strength once monthly during spring/summer active growth.",
        propagationMethod: String = "Stem cuttings with at least one node and aerial root submerged in clean water or sphagnum moss."
    ) {
        self.id = id
        self.targetLuxMin = targetLuxMin
        self.targetLuxMax = targetLuxMax
        self.temperatureMinCelsius = temperatureMinCelsius
        self.temperatureMaxCelsius = temperatureMaxCelsius
        self.targetHumidityPercentMin = targetHumidityPercentMin
        self.targetHumidityPercentMax = targetHumidityPercentMax
        self.soilPhRange = soilPhRange
        self.wateringTechnique = wateringTechnique
        self.fertilizationSchedule = fertilizationSchedule
        self.propagationMethod = propagationMethod
    }
}
