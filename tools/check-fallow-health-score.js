#!/usr/bin/env node

const { spawnSync } = require('node:child_process');

const DEFAULT_MIN_SCORE = 70;
const minScore = Number(process.argv[2] ?? process.env.FALLOW_MIN_HEALTH_SCORE ?? DEFAULT_MIN_SCORE);

if (!Number.isFinite(minScore)) {
  console.error('Fallow health gate needs a numeric minimum score.');
  process.exit(1);
}

const fallowBin = require.resolve('fallow/bin/fallow');
const result = spawnSync(
  process.execPath,
  [fallowBin, 'health', '--score', '--group-by', 'package', '--format', 'json'],
  {
    encoding: 'utf8',
    env: {
      ...process.env,
      FALLOW_SKIP_BINARY_VERIFY: process.env.FALLOW_SKIP_BINARY_VERIFY ?? '1',
    },
  },
);

if (result.error) {
  console.error(`Failed to run Fallow: ${result.error.message}`);
  process.exit(1);
}

let report;
try {
  report = JSON.parse(result.stdout);
} catch (error) {
  console.error('Failed to parse Fallow health JSON output.');
  if (result.stdout) {
    console.error(result.stdout);
  }
  if (result.stderr) {
    console.error(result.stderr);
  }
  process.exit(1);
}

const score = report.health_score?.score;
const grade = report.health_score?.grade ?? 'n/a';

if (typeof score !== 'number') {
  console.error('Fallow health report did not include a numeric score.');
  process.exit(1);
}

const penalties = Object.entries(report.health_score?.penalties ?? {})
  .filter(([, value]) => typeof value === 'number' && value > 0)
  .map(([name, value]) => `${name} -${value.toFixed(1)}`);

console.log(`Fallow health score: ${score.toFixed(1)} ${grade} (minimum ${minScore})`);

if (penalties.length > 0) {
  console.log(`Deductions: ${penalties.join(' · ')}`);
}

if (typeof report.summary?.functions_above_threshold === 'number') {
  console.log(
    `Complexity findings above threshold: ${report.summary.functions_above_threshold} (advisory for this gate)`,
  );
}

if (score < minScore) {
  console.error(`Fallow health score ${score.toFixed(1)} is below the required ${minScore}.`);
  process.exit(1);
}
