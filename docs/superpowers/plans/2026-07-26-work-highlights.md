# Work Highlights Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add concrete, already-public evidence of Ryan's Nava scope and outcomes to the About page and chat profile context.

**Architecture:** Extend the profile experience schema with optional highlight strings, put the published résumé bullets in `me/profile.json`, render them beneath the corresponding timeline entry, and include them in the generated chat summary. The profile remains the single source of truth.

**Tech Stack:** TypeScript, JSON, React, Emotion, Playwright, profile summary generator.

## Global Constraints

- Use only claims already published in `public/Ryan-Lewis-Resume.pdf`.
- Add these Nava facts without embellishment:
  - Streamlined the Massachusetts Paid Family and Medical Leave application process, reducing completion time by 30% and monthly appeals by 20%.
  - Contributed to a CMS React/Node application that shortened cloud onboarding from months to weeks.
  - Updated AWS infrastructure to remove critical vulnerabilities and meet CMS security standards.
- Do not identify clients, systems, team sizes, budgets, traffic, or implementation details beyond the résumé.
- Keep highlights optional so the other experience entries remain valid.
- Preserve the existing company/title/date timeline and mobile layout.

---

### Task 1: Add red-first About-page coverage

**Files:**

- Modify: `tests/about-page.spec.ts`
- Modify: `lib/profile.ts`
- Modify: `me/profile.json`
- Modify: `pages/about.tsx`
- Modify: `components/styles/about.styles.ts`
- Modify: `scripts/generate-summary.ts`
- Modify: `me/summary.txt`

**Interfaces:**

- Produces: `Experience.highlights?: string[]`, rendered as a nested list and serialized into the profile summary.

- [ ] **Step 1: Write the failing test**

Locate the Nava timeline entry and assert that it contains a three-item highlights list with the published outcome, onboarding, and security language.

- [ ] **Step 2: Verify RED**

Run `npx playwright test tests/about-page.spec.ts`.

Expected: failure because the Nava entry currently contains only company, title, and dates.

- [ ] **Step 3: Add the profile data and type**

Add optional `highlights` to `Experience` and the three exact claims to Nava's profile entry. Do not add unsupported facts to other jobs.

- [ ] **Step 4: Render and style highlights**

Render a nested list only when highlights are present. Keep the list inside the matching timeline item, make it span the row on desktop, and retain readable indentation on mobile.

- [ ] **Step 5: Keep chat context aligned**

Update `generate-summary.ts` so each experience headline is followed by its optional highlights. Run `npm run generate:summary` and commit the resulting `me/summary.txt`.

- [ ] **Step 6: Verify GREEN and regression coverage**

Run:

```powershell
npx playwright test tests/about-page.spec.ts
npx prettier --check tests/about-page.spec.ts lib/profile.ts me/profile.json pages/about.tsx components/styles/about.styles.ts scripts/generate-summary.ts docs/superpowers/plans/2026-07-26-work-highlights.md
npm run build
npm run test:e2e
```

Expected: every command exits 0 and the generated summary contains the same three Nava facts. Restore unrelated generated build drift before committing.

- [ ] **Step 7: Commit**

```powershell
git add tests/about-page.spec.ts lib/profile.ts me/profile.json pages/about.tsx components/styles/about.styles.ts scripts/generate-summary.ts me/summary.txt docs/superpowers/plans/2026-07-26-work-highlights.md
git commit -m "Add published Nava work highlights"
```
