#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const LOG_PATH = path.join(PROJECT_ROOT, 'test-results.log');
const FAILED_RESULTS_PATH = path.join(PROJECT_ROOT, 'test-results.failed.txt');

let JEST_BIN_PATH = null;
try {
  // Allows running jest CLI directly, bypassing npm/npx.
  JEST_BIN_PATH = require.resolve('jest/bin/jest');
} catch (error) {
  // Don't interrupt execution: just won't be able to show ETA.
  console.warn('extract-tests: could not determine path to jest/bin/jest.');
  console.warn(error && error.message ? error.message : error);
}

const stripAnsi = (value) =>
  (typeof value === 'string' ? value : '').replace(/\u001b\[[0-9;]*m/g, '');

function formatEta(ms) {
  if (!Number.isFinite(ms) || ms <= 0) {
    return null;
  }
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
  }

  return `${seconds}s`;
}

function formatDuration(ms) {
  if (!Number.isFinite(ms) || ms <= 0) {
    return null;
  }

  if (ms < 1000) {
    return `${Math.max(1, Math.round(ms))}ms`;
  }

  const seconds = ms / 1000;
  if (seconds < 10) {
    return `${seconds.toFixed(1)}s`;
  }

  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remSeconds = Math.round(seconds % 60);
  return `${minutes}m ${remSeconds.toString().padStart(2, '0')}s`;
}

function formatAverageDuration(ms) {
  const duration = formatDuration(ms);
  return duration ? `${duration}/suite` : null;
}

function createRunStats(initialTotalSuites = null) {
  let totalSuites =
    Number.isFinite(initialTotalSuites) && initialTotalSuites > 0
      ? initialTotalSuites
      : null;
  let completedSuites = 0;
  let failedSuites = 0;
  let startTimestamp = null;
  const processedSuites = new Set();
  const failedSuiteKeys = new Set();

  function setTotalSuites(nextValue) {
    if (!Number.isFinite(nextValue) || nextValue <= 0) {
      return;
    }
    totalSuites = nextValue;
  }

  function markStart() {
    startTimestamp = Date.now();
  }

  function markSuite({ status, file, durationMs }) {
    const suiteKey =
      typeof file === 'string' && file.length > 0
        ? file
        : `__unknown_${processedSuites.size}`;

    let recorded = false;
    if (!processedSuites.has(suiteKey)) {
      processedSuites.add(suiteKey);
      completedSuites += 1;
      recorded = true;
    }

    if (status === 'FAIL' && !failedSuiteKeys.has(suiteKey)) {
      failedSuiteKeys.add(suiteKey);
      failedSuites += 1;
    }

    if (recorded && Number.isFinite(durationMs)) {
      // keep track of latest duration to smooth ETA for very short suites
      // by updating startTimestamp backwards if first measurement arrives late
      if (!startTimestamp) {
        startTimestamp = Date.now() - durationMs;
      }
    }
  }

  function buildSummary() {
    const parts = [];
    if (Number.isFinite(totalSuites) && totalSuites > 0) {
      const percent =
        totalSuites === 0
          ? 100
          : Math.min(100, Math.round((completedSuites / totalSuites) * 100));
      parts.push(`${percent}%`);
      parts.push(`Suites ${completedSuites}/${totalSuites}`);
    } else {
      parts.push(`Suites ${completedSuites}`);
    }

    if (failedSuites > 0) {
      parts.push(`FAIL ${failedSuites}`);
    }

    if (!startTimestamp) {
      parts.push('Waiting for Jest to start');
    } else {
      const elapsedMs = Date.now() - startTimestamp;
      const avgMs = completedSuites > 0 ? elapsedMs / completedSuites : null;
      const etaMs =
        avgMs &&
          Number.isFinite(totalSuites) &&
          totalSuites > completedSuites
          ? avgMs * (totalSuites - completedSuites)
          : null;

      const etaLabel = formatEta(etaMs);
      if (etaLabel) {
        parts.push(`ETA ${etaLabel}`);
      }

      const avgLabel = formatAverageDuration(avgMs);
      if (avgLabel) {
        parts.push(`~${avgLabel}`);
      }
    }

    return parts.join(' | ');
  }

  function getCompletionRatio() {
    if (!Number.isFinite(totalSuites) || totalSuites <= 0) {
      return null;
    }
    if (totalSuites === 0) {
      return 1;
    }
    return Math.max(0, Math.min(1, completedSuites / totalSuites));
  }

  return {
    setTotalSuites,
    markStart,
    markSuite,
    getCompletionRatio,
    getSummary: buildSummary,
  };
}

function listAllTestSuites() {
  if (!JEST_BIN_PATH) {
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [JEST_BIN_PATH, '--listTests'], {
      cwd: PROJECT_ROOT,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if ((code ?? 0) !== 0) {
        const error = new Error(
          `jest --listTests exited with code ${code}. ${stderr.trim()}`,
        );
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
        return;
      }

      const suites = stdout
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
      resolve(suites);
    });
  });
}

function createLineParser(onLine, source) {
  let buffer = '';

  return (chunk) => {
    if (chunk === null) {
      if (buffer) {
        onLine(buffer, source);
        buffer = '';
      }
      return;
    }

    buffer += chunk.toString('utf-8').replace(/\r/g, '\n');
    const parts = buffer.split('\n');
    buffer = parts.pop();
    parts.forEach((line) => onLine(line, source));
  };
}

function createUiRenderer() {
  if (!process.stdout.isTTY) {
    let progressPrinted = false;

    return {
      updateProgress(text) {
        if (!progressPrinted) {
          console.log(text);
          progressPrinted = true;
        }
      },
      updateFailures() {},
      teardown(finalLine) {
        if (finalLine) {
          console.log(finalLine);
        }
      },
    };
  }

  let active = true;
  const state = { progress: 'Starting npm test...' };

  function render() {
    if (!active) {
      return;
    }

    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(state.progress);
  }

  render();

  return {
    updateProgress(text) {
      if (!active) {
        return;
      }
      state.progress = text;
      render();
    },
    updateFailures() {},
    teardown(finalLine) {
      if (!active) {
        return;
      }

      if (finalLine) {
        state.progress = finalLine;
        render();
      }

      process.stdout.write('\n');
      active = false;
    },
  };
}

function createProgressAnimator(updateProgress) {
  const defaultText = 'Running npm test...';
  let dynamicText = defaultText;
  let progressRatio = null;

  if (!process.stdout.isTTY) {
    return {
      start() {
        updateProgress(dynamicText);
      },
      stop(finalLine) {
        if (finalLine) {
          updateProgress(finalLine);
        }
      },
      setStatus({ text, ratio }) {
        dynamicText = text || defaultText;
        progressRatio =
          Number.isFinite(ratio) && ratio >= 0 ? Math.min(1, ratio) : null;
        updateProgress(dynamicText);
      },
    };
  }

  const frames = ['-', '\\', '|', '/'];
  const barLength = 28;
  let position = 0;
  let direction = 1;
  let frameIndex = 0;
  let intervalId = null;

  function renderFrame({ advance = true } = {}) {
    if (advance) {
      frameIndex = (frameIndex + 1) % frames.length;
      if (progressRatio === null) {
        position += direction;
        if (position >= barLength) {
          position = barLength;
          direction = -1;
        } else if (position <= 0) {
          position = 0;
          direction = 1;
        }
      }
    }

    const filled =
      progressRatio === null
        ? Math.max(0, Math.min(barLength, position))
        : Math.max(0, Math.min(barLength, Math.round(progressRatio * barLength)));

    const bar =
      '#'.repeat(filled) + '.'.repeat(Math.max(0, barLength - filled));
    const spinner = frames[frameIndex];

    updateProgress(`[${bar}] ${spinner} ${dynamicText}`);
  }

  return {
    start() {
      if (intervalId) {
        return;
      }
      renderFrame({ advance: false });
      intervalId = setInterval(() => renderFrame(), 160);
    },
    stop(finalLine) {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      if (finalLine) {
        updateProgress(finalLine);
      }
    },
    setStatus({ text, ratio }) {
      dynamicText = text || defaultText;
      progressRatio =
        Number.isFinite(ratio) && ratio >= 0 ? Math.min(1, ratio) : null;
      renderFrame({ advance: false });
    },
  };
}

function createFailureTracker(ui, options = {}) {
  const failures = [];
  const seen = new Set();
  const linePattern = /^\s*(PASS|FAIL)\s+(.+?)(?:\s+\((\d+(?:\.\d+)?) s\))?\s*$/;
  let currentSuite = null;
  const onSuiteResult =
    typeof options.onSuiteResult === 'function' ? options.onSuiteResult : () => {};

  function recordFailure(file, test) {
    const key = `${file}::${test}`;
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    failures.push({ file, test });
  }

  return {
    handleLine(line, source = 'stdout') {
      const cleaned = stripAnsi(line);
      const statusMatch = linePattern.exec(cleaned);

      if (statusMatch) {
        const status = statusMatch[1];
        const testPath = statusMatch[2];
        const durationSeconds = statusMatch[3]
          ? parseFloat(statusMatch[3])
          : null;
        const durationMs = Number.isFinite(durationSeconds)
          ? durationSeconds * 1000
          : null;

        if (status === 'FAIL') {
          onSuiteResult({ status, file: testPath, durationMs });
          currentSuite = testPath;
        } else if (status === 'PASS') {
          onSuiteResult({ status, file: testPath, durationMs });
          currentSuite = null;
        } else {
          currentSuite = null;
        }

        return;
      }

      if (!currentSuite) {
        return;
      }

      const trimmed = cleaned.trim();
      if (trimmed.startsWith('●')) {
        const testName = trimmed.slice(1).trim();
        if (testName.length > 0) {
          recordFailure(currentSuite, testName);
        }
      }
    },
    getFailures() {
      return failures.slice();
    },
  };
}

function formatFailureReport(failures) {
  const lines = ['# Failed Tests List', ''];

  if (failures.length === 0) {
    lines.push('No failed tests detected.');
  } else {
    lines.push(
      `Detected ${failures.length} failures. List grouped by test files:`,
    );
    lines.push('');

    const grouped = failures.reduce((acc, failure) => {
      const file = failure.file || 'Unknown file';
      if (!acc.has(file)) {
        acc.set(file, []);
      }
      acc.get(file).push(failure.test || 'Unknown test');
      return acc;
    }, new Map());

    grouped.forEach((tests, file) => {
      lines.push(`- ${file}`);
      tests.forEach((test) => {
        lines.push(`    - ${test}`);
      });
      lines.push('');
    });
  }

  lines.push('---');
  lines.push('');
  lines.push(`Last updated: ${new Date().toISOString()}`);

  return lines.join('\n');
}

function writeFailureReport(failures) {
  const report = formatFailureReport(failures);
  fs.writeFileSync(FAILED_RESULTS_PATH, `${report}\n`, 'utf-8');
}

function runTestsWithLogging({ onLine }) {
  return new Promise((resolve, reject) => {
    const logStream = fs.createWriteStream(LOG_PATH, { flags: 'w' });
    const testProcess = spawn('npm', ['test'], {
      cwd: PROJECT_ROOT,
      env: process.env,
      stdio: ['inherit', 'pipe', 'pipe'],
    });

    const handleLine = typeof onLine === 'function' ? onLine : () => {};
    const parseStdout = createLineParser(handleLine, 'stdout');
    const parseStderr = createLineParser(handleLine, 'stderr');

    testProcess.stdout.on('data', (chunk) => {
      logStream.write(chunk);
      parseStdout(chunk);
    });

    testProcess.stderr.on('data', (chunk) => {
      logStream.write(chunk);
      parseStderr(chunk);
    });

    testProcess.on('error', (error) => {
      parseStdout(null);
      parseStderr(null);
      logStream.end(() => reject(error));
    });

    testProcess.on('close', (code) => {
      parseStdout(null);
      parseStderr(null);
      logStream.end(() => resolve(code ?? 0));
    });
  });
}

async function main() {
  const ui = createUiRenderer();
  const runStats = createRunStats();

  ui.updateProgress('Determining list of test files...');
  try {
    const suites = await listAllTestSuites();
    if (Array.isArray(suites) && suites.length > 0) {
      runStats.setTotalSuites(suites.length);
    }
  } catch (error) {
    console.warn(
      'extract-tests: could not determine number of test files.',
    );
    console.warn(error && error.message ? error.message : error);
  }

  const progress = createProgressAnimator((text) => ui.updateProgress(text));
  progress.setStatus({
    text: runStats.getSummary(),
    ratio: runStats.getCompletionRatio(),
  });
  const failureTracker = createFailureTracker(ui, {
    onSuiteResult(payload) {
      runStats.markSuite(payload);
      progress.setStatus({
        text: runStats.getSummary(),
        ratio: runStats.getCompletionRatio(),
      });
    },
  });

  runStats.markStart();
  progress.start();

  let testExitCode;
  try {
    testExitCode = await runTestsWithLogging({
      onLine: failureTracker.handleLine,
    });
  } catch (error) {
    progress.stop('[########] npm test failed to start');
    ui.teardown();
    console.error('extract-tests: error starting npm test.');
    console.error(error);
    process.exit(1);
  }

  const completionText =
    testExitCode === 0
      ? '[########################] npm test completed'
      : '[########################] npm test completed with errors';

  const summaryLine = runStats.getSummary();
  progress.setStatus({
    text: summaryLine,
    ratio: runStats.getCompletionRatio(),
  });
  progress.stop(`${completionText} | ${summaryLine}`);
  ui.teardown();

  const failures = failureTracker.getFailures();
  let reportWritten = false;
  try {
    writeFailureReport(failures);
    reportWritten = true;
  } catch (error) {
    console.error(
      'extract-tests: could not save test-results.failed.txt.',
    );
    console.error(error);
  }

  const failuresCount = failures.length;

  console.log('');
  if (failuresCount > 0) {
    console.log(
      `Detected ${failuresCount} failures. Detailed list: test-results.failed.txt.`,
    );
  } else if (testExitCode === 0) {
    console.log('All tests passed successfully. Log: test-results.log.');
  } else {
    console.log('Some tests failed. See test-results.log.');
  }

  if (!reportWritten) {
    console.log(
      'Warning: could not properly generate the failed tests report.',
    );
  }

  const finalExitCode =
    testExitCode !== 0 ? testExitCode : reportWritten ? 0 : 1;

  process.exit(finalExitCode);
}

main();
