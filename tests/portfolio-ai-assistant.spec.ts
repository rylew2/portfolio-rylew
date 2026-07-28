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
