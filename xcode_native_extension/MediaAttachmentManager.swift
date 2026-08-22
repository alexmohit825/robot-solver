//
//  MediaAttachmentManager.swift
//  ErgosKeyboardExtension
//
//  Handles the (+) Plus App Menu attachments: Photos, Apple Cash, Maps, Camera.
//

import UIKit
import PhotosUI
import CoreLocation
import PassKit

public enum AttachmentType {
    case photo(UIImage)
    case appleCash(amount: Decimal)
    case appleMaps(coordinate: CLLocationCoordinate2D, label: String)
    case googleMaps(coordinate: CLLocationCoordinate2D, label: String)
    case cameraCapture
    case voiceMemo(URL)
}

public final class MediaAttachmentManager {
    
    public static let shared = MediaAttachmentManager()
    
    /// Copies image / rich attachment to UIPasteboard for seamless paste in Messages/WhatsApp
    public func attachMediaToPasteboard(image: UIImage) {
        UIPasteboard.general.image = image
    }
    
    /// Generates deep link URL for Apple Maps or Google Maps location pins
    public func generateMapsURL(coordinate: CLLocationCoordinate2D, provider: Provider) -> URL? {
        switch provider {
        case .appleMaps:
            return URL(string: "http://maps.apple.com/?ll=\(coordinate.latitude),\(coordinate.longitude)&q=Pinned+Location")
        case .googleMaps:
            return URL(string: "https://www.google.com/maps/search/?api=1&query=\(coordinate.latitude),\(coordinate.longitude)")
        }
    }
    
    public enum Provider {
        case appleMaps
        case googleMaps
    }
}
