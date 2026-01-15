import { test, expect } from "@playwright/test";
import tagsJSON from "../config/tags.json";
import { getContentList, getContentWithTag } from "../lib/content";

const siteTags = new Set(tagsJSON.map((tag) => tag.tag));

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const pickTaggedEntry = (content) => {
  return content.find(
    (item) =>
      Array.isArray(item.tags) && item.tags.some((tag) => siteTags.has(tag))
  );
};

test("project tags link to the full tagged list", async ({ page }) => {
  const projects = getContentList("project");
  const taggedProject = pickTaggedEntry(projects);

  expect(taggedProject).toBeTruthy();
  if (!taggedProject) {
    throw new Error("No projects matched tags in config/tags.json.");
  }

  const tag = taggedProject.tags.find((value) => siteTags.has(value));
  if (!tag) {
    throw new Error("No project tags matched tags in config/tags.json.");
  }

  await page.goto(`/projects/${taggedProject.slug}`);
  await page.getByRole("link", { name: tag }).click();

  await expect(page).toHaveURL(
    new RegExp(`/projects/tags/${escapeRegExp(encodeURIComponent(tag))}$`),
    { timeout: 15000 }
  );

  const taggedProjects = getContentWithTag(tag, "project");
  const headings = page.locator("main article h2");

  await expect(headings).toHaveCount(taggedProjects.length);
  for (const project of taggedProjects) {
    await expect(
      page.locator("main").getByRole("heading", { name: project.title })
    ).toBeVisible();
  }
});

test("book tags link to the full tagged list", async ({ page }) => {
  const books = getContentList("book");
  const taggedBook = pickTaggedEntry(books);

  expect(taggedBook).toBeTruthy();
  if (!taggedBook) {
    throw new Error("No books matched tags in config/tags.json.");
  }

  const tag = taggedBook.tags.find((value) => siteTags.has(value));
  if (!tag) {
    throw new Error("No book tags matched tags in config/tags.json.");
  }

  await page.goto(`/books/${taggedBook.slug}`);
  await page.getByRole("link", { name: tag }).click();

  await expect(page).toHaveURL(
    new RegExp(`/books/tags/${escapeRegExp(encodeURIComponent(tag))}$`),
    { timeout: 15000 }
  );

  const taggedBooks = getContentWithTag(tag, "book");
  const headings = page.locator("main article h2");

  await expect(headings).toHaveCount(taggedBooks.length);
  for (const book of taggedBooks) {
    await expect(
      page.locator("main").getByRole("heading", { name: book.title })
    ).toBeVisible();
  }
});

test("all content tags exist in config/tags.json", async () => {
  const projects = getContentList("project");
  const books = getContentList("book");
  const contentTags = new Set(
    [...projects, ...books].flatMap((item) =>
      Array.isArray(item.tags) ? item.tags : []
    )
  );

  for (const tag of contentTags) {
    expect(siteTags.has(tag)).toBeTruthy();
  }
});
