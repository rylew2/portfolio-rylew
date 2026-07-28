import { expect, test } from '@playwright/test';
import { XMLParser, XMLValidator } from 'fast-xml-parser';

import { getContentList } from '../lib/content';

const CANONICAL_ORIGIN = 'https://www.rylew.dev';
const SITEMAP_NAMESPACE = 'http://www.sitemaps.org/schemas/sitemap/0.9';

const expectedSitemapUrls = [
  ...new Set([
    `${CANONICAL_ORIGIN}/`,
    `${CANONICAL_ORIGIN}/about`,
    `${CANONICAL_ORIGIN}/books`,
    `${CANONICAL_ORIGIN}/projects`,
    ...getContentList('book').map(
      ({ slug }) => `${CANONICAL_ORIGIN}/books/${encodeURIComponent(slug!)}`
    ),
    ...getContentList('project').map(
      ({ slug }) => `${CANONICAL_ORIGIN}/projects/${encodeURIComponent(slug!)}`
    ),
  ]),
].sort();

test('robots.txt allows public crawling and points to the canonical sitemap', async ({
  request,
}) => {
  const response = await request.get('/robots.txt');

  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toMatch(/^text\/plain\b/i);

  const body = (await response.text()).replace(/\r\n/g, '\n').trimEnd();
  expect(body).toBe(`User-agent: *
Allow: /

Sitemap: ${CANONICAL_ORIGIN}/sitemap.xml`);
  expect(body).not.toContain('/api');
});

test('sitemap.xml serves valid canonical URLs and excludes low-value routes', async ({
  request,
}) => {
  const response = await request.get('/sitemap.xml');

  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toMatch(
    /^application\/xml;\s*charset=utf-8$/i
  );

  const xml = await response.text();
  expect(XMLValidator.validate(xml)).toBe(true);

  const parsed = new XMLParser({ ignoreAttributes: false }).parse(xml) as {
    urlset: {
      '@_xmlns': string;
      url: Array<{ loc: string }>;
    };
  };
  const locations = parsed.urlset.url.map(({ loc }) => loc);

  expect(parsed.urlset['@_xmlns']).toBe(SITEMAP_NAMESPACE);
  expect(locations).toEqual(expectedSitemapUrls);

  for (const excludedSegment of ['/api/', '/tags/', '/categories/']) {
    expect(
      locations.some((location) => location.includes(excludedSegment))
    ).toBe(false);
  }
});
