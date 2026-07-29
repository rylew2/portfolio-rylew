# Production Hygiene Design

## Goal

Remove an unused public API route, align the Playwright workflow with the
repository's npm lockfile and scripts, and add low-risk response security
headers without changing site content or runtime integrations.

## Scope

- Delete `pages/api/hello.tsx`, making `/api/hello` resolve through the normal
  Next.js 404 behavior.
- Change `.github/workflows/playwright.yml` to install with `npm ci`, enable the
  npm cache through `actions/setup-node`, and run the existing `test:e2e` npm
  script.
- Add a root `next.config.js` whose global `headers()` rule sets:
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- Add Playwright coverage that observes the removed route and headers through a
  running Next.js server.

No README, scratch file, sitemap, robots, page metadata, taxonomy, homepage, or
content changes belong in this pull request.

## Design Decisions

Next.js applies configured headers before filesystem routing, so one `/(.*)`
rule will cover pages, API responses, and 404 responses. The header values match
the current official Next.js header configuration guidance while avoiding
behavioral changes to embedding, browser capabilities, and transport handling.

The workflow will use `npm ci` because `package-lock.json` is committed. Browser
installation remains `npx playwright install --with-deps`, and the suite will
run through `npm run test:e2e`, which exactly matches the package script.

## CSP Evaluation

This pull request will not add Content Security Policy. The Pages Router
currently uses inline scripts, Emotion styles, Next.js runtime scripts, Vercel
Analytics, Google Tag Manager, an external Prism stylesheet, and external
connections. The official Next.js CSP guidance notes that a strict nonce policy
requires per-request nonces and dynamic rendering, while a static policy must
permit inline and third-party resources. Shipping an unvalidated policy here
could break rendering or analytics; a CSP should be designed and tested as a
separate change.

## Testing and Verification

The new Playwright spec will first fail against the existing route and missing
headers, then pass after implementation. Verification will use an isolated
temporary Playwright configuration on port 3103 with server reuse disabled.
Final checks include Prettier, unit tests, production build, full Playwright
coverage, `npm audit`, workflow-to-lockfile/script inspection, and a clean diff
against `master`.

## Dependency Audit Policy

Run `npm audit` and apply only remediation that npm identifies as non-breaking
and that survives the complete verification suite. Do not use
`npm audit fix --force` or accept major-version changes. Record any remaining
findings in the pull request.
