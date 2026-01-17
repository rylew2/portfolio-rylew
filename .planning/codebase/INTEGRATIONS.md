# External Integrations

**Analysis Date:** 2026-01-17

## APIs & External Services

**AI/LLM:**
- Groq API - Powers the chat widget for AI-powered portfolio assistant
  - Endpoint: `https://api.groq.com/openai/v1/chat/completions`
  - Model: `llama-3.3-70b-versatile`
  - Auth: `GROQ_API_KEY` environment variable
  - Implementation: `pages/api/chat.ts`

**Analytics:**
- Google Analytics (gtag.js)
  - Auth: `ANALYTICS_ID` environment variable
  - Implementation: `pages/_document.tsx`, `lib/gtag.ts`
  - Script loaded from `googletagmanager.com`

- Vercel Analytics
  - SDK: `@vercel/analytics`
  - Implementation: `pages/_app.tsx`
  - No additional configuration required (auto-configured on Vercel)

**CDN:**
- unpkg.com - Prism.js theme stylesheet
  - URL: `https://unpkg.com/prismjs@1.29.0/themes/prism-okaidia.css`
  - Loaded in: `pages/_document.tsx`

## Data Storage

**Databases:**
- None - Static site with file-based content

**File Storage:**
- Local filesystem only
  - Content stored as Markdown files in `content/book/` and `content/project/`
  - Images stored in `public/images/`
  - Processed at build time via Next.js SSG

**Caching:**
- None - Relies on Next.js build-time static generation
- Browser caching handled by Vercel CDN

## Authentication & Identity

**Auth Provider:**
- None - Public portfolio site with no user authentication

**API Security:**
- Server-side API key validation for Groq API (`pages/api/chat.ts`)
- API keys stored in environment variables, not exposed to client

## Monitoring & Observability

**Error Tracking:**
- None - Console logging only

**Logs:**
- Console.error for Groq API errors (`pages/api/chat.ts`)
- No structured logging or external log aggregation

**Analytics:**
- Google Analytics for page views and user behavior
- Vercel Analytics for web vitals and performance metrics

## CI/CD & Deployment

**Hosting:**
- Vercel (inferred from `@vercel/analytics` and `.vercel` in gitignore)
- Automatic deployments on git push

**CI Pipeline:**
- GitHub Actions
  - Workflow: `.github/workflows/playwright.yml`
  - Triggers: Pull requests, pushes to master
  - Tests: Playwright E2E tests
  - Runner: Ubuntu latest with Node.js 22

## Environment Configuration

**Required env vars:**
- `GROQ_API_KEY` - Required for chat widget functionality
- `ANALYTICS_ID` - Required for Google Analytics tracking

**Optional env vars:**
- None detected

**Secrets location:**
- `.env.local` for local development (gitignored)
- Vercel environment variables for production

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## API Routes

**Internal API Endpoints:**

| Route | Method | Purpose | File |
|-------|--------|---------|------|
| `/api/chat` | POST | AI chat completion via Groq | `pages/api/chat.ts` |
| `/api/hello` | GET | Test endpoint | `pages/api/hello.tsx` |

**Chat API Request Format:**
```typescript
interface ChatRequest {
  message: string;
  history: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
}
```

**Chat API Response Format:**
```typescript
interface ChatResponse {
  response: string;
}
// or on error:
interface ChatError {
  error: string;
}
```

## External Font Services

**Google Fonts:**
- DM Sans (weights: 400, 700) - Via `next/font/google`
- Manrope (weights: 400, 700, 800) - Via `next/font/google`
- Implementation: `pages/_app.tsx`
- Optimized by Next.js (self-hosted, no external requests at runtime)

---

*Integration audit: 2026-01-17*
