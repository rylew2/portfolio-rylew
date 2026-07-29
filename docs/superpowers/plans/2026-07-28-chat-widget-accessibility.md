# Chat Widget Trust, Usability, and Accessibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing chat widget behave like a trustworthy, keyboard-accessible dialog while preserving its current API and visual identity.

**Architecture:** Keep message submission and `/api/chat` unchanged. Add dialog semantics and focus management inside `ChatWidget`, make the composer visibly labelled and bounded, expose message/loading updates to assistive technology, and add reduced-motion and line-break handling in the existing styled-components file.

**Tech Stack:** Next.js, React, TypeScript, styled-components, Playwright, axe-core

## Global Constraints

- Base all work on commit `4cdf4d9233b8e1ac316f735fa53bc26e7a6aa43d`.
- Do not modify `pages/api/chat.ts`, prompt handling, model selection, rate limiting, or API contracts.
- The open panel must be a labelled modal dialog that closes with Escape, traps Tab/Shift+Tab, and restores focus to its launcher.
- Avoid duplicate close controls: hide the launcher while the panel is open.
- Add a visible `Your question` label, `maxLength={1000}`, and a visible character count.
- Announce newly added messages and the assistant's loading state without announcing unrelated page content.
- Preserve visitor and assistant line breaks with `white-space: pre-wrap`; do not add Markdown rendering.
- Disable nonessential chat animations under `prefers-reduced-motion: reduce`.
- Keep all AI copy in third person so the assistant never speaks as Ryan.
- Add no dependencies.

---

### Task 1: Add failing interaction and semantics coverage

**Files:**

- Create: `tests/chat-widget-accessibility.spec.ts`

**Interfaces:**

- Consumes: the chat launcher and open panel on `/`
- Produces: regression coverage for dialog semantics, keyboard behavior, composer constraints, announcements, and copy

- [ ] **Step 1: Write failing tests**

Cover: launcher opens a dialog with an accessible name; the launcher is absent while open; Escape closes and returns focus; Tab and Shift+Tab stay inside the open dialog; a visible `Your question` label controls a textbox with `maxlength="1000"`; the character count updates; the message region has log/live semantics; the loading state exposes status text; the open dialog has no serious axe violations.

- [ ] **Step 2: Run the focused suite to verify failures**

Use a production build on an isolated non-3000 port with `reuseExistingServer: false`.

Expected: FAIL on current missing dialog semantics, focus handling, visible label, input bound, and live-region contract.

- [ ] **Step 3: Commit the failing suite**

Commit only the focused tests with a message describing the chat accessibility contract.

### Task 2: Implement dialog and keyboard behavior

**Files:**

- Modify: `components/chat/chat-widget.tsx`
- Test: `tests/chat-widget-accessibility.spec.ts`

**Interfaces:**

- Consumes: the existing `isOpen` state and current launcher/input controls
- Produces: labelled modal-dialog semantics, trapped focus, Escape dismissal, and focus restoration

- [ ] **Step 1: Add stable refs and accessible names**

Add refs for the launcher, dialog, and initial focus target. Give the panel `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` pointing to its visible title.

- [ ] **Step 2: Add lifecycle focus behavior**

On open, focus the intended control. While open, handle Escape and cycle Tab/Shift+Tab among enabled focusable controls. On close, restore focus to the launcher without stealing focus during initial page load.

- [ ] **Step 3: Remove the duplicate control**

Render the launcher only while closed; retain the labelled close button inside the dialog.

- [ ] **Step 4: Run the keyboard-focused tests**

Expected: dialog, Escape, focus-return, and focus-trap cases PASS.

- [ ] **Step 5: Commit the behavior**

Commit the focused dialog and keyboard implementation.

### Task 3: Improve the composer, announcements, copy, and motion

**Files:**

- Modify: `components/chat/chat-widget.tsx`
- Modify: `components/chat/chat-widget.styles.ts`
- Test: `tests/chat-widget-accessibility.spec.ts`

**Interfaces:**

- Consumes: existing message, input, loading, and error state
- Produces: a bounded labelled composer, targeted live updates, preserved line breaks, reduced motion, and third-person copy

- [ ] **Step 1: Implement the labelled bounded composer**

Associate a visible `Your question` label with the textarea, set `maxLength={1000}`, and show `${input.length} / 1000` as a non-live counter.

- [ ] **Step 2: Implement targeted announcements**

Make the message list a polite log that announces additions. Expose the loading state as a status with meaningful text while retaining the visual dots.

- [ ] **Step 3: Correct copy and rendering**

Keep the welcome text explicitly framed as an AI assistant representing Ryan. Rewrite error guidance to say visitors can contact Ryan, never `me`. Apply `white-space: pre-wrap` to message text.

- [ ] **Step 4: Respect reduced motion**

Use a `prefers-reduced-motion: reduce` media query to remove the panel entrance and loading-dot animations without hiding content.

- [ ] **Step 5: Run the full focused suite**

Expected: all chat behavior and axe cases PASS.

- [ ] **Step 6: Commit the usability changes**

Commit the component, style, and focused test changes.

### Task 4: Verify and open an unmerged PR

**Files:**

- Modify only if verification exposes a defect in this PR's scope

**Interfaces:**

- Consumes: the completed chat branch
- Produces: a pushed branch and open PR targeting `master`

- [ ] **Step 1: Format and inspect**

Run Prettier, `git diff --check`, and inspect the diff for API or unrelated changes.

- [ ] **Step 2: Run verification**

Run `npm run test:unit`, `npm run build`, the focused suite, and the full production Playwright suite on an isolated port. Restore generated drift in `me/chat-context.json`, `me/summary.txt`, `next-env.d.ts`, and `tsconfig.json`.

- [ ] **Step 3: Commit any scoped fixes**

Use TDD for behavior corrections and repeat the affected verification.

- [ ] **Step 4: Push and open the PR**

Push `tier1/chat-widget-accessibility` and open an unmerged PR against `master` with the behavior contract and exact verification evidence.
