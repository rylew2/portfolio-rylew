import { expect, test } from '@playwright/test';

test('loads the chat implementation only after launcher activation', async ({
  page,
}) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const deferredScriptRequests: string[] = [];
  page.on('request', (request) => {
    if (request.resourceType() === 'script') {
      deferredScriptRequests.push(request.url());
    }
  });

  await page.getByRole('button', { name: 'Open chat' }).click();

  await expect
    .poll(() => deferredScriptRequests.length, { timeout: 5_000 })
    .toBeGreaterThan(0);
  await expect(
    page.getByRole('dialog', { name: 'Chat with Ryan' })
  ).toBeVisible();
});
