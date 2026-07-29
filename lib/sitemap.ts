import SiteConfig from '../config/index.json';

import { getContentList } from './content';

const CORE_PATHS = ['/', '/about', '/books', '/projects'] as const;

const escapeXml = (value: string): string =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&apos;',
      })[character]!
  );

export const getCanonicalSitemapUrls = (): string[] => {
  const detailPaths = (['book', 'project'] as const).flatMap((contentType) =>
    getContentList(contentType).map(({ slug }) => {
      if (typeof slug !== 'string' || slug.trim().length === 0) {
        throw new Error(`${contentType} content requires a slug`);
      }

      return `/${contentType}s/${encodeURIComponent(slug)}`;
    })
  );

  return [
    ...new Set(
      [...CORE_PATHS, ...detailPaths].map(
        (pathname) => new URL(pathname, SiteConfig.site.siteUrl).href
      )
    ),
  ].sort();
};

export const generateSitemapXml = (
  urls: readonly string[] = getCanonicalSitemapUrls()
): string => {
  const entries = [...new Set(urls)]
    .sort()
    .map((url) => `  <url>\n    <loc>${escapeXml(url)}</loc>\n  </url>`);

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n');
};
