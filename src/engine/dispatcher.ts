import { CalendarEvent, ProtectionRule, Scheduler, NotificationRecord, SurgeonProfile } from '../types/vigilor';
import { EvaluationResult } from './ruleEvaluator';

export interface EmailDispatchPayload {
  subject: string;
  html: string;
  text: string;
  recipientEmail: string;
}

/**
 * Prepares formatted clinical email notifications for all targeted schedulers
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
    if (!scheduler.isActive || !scheduler.email) continue;

    const recordId = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const emailPayload = generateClinicalEmail(
      profile,
      scheduler,
      evaluation.formattedTimeWindow,
      evaluation.sanitizedSummary,
      recordId
    );

    const record: NotificationRecord = {
      id: recordId,
      ruleId: rule.id,
      ruleName: rule.name,
      schedulerId: scheduler.id,
      schedulerName: scheduler.fullName,
      schedulerFacility: scheduler.facilityName,
      recipientEmail: scheduler.email,
      eventUid: event.uid,
      eventSummary: evaluation.sanitizedSummary,
      eventStart: event.start.toISOString(),
      eventEnd: event.end.toISOString(),
      emailSubject: emailPayload.subject,
      emailHtml: emailPayload.html,
      emailText: emailPayload.text,
      deliveryStatus: isDebouncing ? 'PENDING_DEBOUNCE' : 'SENT',
      sentAt: isDebouncing ? undefined : new Date().toISOString(),
      ackStatus: 'UNACKNOWLEDGED',
      debounceExpiresAt: isDebouncing
        ? new Date(Date.now() + rule.debounceMinutes * 60000).toISOString()
        : undefined,
    };

    records.push(record);
  }

  return records;
}

/**
 * Generates an official, high-priority clinical email notice
 */
export function generateClinicalEmail(
  profile: SurgeonProfile,
  scheduler: Scheduler,
  formattedTimeWindow: string,
  sanitizedSummary: string,
  recordId: string
): EmailDispatchPayload {
  const surgeonFullName = `${profile.name}, ${profile.title}`;
  const subject = `[OR Block Notice] ${surgeonFullName} - Protected Window (${formattedTimeWindow})`;

  const plainText = 
`=============================================================
VIGILOR CLINICAL SCHEDULE SENTINEL - OR AVAILABILITY NOTICE
=============================================================

Date / Time: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Surgeon: ${surgeonFullName} (${profile.specialty})
Facility: ${profile.primaryHospital}
Recipient: ${scheduler.fullName} <${scheduler.email}> (${scheduler.facilityName})

PROTECTED SCHEDULE BLOCK DETAILS:
-------------------------------------------------------------
• Window: ${formattedTimeWindow}
• Status: ${sanitizedSummary}
• Action Requested: Hold OR schedule clear. Do NOT book surgery cases.

To acknowledge receipt and confirm this block is noted in the OR system:
https://alexmohit825.github.io/vigilOR/?ack=${recordId}&status=confirmed

If there is an active urgent case conflict, please flag immediately:
https://alexmohit825.github.io/vigilOR/?ack=${recordId}&status=conflict

Office Contact: ${profile.officeEmail}
Sent via VigilOR Autonomous Surgical Schedule Sentinel.`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background: #0f172a; padding: 24px; color: #ffffff; border-bottom: 3px solid #10b981; }
    .header h1 { margin: 0; font-size: 18px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em; }
    .header p { margin: 4px 0 0 0; font-size: 13px; color: #94a3b8; }
    .content { padding: 24px; }
    .badge { display: inline-block; background: #ecfdf5; color: #047857; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; border: 1px solid #a7f3d0; margin-bottom: 16px; }
    .card { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px; margin: 16px 0; }
    .card-row { margin-bottom: 8px; font-size: 14px; }
    .card-row:last-child { margin-bottom: 0; }
    .label { font-weight: 700; color: #475569; display: inline-block; width: 90px; }
    .value { color: #0f172a; font-weight: 600; }
    .alert-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 14px; color: #991b1b; font-size: 13px; font-weight: 600; margin: 18px 0; }
    .button-group { margin: 24px 0; text-align: center; }
    .btn { display: inline-block; padding: 12px 24px; background: #10b981; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; border-radius: 10px; box-shadow: 0 2px 4px rgba(16,185,129,0.25); }
    .footer { padding: 16px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🛡️ VigilOR Surgical Schedule Sentinel</h1>
      <p>${surgeonFullName} • ${profile.specialty}</p>
    </div>
    <div class="content">
      <span class="badge">OFFICIAL OR BLACKOUT NOTICE</span>
      <p style="font-size: 14px; line-height: 1.5; margin: 0 0 12px 0;">
        Dear <strong>${scheduler.fullName}</strong> (${scheduler.facilityName}),
      </p>
      <p style="font-size: 14px; line-height: 1.5; margin: 0 0 16px 0;">
        Please be advised that <strong>${surgeonFullName}</strong> has scheduled a protected schedule block on the calendar:
      </p>
      
      <div class="card">
        <div class="card-row"><span class="label">Time Window:</span> <span class="value" style="color: #047857;">${formattedTimeWindow}</span></div>
        <div class="card-row"><span class="label">Block Type:</span> <span class="value">${sanitizedSummary}</span></div>
        <div class="card-row"><span class="label">Facility:</span> <span class="value">${profile.primaryHospital}</span></div>
      </div>

      <div class="alert-box">
        ⚠️ <strong>Action Required:</strong> Please hold the OR schedule clear and do NOT book surgical cases during this protected window.
      </div>

      <div class="button-group">
        <a href="https://alexmohit825.github.io/vigilOR/?ack=${recordId}&status=confirmed" class="btn" style="color: #ffffff;">✓ Confirm: Block Placed in OR System</a>
      </div>
    </div>
    <div class="footer">
      Office Contact: <a href="mailto:${profile.officeEmail}">${profile.officeEmail}</a> • ${profile.primaryHospital}<br>
      Automated availability notice generated by VigilOR Autonomous Clinical Sentinel.
    </div>
  </div>
</body>
</html>`;

  return {
    subject,
    html,
    text: plainText,
    recipientEmail: scheduler.email
  };
}
