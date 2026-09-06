import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
const allowed = new Set(['MIT', 'ISC', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', '0BSD', 'CC0-1.0', 'Unlicense', 'Python-2.0', 'BlueOak-1.0.0', '(MIT OR Apache-2.0)', '(MIT AND Zlib)', '(MIT AND BSD-3-Clause)']);
const exceptionsPath = 'docs/dependency-license-exceptions.json';
const exceptions = existsSync(exceptionsPath) ? JSON.parse(readFileSync(exceptionsPath, 'utf8')) : {};
const issues = [];
for (const [path, metadata] of Object.entries(lock.packages)) {
  if (!path) continue;
  const manifestPath = join(path, 'package.json');
  const license = metadata.license ?? (existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')).license : undefined);
  if (!allowed.has(license) && !exceptions[`${path}@${metadata.version}`]) issues.push(`${path}@${metadata.version}: ${license ?? 'missing license metadata'}`);
}
if (issues.length) {
  console.error('Dependency licenses require documented review:\n' + issues.join('\n'));
  process.exitCode = 1;
} else console.log('All dependency licenses match the repository policy.');
