import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const config = JSON.parse(
  await readFile(new URL('../config/index.json', import.meta.url), 'utf8')
);
const canonicalOrigin = config.site.siteUrl;
const origin = process.env.SITE_SMOKE_ORIGIN || canonicalOrigin;
const corePages = [
  ['/', config.author.title],
  ['/about', /^About\b/],
  ['/projects', 'Projects'],
  ['/books', 'Books'],
];
const detailPaths = [];

async function get(route, contentType) {
  const response = await fetch(new URL(route, origin), {
    signal: AbortSignal.timeout(20_000),
    redirect: 'error',
  });
  assert.equal(
    response.status,
    200,
    `Expected HTTP 200, received HTTP ${response.status}`
  );
  assert.match(
    response.headers.get('content-type') || '',
    contentType,
    'Unexpected content type'
  );
  return response.text();
}

function checkPage(html, heading) {
  const actualHeading = html
    .match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]
    .replace(/<[^>]+>/g, '')
    .trim();
  assert.ok(actualHeading, 'Missing primary heading');
  if (heading instanceof RegExp) assert.match(actualHeading, heading);
  else assert.equal(actualHeading, heading, 'Unexpected primary heading');
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  assert.ok(main?.replace(/<[^>]+>/g, '').trim(), 'Missing main page content');
}

async function check(route, verify) {
  try {
    await verify();
    console.log(`PASS ${route}`);
  } catch (error) {
    console.error(`FAIL ${route}: ${error.message}`);
    process.exitCode = 1;
  }
}

await Promise.all(
  corePages
    .map(([route, heading]) =>
      check(route, async () => {
        const html = await get(route, /^text\/html\b/i);
        checkPage(html, heading);
        if (route === '/about')
          assert.match(
            html,
            /<h2\b[^>]*>Experience<\/h2>/i,
            'Missing experience section'
          );
        if (route === '/projects' || route === '/books') {
          // Follow a rendered card rather than hardcoding a content slug or title.
          const card = [
            ...html.matchAll(
              /<a\b[^>]*href="([^"]+)"[^>]*>\s*<h2\b[^>]*>([\s\S]*?)<\/h2>\s*<\/a>/gi
            ),
          ].find((match) => match[1].startsWith(`${route}/`));
          assert.ok(card, 'Missing linked content card');
          const detailPath = card[1];
          detailPaths.push(detailPath);
          await check(detailPath, async () => {
            checkPage(
              await get(detailPath, /^text\/html\b/i),
              card[2].replace(/<[^>]+>/g, '').trim()
            );
          });
        }
      })
    )
    .concat([
      check('/robots.txt', async () => {
        const robots = await get('/robots.txt', /^text\/plain\b/i);
        assert.equal(
          robots.replace(/\r\n/g, '\n').trim(),
          `User-agent: *\nAllow: /\n\nSitemap: ${canonicalOrigin}/sitemap.xml`,
          'Expected public crawling and canonical sitemap'
        );
      }),
    ])
);

await check('/sitemap.xml', async () => {
  const xml = await get('/sitemap.xml', /^(application|text)\/xml\b/i);
  assert.match(
    xml,
    /<urlset\b[^>]*xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0\.9"[^>]*>/
  );
  assert.match(xml, /<\/urlset>\s*$/);
  const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1]
  );
  for (const route of [...corePages.map(([route]) => route), ...detailPaths]) {
    assert.ok(
      locations.includes(new URL(route, canonicalOrigin).href),
      `Missing sitemap entry: ${route}`
    );
  }
});
