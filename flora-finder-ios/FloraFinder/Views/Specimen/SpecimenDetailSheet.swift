import SwiftUI

/// Glassmorphic Botanical Specimen Sheet presenting comprehensive taxonomy, care guidelines, and conversational AI assistance.
public struct SpecimenDetailSheet: View {
    public let specimen: BotanicalSpecimen
    @ObservedObject var geminiService: GeminiBotanicalService = GeminiBotanicalService.shared

    @State private var userQuestion: String = ""
    @State private var chatHistory: [BotanicalChatMessage] = []
    @State private var isAskingAI: Bool = false
    @State private var isSavedToJournal: Bool = false

    @Environment(\.dismiss) private var dismiss

    public init(specimen: BotanicalSpecimen) {
        self.specimen = specimen
    }

    public var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    // Header Card
                    VStack(alignment: .leading, spacing: 6) {
                        HStack {
                            Text(specimen.commonName)
                                .font(.system(size: 26, weight: .bold, design: .rounded))
                                .foregroundColor(.primary)
                            Spacer()
                            // Confidence Tag
                            Text("\(Int(specimen.confidence * 100))% Match")
                                .font(.system(size: 12, weight: .bold))
                                .padding(.horizontal, 10)
                                .padding(.vertical, 5)
                                .background(Color.green.opacity(0.15))
                                .foregroundColor(.green)
                                .clipShape(Capsule())
                        }

                        Text(specimen.scientificName)
                            .font(.system(size: 16, weight: .medium, design: .serif))
                            .italic()
                            .foregroundColor(.secondary)

                        Text("Family: \(specimen.family)")
                            .font(.system(size: 13, weight: .regular))
                            .foregroundColor(.secondary)
                    }
                    .padding()
                    .background(Color(.secondarySystemBackground))
                    .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))

                    // Key Environmental Indicators
                    HStack(spacing: 12) {
                        IndicatorPill(
                            icon: specimen.lightRequirement.iconName,
                            title: "Light",
                            subtitle: specimen.lightRequirement.rawValue,
                            color: .yellow
                        )
                        IndicatorPill(
                            icon: "drop.fill",
                            title: "Water",
                            subtitle: "Every \(specimen.waterFrequencyDays) days",
                            color: .blue
                        )
                    }

                    // Pet Toxicity Card
                    HStack(alignment: .top, spacing: 14) {
                        Image(systemName: specimen.petToxicity.isSafe ? "pawprint.fill" : "exclamationmark.triangle.fill")
                            .font(.system(size: 22))
                            .foregroundColor(specimen.petToxicity.badgeColor)

                        VStack(alignment: .leading, spacing: 4) {
                            Text(specimen.petToxicity.displayLabel)
                                .font(.system(size: 15, weight: .bold))
                                .foregroundColor(specimen.petToxicity.badgeColor)

                            if case .toxicToPets(let reason) = specimen.petToxicity {
                                Text(reason)
                                    .font(.system(size: 13))
                                    .foregroundColor(.secondary)
                            }
                        }
                    }
                    .padding()
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(specimen.petToxicity.badgeColor.opacity(0.1))
                    .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))

                    // Soil & Habitat Overview
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Botanical Profile")
                            .font(.system(size: 18, weight: .bold, design: .rounded))

                        Text(specimen.summaryDescription)
                            .font(.system(size: 14))
                            .foregroundColor(.secondary)
                            .lineSpacing(3)

                        Divider()

                        HStack {
                            Image(systemName: "globe.americas.fill")
                                .foregroundColor(.green)
                            Text("Native Origin: ")
                                .font(.system(size: 13, weight: .semibold))
                            Text(specimen.nativeRegion)
                                .font(.system(size: 13))
                                .foregroundColor(.secondary)
                        }

                        HStack {
                            Image(systemName: "square.stack.3d.down.right.fill")
                                .foregroundColor(.brown)
                            Text("Soil Blend: ")
                                .font(.system(size: 13, weight: .semibold))
                            Text(specimen.soilType)
                                .font(.system(size: 13))
                                .foregroundColor(.secondary)
                        }
                    }
                    .padding()
                    .background(Color(.secondarySystemBackground))
                    .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))

                    // Gemini Conversational Care Assistant
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Image(systemName: "sparkles")
                                .foregroundColor(.purple)
                            Text("Ask AI Botanist (Gemini 2.0 Flash)")
                                .font(.system(size: 17, weight: .bold, design: .rounded))
                        }

                        ForEach(chatHistory) { msg in
                            HStack {
                                if msg.isUser { Spacer() }
                                Text(msg.text)
                                    .font(.system(size: 14))
                                    .padding(.horizontal, 14)
                                    .padding(.vertical, 10)
                                    .background(msg.isUser ? Color.accentColor : Color(.tertiarySystemBackground))
                                    .foregroundColor(msg.isUser ? .white : .primary)
                                    .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                                if !msg.isUser { Spacer() }
                            }
                        }

                        if isAskingAI {
                            HStack {
                                ProgressView()
                                    .padding(.trailing, 6)
                                Text("Analyzing botanical context...")
                                    .font(.system(size: 13))
                                    .foregroundColor(.secondary)
                            }
                            .padding(.vertical, 4)
                        }

                        HStack {
                            TextField("Ask about watering, pruning, pests...", text: $userQuestion)
                                .textFieldStyle(RoundedBorderTextFieldStyle())

                            Button(action: sendGeminiQuestion) {
                                Image(systemName: "arrow.up.circle.fill")
                                    .font(.system(size: 28))
                                    .foregroundColor(userQuestion.isEmpty ? .gray : .purple)
                            }
                            .disabled(userQuestion.isEmpty || isAskingAI)
                        }
                    }
                    .padding()
                    .background(Color(.secondarySystemBackground))
                    .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))

                    // Bottom Save to Journal Action
                    Button(action: {
                        isSavedToJournal = true
                    }) {
                        HStack {
                            Image(systemName: isSavedToJournal ? "checkmark.circle.fill" : "bookmark.fill")
                            Text(isSavedToJournal ? "Saved to Field Journal" : "Save to Field Journal")
                                .fontWeight(.bold)
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(isSavedToJournal ? Color.gray : Color.green)
                        .foregroundColor(.white)
                        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                    }
                }
                .padding()
            }
            .navigationTitle("Specimen Details")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }

    private func sendGeminiQuestion() {
        let query = userQuestion
        userQuestion = ""
        chatHistory.append(BotanicalChatMessage(text: query, isUser: true))
        isAskingAI = true

        Task {
            do {
                let answer = try await geminiService.askCareAssistant(query: query, contextSpecimen: specimen)
                await MainActor.run {
                    chatHistory.append(BotanicalChatMessage(text: answer, isUser: false))
                    isAskingAI = false
                }
            } catch {
                await MainActor.run {
                    chatHistory.append(BotanicalChatMessage(text: "Error: \(error.localizedDescription)", isUser: false))
                    isAskingAI = false
                }
            }
        }
    }
}

public struct BotanicalChatMessage: Identifiable {
    public let id = UUID()
    public let text: String
    public let isUser: Bool
}

private struct IndicatorPill: View {
    let icon: String
    let title: String
    let subtitle: String
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Image(systemName: icon)
                    .foregroundColor(color)
                Text(title)
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(.secondary)
            }
            Text(subtitle)
                .font(.system(size: 13, weight: .semibold))
                .foregroundColor(.primary)
                .lineLimit(2)
                .minimumScaleFactor(0.8)
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.secondarySystemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
    }
}
