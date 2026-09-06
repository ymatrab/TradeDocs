import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function files(path) {
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? files(join(path, entry.name)) : [join(path, entry.name)]);
}
let failed = false;
for (const file of files('src').filter((path) => /\.[tj]sx?$/.test(path))) {
  const text = readFileSync(file, 'utf8');
  if (/['"]use client['"]/.test(text) && /(?:SUPABASE_SERVICE_ROLE|RESEND_API_KEY|TURNSTILE_SECRET|PAYMENT_WEBHOOK_SECRET|from ['"]@\/lib\/(?:config\/server|supabase\/server|security\/rate-limit))/.test(text)) {
    console.error(`Forbidden privileged client boundary in ${file}`);
    failed = true;
  }
  if (/NEXT_PUBLIC_\w*(?:SECRET|SERVICE_ROLE|PRIVATE|AUTH_TOKEN)/.test(text)) {
    console.error(`Forbidden public secret name in ${file}`);
    failed = true;
  }
}
if (failed) process.exitCode = 1;
else console.log('Static server/client boundary checks passed; the Next build additionally enforces server-only imports.');
