import SwiftUI

/// Offline Geotagged Botanical Discovery Journal.
public struct FieldJournalView: View {
    @State private var searchQuery: String = ""
    @State private var filterPetSafeOnly: Bool = false
    @State private var journalEntries: [BotanicalSpecimen] = [
        BotanicalSpecimen.sampleMonstera,
        BotanicalSpecimen(
            commonName: "Snake Plant",
            scientificName: "Dracaena trifasciata",
            family: "Asparagaceae",
            confidence: 0.97,
            nativeRegion: "Tropical West Africa",
            petToxicity: .toxicToPets(reason: "Saponins irritate digestive tract."),
            lightRequirement: .lowLight,
            waterFrequencyDays: 14,
            soilType: "Porous succulent blend",
            summaryDescription: "Hardy architectural plant with upright variegated foliage."
        ),
        BotanicalSpecimen(
            commonName: "Spider Plant",
            scientificName: "Chlorophytum comosum",
            family: "Asparagaceae",
            confidence: 0.96,
            nativeRegion: "Southern & Tropical Africa",
            petToxicity: .safeForPets,
            lightRequirement: .brightIndirect,
            waterFrequencyDays: 6,
            soilType: "Standard potting mix",
            summaryDescription: "Classic non-toxic specimen with ribbon-like leaves."
        )
    ]

    @State private var selectedSpecimen: BotanicalSpecimen?

    public init() {}

    public var filteredEntries: [BotanicalSpecimen] {
        journalEntries.filter { specimen in
            let matchesSearch = searchQuery.isEmpty ||
                specimen.commonName.localizedCaseInsensitiveContains(searchQuery) ||
                specimen.scientificName.localizedCaseInsensitiveContains(searchQuery) ||
                specimen.family.localizedCaseInsensitiveContains(searchQuery)

            let matchesPetFilter = !filterPetSafeOnly || specimen.petToxicity.isSafe

            return matchesSearch && matchesPetFilter
        }
    }

    public var body: some View {
        NavigationView {
            List {
                // Summary Filter Bar
                Section {
                    Toggle(isOn: $filterPetSafeOnly) {
                        Label("Show Pet-Safe Only", systemImage: "pawprint.fill")
                            .foregroundColor(.green)
                    }
                }

                // Discovered Specimen List
                Section(header: Text("Cataloged Encounters (\(filteredEntries.count))")) {
                    ForEach(filteredEntries) { specimen in
                        Button(action: {
                            selectedSpecimen = specimen
                        }) {
                            HStack(spacing: 14) {
                                ZStack {
                                    Circle()
                                        .fill(Color.green.opacity(0.15))
                                        .frame(width: 44, height: 44)
                                    Image(systemName: "leaf.fill")
                                        .foregroundColor(.green)
                                }

                                VStack(alignment: .leading, spacing: 3) {
                                    Text(specimen.commonName)
                                        .font(.system(size: 16, weight: .bold))
                                        .foregroundColor(.primary)

                                    Text(specimen.scientificName)
                                        .font(.system(size: 13))
                                        .italic()
                                        .foregroundColor(.secondary)

                                    HStack(spacing: 6) {
                                        Text(specimen.family)
                                            .font(.system(size: 11, weight: .semibold))
                                            .foregroundColor(.secondary)

                                        Text("•")
                                            .foregroundColor(.secondary)

                                        Text(specimen.petToxicity.isSafe ? "Pet-Safe" : "Toxic")
                                            .font(.system(size: 11, weight: .bold))
                                            .foregroundColor(specimen.petToxicity.badgeColor)
                                    }
                                }

                                Spacer()

                                VStack(alignment: .trailing, spacing: 4) {
                                    Text("\(Int(specimen.confidence * 100))%")
                                        .font(.system(size: 13, weight: .bold, design: .monospaced))
                                        .foregroundColor(.green)

                                    Image(systemName: "chevron.right")
                                        .font(.system(size: 12))
                                        .foregroundColor(.secondary)
                                }
                            }
                            .padding(.vertical, 4)
                        }
                    }
                }
            }
            .searchable(text: $searchQuery, prompt: "Search common, scientific, or family name...")
            .navigationTitle("Field Journal")
            .sheet(item: $selectedSpecimen) { specimen in
                SpecimenDetailSheet(specimen: specimen)
            }
        }
    }
}
