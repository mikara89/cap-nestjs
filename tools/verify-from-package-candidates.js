#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const semver = require('semver');

const rootDir = path.resolve(__dirname, '..');
const releasePlan = readJson(path.join(rootDir, 'release-plan.json'));
const expectedRegistry = 'https://registry.npmjs.org/';
const expectedRepositoryUrl = 'https://github.com/mikara89/cap-nodejs';
const expectedBootstrapConfirmation = 'PUBLISH_ALL_TO_NPM';
const expectedNormalPackages = [
  '@mikara89/cap-nest',
  '@mikara89/cap-storage-mikro-orm',
  '@mikara89/cap-transport-azure-servicebus',
  '@mikara89/cap-transport-nestjs-microservices',
  '@mikara89/cap-dashboard',
];
const expectedBootstrapPackages = [
  '@mikara89/cap-core',
  '@mikara89/cap-testing',
  '@mikara89/cap-nest',
  '@mikara89/cap-express',
  '@mikara89/cap-dashboard-core',
  '@mikara89/cap-dashboard-nest',
  '@mikara89/cap-dashboard-express',
  '@mikara89/cap-dashboard',
  '@mikara89/cap-storage-mikro-orm',
  '@mikara89/cap-storage-knex',
  '@mikara89/cap-storage-typeorm',
  '@mikara89/cap-storage-prisma',
  '@mikara89/cap-transport-azure-servicebus',
  '@mikara89/cap-transport-nestjs-microservices',
];
const dependencyFields = [
  'dependencies',
  'optionalDependencies',
  'peerDependencies',
];
const supportedCommands = new Set(['--verify', '--plan', '--publish']);

function fail(message) {
  throw new Error(message);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function sorted(values) {
  return [...values].sort((left, right) => left.localeCompare(right));
}

function assertExactSet(actual, expected, label) {
  const actualSet = new Set(actual);
  const expectedSet = new Set(expected);
  const missing = expected.filter((value) => !actualSet.has(value));
  const extra = actual.filter((value) => !expectedSet.has(value));

  if (
    actual.length !== actualSet.size ||
    expected.length !== expectedSet.size ||
    missing.length > 0 ||
    extra.length > 0
  ) {
    fail(
      `${label} mismatch. Missing: ${missing.join(', ') || 'none'}. ` +
        `Unexpected: ${extra.join(', ') || 'none'}.`,
    );
  }
}

function discoverPackages() {
  const npmConfig = fs
    .readFileSync(path.join(rootDir, '.npmrc'), 'utf8')
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith(';') && !line.startsWith('#'));
  assertExactSet(
    npmConfig,
    [`registry=${expectedRegistry}`, 'strict-ssl=true'],
    'Repository npm configuration',
  );

  const rootManifest = readJson(path.join(rootDir, 'package.json'));
  if (rootManifest.private !== true) {
    fail('The repository root package must remain private.');
  }
  if (rootManifest.repository?.url !== releasePlan.repositoryUrl) {
    fail('The root repository.url does not match the release plan.');
  }

  const workspaceDirs = (rootManifest.workspaces || []).flatMap((pattern) => {
    if (!pattern.endsWith('/*')) {
      fail(`Unsupported workspace pattern: ${pattern}`);
    }

    const base = path.join(rootDir, pattern.slice(0, -2));
    return fs
      .readdirSync(base, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(base, entry.name))
      .filter((dir) => fs.existsSync(path.join(dir, 'package.json')));
  });

  const packages = workspaceDirs
    .map((dir) => ({
      dir,
      manifestPath: path.join(dir, 'package.json'),
      manifest: readJson(path.join(dir, 'package.json')),
    }))
    .filter(({ manifest }) => manifest.private !== true);

  for (const { manifestPath, manifest } of packages) {
    if (typeof manifest.name !== 'string') {
      fail(`Publishable workspace has no package name: ${manifestPath}`);
    }
  }

  assertExactSet(
    packages.map(({ manifest }) => manifest.name),
    releasePlan.bootstrapPackages,
    'Publishable package discovery',
  );

  const lock = readJson(path.join(rootDir, 'package-lock.json'));
  const byName = new Map(packages.map((pkg) => [pkg.manifest.name, pkg]));

  for (const pkg of packages) {
    const { manifest } = pkg;
    if (!semver.valid(manifest.version)) {
      fail(`${manifest.name} has an invalid version: ${manifest.version}`);
    }
    if (manifest.repository?.url !== releasePlan.repositoryUrl) {
      fail(`${manifest.name} repository.url does not match the release plan.`);
    }
    if (
      manifest.publishConfig?.registry !== releasePlan.registry ||
      manifest.publishConfig?.access !== 'public'
    ) {
      fail(
        `${manifest.name} must publish publicly to ${releasePlan.registry}.`,
      );
    }

    const relativeDir = path
      .relative(rootDir, pkg.dir)
      .replaceAll(path.sep, '/');
    const lockPackage = lock.packages?.[relativeDir];
    if (!lockPackage || lockPackage.version !== manifest.version) {
      fail(
        `${manifest.name} package-lock version does not match ` +
          `${manifest.version}.`,
      );
    }
  }

  return { packages, byName };
}

function buildInternalGraph(packages, byName) {
  const graph = new Map();

  for (const { manifest } of packages) {
    const dependencies = new Map();
    for (const field of dependencyFields) {
      for (const [dependencyName, range] of Object.entries(
        manifest[field] || {},
      )) {
        if (!dependencyName.startsWith('@mikara89/cap-')) {
          continue;
        }

        const dependencyPackage = byName.get(dependencyName);
        if (!dependencyPackage) {
          fail(
            `${manifest.name} ${field} references unexpected internal package ` +
              `${dependencyName}.`,
          );
        }
        if (!semver.validRange(range)) {
          fail(
            `${manifest.name} has invalid internal range ${dependencyName}@${range}.`,
          );
        }
        if (!semver.satisfies(dependencyPackage.manifest.version, range)) {
          fail(
            `${manifest.name} requires ${dependencyName}@${range}, but the ` +
              `current internal version is ${dependencyPackage.manifest.version}.`,
          );
        }

        dependencies.set(dependencyName, range);
      }
    }
    graph.set(manifest.name, dependencies);
  }

  return graph;
}

function topologicalOrder(graph) {
  const result = [];
  const visiting = new Set();
  const visited = new Set();

  function visit(name) {
    if (visited.has(name)) {
      return;
    }
    if (visiting.has(name)) {
      fail(`Internal package dependency cycle detected at ${name}.`);
    }

    visiting.add(name);
    for (const dependencyName of graph.get(name).keys()) {
      visit(dependencyName);
    }
    visiting.delete(name);
    visited.add(name);
    result.push(name);
  }

  for (const name of releasePlan.bootstrapPackages) {
    visit(name);
  }
  assertExactSet(result, releasePlan.bootstrapPackages, 'Dependency graph');
  return result;
}

function resolveRelease(packagesByName, graph) {
  const bootstrap = process.env.BOOTSTRAP_NPM === 'true';
  const selectedPackage = process.env.RELEASE_PACKAGE || '';

  if (bootstrap) {
    if (
      process.env.BOOTSTRAP_CONFIRMATION !== releasePlan.bootstrapConfirmation
    ) {
      fail(
        `bootstrap_npm requires exact confirmation: ` +
          `${releasePlan.bootstrapConfirmation}`,
      );
    }
    return {
      bootstrap,
      targetNames: topologicalOrder(graph),
    };
  }

  if (!releasePlan.normalReleasePackages.includes(selectedPackage)) {
    fail(
      `Normal releases require one allowlisted package. Received: ` +
        `${selectedPackage || '(empty)'}`,
    );
  }
  if (!packagesByName.has(selectedPackage)) {
    fail(`Selected package was not discovered: ${selectedPackage}`);
  }

  return { bootstrap, targetNames: [selectedPackage] };
}

async function enumeratePublicVersions(packageName, registry) {
  const packageUrl = new URL(encodeURIComponent(packageName), registry);
  let response;

  try {
    response = await fetch(packageUrl, {
      headers: { accept: 'application/vnd.npm.install-v1+json' },
      redirect: 'error',
      signal: AbortSignal.timeout(30_000),
    });
  } catch (error) {
    fail(`npm registry request failed for ${packageName}: ${error.message}`);
  }

  if (response.status === 404) {
    return [];
  }
  if (!response.ok) {
    fail(`npm registry returned HTTP ${response.status} for ${packageName}.`);
  }

  let metadata;
  try {
    metadata = await response.json();
  } catch (error) {
    fail(
      `npm registry returned invalid JSON for ${packageName}: ${error.message}`,
    );
  }

  if (metadata.name !== packageName || typeof metadata.versions !== 'object') {
    fail(`npm registry metadata was invalid for ${packageName}.`);
  }

  const versions = Object.keys(metadata.versions);
  if (versions.some((version) => !semver.valid(version))) {
    fail(`npm registry returned an invalid version for ${packageName}.`);
  }
  return versions;
}

function transitiveNames(targetNames, graph) {
  const names = new Set(targetNames);
  const pending = [...targetNames];
  while (pending.length > 0) {
    const name = pending.pop();
    for (const dependencyName of graph.get(name).keys()) {
      if (!names.has(dependencyName)) {
        names.add(dependencyName);
        pending.push(dependencyName);
      }
    }
  }
  return names;
}

function verifyDependencyAvailability(
  packageName,
  graph,
  availableVersions,
  scheduledNames,
) {
  for (const [dependencyName, range] of graph.get(packageName)) {
    const versions = availableVersions.get(dependencyName) || [];
    const dependencyWillBePublished = scheduledNames.has(dependencyName);
    if (
      !dependencyWillBePublished &&
      !versions.some((version) => semver.satisfies(version, range))
    ) {
      fail(
        `${packageName} requires ${dependencyName}@${range}, but npmjs has no ` +
          `matching public version and it is not part of this release.`,
      );
    }
  }
}

function publishPackage(pkg, registry) {
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const args = [
    'publish',
    pkg.dir,
    '--access',
    'public',
    '--tag',
    releasePlan.distTag,
    '--registry',
    registry,
  ];
  const result = spawnSync(npmCommand, args, {
    cwd: rootDir,
    env: process.env,
    stdio: 'inherit',
  });

  if (result.error) {
    fail(
      `npm publish failed to start for ${pkg.manifest.name}: ${result.error.message}`,
    );
  }
  if (result.status !== 0) {
    fail(
      `npm publish failed for ${pkg.manifest.name} with exit ${result.status}.`,
    );
  }
}

async function main() {
  const command = process.argv[2] || '--verify';
  if (!supportedCommands.has(command) || process.argv.length > 3) {
    fail('Usage: verify-from-package-candidates.js --verify|--plan|--publish');
  }

  if (releasePlan.registry !== expectedRegistry) {
    fail(`Release plan registry must be exactly ${expectedRegistry}.`);
  }
  if (releasePlan.repositoryUrl !== expectedRepositoryUrl) {
    fail(`Release plan repository must be exactly ${expectedRepositoryUrl}.`);
  }
  if (releasePlan.bootstrapConfirmation !== expectedBootstrapConfirmation) {
    fail(
      `Release plan confirmation must be exactly ${expectedBootstrapConfirmation}.`,
    );
  }
  const registry = process.env.NPM_REGISTRY_URL || expectedRegistry;
  if (registry !== expectedRegistry) {
    fail(`Registry must be exactly ${expectedRegistry}.`);
  }
  if (releasePlan.distTag !== 'latest') {
    fail('The release plan dist-tag must remain latest.');
  }
  assertExactSet(
    releasePlan.normalReleasePackages,
    expectedNormalPackages,
    'Normal release allowlist',
  );
  assertExactSet(
    releasePlan.bootstrapPackages,
    expectedBootstrapPackages,
    'Bootstrap package allowlist',
  );

  const { packages, byName } = discoverPackages();
  const graph = buildInternalGraph(packages, byName);
  topologicalOrder(graph);
  console.log(
    `Verified ${packages.length} publishable packages and the complete ` +
      'internal dependency graph.',
  );

  if (command === '--verify') {
    return;
  }

  const release = resolveRelease(byName, graph);
  const lookupNames = transitiveNames(release.targetNames, graph);
  const availableVersions = new Map();
  for (const name of sorted(lookupNames)) {
    availableVersions.set(name, await enumeratePublicVersions(name, registry));
  }

  const scheduledNames = new Set(release.targetNames);
  for (const name of release.targetNames) {
    verifyDependencyAvailability(
      name,
      graph,
      availableVersions,
      scheduledNames,
    );
  }

  const candidates = release.targetNames.filter((name) => {
    const version = byName.get(name).manifest.version;
    const alreadyPublished = availableVersions.get(name)?.includes(version);
    console.log(
      `${name}@${version}: ${alreadyPublished ? 'already on npmjs; skip' : 'publish'}`,
    );
    return !alreadyPublished;
  });

  if (command === '--plan') {
    console.log(
      `Release plan contains ${candidates.length} publish candidate(s).`,
    );
    return;
  }

  for (const name of candidates) {
    const pkg = byName.get(name);
    publishPackage(pkg, registry);
    availableVersions.get(name).push(pkg.manifest.version);
  }
  console.log(`Published ${candidates.length} package(s) to npmjs.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
