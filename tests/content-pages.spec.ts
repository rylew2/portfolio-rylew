import { test, expect } from "@playwright/test";
import { getContentList } from "../lib/content";

const expectContentPage = async (
  page,
  url: string,
  contentType: "blog" | "notes" | "project"
) => {
  const content = getContentList(contentType);
  const titles = content.map((item) => item.title);

  await page.goto(url);

  const headingLocator = page.locator("main article h2");
  await expect(headingLocator).toHaveCount(titles.length);

  for (const title of titles) {
    await expect(
      page.locator("main").getByRole("heading", { name: title })
    ).toBeVisible();
  }
};

test("projects page lists all project items", async ({ page }) => {
  await expectContentPage(page, "/projects", "project");
});

test("blog page lists all blog items", async ({ page }) => {
  await expectContentPage(page, "/blog", "blog");
});

test("notes page lists all note items", async ({ page }) => {
  await expectContentPage(page, "/notes", "notes");
});

test("home page lists selected projects", async ({ page }) => {
  const projects = getContentList("project");
  const selectedProjects = projects.filter((project) => project.selectedWork);
  const titles = selectedProjects.map((project) => project.title);

  await page.goto("/");

  const headingLocator = page.locator("main article h2");
  await expect(headingLocator).toHaveCount(titles.length);

  for (const title of titles) {
    await expect(
      page.locator("main").getByRole("heading", { name: title })
    ).toBeVisible();
  }
});

test("about page renders", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { name: "About Me" })).toBeVisible();
});
