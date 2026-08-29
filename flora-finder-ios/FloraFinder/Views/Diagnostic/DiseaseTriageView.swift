import SwiftUI
import PhotosUI

/// Doctor Mode: Comprehensive plant health diagnostics powered by Google Gemini Multimodal analysis.
public struct DiseaseTriageView: View {
    @ObservedObject var geminiService = GeminiBotanicalService.shared

    @State private var selectedImage: UIImage?
    @State private var selectedPhotoItem: PhotosPickerItem?
    @State private var symptomsDescription: String = ""
    @State private var diagnosticReport: DiagnosticReport?
    @State private var isAnalyzing: Bool = false
    @State private var errorMessage: String?

    @Environment(\.dismiss) private var dismiss

    public init() {}

    public var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    // Header Card
                    VStack(alignment: .leading, spacing: 6) {
                        HStack {
                            Image(systemName: "cross.case.fill")
                                .foregroundColor(.red)
                            Text("Plant Doctor & Pathology")
                                .font(.system(size: 20, weight: .bold, design: .rounded))
                        }
                        Text("Capture high-resolution photos of damaged foliage, discolored spots, or pests for deep AI diagnosis.")
                            .font(.system(size: 13))
                            .foregroundColor(.secondary)
                    }
                    .padding()
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Color(.secondarySystemBackground))
                    .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))

                    // Photo Input Area
                    VStack(spacing: 12) {
                        if let image = selectedImage {
                            Image(uiImage: image)
                                .resizable()
                                .scaledToFill()
                                .frame(height: 220)
                                .frame(maxWidth: .infinity)
                                .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                                        .stroke(Color.red.opacity(0.4), lineWidth: 2)
                                )
                        } else {
                            PhotosPicker(selection: $selectedPhotoItem, matching: .images) {
                                VStack(spacing: 12) {
                                    Image(systemName: "camera.badge.ellipsis")
                                        .font(.system(size: 40))
                                        .foregroundColor(.red)
                                    Text("Select Photo for Health Triage")
                                        .font(.system(size: 15, weight: .bold))
                                        .foregroundColor(.primary)
                                    Text("Include clear view of leaf discoloration or wilting")
                                        .font(.system(size: 12))
                                        .foregroundColor(.secondary)
                                }
                                .frame(height: 180)
                                .frame(maxWidth: .infinity)
                                .background(Color(.secondarySystemBackground))
                                .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                            }
                        }

                        if selectedImage != nil {
                            Button("Change Photo") {
                                selectedImage = nil
                                diagnosticReport = nil
                            }
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(.red)
                        }
                    }

                    // Symptoms Context Input
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Observed Symptoms (Optional)")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(.secondary)

                        TextField("e.g. Yellowing leaf margins, black spots, drooping stems...", text: $symptomsDescription)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                    }

                    // Action Trigger
                    Button(action: runDiagnosis) {
                        HStack {
                            if isAnalyzing {
                                ProgressView()
                                    .padding(.trailing, 6)
                                Text("Diagnosing with Gemini 2.0...")
                            } else {
                                Image(systemName: "stethoscope")
                                Text("Run Diagnostic Analysis")
                            }
                        }
                        .font(.system(size: 16, weight: .bold))
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(selectedImage == nil || isAnalyzing ? Color.gray : Color.red)
                        .foregroundColor(.white)
                        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                    }
                    .disabled(selectedImage == nil || isAnalyzing)

                    if let error = errorMessage {
                        Text(error)
                            .font(.system(size: 13))
                            .foregroundColor(.red)
                            .padding()
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(Color.red.opacity(0.1))
                            .clipShape(RoundedRectangle(cornerRadius: 10))
                    }

                    // Diagnostic Report Card
                    if let report = diagnosticReport {
                        VStack(alignment: .leading, spacing: 16) {
                            // Condition Title & Badges
                            VStack(alignment: .leading, spacing: 8) {
                                HStack {
                                    Text(report.conditionName)
                                        .font(.system(size: 22, weight: .bold, design: .rounded))
                                    Spacer()
                                    Text("\(Int(report.confidenceScore * 100))% Confidence")
                                        .font(.system(size: 11, weight: .bold))
                                        .padding(.horizontal, 8)
                                        .padding(.vertical, 4)
                                        .background(Color.blue.opacity(0.15))
                                        .foregroundColor(.blue)
                                        .clipShape(Capsule())
                                }

                                HStack(spacing: 8) {
                                    Label(report.pathogenCategory.rawValue, systemImage: report.pathogenCategory.iconName)
                                        .font(.system(size: 12, weight: .semibold))
                                        .padding(.horizontal, 10)
                                        .padding(.vertical, 5)
                                        .background(Color(.secondarySystemBackground))
                                        .clipShape(Capsule())

                                    Text(report.severity.rawValue)
                                        .font(.system(size: 12, weight: .bold))
                                        .padding(.horizontal, 10)
                                        .padding(.vertical, 5)
                                        .background(report.severity.color.opacity(0.15))
                                        .foregroundColor(report.severity.color)
                                        .clipShape(Capsule())
                                }
                            }

                            // Quarantine Alert if critical
                            if report.requiresImmediateQuarantine {
                                HStack(spacing: 12) {
                                    Image(systemName: "shield.lefthalf.filled.trianglebadge.exclamationmark")
                                        .foregroundColor(.orange)
                                    Text("Quarantine Recommended: Isolate this plant to prevent airborne or contact transmission to neighboring flora.")
                                        .font(.system(size: 13, weight: .semibold))
                                        .foregroundColor(.orange)
                                }
                                .padding()
                                .background(Color.orange.opacity(0.1))
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                            }

                            // Symptoms Checklist
                            VStack(alignment: .leading, spacing: 6) {
                                Text("Primary Diagnostic Indicators")
                                    .font(.system(size: 15, weight: .bold))
                                ForEach(report.primarySymptoms, id: \.self) { symptom in
                                    HStack(alignment: .top, spacing: 8) {
                                        Image(systemName: "checkmark.circle.fill")
                                            .foregroundColor(.red)
                                            .font(.system(size: 13))
                                        Text(symptom)
                                            .font(.system(size: 13))
                                            .foregroundColor(.secondary)
                                    }
                                }
                            }

                            Divider()

                            // Treatment Protocol Steps
                            VStack(alignment: .leading, spacing: 10) {
                                Text("Recommended Treatment Protocol")
                                    .font(.system(size: 15, weight: .bold))

                                ForEach(report.treatmentProtocol) { step in
                                    HStack(alignment: .top, spacing: 12) {
                                        Text("\(step.stepNumber)")
                                            .font(.system(size: 13, weight: .black))
                                            .foregroundColor(.white)
                                            .frame(width: 24, height: 24)
                                            .background(Color.red)
                                            .clipShape(Circle())

                                        VStack(alignment: .leading, spacing: 2) {
                                            Text(step.title)
                                                .font(.system(size: 14, weight: .bold))
                                            Text(step.instruction)
                                                .font(.system(size: 13))
                                                .foregroundColor(.secondary)
                                        }
                                    }
                                    .padding(.vertical, 2)
                                }
                            }
                        }
                        .padding()
                        .background(Color(.secondarySystemBackground))
                        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                    }
                }
                .padding()
            }
            .navigationTitle("Plant Health Triage")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Close") {
                        dismiss()
                    }
                }
            }
            .onChange(of: selectedPhotoItem) { newItem in
                Task {
                    if let data = try? await newItem?.loadTransferable(type: Data.self),
                       let uiImage = UIImage(data: data) {
                        await MainActor.run {
                            self.selectedImage = uiImage
                        }
                    }
                }
            }
        }
    }

    private func runDiagnosis() {
        guard let image = selectedImage else { return }
        isAnalyzing = true
        errorMessage = nil

        Task {
            do {
                let report = try await geminiService.diagnosePlantHealth(image: image, symptomsDescription: symptomsDescription)
                await MainActor.run {
                    self.diagnosticReport = report
                    self.isAnalyzing = false
                }
            } catch {
                await MainActor.run {
                    // Fallback to sample diagnostic if API key is not yet set or in offline demo mode
                    if geminiService.apiKey.isEmpty {
                        self.diagnosticReport = DiagnosticReport.sampleDiagnostic
                        self.errorMessage = "Demo Mode: Showing baseline pathology triage. Add your Gemini API Key in Settings for live cloud analysis."
                    } else {
                        self.errorMessage = error.localizedDescription
                    }
                    self.isAnalyzing = false
                }
            }
        }
    }
}
