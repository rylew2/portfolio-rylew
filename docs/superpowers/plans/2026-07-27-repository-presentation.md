# Repository Presentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Present the existing portfolio repository accurately through a
complete README, a current site screenshot, and targeted repository hygiene.

**Architecture:** Documentation will describe the existing Next.js Pages
Router, file-system content, generated profile/chat artifacts, and server-side
chat API without changing them. A production build served on port 3104 supplies
the screenshot and browser-test target; temporary verification files are
removed before commit.

**Tech Stack:** Next.js 16, React 19, TypeScript, Emotion, Markdown/remark,
Groq Chat Completions, Node test runner, Playwright, axe-core, Prettier

## Global Constraints

- Do not change runtime application code, dependencies, workflows, content
  pages, taxonomy, metadata, sitemap, homepage behavior, or security headers.
- Verify every README claim and command against tracked repository source or
  configuration.
- Remove only confirmed tracked scratch/build artifacts.
- Keep ignore rules specific to the root artifacts being removed.
- Restore unrelated generated build drift before committing.

---

### Task 1: Capture the Current Homepage

**Files:**

- Create: `public/images/portfolio-home.png`
- Temporary: `playwright.repository-presentation.config.ts`
- Temporary: `tests/repository-presentation.capture.spec.ts`

**Interfaces:**

- Consumes: the production output created by `npm run build`
- Produces: a repository-local screenshot referenced by `README.md`

- [ ] **Step 1: Configure the temporary browser target**

Create a Playwright config whose `baseURL` is
`http://127.0.0.1:3104`, with no development-server command, and a temporary
capture test that visits `/`, sets a 1440×1000 viewport, waits for the homepage
cards, and writes `public/images/portfolio-home.png`.

- [ ] **Step 2: Capture the built site**

Run the production server with:

```powershell
npm run start -- -p 3104
```

Then run:

```powershell
npx playwright test tests/repository-presentation.capture.spec.ts --config playwright.repository-presentation.config.ts
```

Expected: one passing test and a PNG showing the current homepage.

- [ ] **Step 3: Inspect and clean up**

Open the PNG to verify that the desktop homepage is legible and complete.
Remove the temporary capture test; retain the temporary config for the final
browser suite.

### Task 2: Rewrite the Repository Guide

**Files:**

- Modify: `README.md`

**Interfaces:**

- Consumes: `package.json`, `config/index.json`, `lib/content.ts`,
  `lib/profile.ts`, `scripts/generate-summary.ts`,
  `scripts/generate-chat-context.ts`, `pages/api/chat.ts`,
  `lib/chat-security.ts`, and `tests/*`
- Produces: the public repository landing page

- [ ] **Step 1: Write the overview and architecture sections**

Describe the portfolio, link `https://www.rylew.dev`, embed
`public/images/portfolio-home.png`, list the verified stack, and map Pages
Router routes to Markdown, JSON, and generated sources.

- [ ] **Step 2: Write setup, environment, and scripts sections**

Require Node 22 and `npm install`; document `GROQ_API_KEY` as required for chat
and `ANALYTICS_ID` as the optional legacy Google Analytics ID consumed by
`pages/_document.tsx` alongside Vercel Analytics; list every script declared in
`package.json` with its actual command purpose.

- [ ] **Step 3: Write the content and chat flows**

Trace `me/profile.json` to the About page and `me/summary.txt`; trace
`content/{project,book}` to routes and `me/chat-context.json`; explain
title/tag/description/body retrieval weights of 5/3/2/1, explicit title/slug
matching, three-item fallback limits, `llama-3.3-70b-versatile`, and the
500-token response cap.

- [ ] **Step 4: Write hardening, workflow, coverage, and tradeoff sections**

State the exact validation and rate-limit bounds from `lib/chat-security.ts`,
the 10-second upstream timeout and generic errors from `pages/api/chat.ts`, the
checked-in GitHub Actions build, Playwright, and Dependabot automation, the
absence of deployment automation or host configuration, the content update
commands, the unit/E2E/accessibility coverage, and the verified architectural
tradeoffs.

- [ ] **Step 5: Add project links and review claims**

Link the live site, GitHub profile, LinkedIn profile, and résumé route. Check
each technical noun, number, environment variable, and command against its
source file.

### Task 3: Remove Tracked Artifacts and Prevent Recurrence

**Files:**

- Modify: `.gitignore`
- Delete: `debug.log`
- Delete: `mergeupstreamchanges.txt`
- Delete: `tsconfig.tsbuildinfo`

**Interfaces:**

- Consumes: the confirmed tracked artifact list from `git ls-files`
- Produces: a clean root artifact policy with no source/content deletion

- [ ] **Step 1: Add exact ignore rules**

Add `/debug.log`, `/mergeupstreamchanges.txt`, `/tsconfig.tsbuildinfo`, and
`/tmpclaude-*`. Replace the existing unanchored `tmpclaude-*` line so the rule
applies only to root scratch markers.

- [ ] **Step 2: Delete only confirmed tracked artifacts**

Remove the three files listed above. Do not delete any `content/`, `me/`,
`public/`, or source file.

- [ ] **Step 3: Verify ignore behavior**

Run:

```powershell
git check-ignore -v --no-index debug.log mergeupstreamchanges.txt tsconfig.tsbuildinfo tmpclaude-check
```

Expected: all four names resolve to their exact root ignore rules.

### Task 4: Verify, Review, and Publish

**Files:**

- Modify only if checks expose documentation defects
- Delete: `playwright.repository-presentation.config.ts`

**Interfaces:**

- Consumes: Tasks 1–3
- Produces: a reviewed commit and a pull request targeting `master`

- [ ] **Step 1: Format changed text files**

Run Prettier against `README.md`, the design spec, and this plan. Run
`git diff --check`.

- [ ] **Step 2: Run automated verification**

Run:

```powershell
npm run test:unit
npx playwright test --config playwright.repository-presentation.config.ts
npm run build
```

Expected: 33 unit tests pass, the complete Playwright suite passes against the
production server on port 3104, and the Next.js production build exits zero.

- [ ] **Step 3: Remove temporary files and generated drift**

Delete the temporary Playwright config. Restore unrelated changes to
`me/chat-context.json`, `me/summary.txt`, `next-env.d.ts`, and `tsconfig.json`.
Confirm no temporary Playwright, result, trace, or server-log file is tracked.

- [ ] **Step 4: Self-review against master**

Inspect `git diff --stat master`, `git diff --check master`, and
`git diff master`. Confirm the diff contains only the approved documentation,
screenshot, ignore rules, and artifact deletions.

- [ ] **Step 5: Commit and publish**

Commit the implementation, push `tier2/repository-presentation`, and create a
GitHub pull request with `master` as the base. The PR body must summarize the
README, screenshot, repository hygiene, and exact verification evidence. Do
not merge the pull request.
