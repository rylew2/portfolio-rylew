import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { getContentList } from "../lib/content";

type AxeViolation = {
  id: string;
  impact?: string | null;
  help: string;
  nodes: Array<{ target: string[] }>;
};

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

const reportViolations = (violations: AxeViolation[]) =>
  violations.map((violation) => {
    const targets = violation.nodes
      .map((node) => node.target.join(", "))
      .join(" | ");
    return `${violation.id} (${violation.impact}) ${violation.help}\n${targets}`;
  });

test.describe("accessibility", () => {
  test.describe.configure({ timeout: 120_000 });
  const pages = buildPageList();

  test("light mode", async ({ page }) => {
    test.setTimeout(120_000);
    for (const { name, url } of pages) {
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

      const results = await new AxeBuilder({ page })
        .include("main")
        .analyze();
      expect(reportViolations(results.violations), `a11y issues on ${name}`).toEqual([]);
    }
  });

  test("dark mode", async ({ page }) => {
    test.setTimeout(120_000);
    await page.addInitScript(() => {
      window.localStorage.setItem("theme", "dark");
    });

    for (const { name, url } of pages) {
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

      const results = await new AxeBuilder({ page })
        .include("main")
        .analyze();
      expect(reportViolations(results.violations), `a11y issues on ${name} (dark mode)`).toEqual([]);
    }
  });
});
