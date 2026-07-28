# Portfolio AI Assistant Case Study Design

## Goal

Add a selected-work case study for the portfolio's existing AI assistant. The
project must be visible as a card on `/projects` and the homepage, and its
detail page must use a genuine screenshot of the open chat widget.

## Scope

- Add one project Markdown file using the repository's existing frontmatter and
  content pipeline.
- Set `selectedWork: true` so the existing homepage selection logic includes
  the project without changing the homepage layout.
- Capture the current application at a 1200 × 600 viewport with the real chat
  widget open, and store the PNG under
  `public/images/project/portfolio-ai-assistant/`.
- Add focused Playwright checks for the generated detail route and the card on
  both listing surfaces.
- Allow the normal build generators to add the new project to
  `me/chat-context.json`, while discarding timestamp-only or unrelated
  generated drift.

No homepage, hero, card component, chat implementation, other project, or
unrelated copy changes are in scope.

## Content Design

The project is titled **Portfolio AI Assistant**, uses the slug
`portfolio-ai-assistant`, is dated `2026-07`, and links its source to this
repository. Its description and case-study body cover only behavior present in
the repository:

- `me/profile.json` generates `me/summary.txt`, while project and book Markdown
  generate `me/chat-context.json` during the prebuild step.
- The API tokenizes a visitor query, scores keyword matches across titles,
  tags, descriptions, and content, and selects the highest-scoring details.
- The server posts an OpenAI-style chat-completions payload to Groq's
  OpenAI-compatible endpoint.
- The merged API protections enforce POST-only access, bounded and sanitized
  input/history, permitted history roles, per-client rolling rate limits,
  finite upstream timeouts, generic visitor-facing failures, and upstream
  response validation.
- Node tests cover request validation, rate-limit boundaries, client
  identification, sanitized prompt construction, upstream timeout/failure
  handling, and response validation. Playwright covers the project route and
  its listing cards.

The case study will not claim users, metrics, business impact, or outcomes.

## Data and Rendering Flow

`content/project/portfolio-ai-assistant.md` is consumed by the existing
`lib/content.ts` readers. Those readers generate the static detail path, add the
project to `/projects`, and expose `selectedWork` to the homepage filter. The
existing Cards and project-detail components render the new screenshot without
component changes. The prebuild context generator also consumes the same
Markdown, keeping the assistant's project context aligned with the visible case
study.

## Screenshot

Run the existing Next.js application locally, open `/`, activate the **Open
chat** control, and capture the browser viewport at 1200 × 600. This preserves
the real welcome state, chat header, input, launcher, and surrounding portfolio
UI in a two-to-one image suitable for the existing card and detail-page image
slots.

## Testing

Add literal, feature-specific Playwright expectations:

1. `/projects/portfolio-ai-assistant` responds successfully and renders the
   case-study heading and retrieval section.
2. The `Portfolio AI Assistant` card appears on both `/projects` and `/`, links
   to the detail route, and loads the expected screenshot.

The final verification set is formatting check, unit tests, production build,
focused Playwright coverage, and the full Playwright suite.
