import { expect, test } from '@playwright/test';

test('portfolio AI assistant project generates a detail page', async ({
  page,
}) => {
  const response = await page.goto('/projects/portfolio-ai-assistant');

  expect(response?.ok()).toBe(true);
  await expect(
    page.getByRole('heading', {
      name: 'Portfolio AI Assistant',
      exact: true,
    })
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Keyword-scored retrieval' })
  ).toBeVisible();
});

test('portfolio AI assistant detail image is descriptive, loaded, and two-to-one', async ({
  page,
}) => {
  await page.goto('/projects/portfolio-ai-assistant');

  const screenshot = page.getByRole('img', {
    name: 'Portfolio homepage with the AI assistant chat panel open',
  });
  await expect(screenshot).toBeVisible();
  await expect(screenshot).toHaveJSProperty('complete', true);

  const naturalSize = await screenshot.evaluate((image: HTMLImageElement) => ({
    width: image.naturalWidth,
    height: image.naturalHeight,
  }));
  expect(naturalSize.width).toBeGreaterThan(0);
  expect(naturalSize.height).toBeGreaterThan(0);

  const displayedSize = await screenshot.boundingBox();
  expect(displayedSize).not.toBeNull();
  const displayedRatio = displayedSize!.width / displayedSize!.height;
  expect(displayedRatio).toBeGreaterThan(1.95);
  expect(displayedRatio).toBeLessThan(2.05);
});

test('legacy project detail image keeps its fallback rendering', async ({
  page,
}) => {
  await page.goto('/projects/cardgame');

  const image = page.getByRole('img', { name: 'projectimage' });
  await expect(image).toBeVisible();
  await expect(image).toHaveAttribute('width', '1200');
  await expect(image).toHaveAttribute('height', '550');

  const responsiveStyle = await image.evaluate((element: HTMLImageElement) => ({
    width: element.style.width,
    height: element.style.height,
  }));
  expect(responsiveStyle).toEqual({ width: '', height: '' });

  const displayedSize = await image.boundingBox();
  expect(displayedSize).not.toBeNull();
  expect(displayedSize!.height).toBeGreaterThan(549);
  expect(displayedSize!.height).toBeLessThan(551);
});

test('portfolio AI assistant card appears on projects and home pages', async ({
  page,
}) => {
  for (const route of ['/projects', '/']) {
    await page.goto(route);
    const card = page.locator('main article').filter({
      has: page.getByRole('heading', {
        name: 'Portfolio AI Assistant',
        exact: true,
      }),
    });

    await expect(card).toHaveCount(1);
    await expect(
      card.getByRole('link', {
        name: 'Portfolio AI Assistant',
        exact: true,
      })
    ).toHaveAttribute('href', '/projects/portfolio-ai-assistant');
    await expect(card.locator('img')).toHaveAttribute(
      'src',
      /chat-widget-open/
    );
  }
});
