import { expect, test } from '@playwright/test';

test('the removed hello API returns not found', async ({ request }) => {
  const response = await request.get('/api/hello');

  expect(response.status()).toBe(404);
});

test('pages include the low-risk security headers', async ({ request }) => {
  const response = await request.get('/');
  const headers = response.headers();

  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
});
