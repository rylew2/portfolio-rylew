import assert from 'node:assert/strict';
import test from 'node:test';

import { XMLParser, XMLValidator } from 'fast-xml-parser';

import { getContentList } from '../lib/content';
import { generateSitemapXml, getCanonicalSitemapUrls } from '../lib/sitemap';

const CANONICAL_ORIGIN = 'https://www.rylew.dev';
const SITEMAP_NAMESPACE = 'http://www.sitemaps.org/schemas/sitemap/0.9';

const expectedUrls = [
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

const parseSitemap = (xml: string) => {
  return new XMLParser({ ignoreAttributes: false }).parse(xml) as {
    urlset: {
      '@_xmlns': string;
      url: Array<{ loc: string }>;
    };
  };
};

test('generates valid XML with every canonical content URL', () => {
  const xml = generateSitemapXml();
  const sitemap = parseSitemap(xml);
  const locations = sitemap.urlset.url.map(({ loc }) => loc);

  assert.equal(XMLValidator.validate(xml), true);
  assert.equal(sitemap.urlset['@_xmlns'], SITEMAP_NAMESPACE);
  assert.deepEqual(locations, expectedUrls);
  assert.deepEqual(getCanonicalSitemapUrls(), expectedUrls);
});

test('sorts and deduplicates URLs for stable sitemap output', () => {
  const urls = [
    `${CANONICAL_ORIGIN}/projects/z-last`,
    `${CANONICAL_ORIGIN}/about`,
    `${CANONICAL_ORIGIN}/projects/z-last`,
  ];

  const first = generateSitemapXml(urls);
  const second = generateSitemapXml([...urls].reverse());

  assert.equal(first, second);
  assert.deepEqual(
    parseSitemap(first).urlset.url.map(({ loc }) => loc),
    [`${CANONICAL_ORIGIN}/about`, `${CANONICAL_ORIGIN}/projects/z-last`]
  );
  assert.ok(first.endsWith('\n'));
});

test('escapes XML-reserved characters in locations', () => {
  const xml = generateSitemapXml([`${CANONICAL_ORIGIN}/search?a=1&b=<two>"'`]);

  assert.equal(XMLValidator.validate(xml), true);
  assert.match(
    xml,
    /<loc>https:\/\/www\.rylew\.dev\/search\?a=1&amp;b=&lt;two&gt;&quot;&apos;<\/loc>/
  );
});

test('excludes API and taxonomy routes from the canonical URL set', () => {
  const urls = getCanonicalSitemapUrls();

  for (const excludedSegment of ['/api/', '/tags/', '/categories/']) {
    assert.equal(
      urls.some((url) => url.includes(excludedSegment)),
      false,
      `unexpected sitemap URL containing ${excludedSegment}`
    );
  }
});
