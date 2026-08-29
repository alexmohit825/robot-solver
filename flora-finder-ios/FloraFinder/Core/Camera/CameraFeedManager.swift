import Foundation
import AVFoundation
import UIKit
import Combine

/// Manages high-performance 60fps camera video frame streaming via AVFoundation with frame throttling for CoreML/Vision inference.
public final class CameraFeedManager: NSObject, ObservableObject {
    @Published public var isCameraAuthorized: Bool = false
    @Published public var isRunning: Bool = false
    @Published public var isTorchOn: Bool = false
    @Published public var sessionError: String?

    public let session = AVCaptureSession()
    private let videoOutput = AVCaptureVideoDataOutput()
    private let sessionQueue = DispatchQueue(label: "com.florafinder.cameraSessionQueue")
    private let bufferQueue = DispatchQueue(label: "com.florafinder.bufferQueue", qos: .userInteractive)

    public var frameDelegate: ((CVPixelBuffer) -> Void)?

    private var frameCounter: Int = 0
    private let frameSkipInterval: Int = 4 // Run Vision classification every 4th frame (~15Hz on 60fps feed)

    public override init() {
        super.init()
    }

    public func checkPermissionsAndSetup() {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            self.isCameraAuthorized = true
            self.configureSession()
        case .notDetermined:
            AVCaptureDevice.requestAccess(for: .video) { [weak self] granted in
                DispatchQueue.main.async {
                    self?.isCameraAuthorized = granted
                    if granted {
                        self?.configureSession()
                    } else {
                        self?.sessionError = "Camera access is required for real-time botanical scanning."
                    }
                }
            }
        case .denied, .restricted:
            DispatchQueue.main.async {
                self.isCameraAuthorized = false
                self.sessionError = "Camera permission was denied. Please enable it in iOS Settings."
            }
        @unknown default:
            break
        }
    }

    private func configureSession() {
        sessionQueue.async { [weak self] in
            guard let self = self else { return }
            self.session.beginConfiguration()
            self.session.sessionPreset = .hd1920x1080

            // Add Video Device Input
            guard let device = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .back),
                  let input = try? AVCaptureDeviceInput(device: device),
                  self.session.canAddInput(input) else {
                DispatchQueue.main.async {
                    self.sessionError = "Unable to initialize rear botanical camera."
                }
                self.session.commitConfiguration()
                return
            }
            self.session.addInput(input)

            // Configure Video Data Output
            if self.session.canAddOutput(self.videoOutput) {
                self.videoOutput.alwaysDiscardsLateVideoFrames = true
                self.videoOutput.videoSettings = [
                    kCVPixelBufferPixelFormatTypeKey as String: Int(kCVPixelFormatType_32BGRA)
                ]
                self.videoOutput.setSampleBufferDelegate(self, queue: self.bufferQueue)
                self.session.addOutput(self.videoOutput)

                if let connection = self.videoOutput.connection(with: .video) {
                    connection.videoOrientation = .portrait
                    if connection.isVideoStabilizationSupported {
                        connection.preferredVideoStabilizationMode = .auto
                    }
                }
            }

            self.session.commitConfiguration()
            self.startSession()
        }
    }

    public func startSession() {
        sessionQueue.async { [weak self] in
            guard let self = self, !self.session.isRunning else { return }
            self.session.startRunning()
            DispatchQueue.main.async {
                self.isRunning = self.session.isRunning
            }
        }
    }

    public func stopSession() {
        sessionQueue.async { [weak self] in
            guard let self = self, self.session.isRunning else { return }
            self.session.stopRunning()
            DispatchQueue.main.async {
                self.isRunning = false
            }
        }
    }

    public func toggleTorch() {
        guard let device = AVCaptureDevice.default(for: .video), device.hasTorch else { return }
        do {
            try device.lockForConfiguration()
            if device.torchMode == .on {
                device.torchMode = .off
                DispatchQueue.main.async { self.isTorchOn = false }
            } else {
                try device.setTorchModeOn(level: 0.8)
                DispatchQueue.main.async { self.isTorchOn = true }
            }
            device.unlockForConfiguration()
        } catch {
            print("Failed to toggle camera torch: \(error)")
        }
    }
}

extension CameraFeedManager: AVCaptureVideoDataOutputSampleBufferDelegate {
    public func captureOutput(
        _ output: AVCaptureOutput,
        didOutput sampleBuffer: CMSampleBuffer,
        from connection: AVCaptureConnection
    ) {
        frameCounter += 1
        guard frameCounter % frameSkipInterval == 0 else { return }
        guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }
        frameDelegate?(pixelBuffer)
    }
}
