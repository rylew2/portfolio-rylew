# Portfolio AI Assistant Case Study Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a repository-supported Portfolio AI Assistant case study with
a real open-widget screenshot on its detail page, `/projects`, and the
homepage.

**Architecture:** Add one Markdown content item to the existing project content
pipeline rather than changing rendering components. The same frontmatter will
drive the static route, both card surfaces, the preview image, and generated
chat context; Playwright will verify the visitor-visible contract.

**Tech Stack:** Next.js Pages Router, React, gray-matter Markdown content,
Playwright, Node test runner, Prettier.

## Global Constraints

- Set `selectedWork: true`.
- Use only facts supported by this repository.
- Explain generated profile/content context, keyword-scored retrieval, Groq's
  OpenAI-compatible endpoint, merged API protections, and test coverage.
- Do not invent metrics, business impact, users, or outcomes.
- Do not change the homepage layout, hero, other projects, or unrelated copy.
- Use a genuine 1200 × 600 screenshot of the existing open chat widget at
  `public/images/project/portfolio-ai-assistant/chat-widget-open.png`.

---

### Task 1: Add focused visitor-facing tests

**Files:**

- Modify: `tests/content-pages.spec.ts`
- Test: `tests/content-pages.spec.ts`

**Interfaces:**

- Consumes: the public routes `/projects/portfolio-ai-assistant`, `/projects`,
  and `/`, plus the existing `main article` card markup.
- Produces: regression coverage for the detail route and both required card
  surfaces.

- [ ] **Step 1: Write the failing detail-route test**

```ts
test('portfolio AI assistant project generates a detail page', async ({
  page,
}) => {
  const response = await page.goto('/projects/portfolio-ai-assistant');

  expect(response?.ok()).toBe(true);
  await expect(
    page.getByRole('heading', { name: 'Portfolio AI Assistant', exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Keyword-scored retrieval' })
  ).toBeVisible();
});
```

- [ ] **Step 2: Write the failing two-surface card test**

```ts
test('portfolio AI assistant card appears on projects and home pages', async ({
  page,
}) => {
  for (const route of ['/projects', '/']) {
    await page.goto(route);
    const card = page.locator('main article').filter({
      has: page.getByRole('heading', {
        name: 'Portfolio AI Assistant',
        exact: true,
      }),
    });

    await expect(card).toHaveCount(1);
    await expect(card.getByRole('link')).toHaveAttribute(
      'href',
      '/projects/portfolio-ai-assistant'
    );
    await expect(card.locator('img')).toHaveAttribute(
      'src',
      /chat-widget-open/
    );
  }
});
```

- [ ] **Step 3: Run the focused tests and confirm RED**

Run:
`npx playwright test tests/content-pages.spec.ts --grep "portfolio AI assistant"`

Expected: both tests fail because the detail path and cards do not exist.

### Task 2: Capture the real UI and add the project content

**Files:**

- Create:
  `public/images/project/portfolio-ai-assistant/chat-widget-open.png`
- Create: `content/project/portfolio-ai-assistant.md`
- Modify: `me/chat-context.json` through `npm run generate:context`
- Test: `tests/content-pages.spec.ts`

**Interfaces:**

- Consumes: the existing `ChatWidget`, project Markdown frontmatter contract,
  and `scripts/generate-chat-context.ts`.
- Produces: project slug `portfolio-ai-assistant`, selected-work metadata,
  screenshot preview path, rendered case study, and generated assistant
  context.

- [ ] **Step 1: Capture the genuine screenshot**

Start `npm run dev -- -p 3000`, open `/` in Playwright with a 1200 × 600
viewport, click the button named `Open chat`, verify the `Chat with Ryan`
heading is visible, and save the viewport screenshot to
`public/images/project/portfolio-ai-assistant/chat-widget-open.png`.

- [ ] **Step 2: Add the minimal project frontmatter**

```yaml
---
title: 'Portfolio AI Assistant'
date: '2026-07'
slug: 'portfolio-ai-assistant'
selectedWork: true
description: 'A grounded AI assistant for exploring my portfolio, experience, and projects.'
previewImage: '/images/project/portfolio-ai-assistant/chat-widget-open.png'
sourceCode: 'https://github.com/rylew2/portfolio-rylew'
tags:
  - react
  - javascript
  - fullstack
---
```

- [ ] **Step 3: Write the case study**

Use the headings `Overview`, `Generated portfolio context`,
`Keyword-scored retrieval`, `Groq chat completion`, `API protections`, and
`Test coverage`. Describe only the exact data flow and safeguards named in the
design spec, without impact claims or invented results.

- [ ] **Step 4: Regenerate project context**

Run: `npm run generate:context`

Expected: `me/chat-context.json` contains one new
`portfolio-ai-assistant` project. Restore the prior `generatedAt` value so the
tracked diff contains content changes only.

- [ ] **Step 5: Run the focused tests and confirm GREEN**

Run:
`npx playwright test tests/content-pages.spec.ts --grep "portfolio AI assistant"`

Expected: 2 passed.

### Task 3: Verify scope and production behavior

**Files:**

- Verify all files changed against `origin/master`.

**Interfaces:**

- Consumes: the completed content, asset, generated context, and focused tests.
- Produces: a formatted, buildable, fully tested PR with no unrelated generated
  drift.

- [ ] **Step 1: Run formatting check**

Run: `npm run format:check`

Expected: all matched files use Prettier formatting.

- [ ] **Step 2: Run unit tests**

Run: `npm run test:unit`

Expected: all Node tests pass.

- [ ] **Step 3: Run the production build**

Run: `npm run build`

Expected: static generation includes `/projects/portfolio-ai-assistant`.

- [ ] **Step 4: Remove unrelated generator drift**

Run: `git diff -- me/summary.txt me/chat-context.json config`

Expected: `me/summary.txt` and `config` are unchanged; the context diff contains
only the new project entry.

- [ ] **Step 5: Run focused and full browser coverage**

Run:
`npx playwright test tests/content-pages.spec.ts tests/cards.spec.ts tests/accessibility.spec.ts`

Then run: `npm run test:e2e`

Expected: all relevant and full Playwright tests pass.

- [ ] **Step 6: Review and publish**

Review `git diff origin/master...HEAD` plus the working-tree diff for factual
accuracy and scope, commit intended files, push
`tier2/portfolio-ai-case-study`, and create a GitHub PR targeting `master` with
the test commands and results. Do not merge.
