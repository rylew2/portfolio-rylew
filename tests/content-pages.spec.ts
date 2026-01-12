import { test, expect } from "@playwright/test";
import { getContentList } from "../lib/content";

const expectContentPage = async (
  page,
  url: string,
  contentType: "book" | "project"
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

test("books page lists all book items", async ({ page }) => {
  await expectContentPage(page, "/books", "book");
});

test("home page lists selected works", async ({ page }) => {
  const projects = getContentList("project");
  const books = getContentList("book");
  const selectedProjects = projects.filter((project) => project.selectedWork);
  const selectedBooks = books.filter((book) => book.selectedWork);
  const selectedWorks = [...selectedProjects, ...selectedBooks];
  const titles = selectedWorks.map((work) => work.title);

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
