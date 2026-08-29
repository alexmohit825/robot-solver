import SwiftUI
import AVFoundation

/// Live Camera Viewfinder with 60fps AVFoundation preview and real-time Vision classification pipeline.
public struct LiveViewfinderView: View {
    @ObservedObject var cameraManager: CameraFeedManager
    @ObservedObject var visionClassifier: PlantVisionClassifier
    
    @Binding var selectedSpecimen: BotanicalSpecimen?
    @Binding var isPresentingDiagnostics: Bool
    @Binding var isPresentingSettings: Bool

    public init(
        cameraManager: CameraFeedManager,
        visionClassifier: PlantVisionClassifier,
        selectedSpecimen: Binding<BotanicalSpecimen?>,
        isPresentingDiagnostics: Binding<Bool>,
        isPresentingSettings: Binding<Bool>
    ) {
        self.cameraManager = cameraManager
        self.visionClassifier = visionClassifier
        self._selectedSpecimen = selectedSpecimen
        self._isPresentingDiagnostics = isPresentingDiagnostics
        self._isPresentingSettings = isPresentingSettings
    }

    public var body: some View {
        ZStack {
            // Native AVFoundation Camera Video Stream
            AVCapturePreviewBridge(session: cameraManager.session)
                .ignoresSafeArea()

            // Dynamic Dark Gradient Vignette for UI contrast
            VStack {
                LinearGradient(
                    gradient: Gradient(colors: [.black.opacity(0.6), .clear]),
                    startPoint: .top,
                    endPoint: .bottom
                )
                .frame(height: 120)
                Spacer()
                LinearGradient(
                    gradient: Gradient(colors: [.clear, .black.opacity(0.7)]),
                    startPoint: .top,
                    endPoint: .bottom
                )
                .frame(height: 140)
            }
            .ignoresSafeArea()

            // Real-Time Animated Botanical Reticle
            ARReticleOverlay(
                confidence: visionClassifier.detectionConfidence,
                commonName: visionClassifier.topCandidate?.commonName,
                isTracking: visionClassifier.topCandidate != nil
            )

            // Top Status Bar & Quick Actions
            VStack {
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        HStack(spacing: 6) {
                            Circle()
                                .fill(Color.green)
                                .frame(width: 8, height: 8)
                            Text("FLORA FINDER")
                                .font(.system(size: 13, weight: .black, design: .rounded))
                                .tracking(1.5)
                                .foregroundColor(.white)
                        }
                        Text("On-Device Vision (Apple Neural Engine)")
                            .font(.system(size: 10, weight: .medium))
                            .foregroundColor(.white.opacity(0.7))
                    }
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(.ultraThinMaterial)
                    .clipShape(Capsule())

                    Spacer()

                    // Torch Button
                    Button(action: {
                        cameraManager.toggleTorch()
                    }) {
                        Image(systemName: cameraManager.isTorchOn ? "flashlight.on.fill" : "flashlight.off.fill")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(cameraManager.isTorchOn ? .yellow : .white)
                            .frame(width: 44, height: 44)
                            .background(.ultraThinMaterial)
                            .clipShape(Circle())
                    }

                    // Settings Button
                    Button(action: {
                        isPresentingSettings = true
                    }) {
                        Image(systemName: "gearshape.fill")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.white)
                            .frame(width: 44, height: 44)
                            .background(.ultraThinMaterial)
                            .clipShape(Circle())
                    }
                }
                .padding(.horizontal, 20)
                .padding(.top, 50)

                Spacer()

                // Bottom Action Deck
                VStack(spacing: 16) {
                    // Quick Action: Inspect Top Candidate Button
                    if let specimen = visionClassifier.topCandidate, visionClassifier.detectionConfidence > 0.45 {
                        Button(action: {
                            selectedSpecimen = specimen
                        }) {
                            HStack(spacing: 10) {
                                Image(systemName: "leaf.fill")
                                    .foregroundColor(.green)
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(specimen.commonName)
                                        .font(.system(size: 15, weight: .bold))
                                        .foregroundColor(.white)
                                    Text(specimen.scientificName)
                                        .font(.system(size: 12, weight: .regular))
                                        .italic()
                                        .foregroundColor(.white.opacity(0.8))
                                }
                                Spacer()
                                Image(systemName: "chevron.up.circle.fill")
                                    .font(.system(size: 20))
                                    .foregroundColor(.white.opacity(0.8))
                            }
                            .padding(.horizontal, 16)
                            .padding(.vertical, 12)
                            .background(.ultraThinMaterial)
                            .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                            .overlay(
                                RoundedRectangle(cornerRadius: 16, style: .continuous)
                                    .stroke(Color.green.opacity(0.5), lineWidth: 1.5)
                            )
                        }
                        .padding(.horizontal, 24)
                        .transition(.move(edge: .bottom).combined(with: .opacity))
                    }

                    // Primary Shutter & Doctor Mode Hub
                    HStack(spacing: 32) {
                        // Doctor / Disease Mode Trigger
                        Button(action: {
                            isPresentingDiagnostics = true
                        }) {
                            VStack(spacing: 4) {
                                Image(systemName: "cross.case.fill")
                                    .font(.system(size: 20, weight: .medium))
                                    .foregroundColor(.red)
                                Text("Doctor")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(.white)
                            }
                            .frame(width: 60, height: 60)
                            .background(.ultraThinMaterial)
                            .clipShape(Circle())
                        }

                        // Instant Capture / Inspect Button
                        Button(action: {
                            if let candidate = visionClassifier.topCandidate {
                                selectedSpecimen = candidate
                            } else {
                                selectedSpecimen = BotanicalSpecimen.sampleMonstera
                            }
                        }) {
                            ZStack {
                                Circle()
                                    .stroke(Color.white, lineWidth: 4)
                                    .frame(width: 76, height: 76)
                                Circle()
                                    .fill(Color.white)
                                    .frame(width: 62, height: 62)
                            }
                        }

                        // Light / Lux Sensor Mode (Simulated preview)
                        Button(action: {
                            // Quick sensor inspection trigger
                            if let specimen = visionClassifier.topCandidate {
                                selectedSpecimen = specimen
                            }
                        }) {
                            VStack(spacing: 4) {
                                Image(systemName: "sun.max.fill")
                                    .font(.system(size: 20, weight: .medium))
                                    .foregroundColor(.yellow)
                                Text("Lux Meter")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(.white)
                            }
                            .frame(width: 60, height: 60)
                            .background(.ultraThinMaterial)
                            .clipShape(Circle())
                        }
                    }
                    .padding(.bottom, 36)
                }
            }
        }
    }
}

/// UIKit AVFoundation Preview Layer integration bridge
public struct AVCapturePreviewBridge: UIViewRepresentable {
    public let session: AVCaptureSession

    public func makeUIView(context: Context) -> UIView {
        let view = UIView(frame: .zero)
        let previewLayer = AVCaptureVideoPreviewLayer(session: session)
        previewLayer.videoGravity = .resizeAspectFill
        view.layer.addSublayer(previewLayer)
        return view
    }

    public func updateUIView(_ uiView: UIView, context: Context) {
        if let previewLayer = uiView.layer.sublayers?.first as? AVCaptureVideoPreviewLayer {
            previewLayer.frame = uiView.bounds
            if let connection = previewLayer.connection, connection.isVideoOrientationSupported {
                connection.videoOrientation = .portrait
            }
        }
    }
}
