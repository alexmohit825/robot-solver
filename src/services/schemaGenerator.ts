import { PHYSICIAN_PROFILE } from '../data/mockReviews';
import { Review } from '../types/reputation';

export class SchemaGenerator {
  /**
   * Generates Schema.org JSON-LD markup for doctor's website to display star ratings in Google search
   * Includes alternateName array for Google Knowledge Graph alias disambiguation
   */
  static generateJsonLd(reviews: Review[]): string {
    const publishedReviews = reviews.filter(r => r.rating >= 4);
    
    const schema = {
      "@context": "https://schema.org/",
      "@type": "Physician",
      "name": PHYSICIAN_PROFILE.name,
      "alternateName": PHYSICIAN_PROFILE.recognizedAliases,
      "medicalSpecialty": PHYSICIAN_PROFILE.specialty,
      "hospitalAffiliation": {
        "@type": "Hospital",
        "name": PHYSICIAN_PROFILE.hospitalAffiliation,
        "address": "315 Martin Luther King Jr Way, Tacoma, WA 98405"
      },
      "memberOf": {
        "@type": "MedicalOrganization",
        "name": PHYSICIAN_PROFILE.practiceName
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "315 Martin Luther King Jr Way, Suite 400",
        "addressLocality": "Tacoma",
        "addressRegion": "WA",
        "postalCode": "98405",
        "addressCountry": "US"
      },
      "telephone": PHYSICIAN_PROFILE.phone,
      "url": PHYSICIAN_PROFILE.website,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": PHYSICIAN_PROFILE.aggregateRating.toFixed(1),
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": PHYSICIAN_PROFILE.totalReviews.toString()
      },
      "review": publishedReviews.slice(0, 3).map(r => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": r.authorName
        },
        "datePublished": r.publishedAt.split('T')[0],
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": r.rating.toString(),
          "bestRating": "5"
        },
        "reviewBody": r.reviewText
      }))
    };

    return JSON.stringify(schema, null, 2);
  }

  /**
   * Generates HTML embed code for responsive website widget
   */
  static generateEmbedWidgetCode(widgetTheme: 'LIGHT' | 'DARK' | 'MINIMAL' = 'LIGHT'): string {
    return `<!-- MedPulse Verified Physician Reputation Widget -->
<div id="medpulse-reputation-widget" 
     data-doctor-npi="${PHYSICIAN_PROFILE.npi}"
     data-doctor-name="${PHYSICIAN_PROFILE.name}"
     data-aliases="${PHYSICIAN_PROFILE.recognizedAliases.join(',')}"
     data-theme="${widgetTheme.toLowerCase()}"
     data-show-stars="true"
     data-layout="carousel">
</div>
<script src="https://cdn.medpulse.io/v1/widget.bundle.js" async defer></script>`;
  }

  /**
   * Builds the 1-click patient re-share message with copyable link
   */
  static buildReSharePrompt(review: Review, targetPlatform: string = 'Healthgrades'): { message: string; shortLink: string } {
    const firstName = review.matchedPatientContact?.name.split(' ')[0] || review.authorName.split(' ')[0] || 'there';
    const slug = review.authorName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const shortLink = `https://medpulse.io/r/${slug}-${targetPlatform.toLowerCase().slice(0, 2)}`;

    const message = `Hi ${firstName}, Dr. Mohit saw your wonderful review on Google and is deeply grateful! Would you be willing to do a quick 10-second copy-paste to our ${targetPlatform} profile to help other neurosurgery & spine patients find us at MultiCare?

Tap to copy your review & open ${targetPlatform}:
${shortLink}`;

    return { message, shortLink };
  }
}
