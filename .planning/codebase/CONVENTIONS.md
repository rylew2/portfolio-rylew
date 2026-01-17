# Coding Conventions

**Analysis Date:** 2026-01-17

## Naming Patterns

**Files:**
- Components: PascalCase or kebab-case for compound names (`chat-widget.tsx`, `mobile-nav.tsx`)
- Pages: kebab-case with dynamic routes using brackets (`[id].tsx`)
- Styles: kebab-case with `.styles.ts` suffix (`cards.styles.ts`, `chat-widget.styles.ts`)
- Utilities/lib: camelCase (`content.ts`, `gtag.ts`, `getWidth.tsx`)
- Config: kebab-case JSON files (`index.json`, `tags.json`)

**Functions:**
- camelCase for all functions: `getContentList`, `toggleMenuOpen`, `sortByDate`
- React components: PascalCase (`Layout`, `Cards`, `ChatWidget`)
- Event handlers: `handle` prefix (`handleSubmit`)
- Helper functions: descriptive verbs (`getDemoLinks`, `getMetaRow`, `pickTaggedEntry`)

**Variables:**
- camelCase for local variables and state: `menuOpen`, `isLoading`, `contentHtml`
- SCREAMING_SNAKE_CASE for constants: `ANALYTICS_ID` in `lib/gtag.ts`
- Prefixed booleans: `is` prefix (`isOpen`, `isLoading`, `isIndexPage`)

**Types:**
- Interfaces: `I` prefix or descriptive name (`ILayout`, `IContainer`, `IContentData`)
- Props interfaces: Component name + `Props` suffix (`CardsProps`, `ChipsProps`, `ProjectPageProps`)
- Type aliases: PascalCase (`IContentType`, `IWidth`, `MenuContextType`)

## Code Style

**Formatting (Prettier):**
- Config file: `.prettierrc`
- Semi-colons: enabled (`"semi": true`)
- Quotes: single quotes (`"singleQuote": true`)
- Print width: 80 characters (`"printWidth": 80`)
- Tab width: 2 spaces (`"tabWidth": 2`)
- Trailing commas: ES5 style (`"trailingComma": "es5"`)
- Run: `npm run format` to format, `npm run format:check` to verify

**Linting:**
- ESLint: Not configured (no `.eslintrc*` file detected)
- TypeScript: Strict mode enabled in `tsconfig.json` (`"strict": true`)

**Ignored paths for formatting:**
- `node_modules`, `build`, `dist`, `*.log` (from `.prettierignore`)

## Import Organization

**Order (observed pattern):**
1. External packages (React, Next.js, third-party)
2. Internal absolute imports (components, lib, config)
3. Relative imports (local styles, local modules)

**Example from `pages/index.tsx`:**
```typescript
import React from 'react';
import { Cards, Container, Layout } from '../components';
import { StyledIndexPage } from '../components/styles/home.styles';
import { getContentList, ContentListItem } from '../lib/content';
```

**Path Aliases:**
- None configured - uses relative paths throughout
- Common patterns: `../components`, `../../lib/content`, `../config/index.json`

## Error Handling

**Patterns:**

1. **API routes** - Try-catch with HTTP status codes:
```typescript
// From pages/api/chat.ts
try {
  // ... operation
} catch (error) {
  console.error('Chat API error:', error);
  return res.status(500).json({ error: 'Internal server error' });
}
```

2. **Client-side async** - Try-catch with user-friendly fallback:
```typescript
// From components/chat/chat-widget.tsx
try {
  const response = await fetch('/api/chat', { ... });
  // ... handle response
} catch {
  setMessages((prev) => [
    ...prev,
    { role: 'assistant', content: "Sorry, something went wrong..." },
  ]);
}
```

3. **File operations** - Try-catch with empty fallback:
```typescript
// From pages/api/chat.ts
function loadContext(): string {
  try {
    const summaryPath = path.join(process.cwd(), 'me', 'summary.txt');
    return fs.readFileSync(summaryPath, 'utf-8');
  } catch {
    return '';
  }
}
```

4. **Switch statements** - Throw for unhandled cases:
```typescript
// From lib/content.ts
default:
  throw new Error('You have to provide a content type');
```

## Logging

**Framework:** Native `console` methods

**Patterns:**
- Error logging only: `console.error()` for API errors
- No debug logging in production code
- Example: `console.error('Groq API error:', errorText);`

## Comments

**When to Comment:**
- JSDoc-style comments for exported functions with parameters
- Inline comments for non-obvious logic
- TODO comments for future work (sparingly used)

**JSDoc Pattern:**
```typescript
/**
 * Get content list for a particular content type
 * @param {string} contentType Type of content
 * For the landing page of each subpage - called from book/project.tsx getStaticProps
 */
export const getContentList = (contentType: IContentType): ContentListItem[] => {
```

**Inline comments:**
```typescript
// Label that it's a book review on the index page to distinguish from project cards
```

## Function Design

**Size:**
- Functions generally kept under 50 lines
- Complex logic extracted into helper functions (e.g., `getDemoLinks`, `getMetaRow` in `cards.tsx`)

**Parameters:**
- Use destructuring for props: `({ children, width = 'default', ...props }: IContainer)`
- Default parameter values when appropriate
- TypeScript interfaces for complex parameter objects

**Return Values:**
- Explicit return types on exported functions
- JSX returns for components
- Arrays/objects for data functions

## Module Design

**Exports:**
- Named exports preferred: `export { Layout };`, `export { Cards };`
- Default exports for page components and some standalone components
- Re-exports via barrel files: `components/index.tsx` exports from subdirectories

**Barrel Files:**
- `components/index.tsx` - Main component barrel file
- `components/cards/index.ts` - `export * from './cards';`
- `components/chat/index.ts` - `export { ChatWidget } from './chat-widget';`
- Pattern: each component directory has an `index.ts` for clean imports

## React Patterns

**Component Structure:**
1. Imports
2. Type/Interface definitions
3. Styled components (if co-located) or import styles
4. Helper functions (for JSX clarity)
5. Main component function
6. Export

**State Management:**
- React Context for cross-component state (`MenuContext` in `layout.tsx`)
- `useState` for local component state
- No external state library (Redux, Zustand, etc.)

**Hooks Usage:**
- `useState` for local state
- `useEffect` for side effects (scroll, focus)
- `useContext` for consuming context
- `useRef` for DOM references
- `useRouter` from Next.js for routing

**Props Pattern:**
```typescript
interface CardsProps {
  data: ContentListItem[];
}

const Cards = ({ data }: CardsProps) => {
  // ...
};
```

## Styling Patterns

**Approach:** Emotion styled-components with CSS variables

**Styled Components:**
- Prefix with `Styled`: `StyledCards`, `StyledContainer`, `StyledMain`
- Located in `components/styles/` directory
- File naming: `{component}.styles.ts`

**CSS Variables:**
- Defined in `components/styles/layout.css` under `:root`
- Used throughout: `var(--text-color)`, `var(--prim-color)`, `var(--max-width)`
- Responsive values with media queries

**Example styled component:**
```typescript
import styled from '@emotion/styled';

export const StyledCards = styled.section`
  display: flex;
  flex-direction: column;

  h2 {
    color: var(--text-color);
  }

  @media all and (min-width: 560px) {
    flex-direction: row;
  }
`;
```

## Next.js Patterns

**Pages:**
- Use `getStaticProps` for build-time data fetching
- Use `getStaticPaths` for dynamic routes with `fallback: false`
- Page components receive data as props

**API Routes:**
- Located in `pages/api/`
- Check HTTP method first: `if (req.method !== 'POST')`
- Return JSON responses with appropriate status codes

**Image Optimization:**
- Use `next/image` component with explicit width/height
- Example: `<Image src={...} width={450} height={220} />`

---

*Convention analysis: 2026-01-17*
