import { readFileSync } from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

interface PerformanceBudget {
  route: string;
  maxInitialJavaScriptGzipKiB: number;
  maxInitialJavaScriptRequests: number;
  maxInitialChunkGzipKiB: number;
}

interface BuildManifest {
  pages: Record<string, string[]>;
  lowPriorityFiles?: string[];
  polyfillFiles?: string[];
  rootMainFiles?: string[];
}

interface ChunkMeasurement {
  file: string;
  gzipKiB: number;
}

const parseArgument = (name: string, fallback: string): string => {
  const argumentIndex = process.argv.indexOf(name);
  return argumentIndex === -1 ? fallback : process.argv[argumentIndex + 1];
};

const formatKiB = (value: number): string => value.toFixed(1);

const buildDir = path.resolve(parseArgument('--build-dir', '.next'));
const configPath = path.resolve(
  parseArgument('--config', 'config/performance-budget.json')
);
const budget = JSON.parse(
  readFileSync(configPath, 'utf8')
) as PerformanceBudget;
const manifest = JSON.parse(
  readFileSync(path.join(buildDir, 'build-manifest.json'), 'utf8')
) as BuildManifest;

const routeFiles = manifest.pages[budget.route];
const appFiles = manifest.pages['/_app'];
if (!routeFiles || !appFiles) {
  throw new Error(
    `Build manifest must contain /_app and ${budget.route} page assets`
  );
}

const initialJavaScriptFiles = [
  ...(manifest.polyfillFiles ?? []),
  ...(manifest.rootMainFiles ?? []),
  ...appFiles,
  ...routeFiles,
  ...(manifest.lowPriorityFiles ?? []),
].filter(
  (file, index, files) => file.endsWith('.js') && files.indexOf(file) === index
);

const chunks: ChunkMeasurement[] = initialJavaScriptFiles.map((file) => {
  const source = readFileSync(path.join(buildDir, file));
  return {
    file,
    gzipKiB: gzipSync(source, { level: 9 }).byteLength / 1024,
  };
});
const totalGzipKiB = chunks.reduce((total, chunk) => total + chunk.gzipKiB, 0);
const largestChunk = chunks.reduce(
  (largest, chunk) => (chunk.gzipKiB > largest.gzipKiB ? chunk : largest),
  { file: '(none)', gzipKiB: 0 }
);

const measurements = [
  `total initial JavaScript: ${formatKiB(totalGzipKiB)} KiB gzip / ${budget.maxInitialJavaScriptGzipKiB} KiB`,
  `initial JavaScript requests: ${chunks.length} / ${budget.maxInitialJavaScriptRequests}`,
  `largest initial JavaScript chunk: ${formatKiB(largestChunk.gzipKiB)} KiB gzip / ${budget.maxInitialChunkGzipKiB} KiB (${largestChunk.file})`,
];
const violations = [
  totalGzipKiB > budget.maxInitialJavaScriptGzipKiB ? measurements[0] : null,
  chunks.length > budget.maxInitialJavaScriptRequests ? measurements[1] : null,
  largestChunk.gzipKiB > budget.maxInitialChunkGzipKiB ? measurements[2] : null,
].filter((violation): violation is string => violation !== null);

if (violations.length > 0) {
  console.error(
    [`Performance budget failed for ${budget.route}:`, ...violations]
      .map((line) => `  ${line}`)
      .join('\n')
  );
  process.exitCode = 1;
} else {
  console.log(
    [`Performance budget passed for ${budget.route}:`, ...measurements]
      .map((line) => `  ${line}`)
      .join('\n')
  );
}
