import { execFileSync } from 'node:child_process';

// Defense in depth; CI also runs Gitleaks across history.
const patterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\b(?:sk_live_|sk_test_|whsec_|re_)[A-Za-z0-9]{20,}\b/,
  /\b(?:ghp_|github_pat_)[A-Za-z0-9_]{30,}\b/,
  /\bAKIA[A-Z0-9]{16}\b/,
  /\bsb_secret_[A-Za-z0-9_-]{20,}\b/,
];
const files = execFileSync('git', ['ls-files', '-z']).toString().split('\0').filter(Boolean);
let failed = false;
for (const file of files) {
  if (/\.(pdf|png|jpg|woff2|ttf|otf)$/.test(file)) continue;
  const body = execFileSync('git', ['show', `:${file}`], {
    maxBuffer: 20 * 1024 * 1024,
  }).toString();
  if (patterns.some((pattern) => pattern.test(body))) {
    console.error(`Possible credential in ${file}; value withheld.`);
    failed = true;
  }
}
if (failed) process.exitCode = 1;
else console.log(`Checked ${files.length} tracked files. No known credential patterns found.`);
