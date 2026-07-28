# Page-Specific Canonical and Social Metadata Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Emit correct, unique canonical, Open Graph, and Twitter metadata for every rendered page.

**Architecture:** Make each page pass its concrete public path to `Layout` through a required `canonicalPath` prop. `Layout` will sanitize and resolve that path against the configured site origin, emit the shared metadata, and default Open Graph type to `website`; only project and book details will request `article`.

**Tech Stack:** Next.js 16 Pages Router, React 19, TypeScript, `next/head`, Playwright

## Global Constraints

- Use the configured canonical origin `https://www.rylew.dev`.
- Never emit dynamic route placeholders such as `[id]`, `[tag]`, or `[category]`.
- Exclude query strings and hashes from canonical URLs and `og:url`.
- Reuse existing page title, description, and site-wide social image values.
- Do not change positioning copy, keywords, the social image asset, content, taxonomy, sitemap/robots, README, homepage layout, workflows, dependencies, security headers, or structured data.
- Use a temporary branch-local Playwright config on port 3106 and remove it before committing implementation.

---

### Task 1: Add focused metadata regression coverage

**Files:**

- Create: `tests/page-metadata.spec.ts`

**Interfaces:**

- Consumes: rendered `<head>` output for each public route
- Produces: Playwright assertions for one canonical link, matching Open Graph URL/type, and complete Twitter card metadata

- [ ] **Step 1: Write the failing metadata test**

Create literal fixtures covering `/`, `/about`, `/projects`, `/books`,
`/projects/cardgame`, `/books/accelerate`, one project tag, one book tag, and
one book category. Use a helper that asserts each selector has count `1` before
checking its literal content:

```ts
const expectUniqueMeta = async (
  page: Page,
  selector: string,
  expectedContent: string
) => {
  const metadata = page.locator(selector);
  await expect(metadata).toHaveCount(1);
  await expect(metadata).toHaveAttribute('content', expectedContent);
};
```

For every fixture assert:

```ts
await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
  'href',
  expectedUrl
);
await expectUniqueMeta(page, 'meta[property="og:url"]', expectedUrl);
await expectUniqueMeta(page, 'meta[property="og:type"]', expectedType);
await expectUniqueMeta(page, 'meta[name="twitter:card"]', 'summary');
await expectUniqueMeta(page, 'meta[name="twitter:title"]', expectedTitle);
await expectUniqueMeta(
  page,
  'meta[name="twitter:description"]',
  expectedDescription
);
await expectUniqueMeta(
  page,
  'meta[name="twitter:image"]',
  'https://www.rylew.dev/Logo.png'
);
```

Add a query/hash case for `/projects?utm_source=metadata#selected-work` that
expects `https://www.rylew.dev/projects`.

- [ ] **Step 2: Run the focused test to verify RED**

Run:

```powershell
npx playwright test --config=playwright.metadata.config.ts tests/page-metadata.spec.ts --workers=1
```

Expected: FAIL because canonical links and Twitter title, description, and
image tags do not exist, and detail `og:url` values still use the site root.

- [ ] **Step 3: Confirm the failure is behavioral**

Check that Playwright reached the real pages and failures point to missing or
incorrect metadata selectors/values, not server startup, imports, or fixture
typos.

### Task 2: Centralize canonical and social metadata in Layout

**Files:**

- Modify: `components/layout.tsx`
- Modify: `pages/index.tsx`
- Modify: `pages/about.tsx`
- Modify: `pages/projects.tsx`
- Modify: `pages/books.tsx`

**Interfaces:**

- Consumes: `canonicalPath: string`, `pageTitle: string`,
  `pageDescription?: string`, and `ogType?: "website" | "article"`
- Produces: one sanitized absolute canonical URL, matching `og:url`, the
  selected `og:type`, and complete Twitter metadata

- [ ] **Step 1: Change the Layout contract**

Replace `pathname` with required `canonicalPath`, add the optional `ogType`,
and default it:

```ts
interface ILayout {
  children: ReactNode;
  canonicalPath: string;
  pageTitle: string;
  pageDescription?: string;
  ogType?: "website" | "article";
}

const Layout = ({
  children,
  canonicalPath,
  pageTitle,
  pageDescription,
  ogType = "website",
}: ILayout) => {
```

- [ ] **Step 2: Derive shared metadata values**

Resolve the path against the configured origin and remove query/hash data:

```ts
const canonicalUrl = new URL(canonicalPath, SiteConfig.site.siteUrl);
canonicalUrl.search = '';
canonicalUrl.hash = '';

const canonicalHref = canonicalUrl.toString();
const description = pageDescription || SiteConfig.site.siteDescription;
const socialImage = new URL(
  SiteConfig.site.siteImage,
  SiteConfig.site.siteUrl
).toString();
```

- [ ] **Step 3: Emit the complete metadata set**

Add a keyed canonical link, use the shared values for existing Open Graph
tags, and add Twitter title, description, and image:

```tsx
<link rel="canonical" href={canonicalHref} key="canonical" />
<meta property="og:url" content={canonicalHref} key="ogurl" />
<meta property="og:type" content={ogType} key="ogtype" />
<meta name="twitter:title" content={pageTitle} key="twtitle" />
<meta name="twitter:description" content={description} key="twdescription" />
<meta name="twitter:image" content={socialImage} key="twimage" />
```

Use `canonicalPath` where `pathname` previously controlled the header and
page-change effect.

- [ ] **Step 4: Update static page callers**

Pass `canonicalPath="/"`, `canonicalPath="/about"`,
`canonicalPath="/projects"`, and `canonicalPath="/books"` from the respective
pages without changing titles, descriptions, or visible content.

- [ ] **Step 5: Run static metadata cases**

Run:

```powershell
npx playwright test --config=playwright.metadata.config.ts tests/page-metadata.spec.ts --grep "homepage|static|query" --workers=1
```

Expected: PASS for static/query cases while dynamic fixtures remain to be
implemented.

### Task 3: Supply concrete dynamic canonical paths

**Files:**

- Modify: `pages/projects/[id].tsx`
- Modify: `pages/books/[id].tsx`
- Modify: `pages/projects/tags/[tag].tsx`
- Modify: `pages/books/tags/[tag].tsx`
- Modify: `pages/books/categories/[category].tsx`

**Interfaces:**

- Consumes: content `id` values and `getStaticProps` route parameters
- Produces: URL-encoded concrete `canonicalPath` values; detail pages also
  supply `ogType="article"`

- [ ] **Step 1: Update project and book details**

Remove `useRouter` and pass concrete content identifiers:

```tsx
<Layout
  canonicalPath={`/projects/${encodeURIComponent(projectData.id)}`}
  pageTitle={title}
  pageDescription={description}
  ogType="article"
>
```

Use the equivalent `/books/${encodeURIComponent(bookData.id)}` path for book
details.

- [ ] **Step 2: Update project and book tag pages**

Add `tag: string` to each page prop interface, return `tag: params?.tag as
string` from `getStaticProps`, remove `useRouter`, and pass:

```tsx
canonicalPath={`/projects/tags/${encodeURIComponent(tag)}`}
```

Use the equivalent `/books/tags/` prefix on book tag pages.

- [ ] **Step 3: Update the book category page**

Add `category: string` to page props, return it from `getStaticProps`, remove
`useRouter`, and pass:

```tsx
canonicalPath={`/books/categories/${encodeURIComponent(category)}`}
```

- [ ] **Step 4: Run the complete focused suite to verify GREEN**

Run:

```powershell
npx playwright test --config=playwright.metadata.config.ts tests/page-metadata.spec.ts --workers=1
```

Expected: all metadata fixtures pass.

- [ ] **Step 5: Refactor and re-run focused coverage**

Remove duplicated value construction or obsolete router imports only where the
new contract makes them unnecessary, then rerun the focused suite and confirm
it remains green.

### Task 4: Verify, review, and prepare the PR

**Files:**

- Modify temporarily, then remove: `playwright.metadata.config.ts`
- Review: every file changed from `master`

**Interfaces:**

- Consumes: completed source and tests
- Produces: a clean, verified branch and PR targeting `master`

- [ ] **Step 1: Run changed-file formatting checks**

Run Prettier against the changed TypeScript, test, and Markdown files:

```powershell
npx prettier --check components/layout.tsx pages/index.tsx pages/about.tsx pages/projects.tsx pages/books.tsx 'pages/projects/[id].tsx' 'pages/books/[id].tsx' 'pages/projects/tags/[tag].tsx' 'pages/books/tags/[tag].tsx' 'pages/books/categories/[category].tsx' tests/page-metadata.spec.ts docs/superpowers/specs/2026-07-27-page-metadata-design.md docs/superpowers/plans/2026-07-27-page-metadata.md
```

Expected: all matched files use Prettier formatting.

- [ ] **Step 2: Run unit tests and production build**

Run:

```powershell
npm run test:unit
npm run build
```

Expected: 33 unit tests pass and the production build completes.

- [ ] **Step 3: Switch the temporary Playwright config to production**

Set its server command to `npm run start -- -p 3106`, keep its base URL on
port 3106, and disable server reuse.

- [ ] **Step 4: Run focused and full production-server Playwright coverage**

Run:

```powershell
npx playwright test --config=playwright.metadata.config.ts tests/page-metadata.spec.ts --workers=1
npx playwright test --config=playwright.metadata.config.ts --workers=1
```

Expected: the focused metadata suite and all existing browser tests pass
against the production build.

- [ ] **Step 5: Remove temporary/generated artifacts**

Delete `playwright.metadata.config.ts`, restore unrelated generated
`next-env.d.ts`, `tsconfig.json`, `me/summary.txt`, and
`me/chat-context.json` drift if present, and confirm `git status --short`
contains only intended files.

- [ ] **Step 6: Self-review against the approved scope**

Run:

```powershell
git diff --check master...HEAD
git diff --stat master...HEAD
git diff master...HEAD
```

Verify each route family has a concrete canonical path, detail pages alone use
`article`, no literal route placeholders can reach metadata, all metadata is
unique, and excluded files/behavior remain untouched.

- [ ] **Step 7: Commit, push, and create the PR**

Commit the implementation and tests, push `tier3/page-metadata`, and use the
GitHub CLI to create a PR targeting `master` with the test evidence. Do not
merge it.
