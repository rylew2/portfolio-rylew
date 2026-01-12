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

test("blog tags link to the full tagged list", async ({ page }) => {
  const posts = getContentList("blog");
  const taggedPost = pickTaggedEntry(posts);

  expect(taggedPost).toBeTruthy();
  if (!taggedPost) {
    throw new Error("No blog posts matched tags in config/tags.json.");
  }

  const tag = taggedPost.tags.find((value) => siteTags.has(value));
  if (!tag) {
    throw new Error("No blog tags matched tags in config/tags.json.");
  }

  await page.goto(`/blog/${taggedPost.slug}`);
  await page.getByRole("link", { name: tag }).click();

  await expect(page).toHaveURL(
    new RegExp(`/blog/tags/${escapeRegExp(encodeURIComponent(tag))}$`),
    { timeout: 15000 }
  );

  const taggedPosts = getContentWithTag(tag, "blog");
  const headings = page.locator("main article h2");

  await expect(headings).toHaveCount(taggedPosts.length);
  for (const post of taggedPosts) {
    await expect(
      page.locator("main").getByRole("heading", { name: post.title })
    ).toBeVisible();
  }
});
