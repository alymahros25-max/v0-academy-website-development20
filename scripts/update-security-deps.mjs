#!/usr/bin/env node
/**
 * Update dependencies covered by the repository's open security advisories.
 *
 * Usage:
 *   pnpm security:update
 *   pnpm security:update -- --strict
 *
 * The script intentionally does not run migrations, deploys, or modify any
 * Supabase/Vercel settings. It updates package.json and pnpm-lock.yaml only.
 */
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packagePath = resolve(root, 'package.json');
const lockPath = resolve(root, 'pnpm-lock.yaml');
const workspacePath = resolve(root, 'pnpm-workspace.yaml');
const strict = process.argv.includes('--strict');
const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = resolve(root, '.security-backups', timestamp);

function run(command, args, options = {}) {
  console.log(`\n> ${command} ${args.join(' ')}`);
  execFileSync(command, args, { cwd: root, stdio: 'inherit', ...options });
}

function versionOf(section, name) {
  return packageJson[section]?.[name];
}

if (!existsSync(resolve(root, 'pnpm-lock.yaml'))) {
  throw new Error('pnpm-lock.yaml غير موجود؛ أوقف السكربت حتى لا نحدّث الاعتمادات دون ملف قفل.');
}

mkdirSync(backupDir, { recursive: true });
copyFileSync(packagePath, resolve(backupDir, 'package.json'));
copyFileSync(lockPath, resolve(backupDir, 'pnpm-lock.yaml'));
console.log(`تم حفظ النسخة الاحتياطية في: ${backupDir}`);

// Direct fixes required by the advisories. Keep Next and its ESLint config aligned.
const directUpdates = {
  dependencies: {
    next: '16.4.0',
  },
  devDependencies: {
    'eslint-config-next': '16.4.0',
    sharp: '0.35.5',
  },
};

for (const [section, updates] of Object.entries(directUpdates)) {
  packageJson[section] ??= {};
  for (const [name, version] of Object.entries(updates)) {
    console.log(`${section}.${name}: ${packageJson[section][name] ?? '(غير موجود)'} -> ${version}`);
    packageJson[section][name] = version;
  }
}

// Safe transitive floors belong in pnpm-workspace.yaml with pnpm v11. The two
// minimatch generations require different major versions of brace-expansion;
// a global override to v5 would break minimatch@3.
let workspace = readFileSync(workspacePath, 'utf8')
  .replace(/^  'minimatch@3>brace-expansion'.*\n/gm, '')
  .replace(/^  'minimatch@10>brace-expansion'.*\n/gm, '');
const overrides = [
  "  'fast-uri': '>=3.1.8'",
  "  'source-map-js': '>=1.2.2'",
  "  'minimatch@3.1.5>brace-expansion': '1.1.21'",
  "  'minimatch@9.0.9>brace-expansion': '5.0.12'",
  "  'minimatch@10.2.6>brace-expansion': '5.0.12'",
  "  'sharp@<0.35.5': '>=0.35.5'",
];
const missingOverrides = overrides.filter((line) => !workspace.includes(line));
if (missingOverrides.length > 0) {
  workspace = workspace.replace(/^overrides:\n/m, (match) => `${match}${missingOverrides.join('\n')}\n`);
}
writeFileSync(workspacePath, workspace);

writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);

// Resolve the lockfile from the edited manifest without installing or deploying.
run('pnpm', ['install', '--lockfile-only', '--fix-lockfile']);

console.log('\nتشغيل فحص الاعتمادات الإنتاجية:');
let auditExitCode = 0;
try {
  run('pnpm', ['audit', '--prod']);
} catch (error) {
  auditExitCode = error.status ?? 1;
  console.warn(`\nظلّت تنبيهات في pnpm audit (رمز الخروج ${auditExitCode}).`);
}

console.log('\nتشغيل فحص البناء للتحقق من توافق Next.js:');
let buildExitCode = 0;
try {
  run('pnpm', ['run', 'build']);
} catch (error) {
  buildExitCode = error.status ?? 1;
  console.warn(`\nفشل البناء (رمز الخروج ${buildExitCode}). راجع النسخة الاحتياطية قبل المتابعة.`);
}

console.log('\nملاحظة braces:');
console.log('لا توجد حاليًا نسخة npm مصححة منشورة من braces 3.0.3 وفق بيانات الحزمة.');
console.log('لذلك لا يزعم هذا السكربت إغلاق هذا التنبيه؛ يجب انتظار إصدار upstream أو استبدال الاعتماد الأعلى الذي يجلبه.');

if (strict && (auditExitCode !== 0 || buildExitCode !== 0)) {
  process.exit(1);
}

console.log(`\nاكتمل تحديث الاعتمادات. النسخة الاحتياطية: ${backupDir}`);
