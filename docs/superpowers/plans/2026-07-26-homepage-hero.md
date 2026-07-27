# Homepage Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the first viewport identify Ryan, communicate his senior-engineer positioning, and offer clear next actions.

**Architecture:** Keep biographical facts sourced from `me/profile.json` through `lib/profile.ts`, keep the short positioning sentence in `config/index.json`, and render semantic links from `HomeHeader`. Extend the existing Emotion header styles without introducing a component library.

**Tech Stack:** React, Next.js, Emotion, Playwright.

## Global Constraints

- The homepage H1 must be `Ryan Lewis`.
- Show `Senior Software Engineer · Brooklyn, New York` from the profile data, not duplicated literals.
- Use this positioning sentence: `I build reliable, accessible web applications for public-interest and regulated services, working across React, TypeScript, Python, Node.js, and AWS.`
- Provide exactly three primary actions: `View projects` to `/projects`, `Resume` to the configured résumé PDF in a new tab, and `Contact` to the configured email address.
- Render plain React text; remove `dangerouslySetInnerHTML`.
- Preserve keyboard access, visible focus, mobile wrapping, and current light/dark theme variables.
- Do not change site-wide metadata; that is Tier 1 ticket #8.

---

### Task 1: Specify the hero behavior with a failing browser test

**Files:**

- Create: `tests/homepage-hero.spec.ts`
- Modify: `config/index.json`
- Modify: `components/header/home-header.tsx`
- Modify: `components/styles/header.styles.ts`

**Interfaces:**

- Consumes: `profile.name`, `profile.role`, `profile.location`, `profile.links.resume`, and `profile.links.email`.
- Produces: one H1, one positioning line, one description, and three semantic links.

- [ ] **Step 1: Write the failing test**

Assert that `/` exposes the level-one `Ryan Lewis` heading, the role/location line, and the three named links with the exact href contracts. Assert the résumé opens in a new tab.

- [ ] **Step 2: Verify RED**

Run `npx playwright test tests/homepage-hero.spec.ts`.

Expected: failure because the existing H1 is `Ryan Lewis Portfolio` and the three hero actions do not exist.

- [ ] **Step 3: Implement the hero**

Import `profile` into `home-header.tsx`, replace the HTML injection with text, and add a semantic action container. Omit the résumé action only if `profile.links.resume` is null.

- [ ] **Step 4: Style the hierarchy and actions**

Use existing CSS variables for borders, text, and primary color. Actions must wrap cleanly below 560px and retain a visible `:focus-visible` indicator.

- [ ] **Step 5: Verify GREEN and regression coverage**

Run:

```powershell
npx playwright test tests/homepage-hero.spec.ts
npx prettier --check config/index.json components/header/home-header.tsx components/styles/header.styles.ts tests/homepage-hero.spec.ts docs/superpowers/plans/2026-07-26-homepage-hero.md
npm run build
npm run test:e2e
```

Expected: every command exits 0. Restore unrelated generated build drift before committing.

- [ ] **Step 6: Commit**

```powershell
git add config/index.json components/header/home-header.tsx components/styles/header.styles.ts tests/homepage-hero.spec.ts docs/superpowers/plans/2026-07-26-homepage-hero.md
git commit -m "Clarify the homepage hero"
```
