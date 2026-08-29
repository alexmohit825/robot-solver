import SwiftUI

/// Primary Navigation & Orchestration Hub for Flora Finder iOS.
public struct ContentView: View {
    @StateObject private var cameraManager = CameraFeedManager()
    @StateObject private var visionClassifier = PlantVisionClassifier()

    @State private var selectedTab: Int = 0
    @State private var selectedSpecimen: BotanicalSpecimen?
    @State private var isPresentingDiagnostics: Bool = false
    @State private var isPresentingSettings: Bool = false

    public init() {}

    public var body: some View {
        TabView(selection: $selectedTab) {
            // Live Real-Time Botanical Lens
            LiveViewfinderView(
                cameraManager: cameraManager,
                visionClassifier: visionClassifier,
                selectedSpecimen: $selectedSpecimen,
                isPresentingDiagnostics: $isPresentingDiagnostics,
                isPresentingSettings: $isPresentingSettings
            )
            .tabItem {
                Label("Live Scanner", systemImage: "camera.viewfinder")
            }
            .tag(0)

            // Doctor Mode / Disease Diagnostics
            DiseaseTriageView()
                .tabItem {
                    Label("Doctor Mode", systemImage: "cross.case.fill")
                }
                .tag(1)

            // Offline Field Journal
            FieldJournalView()
                .tabItem {
                    Label("Journal", systemImage: "book.closed.fill")
                }
                .tag(2)
        }
        .accentColor(Color.green)
        .sheet(item: $selectedSpecimen) { specimen in
            SpecimenDetailSheet(specimen: specimen)
        }
        .sheet(isPresented: $isPresentingDiagnostics) {
            DiseaseTriageView()
        }
        .sheet(isPresented: $isPresentingSettings) {
            SettingsView()
        }
        .onAppear {
            // Wire AVFoundation video buffer stream directly to Vision Classifier
            cameraManager.frameDelegate = { [weak visionClassifier] buffer in
                visionClassifier?.classifyPixelBuffer(buffer)
            }
            cameraManager.checkPermissionsAndSetup()
        }
        .onDisappear {
            cameraManager.stopSession()
        }
    }
}
