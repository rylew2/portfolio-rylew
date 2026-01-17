# Codebase Concerns

**Analysis Date:** 2026-01-17

## Tech Debt

**Unused API Route:**
- Issue: `pages/api/hello.tsx` is a placeholder/demo file that serves no purpose
- Files: `C:/Users/ryanl/Desktop/portfolio-rylew/pages/api/hello.tsx`
- Impact: Unnecessary endpoint exposed, clutters codebase
- Fix approach: Delete the file if not needed, or implement proper functionality

**Stale Experiments Data:**
- Issue: Experiments content in `content/experiments.ts` links to external repositories belonging to "vickOnRails", not the portfolio owner
- Files: `C:/Users/ryanl/Desktop/portfolio-rylew/content/experiments.ts`
- Impact: Links point to unrelated third-party content, confusing for visitors
- Fix approach: Update with owner's actual experiments or remove the section

**TODO Comment for Date Type:**
- Issue: Experiment date field is typed as string with TODO to convert to datetime
- Files: `C:/Users/ryanl/Desktop/portfolio-rylew/content/experiments.ts` (line 6)
- Impact: Inconsistent date handling, can't sort/format dates properly
- Fix approach: Change `date: string` to `date: Date` and parse during content loading

**Temporary Files in Project Root:**
- Issue: Multiple `tmpclaude-*-cwd` files and debug logs left in project root
- Files: `C:/Users/ryanl/Desktop/portfolio-rylew/tmpclaude-*`, `debug.log`, `devserver.log`, `devserver.err`
- Impact: Clutters repository, unprofessional appearance
- Fix approach: Delete temp files, ensure they are in .gitignore (tmpclaude-* already is)

**Unused Google Analytics Setup:**
- Issue: `lib/gtag.ts` exports ANALYTICS_ID from env but `ANALYTICS_ID` env var is not set
- Files: `C:/Users/ryanl/Desktop/portfolio-rylew/lib/gtag.ts`, `C:/Users/ryanl/Desktop/portfolio-rylew/pages/_document.tsx`
- Impact: Google Analytics code loads with undefined ID, causing console errors
- Fix approach: Either set ANALYTICS_ID in environment or remove gtag integration (Vercel Analytics is already in use)

**Legacy Node.js OpenSSL Workaround:**
- Issue: Playwright config uses `--openssl-legacy-provider` flag, indicating dependency on deprecated crypto
- Files: `C:/Users/ryanl/Desktop/portfolio-rylew/playwright.config.ts` (line 20)
- Impact: Temporary workaround that may break in future Node versions
- Fix approach: Update dependencies to remove need for legacy OpenSSL provider

## Known Bugs

**Outdated Browserslist Database:**
- Symptoms: Warning in dev server logs: "Browserslist: caniuse-lite is outdated"
- Files: `C:/Users/ryanl/Desktop/portfolio-rylew/package-lock.json`
- Trigger: Running `npm run dev` or `npm run build`
- Workaround: Run `npx browserslist@latest --update-db` to update

## Security Considerations

**API Key Exposure Risk:**
- Risk: GROQ_API_KEY is stored in `.env.local` which is gitignored, but the key was visible during analysis
- Files: `C:/Users/ryanl/Desktop/portfolio-rylew/.env.local`
- Current mitigation: File is in .gitignore
- Recommendations: Rotate the API key if it was ever committed; use server-side environment variables in production deployment platform

**dangerouslySetInnerHTML Usage:**
- Risk: XSS vulnerability if content is not properly sanitized
- Files:
  - `C:/Users/ryanl/Desktop/portfolio-rylew/pages/_document.tsx` (line 20) - Google Analytics script
  - `C:/Users/ryanl/Desktop/portfolio-rylew/components/header/home-header.tsx` (line 14) - Config description
  - `C:/Users/ryanl/Desktop/portfolio-rylew/pages/books/[id].tsx` (line 36) - Markdown content
  - `C:/Users/ryanl/Desktop/portfolio-rylew/pages/projects/[id].tsx` (line 105) - Markdown content
- Current mitigation: Content comes from owned markdown files and static config, low risk
- Recommendations: Use remark-rehype sanitization plugin for markdown content; avoid dangerouslySetInnerHTML for config description

**Chat API Rate Limiting:**
- Risk: No rate limiting on `/api/chat` endpoint, vulnerable to abuse
- Files: `C:/Users/ryanl/Desktop/portfolio-rylew/pages/api/chat.ts`
- Current mitigation: None
- Recommendations: Add rate limiting middleware (e.g., using vercel-rate-limit), add request validation

**Chat Message History Size:**
- Risk: No limit on conversation history sent to API, could exceed token limits or enable abuse
- Files: `C:/Users/ryanl/Desktop/portfolio-rylew/pages/api/chat.ts` (line 67)
- Current mitigation: None
- Recommendations: Limit history to last N messages; trim older messages

## Performance Bottlenecks

**Inefficient Content Lookups:**
- Problem: `getContentData()` reads all files to find one by slug, O(n) complexity
- Files: `C:/Users/ryanl/Desktop/portfolio-rylew/lib/content.ts` (lines 106-113)
- Cause: Files are named differently than their slug frontmatter, requiring iteration
- Improvement path: Rename content files to match slugs, or build a slug-to-filename index at startup

**Synchronous File Operations:**
- Problem: All content loading uses synchronous `fs.readFileSync` calls
- Files: `C:/Users/ryanl/Desktop/portfolio-rylew/lib/content.ts` (multiple locations)
- Cause: Simpler implementation, but blocks event loop
- Improvement path: Use `fs.promises.readFile` for async operations (note: in SSG context, impact is at build time only)

**External CSS Dependency:**
- Problem: Prism theme loaded from unpkg CDN on every page load
- Files: `C:/Users/ryanl/Desktop/portfolio-rylew/pages/_document.tsx` (lines 15-18)
- Cause: Using external CDN instead of bundled CSS
- Improvement path: Install prism theme locally and import in styles

## Fragile Areas

**Content Slug Lookup:**
- Files: `C:/Users/ryanl/Desktop/portfolio-rylew/lib/content.ts` (lines 106-117)
- Why fragile: If no file matches the slug, `match[0]` is undefined, causing crash
- Safe modification: Add null check before accessing `match[0]`
- Test coverage: No unit tests exist; only E2E tests cover happy path

**Tag/Category Filtering:**
- Files: `C:/Users/ryanl/Desktop/portfolio-rylew/lib/content.ts` (lines 192-231, 237-279)
- Why fragile: Uses non-null assertion `contentDir!` assuming switch always sets value
- Safe modification: Add default case or move to more defensive pattern
- Test coverage: E2E tests in `tests/tag-pages.spec.ts` cover basic flow

**Duplicate Type Definitions:**
- Files:
  - `C:/Users/ryanl/Desktop/portfolio-rylew/lib/content.ts` (ContentListItem interface)
  - `C:/Users/ryanl/Desktop/portfolio-rylew/pages/books/[id].tsx` (IContentData interface)
- Why fragile: Two similar interfaces for content data, easy to diverge
- Safe modification: Consolidate into single shared type in `lib/content.ts`
- Test coverage: TypeScript compiler catches mismatches

## Scaling Limits

**Static Site Generation:**
- Current capacity: Works well with ~12 content items
- Limit: Build time increases linearly with content count
- Scaling path: For 100+ items, consider ISR (Incremental Static Regeneration) or server-side rendering

**Chat API Token Usage:**
- Current capacity: 500 max_tokens per response, full history sent
- Limit: Groq API token limits per minute/day
- Scaling path: Implement conversation pruning, add caching layer, consider streaming responses

## Dependencies at Risk

**None Critical:**
- All major dependencies (Next.js 15, React 19) are current versions
- No deprecated or abandoned packages detected

## Missing Critical Features

**Error Boundaries:**
- Problem: No React error boundaries to gracefully handle component failures
- Blocks: Runtime errors crash entire page instead of showing fallback
- Files: `C:/Users/ryanl/Desktop/portfolio-rylew/components/layout.tsx` should wrap children

**404 Custom Page:**
- Problem: No custom 404 page exists
- Blocks: Users see generic Next.js 404 instead of branded experience
- Files: Need to create `C:/Users/ryanl/Desktop/portfolio-rylew/pages/404.tsx`

**Loading States:**
- Problem: No loading indicators during page transitions
- Blocks: Users don't know if navigation is working on slow connections
- Files: Could add to `C:/Users/ryanl/Desktop/portfolio-rylew/components/layout.tsx`

## Test Coverage Gaps

**No Unit Tests:**
- What's not tested: All utility functions in `lib/content.ts`
- Files: `C:/Users/ryanl/Desktop/portfolio-rylew/lib/content.ts`
- Risk: Content parsing logic bugs not caught until runtime
- Priority: Medium - E2E tests provide some coverage

**Chat Widget Untested:**
- What's not tested: Chat widget component, API error handling, message state
- Files:
  - `C:/Users/ryanl/Desktop/portfolio-rylew/components/chat/chat-widget.tsx`
  - `C:/Users/ryanl/Desktop/portfolio-rylew/pages/api/chat.ts`
- Risk: Chat functionality could break silently
- Priority: Medium - manual testing covers happy path

**API Route Untested:**
- What's not tested: `/api/chat` endpoint validation, error paths
- Files: `C:/Users/ryanl/Desktop/portfolio-rylew/pages/api/chat.ts`
- Risk: Edge cases (invalid input, API failures) may not behave correctly
- Priority: High - security implications

**No Accessibility Tests:**
- What's not tested: ARIA labels, keyboard navigation, screen reader compatibility
- Files: All component files in `C:/Users/ryanl/Desktop/portfolio-rylew/components/`
- Risk: Site may not be accessible to users with disabilities
- Priority: Low - portfolio site with limited audience

---

*Concerns audit: 2026-01-17*
