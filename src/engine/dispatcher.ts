import { CalendarEvent, ProtectionRule, Scheduler, NotificationRecord, SurgeonProfile } from '../types/vigilor';
import { EvaluationResult } from './ruleEvaluator';

export interface DispatchResult {
  records: NotificationRecord[];
  summaryMessage: string;
}

/**
 * Creates formatted notification records for all targeted schedulers based on an evaluated event
 */
export function prepareNotifications(
  event: CalendarEvent,
  evaluation: EvaluationResult,
  profile: SurgeonProfile,
  isDebouncing: boolean = false
): NotificationRecord[] {
  if (!evaluation.isMatch || !evaluation.matchedRule) {
    return [];
  }

  const rule = evaluation.matchedRule;
  const records: NotificationRecord[] = [];

  for (const scheduler of evaluation.targetSchedulers) {
    const channelsToSend: ('SMS' | 'EMAIL')[] = [];
    if (scheduler.preferredChannel === 'BOTH') {
      channelsToSend.push('SMS', 'EMAIL');
    } else {
      channelsToSend.push(scheduler.preferredChannel);
    }

    for (const channel of channelsToSend) {
      const recordId = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const recipientAddress = channel === 'SMS' ? scheduler.phone : scheduler.email;

      const messageText = generateMessageBody(
        profile.name,
        evaluation.formattedTimeWindow,
        evaluation.sanitizedSummary,
        channel,
        recordId
      );

      const record: NotificationRecord = {
        id: recordId,
        ruleId: rule.id,
        ruleName: rule.name,
        schedulerId: scheduler.id,
        schedulerName: scheduler.fullName,
        schedulerFacility: scheduler.facilityName,
        channel,
        recipientAddress,
        eventUid: event.uid,
        eventSummary: evaluation.sanitizedSummary,
        eventStart: event.start.toISOString(),
        eventEnd: event.end.toISOString(),
        messageText,
        deliveryStatus: isDebouncing ? 'PENDING_DEBOUNCE' : 'SENT',
        sentAt: isDebouncing ? undefined : new Date().toISOString(),
        ackStatus: 'UNACKNOWLEDGED',
        debounceExpiresAt: isDebouncing
          ? new Date(Date.now() + rule.debounceMinutes * 60000).toISOString()
          : undefined,
      };

      records.push(record);
    }
  }

  return records;
}

export function generateMessageBody(
  surgeonName: string,
  formattedTimeWindow: string,
  sanitizedSummary: string,
  channel: 'SMS' | 'EMAIL',
  recordId: string
): string {
  if (channel === 'SMS') {
    return `[VigilOR Sentinel Alert]\n` +
      `${surgeonName} has placed a calendar block for ${formattedTimeWindow}.\n` +
      `Block details: ${sanitizedSummary}.\n` +
      `Please do NOT schedule surgical cases during this window.\n\n` +
      `Confirm / Acknowledge:\n` +
      `https://vigilor.app/ack/${recordId}`;
  }

  // Email format
  return `VigilOR Autonomous Sentinel Alert\n\n` +
    `Dear Surgery Scheduling Team,\n\n` +
    `This is an automated notification from ${surgeonName}'s availability sentinel.\n\n` +
    `A personal/protected block has been scheduled:\n` +
    `• Window: ${formattedTimeWindow}\n` +
    `• Details: ${sanitizedSummary}\n` +
    `• Requested Action: Hold OR block clear. Do NOT book surgery cases for this date/time.\n\n` +
    `Please click the link below to confirm you have adjusted the schedule:\n` +
    `https://vigilor.app/ack/${recordId}\n\n` +
    `Thank you,\n` +
    `${surgeonName} Surgical Practice`;
}
