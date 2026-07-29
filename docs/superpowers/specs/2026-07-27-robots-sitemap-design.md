# Robots and Sitemap Design

## Goal

Expose crawler guidance at `/robots.txt` and a deterministic XML sitemap at
`/sitemap.xml` for the site's valuable canonical public pages.

## Scope

The sitemap contains exactly:

- `https://www.rylew.dev/`
- `https://www.rylew.dev/about`
- `https://www.rylew.dev/books`
- `https://www.rylew.dev/projects`
- Every book detail URL derived from the Markdown frontmatter slug
- Every project detail URL derived from the Markdown frontmatter slug

It excludes every `/api/` URL and all `/books/tags/`, `/books/categories/`,
and `/projects/tags/` taxonomy URLs. This work does not change taxonomy
generation, page metadata, layout, copy, content, documentation outside these
implementation records, headers, or deployment workflows.

## Architecture

`lib/sitemap.ts` owns the canonical URL list and XML serialization. It reads
the existing `config/index.json` canonical origin and calls
`getContentList("project")` and `getContentList("book")`, so adding a Markdown
content file with a slug automatically adds its detail page. Slugs are encoded
as URL path segments, URLs are sorted before serialization, and XML-reserved
characters are escaped. Duplicate canonical URLs are emitted only once.

`pages/sitemap.xml.tsx` follows the official Next.js Pages Router pattern: a
`getServerSideProps` function writes the generated XML to the Node response,
sets `application/xml; charset=utf-8`, and ends the response. The page component
renders nothing.

`public/robots.txt` allows crawling from the root and references the absolute
canonical sitemap URL. It does not list API routes, either as crawl targets or
as advertised disallow entries.

## Error Handling and Stability

Content entries without a non-empty slug fail sitemap generation instead of
silently emitting an invalid canonical URL. The output omits volatile
timestamps, deduplicates and sorts the complete URL set lexicographically, and
ends with a newline, making identical content produce byte-for-byte stable XML.

## Testing

Unit tests parse and validate the XML, compare its locations with the complete
expected set from repository content, assert stable ordering and repeated
output, exercise XML escaping, and explicitly reject API and taxonomy URLs.

Production-server Playwright coverage requests both endpoints on port 3105. It
checks response status, content type, crawler rules, sitemap reference, XML
parseability, expected canonical URLs, and the same explicit exclusions.
