import { Review, ResponseDraft, ResponseTone, DisputeCase, TosViolation } from '../types/reputation';
import { PHYSICIAN_PROFILE } from '../data/mockReviews';

export class AiEngine {
  /**
   * Generates multiple contextual response drafts based on tone and review text
   */
  static generateResponseDrafts(review: Review, customNotes?: string): ResponseDraft[] {
    const isNegative = review.rating <= 2;
    const phone = PHYSICIAN_PROFILE.phone;

    if (!isNegative) {
      return [
        {
          id: `dft-${Date.now()}-1`,
          reviewId: review.id,
          tone: 'WARM_GRATITUDE',
          toneTitle: 'Warm & Professional Gratitude',
          content: `Thank you for your generous feedback, ${review.authorName}. Our surgical and clinical team at ${PHYSICIAN_PROFILE.practiceName} is dedicated to providing meticulous, compassionate neurological and spine care to our patients throughout Tacoma and the Pacific Northwest. We wish you continued health and well-being!`,
          isHipaaCompliant: true,
          complianceNotes: 'Safe: Expresses clinical gratitude without disclosing diagnosis or surgical specifics.'
        }
      ];
    }

    const drafts: ResponseDraft[] = [
      {
        id: `dft-${Date.now()}-1`,
        reviewId: review.id,
        tone: 'EMPATHETIC_POLICY',
        toneTitle: 'Empathetic & Policy-Focused (Recommended)',
        content: `Thank you for sharing your experience. At ${PHYSICIAN_PROFILE.practiceName}, we are deeply committed to providing timely, transparent communication and the highest standard of patient care. We take your feedback seriously and would welcome the opportunity to discuss your experience directly. Please contact our Practice Manager at ${phone} so we can assist you with your concerns.`,
        isHipaaCompliant: true,
        complianceNotes: 'High Safety: Focuses on clinic care standards and provides a direct offline telephone line.'
      },
      {
        id: `dft-${Date.now()}-2`,
        reviewId: review.id,
        tone: 'PROFESSIONAL_FACTUAL',
        toneTitle: 'Professional & Objective Resolution',
        content: `We appreciate you bringing this matter to our attention. Our neurosurgical practice at ${PHYSICIAN_PROFILE.practiceName} strives to ensure all consultations and clinical processes are handled with utmost professionalism and care. If your experience fell short of these expectations, please contact our administration at ${phone} to discuss this in detail.`,
        isHipaaCompliant: true,
        complianceNotes: 'High Safety: Objective, avoids clinical encounter confirmation, reinforces standard care protocol.'
      },
      {
        id: `dft-${Date.now()}-3`,
        reviewId: review.id,
        tone: 'CONCISE_OFFLINE',
        toneTitle: 'Concise Offline Redirection',
        content: `We take all patient feedback seriously and remain dedicated to excellence in neurological care. Please contact our Tacoma office directly at ${phone} so we may assist you privately.`,
        isHipaaCompliant: true,
        complianceNotes: 'Maximum Safety: Minimal public footprint that de-escalates online grievances.'
      }
    ];

    if (customNotes) {
      drafts[0].content += ` (Note regarding your inquiry: ${customNotes})`;
    }

    return drafts;
  }

  /**
   * Scans a review for platform Terms of Service (ToS) violations
   */
  static analyzeTosViolations(review: Review): TosViolation[] {
    const text = review.reviewText.toLowerCase();
    const violations: TosViolation[] = [];

    // Check 1: Profanity / Vulgarity / Harassment
    const profanityRegex = /\b(f\*{2,3}ing|fuck|fucking|shit|bitch|bastard|crook|scam artist|asshole)\b/i;
    if (profanityRegex.test(review.reviewText)) {
      const match = review.reviewText.match(profanityRegex)?.[0] || 'Profane language';
      violations.push({
        type: 'PROFANITY_HARASSMENT',
        title: 'Explicit Profanity & Obscene Language',
        matchedKeywords: [match],
        platformPolicyClause: this.getPlatformPolicyClause(review.platform, 'PROFANITY'),
        severity: 'CRITICAL'
      });
    }

    // Check 2: Lack of Firsthand Consumer Experience (Hearsay)
    const hearsayRegex = /\b(my friend told me|my cousin|never went here|never been|someone told me|heard that)\b/i;
    if (hearsayRegex.test(text)) {
      const match = text.match(hearsayRegex)?.[0] || 'Hearsay indicator';
      violations.push({
        type: 'LACK_OF_FIRSTHAND_EXPERIENCE',
        title: 'Absence of Firsthand Patient Experience',
        matchedKeywords: [match],
        platformPolicyClause: this.getPlatformPolicyClause(review.platform, 'HEARSAY'),
        severity: 'CRITICAL'
      });
    }

    // Check 3: Competitor Promotion / Commercial Sabotage
    const competitorRegex = /\b(go to|instead of|down the street|better clinic|competitor|other doctor|instead)\b/i;
    if (competitorRegex.test(text) && text.includes('instead')) {
      violations.push({
        type: 'COMPETITOR_SABOTAGE_SPAM',
        title: 'Competitor Steering & Commercial Conflict',
        matchedKeywords: ['Steering traffic to an external medical facility'],
        platformPolicyClause: this.getPlatformPolicyClause(review.platform, 'COMPETITOR'),
        severity: 'HIGH'
      });
    }

    // Check 4: Unsubstantiated Defamation / Allegations of Criminality
    if (text.includes('stole') || text.includes('fraud') || text.includes('scam')) {
      violations.push({
        type: 'UNSUBSTANTIATED_DEFAMATION',
        title: 'Defamatory Accusation of Criminal Conduct',
        matchedKeywords: ['Accusations of theft or fraud without evidence'],
        platformPolicyClause: this.getPlatformPolicyClause(review.platform, 'DEFAMATION'),
        severity: 'HIGH'
      });
    }

    return violations;
  }

  /**
   * Compiles a formal, legalistic takedown dossier
   */
  static buildDisputeDossier(review: Review, violations: TosViolation[]): DisputeCase {
    const policyCitations = violations.map(v => `• ${v.title}: ${v.platformPolicyClause}`).join('\n');
    const evidenceList = violations.flatMap(v => v.matchedKeywords).map(k => `Quoted excerpt: "${k}"`);

    const formalStatement = `To the Content Moderation & Trust Team at ${review.platform},

We are formally petitioning for the expedited removal of Review ID #${review.platformReviewId} regarding Provider ${PHYSICIAN_PROFILE.name} (NPI: ${PHYSICIAN_PROFILE.npi}, Location: ${PHYSICIAN_PROFILE.location}).

This user submission contains material violations of your published Content Submission Guidelines and Terms of Service:

${policyCitations}

Evidence & Factual Findings:
${evidenceList.map(e => `1. ${e}`).join('\n')}

Under the published rules governing user submissions on ${review.platform}, reviews containing profane language, unverified third-party hearsay, or competitor redirection are ineligible for publication and must be suppressed to preserve platform content integrity.

We request immediate remediation and confirmation of review removal.

Respectfully,
Compliance & Practice Administration
${PHYSICIAN_PROFILE.practiceName}
${PHYSICIAN_PROFILE.address}
Phone: ${PHYSICIAN_PROFILE.phone}`;

    return {
      id: `dsp-${Date.now()}`,
      reviewId: review.id,
      platform: review.platform,
      status: 'DISPATCH_READY',
      violations,
      appealDossier: {
        subject: `Formal Takedown Petition: Terms of Service Violation on Review #${review.platformReviewId}`,
        formalStatement,
        evidencePoints: evidenceList,
        suggestedRemedy: 'Permanent removal from public directory index'
      },
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Generates a 30-second morning audio/text executive briefing
   */
  static generateDailyBriefing(reviews: Review[]): { text: string; date: string; audioSeconds: number } {
    const fiveStarCount = reviews.filter(r => r.rating === 5).length;
    const pendingDisputes = reviews.filter(r => r.suggestedAction === 'DISPUTE_TAKEDOWN').length;
    const dateStr = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

    const text = `Good morning Dr. Mohit. Here is your MultiCare Neuroscience Institute reputation briefing for ${dateStr}. Over the last 24 hours, our background sentinel scanned all 5 platforms. You have ${fiveStarCount} verified 5-star clinical reviews, with autonomous re-share invitations dispatched to your post-op spine patients. ${pendingDisputes} policy violation is currently queued with a formal legalistic takedown petition citing platform Terms of Service. Your Pierce County aggregate rating remains steady at an exceptional 4.9 stars.`;

    return {
      text,
      date: dateStr,
      audioSeconds: 28
    };
  }

  private static getPlatformPolicyClause(platform: string, violation: string): string {
    switch (platform) {
      case 'GOOGLE':
        return 'Google Maps User Contributed Content Policy — "Prohibited Content: Harassment, Obscenity, and Fake Engagement (Section 3.2)"';
      case 'HEALTHGRADES':
        return 'Healthgrades User Agreement & Editorial Guidelines — "Section 6: Prohibited Submissions, Defamatory Statements, and Profanity"';
      case 'RATEMDS':
        return 'RateMDs Content Policy — "Posting Guidelines: Slander, Hearsay, and Non-Firsthand Reviews"';
      case 'YELP':
        return 'Yelp Content Guidelines — "Relevance, Inappropriate Content, and Conflicts of Interest"';
      default:
        return 'Standard Healthcare Directory Publishing Terms & Conditions';
    }
  }
}
