# Positioning Metadata and Social Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the site's global search/share positioning with Ryan's current role and create a legible branded large-image link preview.

**Architecture:** Update only the global site metadata values and the global social image wiring. Add one deterministic 1200×630 PNG using the existing navy/orange brand, reuse existing metadata plumbing, and explicitly avoid the route-specific canonical/social implementation from closed PR #62.

**Tech Stack:** Next.js Pages Router, TypeScript, JSON configuration, Sharp, Playwright

## Global Constraints

- Base all work on commit `4cdf4d9233b8e1ac316f735fa53bc26e7a6aa43d`.
- Use global title `Ryan Lewis | Senior Software Engineer`.
- Use global description `Senior software engineer in Brooklyn building accessible, maintainable web applications with React, TypeScript, Python, and Node.js.`
- Remove all stale San Francisco positioning from global keywords and replace it with accurate Brooklyn, role, and technology terms.
- Create a 1200×630 PNG preview using the existing navy/orange brand with the text `Ryan Lewis`, `Senior Software Engineer`, `Brooklyn, New York`, and `rylew.dev`.
- Use `summary_large_image` and a global Twitter image so X/Twitter receives the same branded asset.
- Do not add canonical tags, route-specific descriptions, route-specific images, or per-page social URL logic.
- Do not alter the homepage hero or `author` display copy; that belongs to the separate hero PR.
- Add no runtime dependencies.

---

### Task 1: Lock the global metadata contract with a failing test

**Files:**
- Create: `tests/global-positioning-metadata.spec.ts`

**Interfaces:**
- Consumes: the production homepage document head and public social image
- Produces: regression coverage for global title, description, keywords, Open Graph image, Twitter card/image, HTTP availability, and dimensions

- [ ] **Step 1: Write the failing test**

Assert the homepage exact title and description from Global Constraints; keywords contain `Brooklyn` and do not contain `San Francisco`; `og:image` and `twitter:image` resolve to the new absolute global image URL; `twitter:card` is `summary_large_image`; the image request succeeds and Sharp reports exactly 1200×630 PNG.

- [ ] **Step 2: Run the focused test to verify it fails**

Use a production build on an isolated non-3000 port with `reuseExistingServer: false`.

Expected: FAIL because the current config is generic, contains San Francisco, uses `/Logo.png`, and declares `summary`.

- [ ] **Step 3: Commit the failing contract**

Commit only the metadata test.

### Task 2: Create the deterministic branded preview asset

**Files:**
- Create: `public/images/social-preview.png`

**Interfaces:**
- Consumes: existing primary navy and orange brand colors
- Produces: a static 1200×630 PNG suitable for Open Graph and Twitter/X large cards

- [ ] **Step 1: Generate the asset**

Use a temporary SVG with a navy background, restrained orange triangular brand motif, high-contrast white typography, and the exact four text lines from Global Constraints. Convert it to PNG with the already installed `sharp` package. Do not commit the temporary generator or SVG unless it is clearly useful as a maintained source asset.

- [ ] **Step 2: Inspect the image**

Verify dimensions and format with Sharp, then visually inspect the PNG at full size for clipping, contrast, alignment, and safe margins.

- [ ] **Step 3: Commit the asset**

Commit the final PNG only.

### Task 3: Wire accurate global positioning metadata

**Files:**
- Modify: `config/index.json`
- Modify: `components/layout.tsx`
- Test: `tests/global-positioning-metadata.spec.ts`

**Interfaces:**
- Consumes: the new `/images/social-preview.png`
- Produces: accurate global site metadata and matching Open Graph/Twitter image declarations

- [ ] **Step 1: Update global config**

Set `site.siteTitle`, `site.siteDescription`, `site.keywords`, and `site.siteImage` to the approved global values and asset. Leave `author` unchanged.

- [ ] **Step 2: Complete only global Twitter wiring**

Change the Twitter card to `summary_large_image` and add the same global image URL via `twitter:image`. Reuse existing page title/description fallbacks if needed, but do not introduce route-specific metadata abstractions or canonical tags.

- [ ] **Step 3: Run the focused test**

Expected: PASS for content, stale-location removal, image URL, availability, and exact asset dimensions.

- [ ] **Step 4: Commit metadata changes**

Commit the config, layout, and focused test changes.

### Task 4: Verify and open an unmerged PR

**Files:**
- Modify only if verification exposes a defect in this PR's scope

**Interfaces:**
- Consumes: the completed global positioning branch
- Produces: a pushed branch and open PR targeting `master`

- [ ] **Step 1: Format and inspect**

Run Prettier, `git diff --check`, and inspect the diff to confirm there is no route-specific or canonical behavior.

- [ ] **Step 2: Run verification**

Run `npm run test:unit`, `npm run build`, the focused test, and the full production Playwright suite on an isolated port. Restore generated drift in `me/chat-context.json`, `me/summary.txt`, `next-env.d.ts`, and `tsconfig.json`.

- [ ] **Step 3: Commit any scoped fixes**

Use TDD for behavior corrections and repeat affected checks.

- [ ] **Step 4: Push and open the PR**

Push `tier1/positioning-social-preview` and open an unmerged PR against `master`. The PR body must state that canonical and route-specific metadata remain intentionally out of scope and include exact verification evidence.

