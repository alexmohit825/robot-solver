//
//  SpatialTouchEngine.swift
//  ErgosKeyboardExtension
//
//  Dynamic Probabilistic Hit-Testing & Contact Ellipse Centroid Processor for iPhone 17 Pro.
//

import UIKit

public struct KeyCandidate {
    public let key: KeyDefinition
    public let posteriorProbability: Double
    public let spatialLikelihood: Double
    public let languagePrior: Double
}

public class SpatialTouchEngine {
    private var keys: [KeyDefinition] = []
    private var userBias: CGPoint = .zero
    private let priorModel = ProbabilisticTrie()
    private let adaptiveMap = AdaptiveTouchMap.shared
    
    public func updateGeometry(bounds: CGRect, mode: KeyboardLayout) {
        self.keys = BiomechanicalLayoutEngine.generateLayout(for: bounds, mode: mode)
    }
    
    public func evaluateHit(
        point: CGPoint,
        majorRadius: CGFloat,
        tolerance: CGFloat,
        context: String
    ) -> (selectedKey: KeyDefinition, confidence: Double, candidates: [KeyCandidate]) {
        
        let effectiveMajorRadius = max(18.0, majorRadius)
        let centroid = CGPoint(
            x: point.x - userBias.x,
            y: point.y - userBias.y
        )
        
        let priors = priorModel.characterPriors(for: context)
        
        var candidateList: [KeyCandidate] = []
        var totalScoreSum: Double = 0.0
        
        for key in keys {
            let adjustedCenter = adaptiveMap.adjustedCenter(for: key)
            let sigmaX = max(16.0, effectiveMajorRadius * 0.85)
            let sigmaY = max(18.0, effectiveMajorRadius * 0.95)
            
            let dx = Double(centroid.x - adjustedCenter.x)
            let dy = Double(centroid.y - adjustedCenter.y)
            
            let exponent = -((dx * dx) / (2.0 * Double(sigmaX * sigmaX)) + (dy * dy) / (2.0 * Double(sigmaY * sigmaY)))
            let spatialLikelihood = exp(exponent)
            
            let prior = priors[key.identifier] ?? 0.01
            let posteriorScore = spatialLikelihood * pow(prior, 0.65)
            
            candidateList.append(
                KeyCandidate(
                    key: key,
                    posteriorProbability: posteriorScore,
                    spatialLikelihood: spatialLikelihood,
                    languagePrior: prior
                )
            )
            totalScoreSum += posteriorScore
        }
        
        let normalized = candidateList.map { c in
            KeyCandidate(
                key: c.key,
                posteriorProbability: c.posteriorProbability / (totalScoreSum > 0 ? totalScoreSum : 1.0),
                spatialLikelihood: c.spatialLikelihood,
                languagePrior: c.languagePrior
            )
        }.sorted { $0.posteriorProbability > $1.posteriorProbability }
        
        let best = normalized.first ?? KeyCandidate(key: keys[0], posteriorProbability: 1.0, spatialLikelihood: 1.0, languagePrior: 0.1)
        return (selectedKey: best.key, confidence: best.posteriorProbability, candidates: normalized)
    }
}
