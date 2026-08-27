import { CalendarEvent, ProtectionRule, Scheduler, DayOfWeek } from '../types/vigilor';

export interface EvaluationResult {
  isMatch: boolean;
  matchedRule?: ProtectionRule;
  targetSchedulers: Scheduler[];
  sanitizedSummary: string;
  formattedTimeWindow: string;
  reason?: string;
}

/**
 * Checks whether an event overlaps with a given protection rule
 */
export function evaluateEventAgainstRule(
  event: CalendarEvent,
  rule: ProtectionRule,
  allSchedulers: Scheduler[],
  surgeonName: string = 'Dr. A. Alex Mohit'
): EvaluationResult {
  if (!rule.isActive) {
    return {
      isMatch: false,
      targetSchedulers: [],
      sanitizedSummary: event.summary,
      formattedTimeWindow: '',
      reason: `Rule '${rule.name}' is currently disabled.`
    };
  }

  // 1. Check Keyword Exclusions FIRST (e.g. ignore #surgery, Clinic, Grand Rounds)
  if (rule.excludedKeywords && rule.excludedKeywords.length > 0) {
    const summaryLower = (event.summary || '').toLowerCase();
    for (const keyword of rule.excludedKeywords) {
      if (keyword.trim() && summaryLower.includes(keyword.trim().toLowerCase())) {
        return {
          isMatch: false,
          targetSchedulers: [],
          sanitizedSummary: event.summary,
          formattedTimeWindow: '',
          reason: `Ignored due to excluded keyword filter: '${keyword}'.`
        };
      }
    }
  }

  const eventStart = new Date(event.start);
  const eventEnd = new Date(event.end);
  const eventDayOfWeek = eventStart.getDay() as DayOfWeek;

  // 2. Check Day of Week
  if (!rule.daysOfWeek.includes(eventDayOfWeek)) {
    return {
      isMatch: false,
      targetSchedulers: [],
      sanitizedSummary: event.summary,
      formattedTimeWindow: '',
      reason: `Event day (${getDayName(eventDayOfWeek)}) does not match rule days.`
    };
  }

  // 3. Parse Rule Start and End times
  const [ruleStartHour, ruleStartMin] = rule.startTime.split(':').map(Number);
  const [ruleEndHour, ruleEndMin] = rule.endTime.split(':').map(Number);

  const windowStart = new Date(eventStart);
  windowStart.setHours(ruleStartHour, ruleStartMin, 0, 0);

  const windowEnd = new Date(eventStart);
  windowEnd.setHours(ruleEndHour, ruleEndMin, 0, 0);

  // 4. Interval Overlap Condition: (StartA < EndB) and (EndA > StartB)
  const hasOverlap = eventStart < windowEnd && eventEnd > windowStart;

  if (!hasOverlap) {
    return {
      isMatch: false,
      targetSchedulers: [],
      sanitizedSummary: event.summary,
      formattedTimeWindow: '',
      reason: `Event time is outside the protected window (${formatTime12h(rule.startTime)} – ${formatTime12h(rule.endTime)}).`
    };
  }

  // 5. Determine Target Schedulers
  let targetSchedulers: Scheduler[] = [];
  const activeSchedulers = allSchedulers.filter(s => s.isActive);

  if (activeSchedulers.length === 0) {
    // Fallback default for instant testing
    targetSchedulers = [
      {
        id: 'sched_fallback',
        fullName: 'Lead Surgery Scheduler',
        facilityName: 'Main Hospital OR Desk',
        phone: '+1 (206) 650-3283',
        email: 'scheduler@hospital.org',
        preferredChannel: 'BOTH',
        isActive: true
      }
    ];
  } else if (rule.assignedSchedulerIds.length === 0) {
    // Broadcast to all active schedulers
    targetSchedulers = activeSchedulers;
  } else {
    // Specific rule-routed schedulers
    targetSchedulers = activeSchedulers.filter(
      s => rule.assignedSchedulerIds.includes(s.id)
    );
    if (targetSchedulers.length === 0) {
      targetSchedulers = activeSchedulers;
    }
  }

  // 6. Privacy Sanitization
  const sanitizedSummary = rule.maskEventDetails
    ? `${surgeonName} Personal Block`
    : event.summary;

  // 7. Format Time Window for Display
  const dayName = getDayName(eventDayOfWeek);
  const startTimeStr = formatTime12h(
    `${eventStart.getHours().toString().padStart(2, '0')}:${eventStart.getMinutes().toString().padStart(2, '0')}`
  );
  const endTimeStr = formatTime12h(
    `${eventEnd.getHours().toString().padStart(2, '0')}:${eventEnd.getMinutes().toString().padStart(2, '0')}`
  );
  const formattedTimeWindow = `${dayName} from ${startTimeStr} to ${endTimeStr}`;

  return {
    isMatch: true,
    matchedRule: rule,
    targetSchedulers,
    sanitizedSummary,
    formattedTimeWindow,
    reason: `Event overlaps ${rule.name} (${formatTime12h(rule.startTime)} – ${formatTime12h(rule.endTime)}).`
  };
}

/**
 * Evaluates an event against all rules and returns the first match
 */
export function evaluateEventAgainstAllRules(
  event: CalendarEvent,
  rules: ProtectionRule[],
  schedulers: Scheduler[],
  surgeonName: string = 'Dr. A. Alex Mohit'
): EvaluationResult {
  // If rules array is empty, provide a live default rule so simulator never breaks
  const activeRulesList = rules.length > 0 ? rules : [
    {
      id: 'rule_wed_afternoon',
      name: 'Wednesday Afternoon OR Protection',
      isActive: true,
      daysOfWeek: [3 as DayOfWeek],
      startTime: '12:00',
      endTime: '17:00',
      debounceMinutes: 3,
      maskEventDetails: true,
      assignedSchedulerIds: [],
      createdAt: new Date().toISOString()
    }
  ];

  for (const rule of activeRulesList) {
    if (!rule.isActive) continue;
    const result = evaluateEventAgainstRule(event, rule, schedulers, surgeonName);
    if (result.isMatch) {
      return result;
    }
  }

  return {
    isMatch: false,
    targetSchedulers: [],
    sanitizedSummary: event.summary,
    formattedTimeWindow: '',
    reason: 'Event does not conflict with any active protected OR blocks.'
  };
}

export function getDayName(day: DayOfWeek, short: boolean = false): string {
  const fullNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const shortNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return short ? shortNames[day] : fullNames[day];
}

export function formatTime12h(time24: string): string {
  const [hStr, mStr] = time24.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr || '0', 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  const displayM = m === 0 ? '00' : m.toString().padStart(2, '0');
  return `${displayH}:${displayM} ${ampm}`;
}
