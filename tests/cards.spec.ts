import { test, expect, type Page } from '@playwright/test';
import { getContentList } from '../lib/content';

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const cardFor = (page: Page, title: string) =>
  page
    .locator('main article')
    .filter({ has: page.getByRole('heading', { name: title }) })
    .first();

test('clicking a card description opens the article', async ({ page }) => {
  const project = getContentList('project').find(
    (item) => item.slug && item.title && item.description
  );

  if (!project) {
    throw new Error('No project has both a title and a description.');
  }

  await page.goto('/projects');

  const card = cardFor(page, project.title!);
  const description = card.locator('p').first();
  await expect(description).toBeVisible();

  // Click the description's coordinates rather than the element. The <p> is
  // not a link and never receives the event -- the stretched overlay sits on
  // top of it, which is exactly the behaviour under test. Locator.click()
  // would fail its actionability check here for that reason.
  const box = await description.boundingBox();
  if (!box) {
    throw new Error('The card description has no bounding box.');
  }

  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

  await expect(page).toHaveURL(
    new RegExp(`/projects/${escapeRegExp(project.slug!)}$`)
  );
});

test('card action buttons stay clickable above the stretched link', async ({
  page,
}) => {
  const project = getContentList('project').find(
    (item) => item.sourceCode && item.title
  );

  if (!project) {
    throw new Error('No project has a sourceCode link.');
  }

  await page.goto('/projects');

  const source = cardFor(page, project.title!).getByRole('link', {
    name: `${project.title} source code`,
  });

  await expect(source).toHaveAttribute('href', project.sourceCode!);

  // A trial click runs Playwright's actionability checks without navigating.
  // It fails if the card-wide overlay intercepts the pointer, which is the
  // regression this guards against.
  await source.click({ trial: true });
});

test('SenseCourse card links to its presentation without a demo action', async ({
  page,
}) => {
  await page.goto('/projects');

  const card = cardFor(page, 'SenseCourse');
  const presentation = card.getByRole('link', {
    name: 'SenseCourse presentation',
  });

  await expect(presentation).toHaveAttribute(
    'href',
    'https://www.youtube.com/watch?v=LqpXGfcWBt0'
  );
  await expect(
    card.getByRole('link', { name: 'SenseCourse demo' })
  ).toHaveCount(0);
});

test('each card exposes a single link to its article', async ({ page }) => {
  await page.goto('/projects');

  const cards = page.locator('main article');
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);

  for (let index = 0; index < count; index += 1) {
    const articleLinks = cards.nth(index).locator('a[href^="/projects/"]');
    await expect(articleLinks).toHaveCount(1);
  }
});
