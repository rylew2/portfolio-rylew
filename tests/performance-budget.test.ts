import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const projectRoot = path.resolve(process.cwd());
const checkerPath = path.join(
  projectRoot,
  'scripts',
  'check-performance-budget.ts'
);
const tsxPath = path.join(
  projectRoot,
  'node_modules',
  'tsx',
  'dist',
  'cli.mjs'
);

const createBuildFixture = () => {
  const fixtureRoot = mkdtempSync(
    path.join(tmpdir(), 'portfolio-performance-budget-')
  );
  const buildDir = path.join(fixtureRoot, '.next');
  const chunksDir = path.join(buildDir, 'static', 'chunks');
  mkdirSync(chunksDir, { recursive: true });

  writeFileSync(
    path.join(buildDir, 'build-manifest.json'),
    JSON.stringify({
      pages: {
        '/_app': ['static/chunks/shared.js'],
        '/': ['static/chunks/shared.js', 'static/chunks/home.js'],
      },
      polyfillFiles: [],
      rootMainFiles: [],
    })
  );
  writeFileSync(
    path.join(chunksDir, 'shared.js'),
    'const shared = "shared-runtime";\n'.repeat(20)
  );
  writeFileSync(
    path.join(chunksDir, 'home.js'),
    'const home = "homepage-code";\n'.repeat(20)
  );

  return { fixtureRoot, buildDir };
};

const runChecker = (
  buildDir: string,
  budget: {
    route: string;
    maxInitialJavaScriptGzipKiB: number;
    maxInitialJavaScriptRequests: number;
    maxInitialChunkGzipKiB: number;
  }
) => {
  const configPath = path.join(path.dirname(buildDir), 'budget.json');
  writeFileSync(configPath, JSON.stringify(budget));

  return spawnSync(
    process.execPath,
    [tsxPath, checkerPath, '--build-dir', buildDir, '--config', configPath],
    {
      cwd: projectRoot,
      encoding: 'utf8',
    }
  );
};

test('passes when initial JavaScript stays within every configured budget', () => {
  const { fixtureRoot, buildDir } = createBuildFixture();

  try {
    const result = runChecker(buildDir, {
      route: '/',
      maxInitialJavaScriptGzipKiB: 10,
      maxInitialJavaScriptRequests: 2,
      maxInitialChunkGzipKiB: 10,
    });

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Performance budget passed for \//);
    assert.match(result.stdout, /initial JavaScript requests: 2 \/ 2/);
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

test('fails with measured details when an initial JavaScript budget is exceeded', () => {
  const { fixtureRoot, buildDir } = createBuildFixture();

  try {
    const result = runChecker(buildDir, {
      route: '/',
      maxInitialJavaScriptGzipKiB: 0,
      maxInitialJavaScriptRequests: 1,
      maxInitialChunkGzipKiB: 0,
    });

    assert.equal(result.status, 1);
    assert.match(result.stderr, /Performance budget failed for \//);
    assert.match(result.stderr, /total initial JavaScript/);
    assert.match(result.stderr, /initial JavaScript requests/);
    assert.match(result.stderr, /largest initial JavaScript chunk/);
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});
