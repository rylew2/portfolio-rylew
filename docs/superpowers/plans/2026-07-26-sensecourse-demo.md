# SenseCourse Demo Replacement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop sending portfolio visitors to the cold, unreliable SenseCourse deployment and direct them to the existing YouTube walkthrough.

**Architecture:** Use the existing `presentation` frontmatter field and Presentation action already supported by project cards and detail pages. Remove the stale `liveSite` field and update the article text so it does not imply that an interactive demo remains available.

**Tech Stack:** Markdown, gray-matter, Next.js static generation.

## Global Constraints

- Remove `liveSite: 'https://sensecourse.onrender.com/demo'`.
- Preserve `presentation: 'https://www.youtube.com/watch?v=LqpXGfcWBt0'`.
- Preserve all other frontmatter values unless a directly related wording correction is necessary.
- Do not add a replacement deployment or claim the retired Watson integration still works.
- Keep the historical project narrative accurate: the API changed after the course project, and the video demonstrates the submitted experience.

---

### Task 1: Retire the cold demo link

**Files:**

- Modify: `content/project/sensecourse.md`
- Create: `docs/superpowers/plans/2026-07-26-sensecourse-demo.md`

**Interfaces:**

- Consumes: existing `presentation` rendering in `components/cards/cards.tsx` and `pages/projects/[id].tsx`.
- Produces: a SenseCourse card/detail page with Source and Presentation actions but no Demo action.

- [ ] **Step 1: Update frontmatter and prose**

Delete the `liveSite` entry. Replace references to a “live demo” with a concise explanation that the original Watson-backed experience is no longer interactive and the presentation shows the working course submission.

- [ ] **Step 2: Validate rendered behavior**

Run:

```powershell
npx prettier --check content/project/sensecourse.md docs/superpowers/plans/2026-07-26-sensecourse-demo.md
npm run build
npx playwright test tests/cards.spec.ts tests/content-pages.spec.ts
```

Expected: all commands exit 0; the SenseCourse project is generated with its Presentation action and without a Demo action.

- [ ] **Step 3: Self-review**

Search the file for `onrender.com` and `live demo`; both must be absent. Confirm the YouTube URL remains unchanged.

- [ ] **Step 4: Commit**

```powershell
git add content/project/sensecourse.md docs/superpowers/plans/2026-07-26-sensecourse-demo.md
git commit -m "Replace the SenseCourse demo link"
```
