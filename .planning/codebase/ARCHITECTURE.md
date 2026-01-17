# Architecture

**Analysis Date:** 2026-01-17

## Pattern Overview

**Overall:** Next.js Pages Router with Static Site Generation (SSG)

**Key Characteristics:**
- Static site generation at build time for all content pages
- File-based routing via Next.js pages directory
- Markdown-based content management with frontmatter metadata
- Component-based UI with Emotion CSS-in-JS styling
- Minimal API layer (single chat endpoint)

## Layers

**Pages Layer:**
- Purpose: Route handlers and page components that define URL structure
- Location: `pages/`
- Contains: Page components, API routes, Next.js special files (_app, _document)
- Depends on: Components, Lib (content fetching)
- Used by: Next.js framework (routing/rendering)

**Components Layer:**
- Purpose: Reusable UI components and layout primitives
- Location: `components/`
- Contains: React components, styled components, barrel exports
- Depends on: Config, Util, Styles
- Used by: Pages

**Lib Layer:**
- Purpose: Business logic and data fetching utilities
- Location: `lib/`
- Contains: Content parsing (`content.ts`), analytics (`gtag.ts`)
- Depends on: Content directory (markdown files), Config
- Used by: Pages (getStaticProps, getStaticPaths)

**Content Layer:**
- Purpose: Static content storage as markdown files
- Location: `content/`
- Contains: Markdown files with YAML frontmatter (projects, books)
- Depends on: Nothing (pure data)
- Used by: Lib (content.ts parses these)

**Config Layer:**
- Purpose: Site-wide configuration and metadata
- Location: `config/`
- Contains: JSON configuration files (site config, tags, categories)
- Depends on: Nothing
- Used by: Components, Pages, Lib

**API Layer:**
- Purpose: Server-side API endpoints
- Location: `pages/api/`
- Contains: Chat endpoint with Groq LLM integration
- Depends on: `me/` directory for context, external Groq API
- Used by: ChatWidget component (client-side fetch)

## Data Flow

**Static Content Rendering (SSG):**

1. At build time, Next.js calls `getStaticPaths()` in dynamic route pages
2. `lib/content.ts` reads markdown files from `content/` directory
3. `gray-matter` parses YAML frontmatter into metadata objects
4. `getStaticProps()` fetches content data for each path
5. Content is passed as props to page components
6. Pages render with Layout wrapper and Cards/Content components
7. HTML is pre-rendered and served statically

**Chat Widget Flow (Runtime):**

1. User opens ChatWidget component (`components/chat/chat-widget.tsx`)
2. User submits message, triggering POST to `/api/chat`
3. API handler loads context from `me/summary.txt`
4. System prompt is constructed with Ryan's background info
5. Request forwarded to Groq API (llama-3.3-70b-versatile model)
6. Response streamed back to ChatWidget and rendered

**State Management:**
- React useState for local component state (chat messages, menu toggle)
- React Context for cross-component state (MenuContext for mobile nav)
- No global state management library (Redux, Zustand, etc.)
- Content is server-rendered, not fetched client-side

## Key Abstractions

**ContentListItem:**
- Purpose: Represents a piece of content (project or book) in listings
- Definition: `lib/content.ts` lines 20-34
- Examples: Used in Cards component, listing pages
- Pattern: TypeScript interface with optional fields for flexible content types

**Layout:**
- Purpose: Consistent page wrapper with head, nav, header, footer
- Definition: `components/layout.tsx`
- Examples: Every page uses `<Layout>` as wrapper
- Pattern: Compound component with context provider (MenuContext)

**Container:**
- Purpose: Width-constrained content wrapper
- Definition: `components/container.tsx`
- Examples: `<Container width="narrow">`, `<Container width="default">`
- Pattern: Configurable styled component with width prop

**Content Types:**
- Purpose: Distinguish between project and book content
- Definition: `type IContentType = 'book' | 'project'` in `lib/content.ts`
- Examples: `getContentList('project')`, `getContentData(id, 'book')`
- Pattern: Discriminated union type for type-safe content operations

## Entry Points

**Application Entry (`pages/_app.tsx`):**
- Location: `pages/_app.tsx`
- Triggers: Every page render
- Responsibilities: Font loading (DM Sans, Manrope), global CSS import, Vercel Analytics

**Document Entry (`pages/_document.tsx`):**
- Location: `pages/_document.tsx`
- Triggers: Server-side HTML generation
- Responsibilities: Google Analytics script injection, Prism.js syntax highlighting CSS

**Home Page (`pages/index.tsx`):**
- Location: `pages/index.tsx`
- Triggers: Root URL navigation
- Responsibilities: Display selected works (featured projects and books)

**Content Listing Pages:**
- Location: `pages/projects.tsx`, `pages/books.tsx`
- Triggers: `/projects`, `/books` navigation
- Responsibilities: List all items of content type

**Dynamic Content Pages:**
- Location: `pages/projects/[id].tsx`, `pages/books/[id].tsx`
- Triggers: Individual content item URLs
- Responsibilities: Render full markdown content with metadata

**API Entry (`pages/api/chat.ts`):**
- Location: `pages/api/chat.ts`
- Triggers: POST requests from ChatWidget
- Responsibilities: Process chat messages, call Groq LLM, return AI response

## Error Handling

**Strategy:** Minimal explicit error handling; relies on Next.js defaults

**Patterns:**
- API route returns JSON error responses with appropriate HTTP status codes
- `try/catch` in chat API for network failures
- Fallback error messages displayed in ChatWidget UI
- Content parsing assumes valid markdown (no try/catch in content.ts)

## Cross-Cutting Concerns

**Logging:**
- Console.error in API routes for debugging
- No structured logging framework

**Validation:**
- TypeScript interfaces for compile-time type checking
- Basic runtime checks in API (e.g., `!message || typeof message !== 'string'`)
- No schema validation library (Zod, Yup, etc.)

**Authentication:**
- None required (public portfolio site)
- API key for Groq stored in environment variable

**SEO:**
- Managed via Head component in Layout
- OpenGraph and Twitter card meta tags
- Per-page title and description support

**Analytics:**
- Google Analytics via gtag.js (`lib/gtag.ts`)
- Vercel Analytics component in `_app.tsx`

---

*Architecture analysis: 2026-01-17*
