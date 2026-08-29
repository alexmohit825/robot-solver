import Foundation
import UIKit
import Combine

/// Remote Multimodal Botanical Pathology & Care Service powered by Google Gemini 2.0 Flash API.
public final class GeminiBotanicalService: ObservableObject {
    public static let shared = GeminiBotanicalService()

    @Published public var apiKey: String = ""
    @Published public var isDiagnosing: Bool = false
    @Published public var diagnosticError: String?

    private let endpointBase = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

    public init() {
        // Load API key from standard UserDefaults or App Configuration
        if let storedKey = UserDefaults.standard.string(forKey: "GEMINI_API_KEY"), !storedKey.isEmpty {
            self.apiKey = storedKey
        }
    }

    public func setApiKey(_ key: String) {
        self.apiKey = key.trimmingCharacters(in: .whitespacesAndNewlines)
        UserDefaults.standard.set(self.apiKey, forKey: "GEMINI_API_KEY")
    }

    /// Performs deep botanical pathology analysis on captured leaf/plant photos.
    public func diagnosePlantHealth(image: UIImage, symptomsDescription: String? = nil) async throws -> DiagnosticReport {
        guard !apiKey.isEmpty else {
            throw GeminiError.missingApiKey
        }

        // Downscale image to 1024px JPEG (0.8 quality) for sub-second network transmission
        guard let jpegData = resizeImage(image: image, maxDimension: 1024)?.jpegData(compressionQuality: 0.8) else {
            throw GeminiError.invalidImageData
        }
        let base64Image = jpegData.base64EncodedString()

        guard let url = URL(string: "\(endpointBase)?key=\(apiKey)") else {
            throw GeminiError.invalidEndpoint
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let prompt = """
        You are an expert master botanist and plant pathologist. 
        Analyze the provided plant photograph and any observed symptoms: "\(symptomsDescription ?? "None provided")".
        
        Respond STRICTLY with a valid JSON object matching this schema:
        {
          "conditionName": "Scientific or common name of disease/pest/condition",
          "pathogenCategory": "Fungal Infection" | "Bacterial Blight" | "Pest / Insect Infestation" | "Environmental / Abiotic Stress" | "Nutrient Deficiency" | "Healthy Specimen",
          "severity": "Optimal Health" | "Mild / Early Stage" | "Moderate Impact" | "Critical / Severe",
          "confidenceScore": 0.0 to 1.0,
          "primarySymptoms": ["symptom 1", "symptom 2", "symptom 3"],
          "treatmentProtocol": [
            {"stepNumber": 1, "title": "Step title", "instruction": "Clear practical instruction"}
          ],
          "preventionTips": ["tip 1", "tip 2"],
          "requiresImmediateQuarantine": true or false
        }
        Do not include markdown formatting or backticks around the JSON.
        """

        let requestBody: [String: Any] = [
            "contents": [
                [
                    "parts": [
                        ["text": prompt],
                        [
                            "inline_data": [
                                "mime_type": "image/jpeg",
                                "data": base64Image
                            ]
                        ]
                    ]
                ]
            ],
            "generationConfig": [
                "temperature": 0.2,
                "response_mime_type": "application/json"
            ]
        ]

        request.httpBody = try JSONSerialization.data(withJSONObject: requestBody)

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse else {
            throw GeminiError.networkError("Invalid HTTP response")
        }

        if httpResponse.statusCode == 429 {
            throw GeminiError.quotaExceeded
        } else if httpResponse.statusCode != 200 {
            let errorText = String(data: data, encoding: .utf8) ?? "Unknown error"
            throw GeminiError.networkError("HTTP \(httpResponse.statusCode): \(errorText)")
        }

        return try parseDiagnosticResponse(data: data)
    }

    /// Conversational botanical care assistant.
    public func askCareAssistant(query: String, contextSpecimen: BotanicalSpecimen?) async throws -> String {
        guard !apiKey.isEmpty else { throw GeminiError.missingApiKey }
        guard let url = URL(string: "\(endpointBase)?key=\(apiKey)") else { throw GeminiError.invalidEndpoint }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let contextInfo = contextSpecimen != nil ? "Focus on plant: \(contextSpecimen!.commonName) (\(contextSpecimen!.scientificName)), Native region: \(contextSpecimen!.nativeRegion)." : ""
        let systemPrompt = "You are Flora Finder's Senior AI Botanist. Provide concise, friendly, and scientifically grounded plant care advice. \(contextInfo)"

        let requestBody: [String: Any] = [
            "contents": [
                [
                    "parts": [
                        ["text": "\(systemPrompt)\n\nUser Question: \(query)"]
                    ]
                ]
            ],
            "generationConfig": [
                "temperature": 0.7,
                "maxOutputTokens": 600
            ]
        ]

        request.httpBody = try JSONSerialization.data(withJSONObject: requestBody)
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            throw GeminiError.networkError("Failed to fetch response from Gemini Assistant")
        }

        if let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
           let candidates = json["candidates"] as? [[String: Any]],
           let firstCandidate = candidates.first,
           let content = firstCandidate["content"] as? [String: Any],
           let parts = content["parts"] as? [[String: Any]],
           let firstPart = parts.first,
           let answerText = firstPart["text"] as? String {
            return answerText.trimmingCharacters(in: .whitespacesAndNewlines)
        }

        throw GeminiError.parseError
    }

    private func parseDiagnosticResponse(data: Data) throws -> DiagnosticReport {
        guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
              let candidates = json["candidates"] as? [[String: Any]],
              let firstCandidate = candidates.first,
              let content = firstCandidate["content"] as? [String: Any],
              let parts = content["parts"] as? [[String: Any]],
              let firstPart = parts.first,
              let textPayload = firstPart["text"] as? String else {
            throw GeminiError.parseError
        }

        let cleanedJson = textPayload
            .replacingOccurrences(of: "```json", with: "")
            .replacingOccurrences(of: "```", with: "")
            .trimmingCharacters(in: .whitespacesAndNewlines)

        guard let payloadData = cleanedJson.data(using: .utf8),
              let dict = try JSONSerialization.jsonObject(with: payloadData) as? [String: Any] else {
            throw GeminiError.parseError
        }

        let conditionName = dict["conditionName"] as? String ?? "Undetermined Plant Condition"
        let pathogenStr = dict["pathogenCategory"] as? String ?? "Environmental / Abiotic Stress"
        let pathogenCategory = PathogenCategory(rawValue: pathogenStr) ?? .environmental
        let severityStr = dict["severity"] as? String ?? "Moderate Impact"
        let severity = SeverityLevel(rawValue: severityStr) ?? .moderate
        let confidenceScore = dict["confidenceScore"] as? Double ?? 0.85
        let primarySymptoms = dict["primarySymptoms"] as? [String] ?? []
        let preventionTips = dict["preventionTips"] as? [String] ?? []
        let quarantine = dict["requiresImmediateQuarantine"] as? Bool ?? false

        var treatmentSteps: [TreatmentStep] = []
        if let rawSteps = dict["treatmentProtocol"] as? [[String: Any]] {
            for raw in rawSteps {
                let num = raw["stepNumber"] as? Int ?? 1
                let title = raw["title"] as? String ?? "Treatment"
                let instr = raw["instruction"] as? String ?? ""
                treatmentSteps.append(TreatmentStep(stepNumber: num, title: title, instruction: instr))
            }
        }

        return DiagnosticReport(
            conditionName: conditionName,
            pathogenCategory: pathogenCategory,
            severity: severity,
            confidenceScore: confidenceScore,
            primarySymptoms: primarySymptoms,
            treatmentProtocol: treatmentSteps,
            preventionTips: preventionTips,
            requiresImmediateQuarantine: quarantine
        )
    }

    private func resizeImage(image: UIImage, maxDimension: CGFloat) -> UIImage? {
        let size = image.size
        let ratio = min(maxDimension / size.width, maxDimension / size.height)
        if ratio >= 1.0 { return image }

        let newSize = CGSize(width: size.width * ratio, height: size.height * ratio)
        UIGraphicsBeginImageContextWithOptions(newSize, false, 1.0)
        image.draw(in: CGRect(origin: .zero, size: newSize))
        let resized = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        return resized
    }
}

public enum GeminiError: LocalizedError {
    case missingApiKey
    case invalidImageData
    case invalidEndpoint
    case quotaExceeded
    case parseError
    case networkError(String)

    public var errorDescription: String? {
        switch self {
        case .missingApiKey:
            return "Gemini API key is not configured. Please add your key in Settings."
        case .invalidImageData:
            return "Failed to compress or encode plant photo."
        case .invalidEndpoint:
            return "Invalid Gemini API endpoint configuration."
        case .quotaExceeded:
            return "Gemini API rate limit exceeded (HTTP 429). Please try again shortly or use on-device mode."
        case .parseError:
            return "Failed to parse structured diagnostic report from Gemini."
        case .networkError(let message):
            return message
        }
    }
}
