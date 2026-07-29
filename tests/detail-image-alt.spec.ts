import { expect, test } from '@playwright/test';
import { getContentList } from '../lib/content';

const detailImageCases = [
  {
    contentType: 'project',
    route: 'projects',
    imageDescription: 'project preview',
  },
  {
    contentType: 'book',
    route: 'books',
    imageDescription: 'book cover',
  },
] as const;

for (const { contentType, route, imageDescription } of detailImageCases) {
  test(`${contentType} detail image uses content-derived alt text`, async ({
    page,
  }) => {
    const item = getContentList(contentType).find(
      ({ previewImage, slug, title }) => previewImage && slug && title
    );

    expect(item).toBeDefined();
    await page.goto(`/${route}/${item!.slug}`);

    await expect(
      page.getByRole('img', {
        name: `${item!.title} ${imageDescription}`,
      })
    ).toBeVisible();
    await expect(
      page.getByRole('img', { name: /^(projectimage|bookimage)$/i })
    ).toHaveCount(0);
  });
}
