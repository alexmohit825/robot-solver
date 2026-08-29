import SwiftUI

/// Animated botanical HUD reticle with dynamic confidence ring and corner tracking brackets.
public struct ARReticleOverlay: View {
    let confidence: Double
    let commonName: String?
    let isTracking: Bool

    @State private var pulseAnimation: Bool = false

    public init(confidence: Double, commonName: String?, isTracking: Bool) {
        self.confidence = confidence
        self.commonName = commonName
        self.isTracking = isTracking
    }

    public var body: some View {
        ZStack {
            // Outer Pulsing Target Ring
            Circle()
                .stroke(
                    AngularGradient(
                        gradient: Gradient(colors: [
                            Color(red: 0.2, green: 0.85, blue: 0.5),
                            Color(red: 0.1, green: 0.65, blue: 0.9),
                            Color(red: 0.2, green: 0.85, blue: 0.5)
                        ]),
                        center: .center
                    ),
                    lineWidth: 3
                )
                .frame(width: 240, height: 240)
                .scaleEffect(pulseAnimation ? 1.05 : 0.97)
                .opacity(isTracking ? 0.9 : 0.4)
                .animation(.easeInOut(duration: 1.4).repeatForever(autoreverses: true), value: pulseAnimation)
                .onAppear {
                    pulseAnimation = true
                }

            // Real-Time Circular Confidence Indicator
            Circle()
                .trim(from: 0.0, to: CGFloat(min(1.0, confidence)))
                .stroke(
                    Color(red: 0.2, green: 0.95, blue: 0.55),
                    style: StrokeStyle(lineWidth: 6, lineCap: .round)
                )
                .rotationEffect(.degrees(-90))
                .frame(width: 256, height: 256)
                .animation(.spring(response: 0.3, dampingFraction: 0.7), value: confidence)

            // Precision Corner Reticle Brackets
            CornerBracketsView(size: 270)
                .stroke(Color.white.opacity(0.8), lineWidth: 2)
                .frame(width: 270, height: 270)

            // Center Scanning Crosshair
            Image(systemName: "camera.metering.matrix")
                .font(.system(size: 28, weight: .light))
                .foregroundColor(.white.opacity(isTracking ? 0.9 : 0.5))

            // Real-Time Specimen Floating Identification Tag
            if let name = commonName, confidence > 0.4 {
                VStack(spacing: 4) {
                    HStack(spacing: 6) {
                        Circle()
                            .fill(confidence > 0.85 ? Color.green : Color.yellow)
                            .frame(width: 8, height: 8)
                        Text(name)
                            .font(.system(size: 15, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                        Text("\(Int(confidence * 100))%")
                            .font(.system(size: 13, weight: .semibold, design: .monospaced))
                            .foregroundColor(Color(red: 0.4, green: 0.95, blue: 0.6))
                    }
                    .padding(.horizontal, 14)
                    .padding(.vertical, 7)
                    .background(.ultraThinMaterial)
                    .clipShape(Capsule())
                    .overlay(
                        Capsule().stroke(Color.white.opacity(0.3), lineWidth: 1)
                    )
                    .shadow(color: .black.opacity(0.4), radius: 10, x: 0, y: 4)
                }
                .offset(y: 165)
                .transition(.scale.combined(with: .opacity))
            }
        }
    }
}

private struct CornerBracketsView: Shape {
    let size: CGFloat
    let bracketLength: CGFloat = 24

    func path(in rect: CGRect) -> Path {
        var path = Path()
        let minX = rect.minX
        let maxX = rect.maxX
        let minY = rect.minY
        let maxY = rect.maxY

        // Top-Left
        path.move(to: CGPoint(x: minX, y: minY + bracketLength))
        path.addLine(to: CGPoint(x: minX, y: minY))
        path.addLine(to: CGPoint(x: minX + bracketLength, y: minY))

        // Top-Right
        path.move(to: CGPoint(x: maxX - bracketLength, y: minY))
        path.addLine(to: CGPoint(x: maxX, y: minY))
        path.addLine(to: CGPoint(x: maxX, y: minY + bracketLength))

        // Bottom-Left
        path.move(to: CGPoint(x: minX, y: maxY - bracketLength))
        path.addLine(to: CGPoint(x: minX, y: maxY))
        path.addLine(to: CGPoint(x: minX + bracketLength, y: maxY))

        // Bottom-Right
        path.move(to: CGPoint(x: maxX - bracketLength, y: maxY))
        path.addLine(to: CGPoint(x: maxX, y: maxY))
        path.addLine(to: CGPoint(x: maxX, y: maxY - bracketLength))

        return path
    }
}
