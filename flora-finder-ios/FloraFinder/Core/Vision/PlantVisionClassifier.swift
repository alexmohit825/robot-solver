import Foundation
import Vision
import CoreMedia
import UIKit
import Combine

/// On-device real-time botanical classifier leveraging Apple Vision and local taxonomy knowledge.
public final class PlantVisionClassifier: ObservableObject {
    @Published public var topCandidate: BotanicalSpecimen?
    @Published public var detectionConfidence: Double = 0.0
    @Published public var isAnalyzing: Bool = false
    @Published public var recognizedOrgan: PlantOrgan = .leaf
    @Published public var detectedBoundingBox: CGRect = .zero

    private var visionRequests = [VNRequest]()
    private let taxonomyStore = LocalTaxonomyKnowledgeBase.shared

    // Temporal smoothing to prevent UI flicker
    private var smoothedConfidence: Double = 0.0
    private var candidateStreakCount: Int = 0
    private var lastCandidateName: String = ""

    public init() {
        setupVisionRequests()
    }

    private func setupVisionRequests() {
        let classificationRequest = VNClassifyImageRequest { [weak self] request, error in
            guard let self = self, error == nil else { return }
            self.processVisionObservations(request.results as? [VNClassificationObservation] ?? [])
        }
        
        // Optimize for speed on Apple Neural Engine
        classificationRequest.preferBackgroundProcessing = false
        self.visionRequests = [classificationRequest]
    }

    public func classifyPixelBuffer(_ pixelBuffer: CVPixelBuffer) {
        let imageRequestHandler = VNImageRequestHandler(cvPixelBuffer: pixelBuffer, orientation: .up, options: [:])
        do {
            try imageRequestHandler.perform(self.visionRequests)
        } catch {
            print("Vision classification error: \(error)")
        }
    }

    private func processVisionObservations(_ observations: [VNClassificationObservation]) {
        // Filter observations matching plant / botanical identifiers
        let plantObservations = observations.filter { obs in
            let id = obs.identifier.lowercased()
            return id.contains("plant") || id.contains("flora") || id.contains("flower") ||
                   id.contains("leaf") || id.contains("tree") || id.contains("herb") ||
                   self.taxonomyStore.isBotanicalIdentifier(id)
        }

        guard let bestMatch = plantObservations.first, bestMatch.confidence > 0.35 else {
            DispatchQueue.main.async {
                self.detectionConfidence = max(0.0, self.detectionConfidence - 0.1)
                if self.detectionConfidence < 0.2 {
                    self.topCandidate = nil
                }
            }
            return
        }

        let rawConfidence = Double(bestMatch.confidence)
        let resolvedSpecimen = taxonomyStore.resolveSpecimen(identifier: bestMatch.identifier, confidence: rawConfidence)

        DispatchQueue.main.async {
            // Apply exponential moving average for steady UI HUD rendering
            self.smoothedConfidence = (self.smoothedConfidence * 0.7) + (rawConfidence * 0.3)
            self.detectionConfidence = self.smoothedConfidence

            if resolvedSpecimen.scientificName == self.lastCandidateName {
                self.candidateStreakCount += 1
            } else {
                self.candidateStreakCount = 1
                self.lastCandidateName = resolvedSpecimen.scientificName
            }

            // Only promote to topCandidate when stabilized over consecutive frames
            if self.candidateStreakCount >= 2 {
                self.topCandidate = resolvedSpecimen
            }
        }
    }
}

/// Offline Local Botanical Knowledge Base mapped directly to Vision taxonomy classifications.
public final class LocalTaxonomyKnowledgeBase {
    public static let shared = LocalTaxonomyKnowledgeBase()

    private let botanicalIndex: [String: BotanicalSpecimen] = [
        "monstera": BotanicalSpecimen(
            commonName: "Swiss Cheese Plant",
            scientificName: "Monstera deliciosa",
            family: "Araceae",
            confidence: 0.95,
            nativeRegion: "Central & South America",
            petToxicity: .toxicToPets(reason: "Calcium oxalate crystals irritate gastrointestinal tract."),
            lightRequirement: .brightIndirect,
            waterFrequencyDays: 7,
            soilType: "Chunky aroid mix (Perlite, Bark, Peat)",
            summaryDescription: "Iconic tropical vine with perforated split leaves."
        ),
        "ficus_lyrata": BotanicalSpecimen(
            commonName: "Fiddle-Leaf Fig",
            scientificName: "Ficus lyrata",
            family: "Moraceae",
            confidence: 0.92,
            nativeRegion: "Western Africa",
            petToxicity: .toxicToPets(reason: "Milky sap contains furocoumarins and proteolytic enzymes."),
            lightRequirement: .brightIndirect,
            waterFrequencyDays: 8,
            soilType: "Well-draining rich potting soil",
            summaryDescription: "Popular indoor tree characterized by large, violin-shaped leaves."
        ),
        "sansevieria": BotanicalSpecimen(
            commonName: "Snake Plant / Mother-in-Law's Tongue",
            scientificName: "Dracaena trifasciata",
            family: "Asparagaceae",
            confidence: 0.97,
            nativeRegion: "Tropical West Africa",
            petToxicity: .toxicToPets(reason: "Contains saponins causing nausea and vomiting."),
            lightRequirement: .lowLight,
            waterFrequencyDays: 14,
            soilType: "Cactus & succulent porous grit",
            summaryDescription: "Extremely hardy succulent with upright sword-like variegated foliage."
        ),
        "epipremnum_aureum": BotanicalSpecimen(
            commonName: "Golden Pothos / Devil's Ivy",
            scientificName: "Epipremnum aureum",
            family: "Araceae",
            confidence: 0.94,
            nativeRegion: "Mo'orea, French Polynesia",
            petToxicity: .toxicToPets(reason: "Insoluble oxalates cause oral pain."),
            lightRequirement: .mediumIndirect,
            waterFrequencyDays: 7,
            soilType: "Standard indoor potting mix",
            summaryDescription: "Fast-growing cascading vine with heart-shaped golden-streaked foliage."
        ),
        "chlorophytum": BotanicalSpecimen(
            commonName: "Spider Plant",
            scientificName: "Chlorophytum comosum",
            family: "Asparagaceae",
            confidence: 0.96,
            nativeRegion: "Southern & Tropical Africa",
            petToxicity: .safeForPets,
            lightRequirement: .brightIndirect,
            waterFrequencyDays: 6,
            soilType: "Loamy, well-aerated potting mix",
            summaryDescription: "Resilient non-toxic houseplant producing arching runners with plantlets."
        ),
        "calathea": BotanicalSpecimen(
            commonName: "Prayer Plant / Rattlesnake Calathea",
            scientificName: "Goeppertia insignis",
            family: "Marantaceae",
            confidence: 0.91,
            nativeRegion: "Brazilian Rainforests",
            petToxicity: .safeForPets,
            lightRequirement: .mediumIndirect,
            waterFrequencyDays: 5,
            soilType: "Moisture-retentive peat & perlite blend",
            summaryDescription: "Stunning patterned leaves that fold upwards at night in nyctinastic movement."
        )
    ]

    public func isBotanicalIdentifier(_ id: String) -> Bool {
        return botanicalIndex.keys.contains { id.contains($0) }
    }

    public func resolveSpecimen(identifier: String, confidence: Double) -> BotanicalSpecimen {
        let lower = identifier.lowercased()
        for (key, specimen) in botanicalIndex {
            if lower.contains(key) {
                return BotanicalSpecimen(
                    commonName: specimen.commonName,
                    scientificName: specimen.scientificName,
                    family: specimen.family,
                    confidence: confidence,
                    nativeRegion: specimen.nativeRegion,
                    petToxicity: specimen.petToxicity,
                    lightRequirement: specimen.lightRequirement,
                    waterFrequencyDays: specimen.waterFrequencyDays,
                    soilType: specimen.soilType,
                    summaryDescription: specimen.summaryDescription
                )
            }
        }

        // Generic fallback specimen formatted from Vision identifier
        let formattedName = identifier.replacingOccurrences(of: "_", with: " ").capitalized
        return BotanicalSpecimen(
            commonName: formattedName,
            scientificName: "Flora taxonomy (\(formattedName))",
            family: "Plantae",
            confidence: confidence,
            nativeRegion: "Global Distribution",
            petToxicity: .unknown,
            lightRequirement: .brightIndirect,
            waterFrequencyDays: 7,
            soilType: "Standard horticultural mix",
            summaryDescription: "Identified via on-device Apple Vision taxonomy classification."
        )
    }
}
