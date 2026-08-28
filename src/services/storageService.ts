import { ProtectionRule, Scheduler, NotificationRecord, ICloudConnectionConfig, SurgeonProfile, EmailRelayConfig } from '../types/vigilor';

const STORAGE_KEYS = {
  VERSION: 'vigilor_storage_version_v7_multicare_team',
  RULES: 'vigilor_rules',
  SCHEDULERS: 'vigilor_schedulers',
  NOTIFICATIONS: 'vigilor_notifications',
  ICLOUD_CONFIG: 'vigilor_icloud_config',
  EMAIL_CONFIG: 'vigilor_email_config',
  SURGEON_PROFILE: 'vigilor_surgeon_profile',
  SENTINEL_PAUSED: 'vigilor_sentinel_paused',
};

const CURRENT_VERSION = '7.0.0_multicare_team_active';

const DEFAULT_PROFILE: SurgeonProfile = {
  name: 'A. Alex Mohit',
  title: 'MD, PhD, FAANS',
  specialty: 'Neurological Surgery',
  primaryHospital: 'MultiCare Neuroscience Institute',
  officeEmail: 'mohalex@gmail.com',
  officePhone: '+1 (206) 650-3283'
};

const DEFAULT_RULES: ProtectionRule[] = [
  {
    id: 'rule_wed_afternoon',
    name: 'Wednesday Afternoon OR Protection',
    isActive: true,
    daysOfWeek: [3], // Wednesday
    startTime: '12:00',
    endTime: '17:00',
    debounceMinutes: 3,
    maskEventDetails: true,
    assignedSchedulerIds: [], // Broadcasts to ALL active schedulers (Emily & Richona)
    excludedKeywords: ['#surgery', '#orcase', 'Clinic', 'Grand Rounds', 'Conference'],
    monitoredCalendarFolder: 'Personal',
    createdAt: new Date().toISOString(),
  }
];

const DEFAULT_SCHEDULERS: Scheduler[] = [
  {
    id: 'sched_emily_maluyo',
    fullName: 'Emily Jenie Maluyo',
    facilityName: 'MultiCare Neuroscience Institute OR Scheduling Desk',
    email: 'EmilyJenie.Maluyo@Multicare.org',
    phone: '',
    roleTitle: 'Surgical Coordinator',
    isActive: true,
    notes: 'Primary surgical coordinator. Receives automated Wednesday OR blackout notices.'
  },
  {
    id: 'sched_richona_hill',
    fullName: 'Richona Hill',
    facilityName: 'MultiCare Neuroscience Institute OR Scheduling Desk',
    email: 'Richona.Hill@Multicare.org',
    phone: '',
    roleTitle: 'Surgical Coordinator',
    isActive: true,
    notes: 'Surgical coordinator. Receives automated Wednesday OR blackout notices.'
  }
];

const DEFAULT_ICLOUD_CONFIG: ICloudConnectionConfig = {
  appleId: 'mohalex@gmail.com',
  appSpecificPasswordMasked: '••••-••••-••••-••••',
  isConnected: true,
  selectedCalendarName: 'Personal',
  lastSyncAt: new Date().toISOString(),
  syncIntervalSeconds: 60,
  availableCalendars: [
    'Personal',
    'Work / Clinical',
    'OR Cases',
    'Academic & Research'
  ]
};

const DEFAULT_EMAIL_CONFIG: EmailRelayConfig = {
  senderEmail: 'mohalex@gmail.com',
  senderName: 'A. Alex Mohit, MD, PhD, FAANS',
  replyToEmail: 'mohalex@gmail.com',
  serviceProvider: 'GMAIL_SMTP',
  apiKeyOrPasswordMasked: '',
  isVerified: true,
  lastTestedAt: null
};

const DEFAULT_NOTIFICATIONS: NotificationRecord[] = [];

function ensureCleanState() {
  try {
    const version = localStorage.getItem(STORAGE_KEYS.VERSION);
    if (version !== CURRENT_VERSION) {
      localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
      localStorage.setItem(STORAGE_KEYS.SURGEON_PROFILE, JSON.stringify(DEFAULT_PROFILE));
      localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(DEFAULT_RULES));
      localStorage.setItem(STORAGE_KEYS.SCHEDULERS, JSON.stringify(DEFAULT_SCHEDULERS));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(DEFAULT_NOTIFICATIONS));
      localStorage.setItem(STORAGE_KEYS.ICLOUD_CONFIG, JSON.stringify(DEFAULT_ICLOUD_CONFIG));
      localStorage.setItem(STORAGE_KEYS.EMAIL_CONFIG, JSON.stringify(DEFAULT_EMAIL_CONFIG));
      localStorage.setItem(STORAGE_KEYS.SENTINEL_PAUSED, 'false');
    }
  } catch (e) {
    console.error('Failed to initialize storage', e);
  }
}

ensureCleanState();

export const storageService = {
  getRules: (): ProtectionRule[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RULES);
      return data ? JSON.parse(data) : DEFAULT_RULES;
    } catch {
      return DEFAULT_RULES;
    }
  },

  saveRules: (rules: ProtectionRule[]): void => {
    localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(rules));
  },

  getSchedulers: (): Scheduler[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SCHEDULERS);
      return data ? JSON.parse(data) : DEFAULT_SCHEDULERS;
    } catch {
      return DEFAULT_SCHEDULERS;
    }
  },

  saveSchedulers: (schedulers: Scheduler[]): void => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULERS, JSON.stringify(schedulers));
  },

  getNotifications: (): NotificationRecord[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  },

  saveNotifications: (notifications: NotificationRecord[]): void => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  },

  addNotification: (notification: NotificationRecord): void => {
    const existing = storageService.getNotifications();
    const updated = [notification, ...existing];
    storageService.saveNotifications(updated);
  },

  updateNotificationAck: (notificationId: string, status: 'ACKNOWLEDGED' | 'CONFLICT', note?: string): void => {
    const existing = storageService.getNotifications();
    const updated = existing.map(n => {
      if (n.id === notificationId) {
        return {
          ...n,
          ackStatus: status,
          ackTimestamp: new Date().toISOString(),
          ackNote: note || (status === 'ACKNOWLEDGED' ? 'Confirmed by scheduler' : 'Flagged conflict')
        };
      }
      return n;
    });
    storageService.saveNotifications(updated);
  },

  getICloudConfig: (): ICloudConnectionConfig => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ICLOUD_CONFIG);
      return data ? JSON.parse(data) : DEFAULT_ICLOUD_CONFIG;
    } catch {
      return DEFAULT_ICLOUD_CONFIG;
    }
  },

  saveICloudConfig: (config: ICloudConnectionConfig): void => {
    localStorage.setItem(STORAGE_KEYS.ICLOUD_CONFIG, JSON.stringify(config));
  },

  getEmailConfig: (): EmailRelayConfig => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EMAIL_CONFIG);
      return data ? JSON.parse(data) : DEFAULT_EMAIL_CONFIG;
    } catch {
      return DEFAULT_EMAIL_CONFIG;
    }
  },

  saveEmailConfig: (config: EmailRelayConfig): void => {
    localStorage.setItem(STORAGE_KEYS.EMAIL_CONFIG, JSON.stringify(config));
  },

  getSurgeonProfile: (): SurgeonProfile => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SURGEON_PROFILE);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveSurgeonProfile: (profile: SurgeonProfile): void => {
    localStorage.setItem(STORAGE_KEYS.SURGEON_PROFILE, JSON.stringify(profile));
  },

  isSentinelPaused: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.SENTINEL_PAUSED) === 'true';
  },

  setSentinelPaused: (paused: boolean): void => {
    localStorage.setItem(STORAGE_KEYS.SENTINEL_PAUSED, paused ? 'true' : 'false');
  },

  resetToDefaults: (): void => {
    localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(DEFAULT_RULES));
    localStorage.setItem(STORAGE_KEYS.SCHEDULERS, JSON.stringify(DEFAULT_SCHEDULERS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(DEFAULT_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.ICLOUD_CONFIG, JSON.stringify(DEFAULT_ICLOUD_CONFIG));
    localStorage.setItem(STORAGE_KEYS.EMAIL_CONFIG, JSON.stringify(DEFAULT_EMAIL_CONFIG));
    localStorage.setItem(STORAGE_KEYS.SURGEON_PROFILE, JSON.stringify(DEFAULT_PROFILE));
    localStorage.setItem(STORAGE_KEYS.SENTINEL_PAUSED, 'false');
  }
};
