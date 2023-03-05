import axios from 'axios';
import 'dotenv/config';
import validateEnv from './validateEnv';

if (!validateEnv()) process.exit(1);

const invsToCheck = Object.entries(process.env).filter(([key]) =>
  key.toUpperCase().startsWith('URL')
);

console.log(
  `Checking ${invsToCheck.length} urls: ` +
  invsToCheck.map(([key, val]) => `${key}="${val}"`).join(', ')
);

const INTERVAL = process.env.INTERVAL ? +process.env.INTERVAL : 5000;
console.log(`Interval: ${INTERVAL}ms`);

function sendWebhook(msg: string) {
  axios.post(process.env.WEBHOOK_URL!, { content: msg }).catch(_ => _);
}

async function checkInv(code: string) {
  const discordUrl = `https://discord.com/api/v10/invites/${code}`;

  const res = await axios.get(discordUrl).catch(r => r);

  if (res.response?.status === 404 && res.response?.data.code === 10006) {
    sendWebhook(`@everyone\ngg/**${code}** is available!`);
    console.log(`--- Found available invite: "${code}" ---`);
  }
}

sendWebhook('test');

setInterval(async () => {
  for (const [key, val] of invsToCheck) {
    console.log(`(${key}) Checking inv code: "${val}"`);
    checkInv(val!);
  }
}, INTERVAL);
