import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import type { Result } from "axe-core";
import { getContentList } from "../lib/content";

type PageEntry = {
  name: string;
  url: string;
};

const pickFirstSlug = (items: Array<{ slug?: string }>) => {
  const match = items.find((item) => item.slug);
  return match?.slug;
};

const buildPageList = (): PageEntry[] => {
  const projectSlug = pickFirstSlug(getContentList("project"));
  const bookSlug = pickFirstSlug(getContentList("book"));

  return [
    { name: "home", url: "/" },
    { name: "projects", url: "/projects" },
    { name: "books", url: "/books" },
    { name: "about", url: "/about" },
    ...(projectSlug ? [{ name: "project detail", url: `/projects/${projectSlug}` }] : []),
    ...(bookSlug ? [{ name: "book detail", url: `/books/${bookSlug}` }] : []),
  ];
};

const WCAG_TAGS = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
  "best-practice",
];

const VIEWPORTS = [
  { label: "desktop", width: 1280, height: 900 },
  { label: "mobile", width: 390, height: 844 },
];

const reportViolations = (violations: Result[]) =>
  violations.map((violation) => {
    const targets = violation.nodes
      .map((node) => node.target.map(String).join(", "))
      .join(" | ");
    return `${violation.id} (${violation.impact}) ${violation.help}\n${targets}`;
  });

// Every scan below covers the whole document. Scoping to main used to hide the
// nav, the footer, the chat widget, the mobile menu and even the <h1>, which
// sits in a section above main -- the suite passed while all of those had
// violations.
test.describe("accessibility", () => {
  test.describe.configure({ timeout: 300_000 });
  const pages = buildPageList();

  for (const theme of ["light", "dark"] as const) {
    for (const viewport of VIEWPORTS) {
      test(`${theme} mode, ${viewport.label}`, async ({ page }) => {
        test.setTimeout(300_000);

        await page.addInitScript((value: string) => {
          window.localStorage.setItem("theme", value);
        }, theme);
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });

        for (const { name, url } of pages) {
          await page.goto(url);
          await page.waitForLoadState("networkidle");
          await expect(page.locator("main")).toBeVisible();
          await expect(page.locator("html")).toHaveAttribute("data-theme", theme);

          const results = await new AxeBuilder({ page })
            .withTags(WCAG_TAGS)
            .analyze();
          expect(
            reportViolations(results.violations),
            `a11y issues on ${name} (${theme}, ${viewport.label})`
          ).toEqual([]);
        }
      });
    }
  }

  test("skip link is the first tab stop and moves focus to main", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("Tab");
    const skipLink = page.locator(".skip-link");
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeInViewport();

    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  });

  test("each card action is a single control, not a link wrapping a button", async ({
    page,
  }) => {
    await page.goto("/projects");
    await page.waitForLoadState("networkidle");

    // Nesting the two gave every action a duplicate tab stop and collapsed the
    // anchor's box below the 24x24 target-size minimum.
    await expect(page.locator("main a button, main button a")).toHaveCount(0);

    const action = page.locator("main a.card-action").first();
    const box = await action.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(24);
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(24);
  });

  test("mobile menu overlays the page and returns focus on close", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const hamburger = page.getByRole("button", { name: "Open menu" });
    await hamburger.click();

    const menu = page.getByRole("dialog", { name: "Menu" });
    await expect(menu).toBeVisible();

    // The page used to be unmounted while the menu was open, leaving screen
    // reader users with no content and no landmark to return to.
    await expect(page.locator("main")).toBeAttached();
    await expect(page.locator("footer")).toBeAttached();
    await expect(page.locator("h1")).toBeAttached();

    // Focus starts inside the overlay and cannot escape it.
    await expect(menu.getByRole("button", { name: "Close menu" })).toBeFocused();
    for (let i = 0; i < 8; i += 1) {
      await page.keyboard.press("Tab");
      expect(
        await page.evaluate(
          () => !!document.activeElement?.closest("#mobile-menu")
        ),
        `focus escaped the menu after ${i + 1} tabs`
      ).toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(hamburger).toBeFocused();
  });

  test("chat panel header meets contrast in both themes", async ({ page }) => {
    for (const theme of ["light", "dark"] as const) {
      await page.addInitScript((value: string) => {
        window.localStorage.setItem("theme", value);
      }, theme);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      await page.getByRole("button", { name: "Open chat" }).click();
      await expect(page.getByRole("heading", { name: "Chat with Ryan" })).toBeVisible();

      // Scoped to contrast: the panel's dialog semantics are tracked
      // separately, so a full scan of the open panel would fail for
      // unrelated reasons.
      const results = await new AxeBuilder({ page })
        .withRules(["color-contrast"])
        .analyze();
      expect(
        reportViolations(results.violations),
        `chat contrast (${theme})`
      ).toEqual([]);
    }
  });
});
