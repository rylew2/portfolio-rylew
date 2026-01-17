# Codebase Structure

**Analysis Date:** 2026-01-17

## Directory Layout

```
portfolio-rylew/
├── .github/                    # GitHub configuration
│   ├── ISSUE_TEMPLATE/         # Issue templates
│   └── workflows/              # CI/CD workflows
├── .planning/                  # Planning documents
│   └── codebase/               # Codebase analysis docs
├── components/                 # React UI components
│   ├── cards/                  # Card display components
│   ├── chat/                   # AI chat widget
│   ├── chips/                  # Tag chip components
│   ├── footer/                 # Footer component
│   ├── header/                 # Header variants
│   ├── nav/                    # Navigation components
│   ├── notes/                  # Note display (unused?)
│   └── styles/                 # Emotion styled components
├── config/                     # Site configuration JSON
├── content/                    # Markdown content files
│   ├── book/                   # Book review markdown
│   └── project/                # Project markdown
├── lib/                        # Shared utilities
├── me/                         # Personal context for AI chat
├── pages/                      # Next.js page routes
│   ├── api/                    # API endpoints
│   ├── books/                  # Book routes
│   │   ├── categories/         # Book category pages
│   │   └── tags/               # Book tag pages
│   └── projects/               # Project routes
│       └── tags/               # Project tag pages
├── public/                     # Static assets
│   └── images/                 # Image assets
│       ├── book/               # Book preview images
│       └── project/            # Project preview images
├── tests/                      # Playwright E2E tests
├── test-results/               # Test output (gitignored)
└── util/                       # Utility functions
```

## Directory Purposes

**components/**
- Purpose: All React UI components and styled components
- Contains: TSX component files, barrel exports (index.ts), style files
- Key files:
  - `index.tsx` - Main barrel export
  - `layout.tsx` - Page wrapper with Nav/Header/Footer
  - `container.tsx` - Width-constrained wrapper

**components/cards/**
- Purpose: Card grid display for content listings
- Contains: Cards component and barrel export
- Key files: `cards.tsx`, `index.ts`

**components/chat/**
- Purpose: AI-powered chat widget
- Contains: Chat UI component and styles
- Key files: `chat-widget.tsx`, `chat-widget.styles.ts`, `index.ts`

**components/styles/**
- Purpose: All Emotion styled component definitions
- Contains: `.styles.ts` files matching component names
- Key files: `layout.styles.ts`, `cards.styles.ts`, `nav.styles.ts`

**config/**
- Purpose: JSON configuration for site metadata and content taxonomy
- Contains: JSON files read at build time
- Key files:
  - `index.json` - Site/author metadata
  - `tags.json` - Tag definitions with titles/descriptions
  - `categories.json` - Category definitions

**content/**
- Purpose: Markdown content with YAML frontmatter
- Contains: `.md` files organized by content type
- Key files:
  - `content/project/*.md` - Project write-ups
  - `content/book/*.md` - Book reviews

**lib/**
- Purpose: Business logic and data utilities
- Contains: TypeScript modules for content and analytics
- Key files:
  - `content.ts` - All content fetching/parsing functions
  - `gtag.ts` - Google Analytics ID export

**me/**
- Purpose: Personal context loaded by AI chat
- Contains: Text files describing Ryan for LLM system prompt
- Key files: `summary.txt`

**pages/**
- Purpose: Next.js file-based routing
- Contains: Page components, API routes, special files
- Key files:
  - `_app.tsx` - App wrapper (fonts, global styles)
  - `_document.tsx` - HTML document customization
  - `index.tsx` - Home page
  - `about.tsx` - About page
  - `projects.tsx` - Projects listing
  - `books.tsx` - Books listing

**pages/api/**
- Purpose: Serverless API endpoints
- Contains: API route handlers
- Key files: `chat.ts` (Groq LLM integration)

**pages/[content]/[id].tsx**
- Purpose: Dynamic routes for individual content items
- Contains: Single content page with markdown rendering
- Key files: `pages/projects/[id].tsx`, `pages/books/[id].tsx`

**pages/[content]/tags/[tag].tsx**
- Purpose: Tag-filtered content listings
- Contains: Pages showing content filtered by tag
- Key files: `pages/projects/tags/[tag].tsx`, `pages/books/tags/[tag].tsx`

**public/**
- Purpose: Static assets served at root URL
- Contains: Images, favicon, static files
- Key files: `favicon.ico`, `images/`

**tests/**
- Purpose: End-to-end tests
- Contains: Playwright test specifications
- Key files: `content-pages.spec.ts`, `tag-pages.spec.ts`

**util/**
- Purpose: Shared utility functions
- Contains: Small helper modules
- Key files: `getWidth.tsx` - Container width helper

## Key File Locations

**Entry Points:**
- `pages/_app.tsx`: Application wrapper, font loading, analytics
- `pages/_document.tsx`: HTML document structure, external scripts
- `pages/index.tsx`: Home page with selected works

**Configuration:**
- `package.json`: Dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `playwright.config.ts`: E2E test configuration
- `config/index.json`: Site metadata
- `config/tags.json`: Tag taxonomy
- `.env.local`: Environment variables (GROQ_API_KEY, ANALYTICS_ID)

**Core Logic:**
- `lib/content.ts`: Content fetching (getContentList, getContentData, getAllContentIds)
- `components/layout.tsx`: Page layout with MenuContext
- `components/cards/cards.tsx`: Content card rendering

**Styling:**
- `components/styles/*.styles.ts`: Emotion styled components
- `components/styles/layout.css`: Global CSS variables

**Testing:**
- `tests/content-pages.spec.ts`: Content page E2E tests
- `tests/tag-pages.spec.ts`: Tag page E2E tests

## Naming Conventions

**Files:**
- Components: kebab-case (`chat-widget.tsx`, `home-header.tsx`)
- Styles: component-name.styles.ts (`cards.styles.ts`, `nav.styles.ts`)
- Pages: kebab-case or lowercase (`about.tsx`, `projects.tsx`)
- Dynamic routes: `[param].tsx` (`[id].tsx`, `[tag].tsx`)
- Config: lowercase (`index.json`, `tags.json`)
- Content: kebab-case (`card-game.md`, `staff-engineer.md`)

**Directories:**
- Plural for collections (`components/`, `pages/`, `tests/`)
- Singular for content types (`content/book/`, `content/project/`)
- Lowercase kebab-case throughout

**Exports:**
- Components: PascalCase (`Cards`, `Layout`, `Container`)
- Functions: camelCase (`getContentList`, `getContentData`)
- Types/Interfaces: PascalCase with I prefix for interfaces (`IContentData`, `ContentListItem`)

## Where to Add New Code

**New Page:**
- Create file in `pages/` following existing naming pattern
- Use Layout wrapper: `<Layout pathname={'/newpage'} pageTitle="Title">`
- Export default page component

**New Component:**
- Create in `components/` or appropriate subdirectory
- Create corresponding `.styles.ts` in `components/styles/`
- Add export to nearest `index.ts` barrel file
- Pattern: `export { ComponentName }` (named export)

**New Content Type:**
- Create directory in `content/` (e.g., `content/newtype/`)
- Add case to switch statements in `lib/content.ts`
- Create listing page in `pages/` (e.g., `pages/newtypes.tsx`)
- Create dynamic page in `pages/newtypes/[id].tsx`
- Add tag page if needed in `pages/newtypes/tags/[tag].tsx`

**New API Endpoint:**
- Create file in `pages/api/` (e.g., `pages/api/newEndpoint.ts`)
- Export default handler function: `export default async function handler(req, res)`
- Handle method checks, validate input, return JSON

**New Styled Component:**
- Add to existing `.styles.ts` file OR create new one in `components/styles/`
- Use Emotion's `styled` import: `import styled from '@emotion/styled'`
- Export as named export: `export const StyledComponent = styled.div\`...\``

**New Configuration:**
- Add to existing JSON in `config/` OR create new JSON file
- Import in consuming files: `import config from '../config/newconfig.json'`

**New Utility:**
- Add to `util/` directory
- Follow existing pattern: export function with TypeScript types

## Special Directories

**.next/**
- Purpose: Next.js build output and cache
- Generated: Yes (by `next build` and `next dev`)
- Committed: No (gitignored)

**node_modules/**
- Purpose: npm dependencies
- Generated: Yes (by `npm install`)
- Committed: No (gitignored)

**test-results/**
- Purpose: Playwright test output and screenshots
- Generated: Yes (by `npm run test:e2e`)
- Committed: No (gitignored)

**.planning/**
- Purpose: GSD planning and codebase analysis documents
- Generated: Partially (by GSD mapping commands)
- Committed: Yes

**public/**
- Purpose: Static assets served at root URL path
- Generated: No (manually added assets)
- Committed: Yes

---

*Structure analysis: 2026-01-17*
