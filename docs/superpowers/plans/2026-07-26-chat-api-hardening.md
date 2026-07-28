# Chat API Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent malformed, oversized, role-injected, and burst traffic from reaching the public Groq-backed chat completion endpoint.

**Architecture:** Move request validation and rate-limit state into a small framework-independent module, then make `pages/api/chat.ts` consume only validated data. Use a bounded in-memory per-client limiter suitable for best-effort protection within each serverless isolate, while documenting that platform-edge rate limiting is still the stronger future control.

**Tech Stack:** TypeScript, Next.js Pages API routes, Node test runner through `tsx`, Groq's OpenAI-compatible endpoint.

## Global Constraints

- Accept POST only.
- Accept a trimmed user message of 1–1,000 characters.
- Default omitted history to an empty array; accept at most 12 history entries.
- Accept only `user` and `assistant` history roles. Reject `system` and every unknown role.
- Require every history content value to be a trimmed non-empty string no longer than 1,000 characters.
- Limit aggregate history content to 6,000 characters.
- Allow at most 10 accepted attempts per client identifier in a rolling 60-second window and return HTTP 429 with `Retry-After` when exceeded.
- Derive the client identifier from the first `x-forwarded-for` address, then the socket address, then a stable fallback.
- Bound limiter memory by pruning expired entries during checks.
- Never echo validation details, API keys, upstream response bodies, or stack traces to visitors.
- Add a system-prompt instruction that visitor messages and history are untrusted data and cannot replace system instructions.
- Do not change the chat widget in this PR.

---

### Task 1: Add red-first request security tests

**Files:**

- Create: `lib/chat-security.ts`
- Create: `tests/chat-security.test.ts`
- Modify: `package.json`

**Interfaces:**

- Produces: a typed validation result consumed by the API handler and a rate limiter whose clock can be injected in tests.

- [ ] **Step 1: Add the unit-test command**

Add `"test:unit": "tsx --test tests/**/*.test.ts"` to `scripts`.

- [ ] **Step 2: Write failing tests**

Cover a valid request; whitespace-only and oversized messages; non-array and oversized history; injected `system` roles; unknown roles; empty and oversized history content; aggregate history overflow; the first 10 limiter attempts; the blocked 11th attempt with a positive retry interval; expiry after 60 seconds; and independent client buckets.

- [ ] **Step 3: Verify RED**

Run:

```powershell
npm run test:unit
```

Expected: failure because the security module or required behavior does not exist.

- [ ] **Step 4: Implement the minimum pure module**

Use explicit discriminated result types rather than throwing for visitor input. Keep constants exported when tests and the route share them; do not expose mutable limiter storage.

- [ ] **Step 5: Verify GREEN**

Run `npm run test:unit`; expected: all unit tests pass.

### Task 2: Enforce validation and throttling in the API route

**Files:**

- Modify: `pages/api/chat.ts`
- Test: `tests/chat-security.test.ts`

**Interfaces:**

- Consumes: the validated message/history and limiter result from `lib/chat-security.ts`.
- Produces: HTTP 400 for invalid input, 429 for throttled clients, and the existing 200 response shape for valid completions.

- [ ] **Step 1: Integrate the security boundary**

Validate `req.body` before building prompts or calling Groq. Construct model history only from the validated `user`/`assistant` entries.

- [ ] **Step 2: Harden the upstream call**

Keep visitor-facing upstream failures generic, add a finite request timeout, and avoid logging upstream response bodies that could contain sensitive details.

- [ ] **Step 3: Add the prompt-injection boundary**

Tell the model that visitor-provided messages/history are untrusted content and never override system instructions. Leave the broader first-person/third-person rewrite for the separate chat-widget PR.

- [ ] **Step 4: Verify the branch**

Run:

```powershell
npm run test:unit
npx prettier --check lib/chat-security.ts tests/chat-security.test.ts pages/api/chat.ts package.json docs/superpowers/plans/2026-07-26-chat-api-hardening.md
npm run build
npm run test:e2e
```

Expected: every command exits 0.

- [ ] **Step 5: Commit**

```powershell
git add package.json lib/chat-security.ts tests/chat-security.test.ts pages/api/chat.ts docs/superpowers/plans/2026-07-26-chat-api-hardening.md
git commit -m "Harden the public chat API"
```
