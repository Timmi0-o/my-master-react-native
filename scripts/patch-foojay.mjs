import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const file = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../node_modules/@react-native/gradle-plugin/settings.gradle.kts',
);

if (!existsSync(file)) {
  process.exit(0);
}

const from = 'foojay-resolver-convention").version("0.5.0")';
const to = 'foojay-resolver-convention").version("1.0.0")';
const content = readFileSync(file, 'utf8');

if (content.includes(from)) {
  writeFileSync(file, content.replace(from, to));
  console.log('[patch-foojay] foojay-resolver-convention 0.5.0 → 1.0.0 (Gradle 9 fix)');
}
