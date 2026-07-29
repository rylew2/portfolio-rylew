# Homepage Hero and Calls to Action Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the homepage immediately identify Ryan, communicate his engineering focus, and provide clear routes to projects, résumé, and contact.

**Architecture:** Keep the existing homepage structure and restrained visual language. Render the approved identity, positioning, and CTA content in `HomeHeader`, sourcing stable profile fields and links from `me/profile.json`, and extend the existing header styles without changing project cards or global metadata.

**Tech Stack:** Next.js Pages Router, React, TypeScript, styled-components, Playwright

## Global Constraints

- Base all work on commit `4cdf4d9233b8e1ac316f735fa53bc26e7a6aa43d`.
- Preserve the current homepage project list, navigation, themes, and mobile layout.
- Use the exact identity line `Senior Software Engineer · Brooklyn, New York`.
- Use the exact positioning sentence `I build accessible, maintainable digital services with React, TypeScript, Python, and Node.js.`
- Provide three CTAs: `View projects` to `/projects`, `Resume` to `/Ryan-Lewis-Resume.pdf`, and `Contact` to `mailto:ryanlewis312@gmail.com`.
- Do not modify global SEO/social metadata; that belongs to the separate positioning PR.
- Add no dependencies.

---

### Task 1: Lock the hero contract with a failing browser test

**Files:**
- Create: `tests/homepage-hero.spec.ts`

**Interfaces:**
- Consumes: the production homepage at `/`
- Produces: a regression contract for the H1, supporting copy, and CTA destinations

- [ ] **Step 1: Write the failing test**

Create a Playwright test that opens `/`, asserts the single level-one heading is `Ryan Lewis`, checks the exact identity and positioning lines, and checks the three named links have the exact `href` values from Global Constraints.

- [ ] **Step 2: Run the focused test to verify it fails**

Run the test against a production build on an isolated non-3000 port with `reuseExistingServer: false`.

Expected: FAIL because the current heading is `Ryan Lewis Portfolio` and the CTAs do not exist.

- [ ] **Step 3: Commit the test**

Commit only the focused failing test with a message describing the homepage hero contract.

### Task 2: Implement the approved hero and CTA treatment

**Files:**
- Modify: `components/header/home-header.tsx`
- Modify: `components/styles/header.styles.ts`
- Test: `tests/homepage-hero.spec.ts`

**Interfaces:**
- Consumes: `role`, `location`, `bio`, and `links` from `me/profile.json`
- Produces: the visible homepage identity, positioning line, and three keyboard-accessible links

- [ ] **Step 1: Replace the generic hero content**

Render an H1 of `Ryan Lewis`, the exact identity line, and the exact positioning sentence. Use profile data for the role, location, résumé URL, and email destination where it produces the approved text and URLs without duplicating mutable values.

- [ ] **Step 2: Add the CTA group**

Render `View projects` as the primary CTA and `Resume` and `Contact` as secondary links. Preserve native anchor behavior, visible focus indicators, sufficient contrast in both themes, and comfortable touch targets.

- [ ] **Step 3: Extend the existing styles**

Keep the current typography and spacing character. Add only the layout, responsive wrapping, hover, and focus styling required for the new content and CTA group.

- [ ] **Step 4: Run the focused test to verify it passes**

Run the same isolated production Playwright command.

Expected: PASS.

- [ ] **Step 5: Commit the implementation**

Commit the component, style, and focused test changes.

### Task 3: Verify and open an unmerged PR

**Files:**
- Modify only if verification exposes a defect in this PR's scope

**Interfaces:**
- Consumes: the completed hero branch
- Produces: a pushed branch and open PR targeting `master`

- [ ] **Step 1: Format and inspect**

Run Prettier on changed source and test files, `git diff --check`, and inspect the final diff for unrelated changes.

- [ ] **Step 2: Run verification**

Run `npm run test:unit`, `npm run build`, the focused test, and the full production Playwright suite on an isolated port. Restore generated drift in `me/chat-context.json`, `me/summary.txt`, `next-env.d.ts`, and `tsconfig.json` if the commands modify files.

- [ ] **Step 3: Commit any scoped verification fixes**

Use TDD for any behavior fix, then repeat the affected checks.

- [ ] **Step 4: Push and open the PR**

Push `tier1/homepage-hero-cta` and open an unmerged PR against `master`. The PR body must state the exact hero copy, CTA destinations, and verification evidence.

