# Technology Stack

**Analysis Date:** 2026-01-17

## Languages

**Primary:**
- TypeScript 5.9.3 - All application code (`pages/`, `components/`, `lib/`, `tests/`)
- TSX - React components and pages

**Secondary:**
- JSON - Configuration files (`config/categories.json`, `tsconfig.json`)
- Markdown - Content files (`content/book/*.md`, `content/project/*.md`)
- CSS - Global styles (`components/styles/layout.css`)

## Runtime

**Environment:**
- Node.js 22.x (specified in `package.json` engines)

**Package Manager:**
- npm (package-lock.json present)
- Note: GitHub workflow uses yarn but package-lock.json suggests npm as primary

## Frameworks

**Core:**
- Next.js 15.5.9 - React framework with Pages Router architecture
- React 19.2.3 - UI library
- React DOM 19.2.3 - DOM rendering

**Testing:**
- Playwright 1.41.2 - E2E testing framework
- Config: `playwright.config.ts`

**Build/Dev:**
- TypeScript 5.9.3 - Type checking and compilation
- Prettier 3.5.3 - Code formatting

## Key Dependencies

**Critical:**
- `next` ^15.5.9 - Core framework, handles routing, SSG, and build
- `react` ^19.2.3 - UI components
- `@vercel/analytics` ^1.5.0 - Analytics tracking for Vercel deployment

**Styling:**
- `@emotion/react` ^11.14.0 - CSS-in-JS styling
- `@emotion/styled` ^11.14.1 - Styled components API

**Icons:**
- `@fortawesome/fontawesome-svg-core` ^7.1.0 - Font Awesome core
- `@fortawesome/free-brands-svg-icons` ^7.1.0 - Brand icons
- `@fortawesome/free-regular-svg-icons` ^7.1.0 - Regular icons
- `@fortawesome/free-solid-svg-icons` ^7.1.0 - Solid icons
- `@fortawesome/react-fontawesome` ^3.1.1 - React bindings
- `react-feather` ^2.0.8 - Feather icons for React

**Content Processing:**
- `gray-matter` ^4.0.2 - Markdown frontmatter parsing
- `remark` ^15.0.1 - Markdown processing
- `remark-gfm` ^4.0.1 - GitHub Flavored Markdown support
- `remark-rehype` ^11.1.2 - Markdown to HTML conversion
- `rehype-prism-plus` ^2.0.1 - Syntax highlighting
- `rehype-stringify` ^10.0.1 - HTML string output
- `prismjs` ^1.30.0 - Code syntax highlighting

**Utilities:**
- `uuid` ^13.0.0 - Unique ID generation for content items
- `react-parallax-tilt` ^1.7.296 - Tilt effect for UI elements

## Configuration

**Environment:**
- `.env.local` - Local environment variables (gitignored)
- Required vars:
  - `ANALYTICS_ID` - Google Analytics tracking ID
  - `GROQ_API_KEY` - API key for Groq LLM service (chat feature)

**TypeScript:**
- `tsconfig.json` - TypeScript configuration
  - Target: ES2017
  - Module: esnext
  - Strict mode enabled
  - Next.js plugin included

**Build:**
- No `next.config.js` present - uses Next.js defaults
- Build output: `.next/` directory

**Formatting:**
- `.prettierrc` - Prettier configuration
  - Semi: true
  - Single quotes: true
  - Print width: 80
  - Tab width: 2
  - Trailing comma: es5

## Platform Requirements

**Development:**
- Node.js 22.x
- npm for dependency management
- OpenSSL legacy provider for Playwright (NODE_OPTIONS flag)

**Production:**
- Vercel hosting (indicated by `@vercel/analytics` and `.vercel` in gitignore)
- Static site generation with API routes

**CI/CD:**
- GitHub Actions (`playwright.yml`)
- Ubuntu latest runner
- Node.js 22
- Playwright E2E tests on PRs and master pushes

---

*Stack analysis: 2026-01-17*
