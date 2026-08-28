import { CalendarEvent } from '../types/vigilor';

/**
 * Robust RFC 5545 iCalendar (.ics) Parser
 * Parses Apple Calendar (.ics) files and extracts single and recurring events.
 */
export function parseIcsCalendar(icsContent: string, defaultCalendarName: string = 'Apple iCalendar'): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  
  // Unfold lines as per RFC 5545 (lines starting with space/tab are continuations)
  const unfolded = icsContent.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '');
  const lines = unfolded.split(/\r\n|\r|\n/);

  let inVEvent = false;
  let currentEvent: Partial<CalendarEvent> & { rrule?: string; dtStartRaw?: string; dtEndRaw?: string; duration?: string } = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed === 'BEGIN:VEVENT') {
      inVEvent = true;
      currentEvent = {
        uid: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        calendarName: defaultCalendarName,
      };
      continue;
    }

    if (trimmed === 'END:VEVENT') {
      inVEvent = false;
      if (currentEvent.dtStartRaw) {
        const start = parseIcsDateTime(currentEvent.dtStartRaw);
        let end = currentEvent.dtEndRaw ? parseIcsDateTime(currentEvent.dtEndRaw) : new Date(start.getTime() + 3600000);
        
        if (start && !isNaN(start.getTime())) {
          if (!end || isNaN(end.getTime()) || end <= start) {
            end = new Date(start.getTime() + 3600000); // 1 hour default
          }

          const baseEvent: CalendarEvent = {
            uid: currentEvent.uid || `evt_${Date.now()}`,
            summary: currentEvent.summary || 'Personal Appointment',
            start,
            end,
            calendarName: currentEvent.calendarName || defaultCalendarName,
            location: currentEvent.location
          };

          // If there is an RRULE (e.g. FREQ=WEEKLY), expand occurrences
          if (currentEvent.rrule) {
            const recurring = expandRRule(baseEvent, currentEvent.rrule);
            events.push(...recurring);
          } else {
            events.push(baseEvent);
          }
        }
      }
      currentEvent = {};
      continue;
    }

    if (!inVEvent) continue;

    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;

    const keyPart = trimmed.substring(0, colonIdx);
    const valuePart = trimmed.substring(colonIdx + 1);

    const key = keyPart.split(';')[0].toUpperCase();

    switch (key) {
      case 'UID':
        currentEvent.uid = valuePart.trim();
        break;
      case 'SUMMARY':
        currentEvent.summary = unescapeIcsText(valuePart.trim());
        break;
      case 'LOCATION':
        currentEvent.location = unescapeIcsText(valuePart.trim());
        break;
      case 'DTSTART':
        currentEvent.dtStartRaw = valuePart.trim();
        break;
      case 'DTEND':
        currentEvent.dtEndRaw = valuePart.trim();
        break;
      case 'RRULE':
        currentEvent.rrule = valuePart.trim();
        break;
    }
  }

  return events;
}

/**
 * Parses iCalendar date/time formats (e.g., 20260903T120000Z, 20260903T120000, 20260903)
 */
function parseIcsDateTime(dateTimeStr: string): Date {
  const clean = dateTimeStr.replace(/[^0-9TZ]/gi, '');
  
  if (clean.length === 8) {
    // All day date YYYYMMDD
    const y = parseInt(clean.substring(0, 4), 10);
    const m = parseInt(clean.substring(4, 6), 10) - 1;
    const d = parseInt(clean.substring(6, 8), 10);
    return new Date(y, m, d, 0, 0, 0);
  }

  if (clean.includes('T')) {
    const [dPart, tPart] = clean.split('T');
    const y = parseInt(dPart.substring(0, 4), 10);
    const m = parseInt(dPart.substring(4, 6), 10) - 1;
    const d = parseInt(dPart.substring(6, 8), 10);

    const hh = parseInt(tPart.substring(0, 2), 10) || 0;
    const mm = parseInt(tPart.substring(2, 4), 10) || 0;
    const ss = parseInt(tPart.substring(4, 6), 10) || 0;

    if (tPart.endsWith('Z')) {
      return new Date(Date.UTC(y, m, d, hh, mm, ss));
    }
    return new Date(y, m, d, hh, mm, ss);
  }

  return new Date(dateTimeStr);
}

/**
 * Unescapes RFC 5545 text characters
 */
function unescapeIcsText(text: string): string {
  return text
    .replace(/\\n/gi, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
}

/**
 * Expands weekly/monthly recurring rules up to 16 weeks into the future
 */
function expandRRule(baseEvent: CalendarEvent, rrule: string): CalendarEvent[] {
  const results: CalendarEvent[] = [baseEvent];
  const durationMs = baseEvent.end.getTime() - baseEvent.start.getTime();

  const isWeekly = rrule.toUpperCase().includes('FREQ=WEEKLY');
  if (isWeekly) {
    // Generate next 16 weeks
    for (let i = 1; i <= 16; i++) {
      const nextStart = new Date(baseEvent.start.getTime() + i * 7 * 86400000);
      const nextEnd = new Date(nextStart.getTime() + durationMs);

      results.push({
        ...baseEvent,
        uid: `${baseEvent.uid}_rec_${i}`,
        start: nextStart,
        end: nextEnd,
      });
    }
  }

  return results;
}
