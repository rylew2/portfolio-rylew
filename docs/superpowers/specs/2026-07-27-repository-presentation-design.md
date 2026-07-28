# Repository Presentation Design

## Objective

Turn the public repository landing page into a credible, accurate portfolio
artifact without changing the application. The README should let a reviewer
understand the site, run it, trace its content and chat data flows, evaluate its
quality controls, and follow the content update process.

## Scope

- Replace the three-line README with a structured project overview.
- Show a screenshot captured from the repository's current production build.
- Document only behavior verified in source, configuration, scripts, and tests.
- Remove the tracked scratch/build artifacts `debug.log`,
  `mergeupstreamchanges.txt`, and `tsconfig.tsbuildinfo`.
- Add exact root ignore rules for those artifacts and the existing
  `tmpclaude-*` scratch convention.
- Add this design and its implementation plan under `docs/superpowers/`.

Runtime code, dependencies, workflows, content entries, taxonomy, metadata,
sitemap behavior, homepage behavior, and security headers are outside this
change.

## README Information Architecture

1. Lead with the site's purpose, live-site link, technology summary, and current
   homepage screenshot.
2. Explain the Pages Router architecture and the Markdown/JSON content model,
   naming the source files that drive routes and UI.
3. Provide Node 22 setup, the exact required `GROQ_API_KEY`, the optional
   `ANALYTICS_ID`, and the repository's declared npm scripts.
4. Trace the generated profile and chat context from their editable sources
   through `prebuild` to the chat API.
5. Describe retrieval weights and Groq request construction exactly as
   implemented, including the selected model and prompt limits.
6. Summarize request validation, in-memory rate limiting, upstream timeout, and
   generic visitor-facing failures without overstating their guarantees.
7. Explain content updates and deployment boundaries, explicitly noting that no
   CI or deployment workflow is checked into this repository.
8. Describe Playwright browser/accessibility coverage and the unit-test scope.
9. Record material tradeoffs: file-system build-time content, generated files
   committed to Git, lexical retrieval, process-local rate limiting, and an
   external hosted model dependency.
10. End with links to the live portfolio and Ryan Lewis's public profile links.

## Screenshot

Capture the actual homepage from `npm run build` followed by `npm run start` on
port 3104. Use a desktop viewport and save the committed image as
`public/images/portfolio-home.png`. The README will reference that relative
path, so GitHub renders it without relying on an external image host.

## Verification

- Run Prettier against changed Markdown and ignore files where supported.
- Run `npm run test:unit`.
- Run the Playwright suite against a temporary config targeting the production
  server on port 3104, then remove the temporary config.
- Run `npm run build`.
- Restore any generated `me/chat-context.json`, `me/summary.txt`, or
  `tsconfig.json` drift that is unrelated to this documentation-only change.
- Review `git diff master...HEAD` and the final tracked-file set before commit,
  push, and pull-request creation.

## Self-Review

The design contains no placeholders, keeps all application behavior outside
scope, and distinguishes repository-verified behavior from deployment details
that are not represented in version control.
