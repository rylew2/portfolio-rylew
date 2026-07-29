import { expect, test } from '@playwright/test';
import sharp from 'sharp';

const GLOBAL_TITLE = 'Ryan Lewis | Senior Software Engineer';
const GLOBAL_DESCRIPTION =
  'Senior software engineer in Brooklyn building accessible, maintainable web applications with React, TypeScript, Python, and Node.js.';
const GLOBAL_SOCIAL_IMAGE = 'https://www.rylew.dev/images/social-preview.png';

test('homepage exposes accurate global positioning and a large social preview', async ({
  page,
  request,
}) => {
  await page.goto('/');

  await expect(page).toHaveTitle(GLOBAL_TITLE);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    GLOBAL_TITLE
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    GLOBAL_DESCRIPTION
  );

  const keywords = page.locator('meta[name="keywords"]');
  await expect(keywords).toHaveAttribute('content', /Brooklyn/);
  await expect(keywords).not.toHaveAttribute('content', /San Francisco/);

  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    GLOBAL_SOCIAL_IMAGE
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    'content',
    'summary_large_image'
  );
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    'content',
    GLOBAL_SOCIAL_IMAGE
  );

  const imageResponse = await request.get(
    new URL(GLOBAL_SOCIAL_IMAGE).pathname
  );
  expect(imageResponse.status()).toBe(200);
  expect(imageResponse.headers()['content-type']).toMatch(/^image\/png\b/i);

  const imageMetadata = await sharp(await imageResponse.body()).metadata();
  expect(imageMetadata).toMatchObject({
    format: 'png',
    width: 1200,
    height: 630,
  });
});
