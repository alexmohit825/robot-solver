import { Review, AutopilotConfig, AutopilotActivityLog, CompetitorBenchmark } from '../types/reputation';

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-001',
    platform: 'HEALTHGRADES',
    platformReviewId: 'hg_8921',
    authorName: 'Mark R.',
    matchedAlias: 'Abdi Mohit',
    rating: 1,
    reviewText: 'Total scam artist. Stole my money for an MRI consult and used f***ing bad language when I asked questions. Avoid this crook at all costs!',
    publishedAt: '2026-08-24T13:40:00Z',
    operationalTags: ['BILLING', 'COMMUNICATION'],
    sentimentScore: -0.95,
    status: 'NEEDS_ACTION',
    suggestedAction: 'DISPUTE_TAKEDOWN',
    internalNotes: [
      'Indexed under Healthgrades profile: "Dr. Abdi Mohit, MD"',
      'Checked MultiCare Tacoma registry: Patient was billed by outside imaging facility, not our neurosurgical clinic.',
      'Explicit profanity ("f***ing") and defamatory language directly violates Healthgrades Section 6 guidelines.'
    ]
  },
  {
    id: 'rev-002',
    platform: 'GOOGLE',
    platformReviewId: 'gbp_5421',
    authorName: 'Jennifer Walsh',
    patientInitials: 'JW',
    matchedAlias: 'Alex Mohit',
    rating: 1,
    reviewText: 'Waited 50 minutes past my scheduled spine consultation at the MultiCare Tacoma clinic. When I asked the front desk receptionist how much longer, she was dismissive without checking Dr. Alex Mohit\'s emergency surgery schedule.',
    publishedAt: '2026-08-24T10:15:00Z',
    operationalTags: ['WAIT_TIME', 'FRONT_DESK', 'FACILITY'],
    sentimentScore: -0.78,
    status: 'NEEDS_ACTION',
    suggestedAction: 'RESPOND',
    matchedPatientContact: {
      name: 'Jennifer Walsh',
      phone: '+1 (253) 342-8819',
      email: 'jennifer.walsh@example.com',
      lastVisitDate: '2026-08-23',
      clinicalMilestone: 'Pre-op Lumbar Consultation'
    }
  },
  {
    id: 'rev-003',
    platform: 'GOOGLE',
    platformReviewId: 'gbp_9901',
    authorName: 'Elena Rostova',
    patientInitials: 'ER',
    matchedAlias: 'Abdi Alex Mohit',
    rating: 5,
    reviewText: 'Dr. Abdi Alex Mohit performed my complex cervical spine fusion at MultiCare Tacoma General Hospital after two other surgeons said nothing could be done. I went from debilitating nerve pain to 100% pain-free and back to hiking Mount Rainier. He is a brilliant neurosurgeon with unmatched compassion.',
    publishedAt: '2026-08-23T18:30:00Z',
    operationalTags: ['CLINICAL_OUTCOME', 'BEDSIDE_MANNER', 'COMMUNICATION'],
    sentimentScore: 0.98,
    status: 'AMPLIFIED',
    suggestedAction: 'AMPLIFY_RESHARE',
    matchedPatientContact: {
      name: 'Elena Rostova',
      phone: '+1 (253) 892-4411',
      email: 'elena.rostova@example.com',
      lastVisitDate: '2026-08-20',
      clinicalMilestone: '6-Week Post-Op Spine Exam (Pain-Free)'
    }
  },
  {
    id: 'rev-004',
    platform: 'YELP',
    platformReviewId: 'ylp_3192',
    authorName: 'David K.',
    matchedAlias: 'Alex Mohit',
    rating: 2,
    reviewText: 'Dr. Alex Mohit is undeniably one of the top neurosurgeons in Washington, but the billing department took months to submit pre-authorization to my insurance for my lumbar disc procedure.',
    publishedAt: '2026-08-22T14:10:00Z',
    operationalTags: ['BILLING', 'COMMUNICATION'],
    sentimentScore: -0.62,
    status: 'NEEDS_ACTION',
    suggestedAction: 'RESPOND'
  },
  {
    id: 'rev-005',
    platform: 'RATEMDS',
    platformReviewId: 'rmd_7712',
    authorName: 'Anonymous Visitor',
    matchedAlias: 'Abdi Mohit',
    rating: 1,
    reviewText: 'I never even went here because my friend told me this neurosurgeon Dr. Abdi Mohit is too busy. Go to Seattle Spine Center instead, they have much more availability!',
    publishedAt: '2026-08-21T09:00:00Z',
    operationalTags: ['COMMUNICATION'],
    sentimentScore: -0.89,
    status: 'DISPUTE_IN_PROGRESS',
    suggestedAction: 'DISPUTE_TAKEDOWN',
    internalNotes: [
      'Commercial competitor steering (Seattle Spine Center) + Lack of firsthand patient encounter.',
      'Formal takedown petition filed with RateMDs moderation.'
    ]
  },
  {
    id: 'rev-006',
    platform: 'VITALS',
    platformReviewId: 'vit_4401',
    authorName: 'Robert Martinez',
    matchedAlias: 'Abdi Alex Mohit',
    rating: 5,
    reviewText: 'Outstanding neurosurgeon. Dr. Abdi Alex Mohit explained the intricacies of my cranial procedure at MultiCare with remarkable clarity and patience. His entire surgical team in Tacoma provided five-star care from pre-op to recovery.',
    publishedAt: '2026-08-20T16:45:00Z',
    operationalTags: ['CLINICAL_OUTCOME', 'FACILITY', 'COMMUNICATION'],
    sentimentScore: 0.94,
    status: 'PUBLISHED',
    suggestedAction: 'AMPLIFY_RESHARE',
    existingResponse: {
      text: 'Thank you for your generous review, Robert. Our neurosurgical team at MultiCare Neuroscience Institute is dedicated to providing thorough, individualized surgical care.',
      publishedAt: '2026-08-21T10:00:00Z',
      publishedVia: 'DIRECT_API'
    }
  },
  {
    id: 'rev-007',
    platform: 'GOOGLE',
    platformReviewId: 'gbp_1120',
    authorName: 'Samantha Lee',
    matchedAlias: 'Alex Mohit',
    rating: 5,
    reviewText: 'I had immense fear about brain surgery for a benign meningioma. Dr. Alex Mohit\'s extensive MD/PhD neurosurgical background and calm demeanor at MultiCare gave me complete peace of mind. Surgery was a flawless success and I was back home in 3 days!',
    publishedAt: '2026-08-19T11:20:00Z',
    operationalTags: ['BEDSIDE_MANNER', 'CLINICAL_OUTCOME'],
    sentimentScore: 0.96,
    status: 'AMPLIFIED',
    suggestedAction: 'AMPLIFY_RESHARE',
    matchedPatientContact: {
      name: 'Samantha Lee',
      phone: '+1 (253) 771-3329',
      email: 'samantha.lee@example.com',
      lastVisitDate: '2026-08-18',
      clinicalMilestone: '3-Month Post-Op Cranial MRI (Clear)'
    }
  }
];

export const PHYSICIAN_PROFILE = {
  name: 'Abdi Alex Mohit, MD, PhD',
  credentials: 'MD, PhD, FAANS',
  doctorCellPhone: '+1 (206) 650-3283',
  recognizedAliases: [
    'Abdi Alex Mohit',
    'Abdi Mohit',
    'Alex Mohit',
    'Abdi A. Mohit',
    'Dr. Mohit',
    'Dr. Alex Mohit'
  ],
  specialty: 'Neurological Surgery & Complex Spine Surgery',
  practiceName: 'MultiCare Neuroscience Institute',
  hospitalAffiliation: 'MultiCare Tacoma General Hospital',
  address: '315 Martin Luther King Jr Way, Suite 400, Tacoma, WA 98405',
  phone: '(253) 555-0188',
  website: 'https://multicare.org/neuroscience',
  npi: '1942830112',
  location: 'Tacoma, Washington',
  aggregateRating: 4.9,
  totalReviews: 248,
  breakdown: {
    GOOGLE: { rating: 4.9, count: 124, directApi: true, matchedAs: 'Alex Mohit / Abdi Alex Mohit' },
    HEALTHGRADES: { rating: 4.7, count: 52, directApi: false, matchedAs: 'Abdi Mohit, MD' },
    YELP: { rating: 4.5, count: 28, directApi: false, matchedAs: 'Alex Mohit, MD' },
    RATEMDS: { rating: 4.9, count: 24, directApi: false, matchedAs: 'Dr. Abdi Mohit' },
    VITALS: { rating: 4.9, count: 20, directApi: false, matchedAs: 'Abdi Alex Mohit, MD, PhD' }
  }
};

export const INITIAL_AUTOPILOT_CONFIG: AutopilotConfig = {
  isEnabled: true,
  mode: 'GUARDED',
  autoDisputeProfanity: true,
  autoReShareFiveStar: true,
  autoSmsQuickActions: true,
  autoPostOpMilestoneSurveys: true,
  syncIntervalMinutes: 60,
  doctorNotificationPhone: '+1 (206) 650-3283',
  recognizedAliases: [
    'Abdi Alex Mohit',
    'Abdi Mohit',
    'Alex Mohit',
    'Abdi A. Mohit',
    'Dr. Mohit',
    'Dr. Alex Mohit'
  ]
};

export const INITIAL_ACTIVITY_LOGS: AutopilotActivityLog[] = [
  {
    id: 'log-001',
    timestamp: '2026-08-24T15:30:00Z',
    type: 'CRAWL_SYNC',
    title: 'Multi-Alias Ingestion Scan Completed (6 Aliases)',
    description: 'Scanned 5 platforms across aliases "Abdi Mohit", "Alex Mohit", and "Abdi Alex Mohit". 248 reviews unified under NPI 1942830112.',
    status: 'SUCCESS'
  },
  {
    id: 'log-002',
    timestamp: '2026-08-24T13:42:00Z',
    type: 'AUTO_DISPUTE',
    title: 'ToS Profanity Violation Detected (Healthgrades)',
    description: 'Auto-compiled legalistic takedown dossier for review under "Dr. Abdi Mohit". Enqueued for 1-click dispatch.',
    status: 'PENDING_APPROVAL',
    platform: 'HEALTHGRADES'
  },
  {
    id: 'log-003',
    timestamp: '2026-08-24T10:18:00Z',
    type: 'SMS_DISPATCH',
    title: 'SMS 1-Tap Quick Action Sent to (206) 650-3283',
    description: 'Sent alert to Dr. Mohit for Google review by Jennifer W. (matched via "Alex Mohit"). Waiting for reply.',
    status: 'PENDING_APPROVAL',
    platform: 'GOOGLE'
  },
  {
    id: 'log-004',
    timestamp: '2026-08-23T18:35:00Z',
    type: 'AUTO_RESHARE',
    title: 'Autonomous 1-Click Re-Share Prompt Dispatched',
    description: 'Auto-matched 5-star Google review to Elena Rostova. SMS re-share invitation sent for Healthgrades boost.',
    status: 'SUCCESS',
    platform: 'GOOGLE'
  }
];

export const REGIONAL_BENCHMARKS: CompetitorBenchmark[] = [
  {
    institutionName: 'MultiCare Neuroscience Institute (Dr. Abdi Alex Mohit)',
    location: 'Tacoma, WA',
    rating: 4.9,
    totalReviews: 248,
    isCurrentUser: true
  },
  {
    institutionName: 'Swedish Neuroscience Institute',
    location: 'Seattle, WA',
    rating: 4.6,
    totalReviews: 312,
    isCurrentUser: false
  },
  {
    institutionName: 'UW Medicine Neurological Surgery',
    location: 'Seattle, WA',
    rating: 4.7,
    totalReviews: 295,
    isCurrentUser: false
  },
  {
    institutionName: 'Virginia Mason Franciscan Spine Care',
    location: 'Tacoma & Federal Way, WA',
    rating: 4.3,
    totalReviews: 184,
    isCurrentUser: false
  }
];
