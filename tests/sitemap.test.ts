import assert from 'node:assert/strict';
import test from 'node:test';

import { XMLParser, XMLValidator } from 'fast-xml-parser';

import { getContentList } from '../lib/content';
import { generateSitemapXml, getCanonicalSitemapUrls } from '../lib/sitemap';

const CANONICAL_ORIGIN = 'https://www.rylew.dev';

const expectedUrls = [
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
].sort();

const parseLocations = (xml: string): string[] => {
  const parsed = new XMLParser().parse(xml) as {
    urlset: { url: Array<{ loc: string }> };
  };

  return parsed.urlset.url.map(({ loc }) => loc);
};

test('generates valid XML with every canonical content URL', () => {
  const xml = generateSitemapXml();

  assert.equal(XMLValidator.validate(xml), true);
  assert.deepEqual(parseLocations(xml), expectedUrls);
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
  assert.deepEqual(parseLocations(first), [
    `${CANONICAL_ORIGIN}/about`,
    `${CANONICAL_ORIGIN}/projects/z-last`,
  ]);
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
