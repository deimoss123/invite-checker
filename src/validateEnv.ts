export default function validateEnv() {
  const requiredEnvs: string[] = ['URL1', 'WEBHOOK_URL'];
  let isValid = true;

  for (const env of requiredEnvs) {
    if (!process.env[env]) {
      console.log(`MISSING ENV VAR: ${env}`);
      isValid = false;
    }
  }

  return isValid;
}
