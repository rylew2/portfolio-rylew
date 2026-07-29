# Taxonomy Route Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate book/project tag routes and book category routes only for configured taxonomy values used by that content type.

**Architecture:** A reusable markdown-content helper exposes unique tag or category values per content type. Each dynamic route filters its metadata configuration through those used values before returning paths, while `fallback: false` provides 404 behavior for omitted values.

**Tech Stack:** Next.js Pages Router, TypeScript, Node test runner through `tsx`, Playwright

## Global Constraints

- Preserve configured titles and descriptions for every retained route.
- Do not modify sitemap or robots behavior, page metadata, content frontmatter, homepage content, or unrelated presentation.
- Derive path eligibility from actual markdown content and keep `fallback: false`.

---

### Task 1: Prove taxonomy path over-generation

**Files:**

- Create: `tests/taxonomy-paths.test.ts`
- Modify: `tests/tag-pages.spec.ts`

**Interfaces:**

- Consumes: the `getStaticPaths()` exports from the three taxonomy page modules
- Produces: regression expectations for exact generated parameters and HTTP 404 behavior

- [ ] **Step 1: Write focused failing unit tests**

Create tests that call each real route's `getStaticPaths()` and assert these
literal parameter lists:

```ts
book tags: ["devops", "engineering", "management"]
project tags: [
  "angular",
  "clustering",
  "d3",
  "dimensionality reduction",
  "django",
  "edtech",
  "flask",
  "fullstack",
  "graphql",
  "javascript",
  "machine learning",
  "mdp",
  "omscs",
  "optimization",
  "policy iteration",
  "postgres",
  "python",
  "q-learning",
  "randomized algorithms",
  "react",
  "reinforcement learning",
  "sklearn",
  "value iteration",
  "vue",
]
book categories: []
```

Also assert `fallback` is exactly `false`.

- [ ] **Step 2: Run the unit test and verify RED**

Run:

```powershell
npx tsx --test tests/taxonomy-paths.test.ts
```

Expected: FAIL because current route modules return every configured value.

- [ ] **Step 3: Add failing HTTP-boundary coverage**

In `tests/tag-pages.spec.ts`, request an unused book tag, an unused project tag,
and an unused book category and expect each response status to be `404`.

- [ ] **Step 4: Run the focused Playwright test and verify RED**

Run:

```powershell
npx playwright test --config playwright.agent.config.ts tests/tag-pages.spec.ts -g "unused taxonomy routes return 404" --workers=1
```

Expected: FAIL because the current build emits empty pages for configured but
unused taxonomy values.

### Task 2: Filter configured paths through content-derived values

**Files:**

- Modify: `lib/content.ts`
- Modify: `pages/books/tags/[tag].tsx`
- Modify: `pages/projects/tags/[tag].tsx`
- Modify: `pages/books/categories/[category].tsx`
- Test: `tests/taxonomy-paths.test.ts`
- Test: `tests/tag-pages.spec.ts`

**Interfaces:**

- Consumes: `getContentList(contentType)` and each taxonomy configuration array
- Produces: `getContentTaxonomyValues(contentType, taxonomy): string[]`

- [ ] **Step 1: Implement the minimal helper**

Add this public interface in `lib/content.ts`:

```ts
type ContentTaxonomy = 'tags' | 'category';

export const getContentTaxonomyValues = (
  contentType: IContentType,
  taxonomy: ContentTaxonomy
): string[] => {
  const content = getContentList(contentType);
  const values =
    taxonomy === 'tags'
      ? content.flatMap((item) => item.tags ?? [])
      : content.flatMap((item) => (item.category ? [item.category] : []));

  return [...new Set(values)];
};
```

- [ ] **Step 2: Filter each route's configured values**

For each `getStaticPaths()`, make a `Set` from
`getContentTaxonomyValues(contentType, taxonomy)` and return only configured
entries whose `tag` or `category` is present.

- [ ] **Step 3: Run focused tests and verify GREEN**

Run:

```powershell
npx tsx --test tests/taxonomy-paths.test.ts
npx playwright test --config playwright.agent.config.ts tests/tag-pages.spec.ts --workers=1
```

Expected: all focused unit and Playwright tests pass.

- [ ] **Step 4: Run the mutation check**

Confirm that removing a route filter, using the wrong content type, or restoring
all configured categories would fail at least one focused test.

### Task 3: Verify and prepare the pull request

**Files:**

- Delete: `playwright.agent.config.ts`
- Review: all files changed against `master`

**Interfaces:**

- Consumes: the completed implementation and regression coverage
- Produces: one committed and pushed PR branch targeting `master`

- [ ] **Step 1: Run format verification**

Run:

```powershell
npx prettier --write docs/superpowers/specs/2026-07-27-taxonomy-route-cleanup-design.md docs/superpowers/plans/2026-07-27-taxonomy-route-cleanup.md lib/content.ts pages/books/tags/[tag].tsx pages/projects/tags/[tag].tsx pages/books/categories/[category].tsx tests/taxonomy-paths.test.ts tests/tag-pages.spec.ts
npm run format:check
```

- [ ] **Step 2: Run complete verification**

Run:

```powershell
npm run test:unit
npm run build
npx playwright test --config playwright.agent.config.ts --workers=1
```

Expected: all commands exit zero.

- [ ] **Step 3: Remove temporary and generated drift**

Delete `playwright.agent.config.ts`, restore only unrelated generated files
changed by build or test runs, and confirm the diff contains the approved
taxonomy scope.

- [ ] **Step 4: Self-review against master**

Review:

```powershell
git diff --check master...HEAD
git diff --stat master
git diff master -- docs/superpowers lib/content.ts pages/books/tags/[tag].tsx pages/projects/tags/[tag].tsx pages/books/categories/[category].tsx tests/taxonomy-paths.test.ts tests/tag-pages.spec.ts
```

Check path/content correspondence, retained metadata behavior, 404 coverage,
formatting, and scope exclusions.

- [ ] **Step 5: Commit, push, and create the PR**

Commit the final diff, push `tier3/taxonomy-cleanup`, then create a GitHub pull
request targeting `master` with the rationale and exact verification evidence.
Do not merge it.
