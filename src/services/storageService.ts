import { ProtectionRule, Scheduler, NotificationRecord, ICloudConnectionConfig, SurgeonProfile } from '../types/vigilor';

export interface TwilioConfig {
  accountSid: string;
  authTokenMasked: string;
  fromPhoneNumber: string;
  targetPhoneNumber: string;
  isVerified: boolean;
  lastTestedAt: string | null;
}

const STORAGE_KEYS = {
  VERSION: 'vigilor_storage_version_v4_diagnostics',
  RULES: 'vigilor_rules',
  SCHEDULERS: 'vigilor_schedulers',
  NOTIFICATIONS: 'vigilor_notifications',
  ICLOUD_CONFIG: 'vigilor_icloud_config',
  SURGEON_PROFILE: 'vigilor_surgeon_profile',
  SENTINEL_PAUSED: 'vigilor_sentinel_paused',
  TWILIO_CONFIG: 'vigilor_twilio_config',
};

const CURRENT_VERSION = '4.0.0_live_twilio_diagnostics';

const DEFAULT_PROFILE: SurgeonProfile = {
  name: 'A. Alex Mohit',
  title: 'MD, PhD, FAANS',
  specialty: 'Neurological Surgery',
  primaryHospital: 'Neurosurgery & Spine Center',
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
    assignedSchedulerIds: [],
    excludedKeywords: ['#surgery', '#orcase', 'Clinic', 'Grand Rounds', 'Conference'],
    monitoredCalendarFolder: 'Personal',
    createdAt: new Date().toISOString(),
  }
];

const DEFAULT_SCHEDULERS: Scheduler[] = [
  {
    id: 'sched_primary_1',
    fullName: 'Lead Surgery Scheduler',
    facilityName: 'Main Hospital OR Scheduling Desk',
    phone: '+1 (206) 650-3283',
    email: 'scheduler@hospital.org',
    preferredChannel: 'BOTH',
    isActive: true,
    notes: 'Primary surgical coordinator. Receives automated OR blackout alerts.'
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

const DEFAULT_TWILIO_CONFIG: TwilioConfig = {
  accountSid: '',
  authTokenMasked: '',
  fromPhoneNumber: '+17372583478',
  targetPhoneNumber: '+12066503283',
  isVerified: false,
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
      localStorage.setItem(STORAGE_KEYS.TWILIO_CONFIG, JSON.stringify(DEFAULT_TWILIO_CONFIG));
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

  getTwilioConfig: (): TwilioConfig => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TWILIO_CONFIG);
      return data ? JSON.parse(data) : DEFAULT_TWILIO_CONFIG;
    } catch {
      return DEFAULT_TWILIO_CONFIG;
    }
  },

  saveTwilioConfig: (config: TwilioConfig): void => {
    localStorage.setItem(STORAGE_KEYS.TWILIO_CONFIG, JSON.stringify(config));
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
    localStorage.setItem(STORAGE_KEYS.TWILIO_CONFIG, JSON.stringify(DEFAULT_TWILIO_CONFIG));
    localStorage.setItem(STORAGE_KEYS.SURGEON_PROFILE, JSON.stringify(DEFAULT_PROFILE));
    localStorage.setItem(STORAGE_KEYS.SENTINEL_PAUSED, 'false');
  }
};
