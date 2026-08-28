export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Sunday, 1=Monday, ..., 6=Saturday

export interface Scheduler {
  id: string;
  fullName: string;
  facilityName: string; // e.g. "Main Hospital OR Scheduling Desk"
  email: string; // e.g. "scheduler@hospital.org"
  phone?: string; // Optional phone for reference
  roleTitle?: string; // e.g. "Lead Surgical Coordinator"
  isActive: boolean;
  notes?: string;
}

export interface ProtectionRule {
  id: string;
  name: string; // e.g. "Wednesday Afternoon OR Protection"
  isActive: boolean;
  daysOfWeek: DayOfWeek[]; // e.g. [3] for Wednesday
  startTime: string; // "12:00" in 24h format
  endTime: string; // "17:00" in 24h format
  debounceMinutes: number; // 0, 3, 5, 10
  maskEventDetails: boolean; // if true, send "Personal Block" instead of event title
  assignedSchedulerIds: string[]; // empty array = broadcast to all active schedulers
  excludedKeywords?: string[]; // e.g. ["#surgery", "#orcase", "Clinic", "Grand Rounds"]
  monitoredCalendarFolder?: string; // e.g. "Personal"
  createdAt: string;
}

export interface CalendarEvent {
  uid: string;
  summary: string;
  start: Date;
  end: Date;
  isAllDay?: boolean;
  calendarName?: string;
  location?: string;
}

export type DeliveryStatus = 'PENDING_DEBOUNCE' | 'SENT' | 'FAILED' | 'CANCELLED';
export type AckStatus = 'UNACKNOWLEDGED' | 'ACKNOWLEDGED' | 'CONFLICT';

export interface NotificationRecord {
  id: string;
  ruleId: string;
  ruleName: string;
  schedulerId: string;
  schedulerName: string;
  schedulerFacility: string;
  recipientEmail: string;
  eventUid: string;
  eventSummary: string;
  eventStart: string;
  eventEnd: string;
  emailSubject: string;
  emailHtml: string;
  emailText: string;
  deliveryStatus: DeliveryStatus;
  sentAt?: string;
  ackStatus: AckStatus;
  ackTimestamp?: string;
  ackNote?: string;
  debounceExpiresAt?: string;
}

export interface ICloudConnectionConfig {
  appleId: string;
  appSpecificPasswordMasked: string;
  isConnected: boolean;
  selectedCalendarName: string;
  lastSyncAt: string | null;
  syncIntervalSeconds: number;
  availableCalendars: string[];
}

export interface EmailRelayConfig {
  senderEmail: string;
  senderName: string;
  replyToEmail: string;
  serviceProvider: 'GMAIL_SMTP' | 'RESEND' | 'OUTLOOK' | 'CUSTOM_SMTP';
  apiKeyOrPasswordMasked: string;
  isVerified: boolean;
  lastTestedAt: string | null;
}

export interface SurgeonProfile {
  name: string;
  title: string;
  specialty: string;
  primaryHospital: string;
  officeEmail: string;
  officePhone?: string;
}
