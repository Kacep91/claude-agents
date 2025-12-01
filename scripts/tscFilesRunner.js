#!/usr/bin/env node

/**
 * Local TS check for specified files (not tied to staged)
 *
 * Example:
 *   node scripts/tscFilesRunner.js --files "src/a.ts,src/b.tsx"
 *
 * Features:
 * - Uses tsc-files for targeted checking
 * - Parses output and saves to tsc-errors.txt
 * - Exit code always 0 (informational, like tsc-staged)
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.resolve(__dirname, '..', 'tsc-errors.txt');

const stripAnsi = (value) =>
  (typeof value === 'string' ? value : '').replace(/\u001b\[[0-9;]*m/g, '');

const errorPattern = /^(.+?)\((\d+),(\d+)\):\s+error\s+(TS\d+):\s+(.+)$/;

function parseArgs() {
  const args = process.argv.slice(2);
  const filesArgIndex = args.indexOf('--files');
  if (filesArgIndex === -1 || !args[filesArgIndex + 1]) {
    return [];
  }
  return args[filesArgIndex + 1]
    .split(',')
    .map((f) => f.trim())
    .filter(Boolean);
}

function parseTscOutput(output) {
  const errors = [];
  const lines = output.split('\n');
  for (const line of lines) {
    const clean = stripAnsi(line).trim();
    const m = errorPattern.exec(clean);
    if (m) {
      const [, filePath, lineNumber, colNumber, code, message] = m;
      errors.push({ filePath, line: lineNumber, col: colNumber, code, message });
    }
  }
  return errors;
}

async function runTsc(files) {
  if (files.length === 0) {
    return { exitCode: 0, output: '' };
  }
  const args = ['tsc-files', '--noEmit', '--pretty', 'false', ...files];
  return new Promise((resolve, reject) => {
    const child = spawn('npx', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => (stdout += chunk.toString('utf-8')));
    child.stderr.on('data', (chunk) => (stderr += chunk.toString('utf-8')));
    child.on('error', reject);
    child.on('close', (code) => resolve({ exitCode: code ?? 0, output: stdout + stderr }));
  });
}

function formatOutput(errors, files) {
  const lines = [];
  lines.push('# TypeScript check for specified files');
  lines.push('');
  lines.push(`Files checked: ${files.length}`);
  lines.push(`Errors found: ${errors.length}`);
  lines.push('');
  if (errors.length === 0) {
    lines.push('[OK] No TypeScript errors detected.');
    return lines.join('\n');
  }

  errors.forEach((err, idx) => {
    lines.push(`${idx + 1}. ${err.filePath}:${err.line}:${err.col}`);
    lines.push(`   Code: ${err.code}`);
    lines.push(`   Error: ${err.message}`);
    lines.push('');
  });

  lines.push('---');
  lines.push('');
  lines.push('Summary by file:');
  const grouped = new Map();
  errors.forEach((e) => grouped.set(e.filePath, (grouped.get(e.filePath) || 0) + 1));
  Array.from(grouped.entries())
    .sort((a, b) => b[1] - a[1])
    .forEach(([file, count]) => lines.push(`- ${file}: ${count} error(s)`));

  return lines.join('\n');
}

async function main() {
  const files = parseArgs();
  if (files.length === 0) {
    console.log('[WARN] No files provided. Usage:');
    console.log('    node scripts/tscFilesRunner.js --files "src/a.ts,src/b.tsx"');
    process.exit(0);
  }

  console.log(`Checking TypeScript in ${files.length} file(s)...`);
  const result = await runTsc(files);
  const errors = parseTscOutput(result.output).filter((err) => files.includes(err.filePath));
  const output = formatOutput(errors, files);
  fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');

  if (errors.length === 0) {
    console.log('[OK] No errors detected.');
  } else {
    console.log(`[FAIL] Errors found: ${errors.length}`);
    console.log(output.split('\n').slice(0, 30).join('\n')); // short console output
    console.log(`Full report: ${OUTPUT_FILE}`);
  }

  process.exit(0);
}

main().catch((e) => {
  console.error('Failed to run tscFilesRunner:', e);
  process.exit(1);
});
