# Robots and Sitemap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add crawler guidance and a deterministic XML sitemap containing the core public pages plus every project and book detail page.

**Architecture:** A pure TypeScript module derives canonical URLs from the existing site configuration and Markdown content loader, then serializes escaped, sorted XML. A Pages Router response page serves that XML, while a static public file serves crawler rules.

**Tech Stack:** Next.js 16 Pages Router, TypeScript, Node test runner through `tsx`, `fast-xml-parser`, and Playwright.

## Global Constraints

- Use the canonical `https://www.rylew.dev` origin already configured.
- Include only `/`, `/about`, `/books`, `/projects`, and every project/book detail page.
- Automatically include future project and book Markdown slugs.
- Exclude all API, tag, and category taxonomy routes.
- Serve well-formed, escaped, deduplicated, stable XML with `application/xml; charset=utf-8`.
- Allow public crawling and reference the canonical sitemap without listing API routes in `robots.txt`.
- Do not modify taxonomy generation, layout/page metadata, positioning copy, README, homepage, production headers/workflows, or content.

---

### Task 1: Specify the canonical URL set and XML serialization

**Files:**

- Create: `tests/sitemap.test.ts`
- Create: `lib/sitemap.ts`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**

- Produces: `getCanonicalSitemapUrls(): string[]`
- Produces: `generateSitemapXml(urls?: readonly string[]): string`

- [ ] **Step 1: Install the XML validator used by tests**

Run:

```powershell
npm install --save-dev fast-xml-parser
```

- [ ] **Step 2: Write the failing sitemap tests**

Create `tests/sitemap.test.ts` with tests that:

```typescript
import assert from 'node:assert/strict';
import test from 'node:test';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { getContentList } from '../lib/content';
import { generateSitemapXml, getCanonicalSitemapUrls } from '../lib/sitemap';

const expectedUrls = [
  'https://www.rylew.dev/',
  'https://www.rylew.dev/about',
  'https://www.rylew.dev/books',
  'https://www.rylew.dev/projects',
  ...getContentList('book').map(
    ({ slug }) => `https://www.rylew.dev/books/${encodeURIComponent(slug!)}`
  ),
  ...getContentList('project').map(
    ({ slug }) => `https://www.rylew.dev/projects/${encodeURIComponent(slug!)}`
  ),
].sort();

test('generates valid XML with every canonical content URL', () => {
  const xml = generateSitemapXml();
  assert.equal(XMLValidator.validate(xml), true);
  const parsed = new XMLParser().parse(xml);
  const locations = parsed.urlset.url.map(({ loc }: { loc: string }) => loc);
  assert.deepEqual(locations, expectedUrls);
});
```

Add separate assertions for sorted, deduplicated, repeatable output,
`& < > " '` escaping when explicit URLs are serialized, and absence of
`/api/`, `/tags/`, and `/categories/`.

- [ ] **Step 3: Verify RED**

Run:

```powershell
npm run test:unit
```

Expected: failure because `lib/sitemap.ts` does not exist.

- [ ] **Step 4: Implement the minimum generator**

Create `lib/sitemap.ts` with:

```typescript
import SiteConfig from '../config/index.json';
import { getContentList } from './content';

const CORE_PATHS = ['/', '/about', '/books', '/projects'] as const;

export const getCanonicalSitemapUrls = (): string[] => {
  const detailPaths = (['book', 'project'] as const).flatMap((type) =>
    getContentList(type).map(({ slug }) => {
      if (typeof slug !== 'string' || slug.length === 0) {
        throw new Error(`${type} content requires a slug`);
      }
      return `/${type}s/${encodeURIComponent(slug)}`;
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
```

Add a private XML escape helper and implement `generateSitemapXml` with an XML
declaration, the sitemap protocol namespace, one `<url><loc>escaped URL</loc></url>`
per unique sorted URL, and a final newline.

- [ ] **Step 5: Verify GREEN**

Run `npm run test:unit`; expected: all unit tests pass.

### Task 2: Serve the crawler files

**Files:**

- Create: `pages/sitemap.xml.tsx`
- Create: `public/robots.txt`
- Create temporarily, then remove: `playwright.production.config.ts`
- Create: `tests/crawler-files.spec.ts`

**Interfaces:**

- Consumes: `generateSitemapXml()` from `lib/sitemap.ts`
- Produces: `GET /sitemap.xml` as `application/xml; charset=utf-8`
- Produces: `GET /robots.txt` as plain text

- [ ] **Step 1: Write the failing production endpoint tests**

Create `tests/crawler-files.spec.ts` to request `/robots.txt` and
`/sitemap.xml`. Assert HTTP 200, expected content types, `User-agent: *`,
`Allow: /`, the absolute sitemap directive, valid XML, all expected canonical
locations, and absence of API/tag/category routes.

- [ ] **Step 2: Verify RED against a production server**

Create a temporary `playwright.production.config.ts` that runs
`npm run start -- -p 3105` with `baseURL` and `webServer.url` set to
`http://127.0.0.1:3105`. Run:

```powershell
npm run build
npx playwright test tests/crawler-files.spec.ts --config playwright.production.config.ts
```

Expected: endpoint tests fail with 404 responses.

- [ ] **Step 3: Add the crawler endpoints**

Create `pages/sitemap.xml.tsx` with a null-rendering component and a typed
`getServerSideProps` that sets status 200, sets
`Content-Type: application/xml; charset=utf-8`, and ends the response with
`generateSitemapXml()`.

Create `public/robots.txt` with:

```text
User-agent: *
Allow: /

Sitemap: https://www.rylew.dev/sitemap.xml
```

- [ ] **Step 4: Verify GREEN**

Rebuild and rerun the focused production endpoint tests; expected: both pass.

- [ ] **Step 5: Run full verification and remove temporary configuration**

Run:

```powershell
npx prettier --check docs/superpowers/specs/2026-07-27-robots-sitemap-design.md docs/superpowers/plans/2026-07-27-robots-sitemap.md lib/sitemap.ts pages/sitemap.xml.tsx public/robots.txt tests/sitemap.test.ts tests/crawler-files.spec.ts package.json package-lock.json
npm run test:unit
npm run build
npx playwright test --config playwright.production.config.ts
```

Remove `playwright.production.config.ts`, restore unrelated generated build
drift, and confirm `git status --short` contains only intended files.

- [ ] **Step 6: Review and publish**

Review `git diff master...HEAD` plus the staged diff against this specification,
commit the implementation, push `tier3/robots-sitemap`, and open a GitHub pull
request targeting `master` with the verification commands and results. Do not
merge the pull request.
