/**
 * VigilOR Autonomous Standalone CalDAV Worker
 * This script runs autonomously on a cloud cron (e.g. GitHub Actions, AWS Lambda, Cloudflare Worker, or Render)
 * to scan Apple iCloud Calendar via RFC 4791 CalDAV and dispatch SMS/Email alerts via Twilio/Resend.
 */

import { ICloudCalDAVClient } from '../src/engine/caldavClient.js';
import { evaluateEventAgainstRule } from '../src/engine/ruleEvaluator.js';
import { prepareNotifications } from '../src/engine/dispatcher.js';

async function runAutonomousSync() {
  console.log('🛡️ [VigilOR Sentinel] Starting autonomous calendar scan...');
  
  const appleId = process.env.VIGILOR_APPLE_ID || 'mohalex@gmail.com';
  const appSpecificPassword = process.env.VIGILOR_APP_PASSWORD || '';
  const calendarName = process.env.VIGILOR_CALENDAR || 'Personal';

  if (!appSpecificPassword) {
    console.log('ℹ️ No VIGILOR_APP_PASSWORD environment variable set. Running in dry-run mode.');
  }

  const client = new ICloudCalDAVClient(appleId, appSpecificPassword, calendarName);
  const report = await client.performDeltaSync();

  console.log(`✅ [VigilOR Sentinel] Scan completed at ${report.timestamp}`);
  console.log(`📊 Scanned ${report.totalEventsScanned} calendar events. Conflicts detected: ${report.conflictingEventsFound}`);
}

runAutonomousSync().catch(err => {
  console.error('❌ [VigilOR Sentinel] Sync error:', err);
  process.exit(1);
});
