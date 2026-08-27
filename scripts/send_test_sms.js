/**
 * Twilio Live SMS Test Dispatcher
 * Usage: node scripts/send_test_sms.js <ACCOUNT_SID> <AUTH_TOKEN>
 */

const accountSid = process.argv[2] || process.env.TWILIO_ACCOUNT_SID;
const authToken = process.argv[3] || process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER || '+17372583478';
const toNumber = process.env.TARGET_PHONE_NUMBER || '+12066503283';

if (!accountSid || !authToken) {
  console.error('❌ Error: Please provide your Twilio Account SID and Auth Token:');
  console.error('   node scripts/send_test_sms.js YOUR_ACCOUNT_SID YOUR_AUTH_TOKEN');
  process.exit(1);
}

async function sendTestSms() {
  console.log(`📡 Connecting to Twilio API...`);
  console.log(`From: ${fromNumber} ──> To: ${toNumber}`);

  const basicAuth = Buffer.from(`${accountSid.trim()}:${authToken.trim()}`).toString('base64');
  const params = new URLSearchParams();
  params.append('From', fromNumber);
  params.append('To', toNumber);
  params.append('Body', `[VigilOR Sentinel Live Verification]\nDr. A. Alex Mohit, your surgical availability sentinel is connected and operational!`);

  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid.trim()}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });

    const data = await res.json();

    if (res.ok && data.sid) {
      console.log('🎉 SUCCESS! Twilio accepted the message.');
      console.log(`Message SID: ${data.sid}`);
      console.log(`Status: ${data.status}`);
      console.log(`Sent to: ${data.to}`);
    } else {
      console.error('❌ Twilio Error Response:');
      console.error(`Code: ${data.code}`);
      console.error(`Message: ${data.message}`);
      console.error(`Status: ${data.status}`);
    }
  } catch (err) {
    console.error('❌ Network Error:', err.message);
  }
}

sendTestSms();
