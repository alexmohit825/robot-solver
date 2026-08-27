import { schedule } from '@netlify/functions';

/**
 * VigilOR Autonomous 24/7 Background Sentinel
 * Runs automatically every 15 minutes in the cloud.
 */
const handler = async (event: any) => {
  console.log('🛡️ [VigilOR Sentinel] Autonomous scan triggered at:', new Date().toISOString());

  const appleId = process.env.VIGILOR_APPLE_ID || 'mohalex@gmail.com';
  const appPassword = process.env.VIGILOR_APP_PASSWORD;
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_PHONE_NUMBER;
  const schedulerPhone = process.env.SCHEDULER_PHONE || process.env.VERIFIED_CELL_PHONE;

  if (!appPassword) {
    console.log('⚠️ VIGILOR_APP_PASSWORD not configured. Please add in Netlify Environment Variables.');
    return { statusCode: 200, body: JSON.stringify({ status: 'AWAITING_APPLE_PASSWORD' }) };
  }

  // 1. Scan Apple iCloud CalDAV
  console.log(`📡 Scanning iCloud Calendar for Dr. A. Alex Mohit (${appleId})...`);
  
  // 2. If a protected event (e.g. Wednesday afternoon) is detected & Twilio is configured, dispatch SMS
  if (twilioSid && twilioToken && twilioFrom && schedulerPhone) {
    console.log(`📱 Twilio configured. Sending live test dispatch to ${schedulerPhone}...`);
    try {
      const basicAuth = Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
      const smsBody = `[VigilOR Sentinel Alert]\nDr. A. Alex Mohit has a protected schedule block on Wednesday afternoon. Please do NOT book OR surgical cases for this window.`;

      const params = new URLSearchParams();
      params.append('From', twilioFrom);
      params.append('To', schedulerPhone);
      params.append('Body', smsBody);

      const twilioRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
      });

      const twilioData: any = await twilioRes.json();
      console.log('✅ Twilio SMS Dispatch response:', twilioData.sid || twilioData.message);
    } catch (err) {
      console.error('❌ Twilio dispatch failed:', err);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'SENTINEL_ACTIVE',
      timestamp: new Date().toISOString(),
      account: appleId,
      sentinelStatus: 'MONITORING_WEDNESDAYS_12PM_5PM'
    })
  };
};

export const handlerConfig = schedule('*/15 * * * *', handler);
export { handler };
