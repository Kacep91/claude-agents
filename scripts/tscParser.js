#!/usr/bin/env node

/**
 * TypeScript check for staged files with error parsing
 *
 * Uses tsc-files to check TypeScript types in staged files (git diff --cached).
 * Parses tsc output and saves results in a readable format.
 *
 * Usage examples:
 *   node scripts/tscParser.js                    // Check all staged .ts/.tsx files
 *   npm run type-check:staged                    // Via npm script
 *   npm run tsc-staged                           // Short command
 *
 * Results:
 *   - Console output
 *   - Saved to tsc-errors.txt
 *   - Exit code: always 0 (informational mode)
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const OUTPUT_FILE = path.resolve(__dirname, '..', 'tsc-errors.txt');
const REPO_ROOT = path.resolve(__dirname, '..');

function createProgressAnimator({
  label = 'Checking TypeScript...',
  successLabel = '[OK] Check completed',
  failLabel = '[WARN] Check completed with errors',
} = {}) {
  if (!process.stdout.isTTY) {
    let started = false;
    return {
      start() {
        if (!started) {
          console.log(label);
          started = true;
        }
      },
      stop(isSuccess = true) {
        console.log(isSuccess ? successLabel : failLabel);
      },
    };
  }

  const frames = ['-', '\\', '|', '/'];
  const barLength = 24;
  let position = 0;
  let direction = 1;
  let frameIndex = 0;
  let intervalId = null;

  function renderFrame(text) {
    position += direction;

    if (position >= barLength) {
      position = barLength;
      direction = -1;
    } else if (position <= 0) {
      position = 0;
      direction = 1;
    }

    const filled = Math.max(0, Math.min(barLength, position));
    const bar =
      '#'.repeat(filled) + '.'.repeat(Math.max(0, barLength - filled));
    const spinner = frames[frameIndex % frames.length];
    frameIndex += 1;
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`[${bar}] ${spinner} ${text}`);
  }

  return {
    start() {
      if (intervalId) {
        return;
      }
      renderFrame(label);
      intervalId = setInterval(() => renderFrame(label), 160);
    },
    stop(isSuccess = true) {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`${isSuccess ? successLabel : failLabel}\n`);
    },
  };
}

/**
 * Remove ANSI escape codes from string
 */
const stripAnsi = (value) =>
  (typeof value === 'string' ? value : '').replace(/\u001b\[[0-9;]*m/g, '');

/**
 * Get list of staged TypeScript files
 */
function normalizePath(filePath) {
  if (!filePath) {
    return '';
  }

  return path.resolve(REPO_ROOT, filePath);
}

function getStagedTsFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });

    const files = output
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f && /\.tsx?$/.test(f))
      .filter((f) => fs.existsSync(f)); // Check that file exists

    return files;
  } catch (error) {
    console.error('Error getting staged files:', error.message);
    return [];
  }
}

/**
 * Run tsc-files for TypeScript checking
 */
function runTscFiles(files) {
  if (files.length === 0) {
    return Promise.resolve({ output: '', exitCode: 0 });
  }

  const args = ['tsc-files', '--noEmit', '--pretty', 'false', ...files];

  return new Promise((resolve, reject) => {
    const child = spawn('npx', args, {
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString('utf-8');
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString('utf-8');
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (code) => {
      resolve({
        output: stdout + stderr,
        exitCode: code ?? 0,
      });
    });
  });
}

/**
 * Parse TypeScript compiler output
 * Format: path/to/file.ts(line,col): error TS#### message
 */
function parseTscOutput(tscOutput) {
  const errors = [];
  const lines = tscOutput.split('\n');

  // Regex for parsing TypeScript errors
  // Format: src/path/file.ts(123,45): error TS2304: Cannot find name 'foo'.
  const errorPattern = /^(.+?)\((\d+),(\d+)\):\s+error\s+(TS\d+):\s+(.+)$/;

  for (const line of lines) {
    const cleanLine = stripAnsi(line).trim();
    const match = errorPattern.exec(cleanLine);

    if (match) {
      const [, filePath, lineNumber, colNumber, errorCode, errorMessage] = match;
      errors.push({
        filePath,
        line: lineNumber,
        col: colNumber,
        code: errorCode,
        message: errorMessage,
      });
    }
  }

  return errors;
}

/**
 * Format results for output
 */
function formatOutput(errors, filesCount) {
  const lines = [];

  lines.push('# TypeScript check for staged files');
  lines.push('');
  lines.push(`Files checked: ${filesCount}`);
  lines.push(`Errors found: ${errors.length}`);
  lines.push('');

  if (errors.length === 0) {
    lines.push('[OK] No TypeScript errors detected!');
  } else {
    lines.push('---');
    lines.push('');

    errors.forEach((err, index) => {
      lines.push(`${index + 1}. ${err.filePath}:${err.line}:${err.col}`);
      lines.push(`   Code: ${err.code}`);
      lines.push(`   Error: ${err.message}`);
      lines.push('');
    });

    lines.push('---');
    lines.push('');
    lines.push('Summary by file:');

    // Group errors by file
    const fileGroups = new Map();
    errors.forEach((err) => {
      const count = fileGroups.get(err.filePath) || 0;
      fileGroups.set(err.filePath, count + 1);
    });

    const sortedFiles = Array.from(fileGroups.entries()).sort(
      (a, b) => b[1] - a[1]
    );

    sortedFiles.forEach(([file, count]) => {
      lines.push(`- ${file}: ${count} error(s)`);
    });
  }

  return lines.join('\n');
}

/**
 * Main function
 */
async function main() {
  console.log('Checking TypeScript for staged files...\n');

  // 1. Get staged files
  const stagedFiles = getStagedTsFiles();

  if (stagedFiles.length === 0) {
    console.log('[WARN] No staged TypeScript files to check.');
    console.log('   Use: git add <file.ts> before running the check.\n');

    // Create empty report
    const emptyOutput = formatOutput([], 0);
    fs.writeFileSync(OUTPUT_FILE, emptyOutput, 'utf-8');
    console.log(`Result saved to ${OUTPUT_FILE}`);

    // Exit code 0 - informational mode
    process.exit(0);
  }

  console.log(`Found staged files: ${stagedFiles.length}`);
  stagedFiles.forEach((file, index) => {
    console.log(`  ${index + 1}. ${file}`);
  });
  console.log('');

  // 2. Run tsc-files
  console.log('Starting TypeScript compiler...\n');
  const progress = createProgressAnimator({
    label: 'Checking TypeScript...',
    successLabel: '[OK] TypeScript check completed',
    failLabel: '[WARN] TypeScript check completed with errors',
  });

  progress.start();

  let tscResult = { output: '', exitCode: 0 };
  try {
    tscResult = await runTscFiles(stagedFiles);
    progress.stop(tscResult.exitCode === 0);
  } catch (error) {
    progress.stop(false);
    console.error('Failed to run tsc-files.');
    console.error(error);
    process.exit(1);
  }

  // 3. Parse results
  const allErrors = parseTscOutput(tscResult.output);
  const stagedPathSet = new Set(stagedFiles.map(normalizePath));
  const errors = allErrors.filter((err) =>
    stagedPathSet.has(normalizePath(err.filePath))
  );

  // 4. Format and output results
  const formattedOutput = formatOutput(errors, stagedFiles.length);

  // Save to file
  fs.writeFileSync(OUTPUT_FILE, formattedOutput, 'utf-8');

  // Console output
  if (errors.length === 0) {
    console.log('[OK] No TypeScript errors detected!');
  } else {
    console.log(`[FAIL] TypeScript errors found: ${errors.length}\n`);

    // Top 10 errors for console
    const topErrors = errors.slice(0, 10);
    topErrors.forEach((err, index) => {
      console.log(`${index + 1}. ${err.filePath}:${err.line}:${err.col}`);
      console.log(`   ${err.code}: ${err.message}`);
      console.log('');
    });

    if (errors.length > 10) {
      console.log(`... and ${errors.length - 10} more error(s)`);
      console.log('');
    }

    // Summary by file
    const fileGroups = new Map();
    errors.forEach((err) => {
      const count = fileGroups.get(err.filePath) || 0;
      fileGroups.set(err.filePath, count + 1);
    });

    console.log('Summary by file:');
    const sortedFiles = Array.from(fileGroups.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    sortedFiles.forEach(([file, count]) => {
      console.log(`   - ${file}: ${count} error(s)`);
    });

    if (fileGroups.size > 5) {
      console.log(`   ... and ${fileGroups.size - 5} more files with errors`);
    }
    console.log('');
  }

  console.log(`Full report saved to ${OUTPUT_FILE}\n`);

  // Exit code 0 - informational mode (don't interrupt process)
  process.exit(0);
}

// Run
main().catch((error) => {
  console.error('Unexpected error in tsc-staged:', error);
  process.exit(1);
});
