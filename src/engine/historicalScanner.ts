import { CalendarEvent, ProtectionRule, Scheduler, SurgeonProfile, NotificationRecord } from '../types/vigilor';
import { evaluateEventAgainstRule, formatTime12h, getDayName } from './ruleEvaluator';
import { generateClinicalEmail } from './dispatcher';

export interface PreExistingConflictItem {
  id: string;
  event: CalendarEvent;
  ruleName: string;
  originalSummary: string;
  sanitizedSummary: string;
  eventDateFormatted: string;
  timeWindowFormatted: string;
  targetSchedulers: Scheduler[];
  isPreExisting: boolean;
  status: 'PENDING_DISPATCH' | 'DISPATCHED' | 'FAILED';
  dispatchedAt?: string;
}

const VERIFIED_FORM_TOKEN = '0613e0d5ba48c05c2834b24e4ba63654';

/**
 * Scans a list of calendar events and identifies all conflicting Wednesday appointments
 */
export function scanCalendarForConflicts(
  events: CalendarEvent[],
  rules: ProtectionRule[],
  schedulers: Scheduler[],
  profile: SurgeonProfile
): PreExistingConflictItem[] {
  const activeRules = rules.filter(r => r.isActive);
  if (activeRules.length === 0) return [];

  const results: PreExistingConflictItem[] = [];

  for (const event of events) {
    for (const rule of activeRules) {
      const evaluation = evaluateEventAgainstRule(event, rule, schedulers, `${profile.name}, ${profile.title}`);
      if (evaluation.isMatch) {
        const start = new Date(event.start);
        const end = new Date(event.end);

        const dateOptions: Intl.DateTimeFormatOptions = {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        };
        const eventDateFormatted = start.toLocaleDateString('en-US', dateOptions);

        const startTimeStr = formatTime12h(`${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`);
        const endTimeStr = formatTime12h(`${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`);
        const timeWindowFormatted = `${startTimeStr} – ${endTimeStr}`;

        results.push({
          id: `audit_conflict_${event.uid}`,
          event,
          ruleName: rule.name,
          originalSummary: event.summary,
          sanitizedSummary: evaluation.sanitizedSummary,
          eventDateFormatted,
          timeWindowFormatted,
          targetSchedulers: evaluation.targetSchedulers,
          isPreExisting: true,
          status: 'PENDING_DISPATCH'
        });
        break; // Match first active rule per event
      }
    }
  }

  // Sort chronologically
  return results.sort((a, b) => new Date(a.event.start).getTime() - new Date(b.event.start).getTime());
}

/**
 * Dispatches an official OR Blackout notice for a single pre-existing conflict
 */
export async function dispatchConflictNotice(
  item: PreExistingConflictItem,
  profile: SurgeonProfile
): Promise<NotificationRecord[]> {
  const records: NotificationRecord[] = [];
  const start = new Date(item.event.start);
  const end = new Date(item.event.end);

  const fullWindowStr = `${item.eventDateFormatted} (${item.timeWindowFormatted})`;

  for (const scheduler of item.targetSchedulers) {
    if (!scheduler.isActive || !scheduler.email) continue;

    const recordId = `notif_pre_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const emailPayload = generateClinicalEmail(
      profile,
      scheduler,
      fullWindowStr,
      item.sanitizedSummary,
      recordId
    );

    // Endpoint selection
    const endpoint = scheduler.email.toLowerCase() === 'mohalex@gmail.com'
      ? `https://formsubmit.co/ajax/${VERIFIED_FORM_TOKEN}`
      : `https://formsubmit.co/ajax/${encodeURIComponent(scheduler.email.trim())}`;

    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: emailPayload.subject,
          surgeon: `${profile.name}, ${profile.title}`,
          specialty: profile.specialty,
          facility: profile.primaryHospital,
          recipient_name: scheduler.fullName,
          protected_window: fullWindowStr,
          block_type: item.sanitizedSummary,
          action_required: 'Please hold OR schedule clear. Do NOT book surgical cases during this pre-existing protected window.',
          details: emailPayload.text,
          _captcha: 'false'
        })
      });

      const record: NotificationRecord = {
        id: recordId,
        ruleId: 'rule_pre_existing_scan',
        ruleName: item.ruleName,
        schedulerId: scheduler.id,
        schedulerName: scheduler.fullName,
        schedulerFacility: scheduler.facilityName,
        recipientEmail: scheduler.email,
        eventUid: item.event.uid,
        eventSummary: item.sanitizedSummary,
        eventStart: start.toISOString(),
        eventEnd: end.toISOString(),
        emailSubject: emailPayload.subject,
        emailHtml: emailPayload.html,
        emailText: emailPayload.text,
        deliveryStatus: 'SENT',
        sentAt: new Date().toISOString(),
        ackStatus: 'UNACKNOWLEDGED'
      };

      records.push(record);
    } catch (e) {
      console.error(`Failed to dispatch pre-existing notice to ${scheduler.email}:`, e);
    }
  }

  return records;
}

/**
 * Generates sample pre-existing appointments representing real Wednesday afternoon blocks
 * entered into Apple Calendar prior to app deployment.
 */
export function generateSamplePreExistingCalendar(): CalendarEvent[] {
  const now = new Date();
  const events: CalendarEvent[] = [];

  // Find Wednesdays over past 4 weeks and next 8 weeks
  const baseDate = new Date(now);
  baseDate.setDate(now.getDate() - 28); // 4 weeks ago

  const sampleTitles = [
    'Academic Research & Spine Literature Review',
    'Neurosurgical Department Administrative Time',
    'Spine Fellowship Curriculum Planning',
    'Complex Spine Case Review & Pre-Op Planning',
    'Personal Block: Family & Administrative',
    'Academic Writing & Grant Review',
    'Neurosurgery Grand Rounds Prep & Research',
    'Spine Journal Club & Clinical Analysis'
  ];

  let titleIdx = 0;
  for (let i = 0; i < 14; i++) {
    const current = new Date(baseDate.getTime() + i * 7 * 86400000);
    // Find Wednesday
    const day = current.getDay();
    const diff = (3 - day + 7) % 7;
    current.setDate(current.getDate() + diff);

    const start = new Date(current);
    start.setHours(12, 0, 0, 0);

    const end = new Date(current);
    end.setHours(17, 0, 0, 0);

    events.push({
      uid: `pre_existing_evt_${i}_${start.getTime()}`,
      summary: sampleTitles[titleIdx % sampleTitles.length],
      start,
      end,
      calendarName: 'Personal',
      location: 'MultiCare Neuroscience Institute'
    });

    titleIdx++;
  }

  return events;
}
