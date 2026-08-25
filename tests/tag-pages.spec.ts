import { test, expect } from '@playwright/test';
import tagsJSON from '../config/tags.json';
import {
  ContentListItem,
  getContentList,
  getContentWithTag,
} from '../lib/content';
import { TAG_CATEGORIES } from '../components/chips/chips';

const siteTags = new Set(tagsJSON.map((tag) => tag.tag));

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const pickTaggedEntry = (content: ContentListItem[]) => {
  return content.find((item) => item.tags.some((tag) => siteTags.has(tag)));
};

test('project tags link to the full tagged list', async ({ page }) => {
  const projects = getContentList('project');
  const taggedProject = pickTaggedEntry(projects);

  expect(taggedProject).toBeTruthy();
  if (!taggedProject) {
    throw new Error('No projects matched tags in config/tags.json.');
  }

  const tag = taggedProject.tags.find((value) => siteTags.has(value));
  if (!tag) {
    throw new Error('No project tags matched tags in config/tags.json.');
  }

  await page.goto(`/projects/${taggedProject.slug}`);
  const tagLink = page.locator('main').getByRole('link', { name: tag }).first();
  await expect(tagLink).toBeVisible();
  await Promise.all([
    page.waitForURL(
      new RegExp(`/projects/tags/${escapeRegExp(encodeURIComponent(tag))}$`),
      { timeout: 15000 }
    ),
    tagLink.click(),
  ]);

  await expect(page).toHaveURL(
    new RegExp(`/projects/tags/${escapeRegExp(encodeURIComponent(tag))}$`)
  );

  const taggedProjects = getContentWithTag(tag, 'project');
  const headings = page.locator('main article h2');

  await expect(headings).toHaveCount(taggedProjects.length);
  for (const project of taggedProjects) {
    await expect(
      page.locator('main').getByRole('heading', { name: project.title })
    ).toBeVisible();
  }
});

test('book tags link to the full tagged list', async ({ page }) => {
  test.setTimeout(60_000);
  const books = getContentList('book');
  const taggedBook = pickTaggedEntry(books);

  expect(taggedBook).toBeTruthy();
  if (!taggedBook) {
    throw new Error('No books matched tags in config/tags.json.');
  }

  const tag = taggedBook.tags.find((value) => siteTags.has(value));
  if (!tag) {
    throw new Error('No book tags matched tags in config/tags.json.');
  }

  await page.goto(`/books/${taggedBook.slug}`);
  const tagLink = page.locator('main').getByRole('link', { name: tag }).first();
  await expect(tagLink).toBeVisible();
  await Promise.all([
    page.waitForURL(
      new RegExp(`/books/tags/${escapeRegExp(encodeURIComponent(tag))}$`),
      { timeout: 45000 }
    ),
    tagLink.click(),
  ]);

  await expect(page).toHaveURL(
    new RegExp(`/books/tags/${escapeRegExp(encodeURIComponent(tag))}$`)
  );

  const taggedBooks = getContentWithTag(tag, 'book');
  const headings = page.locator('main article h2');

  await expect(headings).toHaveCount(taggedBooks.length);
  for (const book of taggedBooks) {
    await expect(
      page.locator('main').getByRole('heading', { name: book.title })
    ).toBeVisible();
  }
});

test('all content tags exist in config/tags.json', async () => {
  const projects = getContentList('project');
  const books = getContentList('book');
  const contentTags = new Set(
    [...projects, ...books].flatMap((item) => item.tags)
  );

  for (const tag of contentTags) {
    expect(siteTags.has(tag)).toBeTruthy();
  }
});

test('every tag in config/tags.json has a known category', async () => {
  for (const entry of tagsJSON) {
    expect(
      TAG_CATEGORIES,
      `tag "${entry.tag}" has category "${entry.category}"`
    ).toContain(entry.category);
  }
});

test('unused taxonomy routes return 404', async ({ request }) => {
  const unusedRoutes = [
    '/books/tags/javascript',
    '/projects/tags/management',
    '/books/categories/weekly-notes',
  ];

  for (const route of unusedRoutes) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(404);
  }
});

test('unknown taxonomy routes return 404', async ({ request }) => {
  const unknownRoutes = [
    '/books/tags/not-configured',
    '/projects/tags/not-configured',
    '/books/categories/not-configured',
  ];

  for (const route of unknownRoutes) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(404);
  }
});
