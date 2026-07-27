# Card Game Case Study Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the Card Game project page into a concise, credible senior-level case study.

**Architecture:** Keep the existing Markdown/frontmatter content system and edit only the Card Game article plus this plan. Reorganize verified facts already present in the article and, when useful, facts verifiable from the linked public repository; do not invent metrics, users, ownership, or production impact.

**Tech Stack:** Markdown, gray-matter, Next.js static generation.

## Global Constraints

- Preserve the current title, slug, date, image, tags, source URL, and frontend demo URL unless a link is demonstrably invalid.
- Lead with the problem, Ryan's role, constraints, key decisions, outcome, and evidence.
- State clearly that the public demo is the standalone frontend and that the Django/GraphQL/PostgreSQL integration ran locally.
- Remove all `...existing code...` artifacts and every “If more time allowed” or apologetic backlog section.
- Keep only short code excerpts that prove an architectural or testing decision; every excerpt must be syntactically coherent.
- Do not claim users, adoption, business impact, performance gains, or metrics that are not documented.

---

### Task 1: Rewrite the Card Game article

**Files:**

- Modify: `content/project/card-game.md`
- Create: `docs/superpowers/plans/2026-07-26-card-game-case-study.md`

**Interfaces:**

- Consumes: the existing frontmatter schema in `lib/content.ts`.
- Produces: the same `cardgame` project route and card metadata with a shorter case-study body.

- [ ] **Step 1: Verify source facts**

Read the current article and inspect the linked public repository with read-only GitHub commands. Record no claim that cannot be traced to one of those sources.

- [ ] **Step 2: Replace the article body**

Use this section order: `Overview`, `Problem and constraints`, `Architecture and key decisions`, `Testing and delivery`, `Outcome and tradeoffs`. Prefer paragraphs and compact bullets over a chronological tutorial.

- [ ] **Step 3: Validate the Markdown**

Run:

```powershell
npx prettier --check content/project/card-game.md docs/superpowers/plans/2026-07-26-card-game-case-study.md
npm run build
npx playwright test tests/content-pages.spec.ts
```

Expected: all commands exit 0 and `/projects/cardgame` is generated.

- [ ] **Step 4: Self-review**

Search for `existing code`, `if more time`, `wish`, and unverifiable numeric claims. Confirm the frontmatter contract is unchanged.

- [ ] **Step 5: Commit**

```powershell
git add content/project/card-game.md docs/superpowers/plans/2026-07-26-card-game-case-study.md
git commit -m "Rewrite the Card Game case study"
```
