# Production Hygiene Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the unused hello API, make Playwright CI consistently use npm, and add verified low-risk response headers.

**Architecture:** A root Next.js configuration applies two global response headers. A focused Playwright integration spec verifies the headers through the real server and confirms the deleted route now returns 404; the GitHub Actions workflow consumes the committed npm lockfile and existing npm script.

**Tech Stack:** Next.js 16 Pages Router, TypeScript, Playwright, npm, GitHub Actions

## Global Constraints

- Do not add CSP in this pull request.
- Do not use `npm audit fix --force` or accept major-version changes.
- Do not change README, scratch files, sitemap, robots, page metadata, taxonomy, homepage, or content.
- Run branch-specific Playwright checks on port 3103 with `reuseExistingServer: false`.

---

### Task 1: Specify production HTTP behavior

**Files:**

- Create: `tests/production-hygiene.spec.ts`

**Interfaces:**

- Consumes: the running Next.js server through Playwright's configured `request`
  fixture.
- Produces: regression coverage for `/api/hello` returning 404 and `/` returning
  both configured security headers.

- [ ] **Step 1: Write failing response tests**

```ts
import { expect, test } from '@playwright/test';

test('the removed hello API returns not found', async ({ request }) => {
  const response = await request.get('/api/hello');
  expect(response.status()).toBe(404);
});

test('pages include the low-risk security headers', async ({ request }) => {
  const response = await request.get('/');
  expect(response.headers()['x-content-type-options']).toBe('nosniff');
  expect(response.headers()['referrer-policy']).toBe(
    'strict-origin-when-cross-origin'
  );
});
```

- [ ] **Step 2: Run the focused spec and verify red**

Run with a temporary port-3103 Playwright config:
`npx playwright test tests/production-hygiene.spec.ts --config playwright.agent.config.ts`

Expected: the route assertion receives 200 and the header assertions receive
`undefined`.

### Task 2: Remove the route and configure headers

**Files:**

- Delete: `pages/api/hello.tsx`
- Create: `next.config.js`

**Interfaces:**

- Consumes: Next.js `headers()` configuration contract.
- Produces: `/api/hello` has no route; all matched responses contain
  `X-Content-Type-Options: nosniff` and
  `Referrer-Policy: strict-origin-when-cross-origin`.

- [ ] **Step 1: Delete the unused route**

Delete `pages/api/hello.tsx` without replacing it.

- [ ] **Step 2: Add the minimal Next.js configuration**

```js
/** @type {import("next").NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

- [ ] **Step 3: Run the focused spec and verify green**

Run:
`npx playwright test tests/production-hygiene.spec.ts --config playwright.agent.config.ts`

Expected: 2 passed.

### Task 3: Align Playwright CI with npm

**Files:**

- Modify: `.github/workflows/playwright.yml`

**Interfaces:**

- Consumes: `package-lock.json` and the `test:e2e` script from `package.json`.
- Produces: deterministic CI installation and invocation through repository npm
  scripts.

- [ ] **Step 1: Update Node setup and commands**

Add `cache: npm` to `actions/setup-node`, replace
`yarn install --frozen-lockfile` with `npm ci`, and replace `yarn test:e2e` with
`npm run test:e2e`. Keep `npx playwright install --with-deps`.

- [ ] **Step 2: Verify workflow inputs**

Run:
`git grep -n -E "cache: npm|npm ci|npx playwright install --with-deps|npm run test:e2e" -- .github/workflows/playwright.yml`

Expected: all four npm/Playwright lines are present, `package-lock.json` exists,
and `package.json` defines `"test:e2e": "playwright test"`.

### Task 4: Audit and complete verification

**Files:**

- Modify only `package-lock.json` if `npm audit fix` offers a non-breaking
  remediation and all checks remain green.

**Interfaces:**

- Consumes: the completed repository state.
- Produces: audit evidence, test evidence, and a reviewable PR.

- [ ] **Step 1: Format and inspect**

Run `npm run format:check`, then inspect `git diff --check` and the complete diff
against `master`.

- [ ] **Step 2: Audit dependencies**

Run `npm audit`. If npm offers a non-breaking fix, run `npm audit fix`, inspect
the lockfile-only result, and rerun the audit. Do not run with `--force`.

- [ ] **Step 3: Run unit and build verification**

Run `npm run test:unit` and `npm run build`.

- [ ] **Step 4: Run full isolated Playwright verification**

Run:
`npx playwright test --config playwright.agent.config.ts`

Expected: all Playwright tests pass on the branch server at port 3103.

- [ ] **Step 5: Remove temporary artifacts and recheck the diff**

Delete `playwright.agent.config.ts`, restore unrelated generated build drift,
and confirm `git status --short` contains only the intended files.

- [ ] **Step 6: Commit, push, and open the pull request**

Commit the complete reviewed change, push `tier3/production-hygiene`, and create
a GitHub pull request targeting `master` with the verification and audit
evidence. Do not merge.
