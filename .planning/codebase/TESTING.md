# Testing Patterns

**Analysis Date:** 2026-01-17

## Test Framework

**Runner:**
- Playwright v1.41.2
- Config: `playwright.config.ts`

**Assertion Library:**
- Playwright's built-in `expect` (from `@playwright/test`)

**Run Commands:**
```bash
npm run test:e2e              # Run all E2E tests
npm run test:e2e:ui           # Run with Playwright UI (interactive)
```

## Test File Organization

**Location:**
- Separate test directory: `tests/`
- Co-location pattern: NOT used (tests are not alongside source files)

**Naming:**
- `{feature}.spec.ts` pattern
- Examples: `content-pages.spec.ts`, `tag-pages.spec.ts`

**Structure:**
```
tests/
  content-pages.spec.ts    # Tests for content listing pages
  tag-pages.spec.ts        # Tests for tag navigation
```

## Test Structure

**Suite Organization:**
```typescript
// From tests/content-pages.spec.ts
import { test, expect } from "@playwright/test";
import { getContentList } from "../lib/content";

// Helper functions defined at module level
const expectContentPage = async (
  page,
  url: string,
  contentType: "book" | "project"
) => {
  // Reusable assertion logic
};

// Individual test cases
test("projects page lists all project items", async ({ page }) => {
  await expectContentPage(page, "/projects", "project");
});

test("books page lists all book items", async ({ page }) => {
  await expectContentPage(page, "/books", "book");
});
```

**Patterns:**
- Import test utilities from lib files for data-driven tests
- Define reusable helper functions for common assertions
- Each `test()` block is self-contained
- Descriptive test names: `"projects page lists all project items"`

## Playwright Configuration

**Config file:** `playwright.config.ts`

```typescript
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev -- -p 3000",
    port: 3000,
    reuseExistingServer: !process.env.CI,
    env: {
      ...process.env,
      NODE_OPTIONS: "--openssl-legacy-provider",
    },
  },
});
```

**Key settings:**
- `fullyParallel: true` - Tests run in parallel
- `timeout: 30_000` - 30 second test timeout
- `expect.timeout: 5_000` - 5 second assertion timeout
- `trace: "retain-on-failure"` - Traces saved only for failed tests
- Auto-starts dev server on port 3000

## Mocking

**Framework:** None explicitly used

**Patterns:**
- Tests use actual lib functions (`getContentList`, `getContentWithTag`)
- Data is read from real content files at test time
- No mocking of API calls or external services

**What to Mock:**
- Not applicable - E2E tests run against real application

**What NOT to Mock:**
- Content data functions (used to verify page content matches data)
- Navigation and routing (tested directly)

## Fixtures and Factories

**Test Data:**
```typescript
// From tests/tag-pages.spec.ts
import tagsJSON from "../config/tags.json";
import { getContentList, getContentWithTag } from "../lib/content";

const siteTags = new Set(tagsJSON.map((tag) => tag.tag));

// Helper to find content with tags
const pickTaggedEntry = (content) => {
  return content.find(
    (item) =>
      Array.isArray(item.tags) && item.tags.some((tag) => siteTags.has(tag))
  );
};
```

**Location:**
- Test data loaded directly from config/content files
- Helper functions defined inline in test files
- No separate fixtures directory

## Coverage

**Requirements:** None enforced

**View Coverage:**
- Not configured (Playwright E2E tests, not unit tests)

## Test Types

**Unit Tests:**
- NOT present in codebase
- No Jest, Vitest, or unit test framework configured

**Integration Tests:**
- NOT present as separate category

**E2E Tests:**
- Primary test type
- Playwright-based browser automation
- Tests actual user flows through the application

## Common Patterns

**Page Navigation:**
```typescript
await page.goto("/projects");
await page.goto(`/projects/${taggedProject.slug}`);
```

**Element Selection:**
```typescript
// By role and name
page.getByRole("heading", { name: title })
page.getByRole("link", { name: tag })

// By locator
page.locator("main article h2")
page.locator("main")
```

**Assertions:**
```typescript
// Visibility
await expect(page.getByRole("heading", { name: "About Me" })).toBeVisible();

// Count
await expect(headingLocator).toHaveCount(titles.length);

// URL matching
await expect(page).toHaveURL(
  new RegExp(`/projects/tags/${escapeRegExp(encodeURIComponent(tag))}$`),
  { timeout: 15000 }
);

// Truthiness
expect(taggedProject).toBeTruthy();
```

**Data-Driven Testing:**
```typescript
// Loop through all expected items
for (const title of titles) {
  await expect(
    page.locator("main").getByRole("heading", { name: title })
  ).toBeVisible();
}
```

**Error Handling in Tests:**
```typescript
expect(taggedBook).toBeTruthy();
if (!taggedBook) {
  throw new Error("No books matched tags in config/tags.json.");
}
```

**Async Testing:**
```typescript
test("projects page lists all project items", async ({ page }) => {
  await page.goto("/projects");
  await expect(headingLocator).toHaveCount(titles.length);
});
```

## CI/CD Integration

**GitHub Actions:** `.github/workflows/playwright.yml`

```yaml
name: Playwright E2E

on:
  pull_request:
  push:
    branches:
      - master

jobs:
  e2e:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: yarn test:e2e
```

**Triggers:**
- On all pull requests
- On push to `master` branch

**Note:** CI uses `yarn` while `package.json` scripts use `npm`. Lockfile is `package-lock.json` (npm), but workflow references `yarn install --frozen-lockfile`.

## Test Results

**Output Directory:** `test-results/`

**Trace Files:**
- Saved on failure (`trace: "retain-on-failure"`)
- Can be viewed with Playwright trace viewer

## Writing New Tests

**Add a new test file:**
1. Create `tests/{feature}.spec.ts`
2. Import from `@playwright/test`
3. Import any needed lib functions for data verification
4. Write `test()` blocks with descriptive names

**Test template:**
```typescript
import { test, expect } from "@playwright/test";

test("descriptive test name", async ({ page }) => {
  // Arrange: navigate to page
  await page.goto("/your-page");

  // Act: interact with elements (if needed)
  await page.getByRole("button", { name: "Submit" }).click();

  // Assert: verify expected state
  await expect(page.getByRole("heading", { name: "Success" })).toBeVisible();
});
```

**Run single test file:**
```bash
npx playwright test tests/your-test.spec.ts
```

**Debug tests:**
```bash
npx playwright test --debug
```

---

*Testing analysis: 2026-01-17*
