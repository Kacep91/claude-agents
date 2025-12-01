/**
 * Script for analyzing coverage report (lcov.info)
 * Outputs statistics by main project directories
 */

const fs = require('fs');
const path = require('path');

const lcovPath = path.join(__dirname, '../coverage/lcov.info');

// Read lcov.info
const lcovContent = fs.readFileSync(lcovPath, 'utf8');

// Parse lcov.info
const files = lcovContent.split('end_of_record').filter(Boolean);

const stats = {
  total: { lines: { found: 0, hit: 0 }, functions: { found: 0, hit: 0 }, branches: { found: 0, hit: 0 } },
  byDirectory: {}
};

files.forEach((fileBlock) => {
  const lines = fileBlock.trim().split('\n');

  let currentFile = '';
  let linesFound = 0, linesHit = 0;
  let functionsFound = 0, functionsHit = 0;
  let branchesFound = 0, branchesHit = 0;

  lines.forEach((line) => {
    if (line.startsWith('SF:')) {
      currentFile = line.substring(3);
    } else if (line.startsWith('LF:')) {
      linesFound = parseInt(line.substring(3), 10);
    } else if (line.startsWith('LH:')) {
      linesHit = parseInt(line.substring(3), 10);
    } else if (line.startsWith('FNF:')) {
      functionsFound = parseInt(line.substring(4), 10);
    } else if (line.startsWith('FNH:')) {
      functionsHit = parseInt(line.substring(4), 10);
    } else if (line.startsWith('BRF:')) {
      branchesFound = parseInt(line.substring(4), 10);
    } else if (line.startsWith('BRH:')) {
      branchesHit = parseInt(line.substring(4), 10);
    }
  });

  if (currentFile) {
    // Determine directory
    const relativePath = currentFile.replace(/^.*\/src\//, 'src/');
    const parts = relativePath.split('/');
    let directory = parts[0]; // 'src'

    if (parts.length > 1) {
      directory = `${parts[0]}/${parts[1]}`; // 'src/pages', 'src/hooks', etc.
    }

    if (parts.length > 2 && parts[1] === 'pages') {
      directory = `${parts[0]}/${parts[1]}/${parts[2]}`; // 'src/pages/Invoice', 'src/pages/Rpp', etc.
    }

    if (!stats.byDirectory[directory]) {
      stats.byDirectory[directory] = {
        lines: { found: 0, hit: 0 },
        functions: { found: 0, hit: 0 },
        branches: { found: 0, hit: 0 },
        files: 0
      };
    }

    stats.byDirectory[directory].lines.found += linesFound;
    stats.byDirectory[directory].lines.hit += linesHit;
    stats.byDirectory[directory].functions.found += functionsFound;
    stats.byDirectory[directory].functions.hit += functionsHit;
    stats.byDirectory[directory].branches.found += branchesFound;
    stats.byDirectory[directory].branches.hit += branchesHit;
    stats.byDirectory[directory].files += 1;

    stats.total.lines.found += linesFound;
    stats.total.lines.hit += linesHit;
    stats.total.functions.found += functionsFound;
    stats.total.functions.hit += functionsHit;
    stats.total.branches.found += branchesFound;
    stats.total.branches.hit += branchesHit;
  }
});

// Function to calculate percentage
const percent = (hit, found) => {
  if (found === 0) return '0.00';
  return ((hit / found) * 100).toFixed(2);
};

// Function to format directory name
const formatDir = (dir) => {
  return dir.padEnd(35);
};

// Function to format metrics
const formatMetric = (hit, found) => {
  const pct = percent(hit, found);
  return `${pct.padStart(6)}% (${hit.toString().padStart(5)}/${found.toString().padEnd(5)})`;
};

// Output total statistics
console.log('\n' + '='.repeat(130));
console.log('COVERAGE REPORT');
console.log('='.repeat(130));
console.log('\nTOTAL PROJECT STATISTICS:\n');
console.log(`Lines:      ${formatMetric(stats.total.lines.hit, stats.total.lines.found)}`);
console.log(`Statements: ${formatMetric(stats.total.lines.hit, stats.total.lines.found)}`);
console.log(`Branches:   ${formatMetric(stats.total.branches.hit, stats.total.branches.found)}`);
console.log(`Functions:  ${formatMetric(stats.total.functions.hit, stats.total.functions.found)}`);

// Sort directories
const sortedDirectories = Object.entries(stats.byDirectory).sort((a, b) => {
  // First src/pages/*
  if (a[0].startsWith('src/pages/') && !b[0].startsWith('src/pages/')) return -1;
  if (!a[0].startsWith('src/pages/') && b[0].startsWith('src/pages/')) return 1;
  // Then src/hooks, src/components, src/api
  return a[0].localeCompare(b[0]);
});

// Output statistics by directory
console.log('\n' + '-'.repeat(130));
console.log('DETAILED STATISTICS BY DIRECTORY:\n');
console.log(`${formatDir('Directory')} | Files | Lines          | Branches       | Functions`);
console.log('-'.repeat(130));

sortedDirectories.forEach(([directory, data]) => {
  const filesCount = data.files.toString().padStart(5);
  const linesMetric = formatMetric(data.lines.hit, data.lines.found);
  const branchesMetric = formatMetric(data.branches.hit, data.branches.found);
  const functionsMetric = formatMetric(data.functions.hit, data.functions.found);

  console.log(`${formatDir(directory)} | ${filesCount} | ${linesMetric} | ${branchesMetric} | ${functionsMetric}`);
});

console.log('-'.repeat(130));

// Highlight critical directories
console.log('\nCRITICAL DIRECTORIES (<60% coverage):\n');

const criticalDirectories = sortedDirectories.filter(([_, data]) => {
  const linesPct = parseFloat(percent(data.lines.hit, data.lines.found));
  return linesPct < 60;
});

if (criticalDirectories.length > 0) {
  criticalDirectories.forEach(([directory, data]) => {
    const linesPct = percent(data.lines.hit, data.lines.found);
    console.log(`  [FAIL] ${directory.padEnd(40)} - ${linesPct}% lines coverage`);
  });
} else {
  console.log('  [OK] No critical directories found');
}

// Highlight directories with good coverage
console.log('\nDIRECTORIES WITH GOOD COVERAGE (>=85%):\n');

const goodDirectories = sortedDirectories.filter(([_, data]) => {
  const linesPct = parseFloat(percent(data.lines.hit, data.lines.found));
  return linesPct >= 85;
});

if (goodDirectories.length > 0) {
  goodDirectories.slice(0, 10).forEach(([directory, data]) => {
    const linesPct = percent(data.lines.hit, data.lines.found);
    console.log(`  [OK] ${directory.padEnd(40)} - ${linesPct}% lines coverage`);
  });
  if (goodDirectories.length > 10) {
    console.log(`  ... and ${goodDirectories.length - 10} more directories`);
  }
} else {
  console.log('  [FAIL] No directories with good coverage found');
}

console.log('\n' + '='.repeat(130) + '\n');

// Save to file
const reportPath = path.join(__dirname, '../coverage-summary.txt');
const report = `
${'='.repeat(130)}
COVERAGE REPORT
${'='.repeat(130)}

TOTAL PROJECT STATISTICS:

Lines:      ${formatMetric(stats.total.lines.hit, stats.total.lines.found)}
Statements: ${formatMetric(stats.total.lines.hit, stats.total.lines.found)}
Branches:   ${formatMetric(stats.total.branches.hit, stats.total.branches.found)}
Functions:  ${formatMetric(stats.total.functions.hit, stats.total.functions.found)}

${'-'.repeat(130)}
DETAILED STATISTICS BY DIRECTORY:

${formatDir('Directory')} | Files | Lines          | Branches       | Functions
${'-'.repeat(130)}
${sortedDirectories.map(([directory, data]) => {
  const filesCount = data.files.toString().padStart(5);
  const linesMetric = formatMetric(data.lines.hit, data.lines.found);
  const branchesMetric = formatMetric(data.branches.hit, data.branches.found);
  const functionsMetric = formatMetric(data.functions.hit, data.functions.found);
  return `${formatDir(directory)} | ${filesCount} | ${linesMetric} | ${branchesMetric} | ${functionsMetric}`;
}).join('\n')}
${'-'.repeat(130)}

CRITICAL DIRECTORIES (<60% coverage):

${criticalDirectories.length > 0 ? criticalDirectories.map(([directory, data]) => {
  const linesPct = percent(data.lines.hit, data.lines.found);
  return `  [FAIL] ${directory.padEnd(40)} - ${linesPct}% lines coverage`;
}).join('\n') : '  [OK] No critical directories found'}

DIRECTORIES WITH GOOD COVERAGE (>=85%):

${goodDirectories.length > 0 ? goodDirectories.slice(0, 10).map(([directory, data]) => {
  const linesPct = percent(data.lines.hit, data.lines.found);
  return `  [OK] ${directory.padEnd(40)} - ${linesPct}% lines coverage`;
}).join('\n') + (goodDirectories.length > 10 ? `\n  ... and ${goodDirectories.length - 10} more directories` : '') : '  [FAIL] No directories with good coverage found'}

${'='.repeat(130)}
`;

fs.writeFileSync(reportPath, report, 'utf8');
console.log(`Report saved to ${reportPath}\n`);
