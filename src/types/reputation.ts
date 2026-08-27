export type Platform = 'GOOGLE' | 'HEALTHGRADES' | 'YELP' | 'RATEMDS' | 'VITALS' | 'ZOCDOC';

export type OperationalTag = 
  | 'WAIT_TIME' 
  | 'FRONT_DESK' 
  | 'BILLING' 
  | 'BEDSIDE_MANNER' 
  | 'CLINICAL_OUTCOME' 
  | 'FACILITY' 
  | 'COMMUNICATION';

export type ReviewStatus = 
  | 'NEW' 
  | 'NEEDS_ACTION' 
  | 'DRAFTED' 
  | 'PUBLISHED' 
  | 'DISPUTE_IN_PROGRESS' 
  | 'REMOVED_BY_PLATFORM' 
  | 'AMPLIFIED' 
  | 'ARCHIVED';

export type ResponseTone = 
  | 'EMPATHETIC_POLICY' 
  | 'PROFESSIONAL_FACTUAL' 
  | 'CONCISE_OFFLINE' 
  | 'WARM_GRATITUDE';

export type ViolationType = 
  | 'PROFANITY_HARASSMENT' 
  | 'UNSUBSTANTIATED_DEFAMATION' 
  | 'LACK_OF_FIRSTHAND_EXPERIENCE' 
  | 'COMPETITOR_SABOTAGE_SPAM' 
  | 'STAFF_NAMING_VIOLATION' 
  | 'OFF_TOPIC_GRIEVANCE';

export interface Review {
  id: string;
  platform: Platform;
  platformReviewId: string;
  authorName: string;
  patientInitials?: string;
  rating: number; // 1 to 5
  reviewText: string;
  publishedAt: string;
  matchedAlias?: string; // 'Abdi Mohit' | 'Alex Mohit' | 'Abdi Alex Mohit'
  operationalTags: OperationalTag[];
  sentimentScore: number; // -1.0 to 1.0
  status: ReviewStatus;
  suggestedAction?: 'RESPOND' | 'DISPUTE_TAKEDOWN' | 'AMPLIFY_RESHARE';
  existingResponse?: {
    text: string;
    publishedAt: string;
    publishedVia: 'DIRECT_API' | 'COMPANION_EXTENSION' | 'MANUAL';
  };
  internalNotes?: string[];
  matchedPatientContact?: {
    name: string;
    phone: string;
    email: string;
    lastVisitDate: string;
    clinicalMilestone?: string;
  };
}

export interface ResponseDraft {
  id: string;
  reviewId: string;
  tone: ResponseTone;
  toneTitle: string;
  content: string;
  isHipaaCompliant: boolean;
  complianceNotes: string;
}

export interface TosViolation {
  type: ViolationType;
  title: string;
  matchedKeywords: string[];
  platformPolicyClause: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface DisputeCase {
  id: string;
  reviewId: string;
  platform: Platform;
  status: 'ANALYZED' | 'DISPATCH_READY' | 'SUBMITTED' | 'UNDER_REVIEW' | 'REMOVED_SUCCESS' | 'REJECTED_BY_PLATFORM';
  violations: TosViolation[];
  appealDossier: {
    subject: string;
    formalStatement: string;
    evidencePoints: string[];
    suggestedRemedy: string;
  };
  submittedAt?: string;
  lastUpdated?: string;
}

export interface ReShareCampaign {
  id: string;
  reviewId: string;
  recipientName: string;
  recipientPhone: string;
  targetPlatform: Platform;
  shortLink: string;
  messageText: string;
  status: 'PENDING' | 'SENT' | 'OPENED' | 'COMPLETED';
  sentAt?: string;
}

export interface SocialCardTheme {
  id: string;
  name: string;
  bgGradient: string;
  cardBg: string;
  textColor: string;
  accentColor: string;
  badgeBg: string;
}

export interface ExtensionActionPayload {
  actionId: string;
  actionType: 'FILL_REPLY' | 'FILL_DISPUTE';
  targetPlatform: Platform;
  targetUrl: string;
  authorName: string;
  reviewSnippet: string;
  textToInject: string;
  status: 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED';
}

// ===================== AUTOPILOT & CLOUD TYPES =====================

export interface AutopilotConfig {
  isEnabled: boolean;
  mode: 'GUARDED' | 'DEFENSIVE' | 'FULL_AUTOPILOT';
  autoDisputeProfanity: boolean;
  autoReShareFiveStar: boolean;
  autoSmsQuickActions: boolean;
  autoPostOpMilestoneSurveys: boolean;
  syncIntervalMinutes: number;
  doctorNotificationPhone: string;
  recognizedAliases: string[];
}

export interface AutopilotActivityLog {
  id: string;
  timestamp: string;
  type: 'CRAWL_SYNC' | 'AUTO_DISPUTE' | 'AUTO_RESHARE' | 'SMS_DISPATCH' | 'AUTO_PUBLISH';
  title: string;
  description: string;
  status: 'SUCCESS' | 'PENDING_APPROVAL' | 'FLAGGED';
  platform?: Platform;
}

export interface CompetitorBenchmark {
  institutionName: string;
  location: string;
  rating: number;
  totalReviews: number;
  isCurrentUser: boolean;
}
