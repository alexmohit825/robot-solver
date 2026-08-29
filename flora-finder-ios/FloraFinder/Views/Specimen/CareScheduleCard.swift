import SwiftUI

/// Visual card displaying targeted environmental lux, temperature, and watering schedule.
public struct CareScheduleCard: View {
    public let careGuide: CareGuide

    public init(careGuide: CareGuide = CareGuide()) {
        self.careGuide = careGuide
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("Environmental Targets & Care")
                .font(.system(size: 17, weight: .bold, design: .rounded))

            // Sunlight & Lux Target
            HStack(spacing: 12) {
                Image(systemName: "sun.max.trianglebadge.exclamationmark.fill")
                    .font(.system(size: 24))
                    .foregroundColor(.yellow)

                VStack(alignment: .leading, spacing: 2) {
                    Text("Target Light Range")
                        .font(.system(size: 13, weight: .semibold))
                    Text("\(Int(careGuide.targetLuxMin)) - \(Int(careGuide.targetLuxMax)) Lux (Indirect)")
                        .font(.system(size: 12))
                        .foregroundColor(.secondary)
                }
            }

            // Temperature & Humidity
            HStack(spacing: 12) {
                Image(systemName: "thermometer.medium")
                    .font(.system(size: 24))
                    .foregroundColor(.orange)

                VStack(alignment: .leading, spacing: 2) {
                    Text("Ideal Temperature & Humidity")
                        .font(.system(size: 13, weight: .semibold))
                    Text("\(Int(careGuide.temperatureMinCelsius))°C - \(Int(careGuide.temperatureMaxCelsius))°C | \(Int(careGuide.targetHumidityPercentMin))% - \(Int(careGuide.targetHumidityPercentMax))% RH")
                        .font(.system(size: 12))
                        .foregroundColor(.secondary)
                }
            }

            // Soil pH Target
            HStack(spacing: 12) {
                Image(systemName: "drop.degreesign.fill")
                    .font(.system(size: 24))
                    .foregroundColor(.cyan)

                VStack(alignment: .leading, spacing: 2) {
                    Text("Target Soil pH")
                        .font(.system(size: 13, weight: .semibold))
                    Text(careGuide.soilPhRange)
                        .font(.system(size: 12))
                        .foregroundColor(.secondary)
                }
            }
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.secondarySystemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
    }
}
