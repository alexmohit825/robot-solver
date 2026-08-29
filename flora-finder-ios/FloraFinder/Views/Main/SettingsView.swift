import SwiftUI

/// App Settings & AI Backend Configuration.
public struct SettingsView: View {
    @ObservedObject var geminiService = GeminiBotanicalService.shared
    @State private var keyInput: String = ""
    @State private var isSaved: Bool = false
    @Environment(\.dismiss) private var dismiss

    public init() {}

    public var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Google Gemini AI Studio Integration"), footer: Text("Your API key is used strictly for on-demand deep disease diagnostics ('Doctor Mode') and conversational botanical care queries. All routine real-time scanning executes 100% on-device with Apple Vision.")) {
                    SecureField("Enter Gemini API Key", text: $keyInput)
                        .autocapitalization(.none)
                        .disableAutocorrection(true)

                    Button(action: saveKey) {
                        HStack {
                            Image(systemName: isSaved ? "checkmark.circle.fill" : "key.fill")
                            Text(isSaved ? "API Key Saved" : "Save Gemini Key")
                        }
                        .foregroundColor(isSaved ? .green : .accentColor)
                    }
                }

                Section(header: Text("Inference Architecture")) {
                    HStack {
                        Label("On-Device Vision (Apple Neural Engine)", systemImage: "bolt.badge.shield.half.filled.fill")
                        Spacer()
                        Text("Active (0ms)")
                            .foregroundColor(.green)
                            .font(.system(size: 13, weight: .bold))
                    }

                    HStack {
                        Label("Cloud Multimodal (Gemini 2.0 Flash)", systemImage: "cloud.fill")
                        Spacer()
                        Text(geminiService.apiKey.isEmpty ? "API Key Needed" : "Connected")
                            .foregroundColor(geminiService.apiKey.isEmpty ? .orange : .green)
                            .font(.system(size: 13, weight: .bold))
                    }
                }

                Section(header: Text("About & Privacy")) {
                    HStack {
                        Text("Flora Finder Engine")
                        Spacer()
                        Text("v2.0.0 (Native Swift)")
                            .foregroundColor(.secondary)
                    }

                    HStack {
                        Text("Privacy Mode")
                        Spacer()
                        Text("Zero Data Logging (Local-First)")
                            .foregroundColor(.secondary)
                    }
                }
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
            .onAppear {
                keyInput = geminiService.apiKey
            }
        }
    }

    private func saveKey() {
        geminiService.setApiKey(keyInput)
        isSaved = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
            isSaved = false
        }
    }
}
