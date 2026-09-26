import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import test from 'node:test';
import siteConfig from '../config/index.json';

const page = (heading: string, content = '<p>Page content</p>') =>
  `<html><h1>${heading}</h1><main>${content}</main></html>`;

const fixtures: Record<
  string,
  { type: string; body: string; status?: number }
> = {
  '/': { type: 'text/html', body: page(siteConfig.author.title) },
  '/about': { type: 'text/html', body: page('About', '<h2>Experience</h2>') },
  '/projects': {
    type: 'text/html',
    body: page(
      'Projects',
      '<a href="/projects/example"><h2>Example project</h2></a>'
    ),
  },
  '/books': {
    type: 'text/html',
    body: page('Books', '<a href="/books/example"><h2>Example book</h2></a>'),
  },
  '/projects/example': { type: 'text/html', body: page('Example project') },
  '/books/example': { type: 'text/html', body: page('Example book') },
  '/robots.txt': {
    type: 'text/plain',
    body: `User-agent: *\nAllow: /\n\nSitemap: ${siteConfig.site.siteUrl}/sitemap.xml`,
  },
  '/sitemap.xml': {
    type: 'application/xml',
    body: `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[
      '/',
      '/about',
      '/projects',
      '/books',
      '/projects/example',
      '/books/example',
    ]
      .map(
        (route) =>
          `<url><loc>${new URL(route, siteConfig.site.siteUrl).href}</loc></url>`
      )
      .join('')}</urlset>`,
  },
};

async function runSmokeCheck(overrides: typeof fixtures = {}) {
  const requested = new Set<string>();
  const server = createServer((request, response) => {
    const route = request.url!;
    requested.add(route);
    const fixture = overrides[route] || fixtures[route];
    response.writeHead(fixture?.status ?? 200, {
      'Content-Type': fixture?.type ?? 'text/plain',
    });
    response.end(fixture?.body ?? 'Unexpected route');
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  try {
    const child = spawn(process.execPath, ['scripts/site-smoke.mjs'], {
      env: {
        ...process.env,
        SITE_SMOKE_ORIGIN: `http://127.0.0.1:${address.port}`,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 80_000,
    });
    let output = '';
    child.stdout.on('data', (chunk) => (output += chunk));
    child.stderr.on('data', (chunk) => (output += chunk));
    const code = await new Promise<number | null>((resolve, reject) => {
      child.on('error', reject);
      child.on('close', resolve);
    });
    return { code, output, requested };
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

test('site smoke check visits core pages, linked details, and crawler files', async () => {
  const result = await runSmokeCheck();
  assert.equal(result.code, 0, result.output);
  assert.deepEqual([...result.requested].sort(), Object.keys(fixtures).sort());
});

const failures = [
  ['HTTP error', '/about', { ...fixtures['/about'], status: 500 }, /HTTP 500/],
  [
    'error page served as HTTP 200',
    '/',
    { type: 'text/html', body: page('Something went wrong') },
    /primary heading/,
  ],
  [
    'empty content list',
    '/projects',
    { type: 'text/html', body: page('Projects') },
    /linked content card/,
  ],
  [
    'broken linked detail',
    '/books/example',
    { type: 'text/html', body: page('Not found') },
    /primary heading/,
  ],
  [
    'missing sitemap entries',
    '/sitemap.xml',
    {
      ...fixtures['/sitemap.xml'],
      body: fixtures['/sitemap.xml'].body.replace(
        `<loc>${new URL('/books/example', siteConfig.site.siteUrl).href}</loc>`,
        ''
      ),
    },
    /Missing sitemap entry: \/books\/example/,
  ],
  [
    'crawler blocking',
    '/robots.txt',
    { type: 'text/plain', body: 'User-agent: *\nDisallow: /' },
    /public crawling/,
  ],
  [
    'wrong content type',
    '/projects/example',
    { ...fixtures['/projects/example'], type: 'application/json' },
    /Unexpected content type/,
  ],
  [
    'empty detail body',
    '/projects/example',
    { type: 'text/html', body: page('Example project', '') },
    /Missing main page content/,
  ],
] as const;

for (const [name, route, fixture, expectedError] of failures) {
  test(`site smoke check fails for ${name}`, async () => {
    const result = await runSmokeCheck({ [route]: fixture });
    assert.equal(result.code, 1, result.output);
    assert.match(result.output, expectedError);
    assert.match(
      result.output,
      new RegExp(`FAIL ${route.replace(/\//g, '\\/')}:`)
    );
    assert.ok(result.requested.has('/robots.txt'));
    assert.ok(result.requested.has('/sitemap.xml'));
  });
}
