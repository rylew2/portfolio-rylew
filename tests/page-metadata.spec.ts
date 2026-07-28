import { expect, test, type Page } from '@playwright/test';

const SITE_ORIGIN = 'https://www.rylew.dev';
const SOCIAL_IMAGE = `${SITE_ORIGIN}/Logo.png`;
const SITE_DESCRIPTION = 'Ryan Lewis Portfolio';

interface MetadataExpectation {
  name: string;
  route: string;
  canonicalPath: string;
  title: string;
  description: string;
  type: 'website' | 'article';
}

const staticPages: MetadataExpectation[] = [
  {
    name: 'homepage',
    route: '/',
    canonicalPath: '/',
    title: 'Ryan Lewis Portfolio',
    description: SITE_DESCRIPTION,
    type: 'website',
  },
  {
    name: 'static about page',
    route: '/about',
    canonicalPath: '/about',
    title: 'About',
    description:
      'Senior Software Engineer based in Brooklyn, New York. Experience, education, and the tools I build with.',
    type: 'website',
  },
  {
    name: 'static projects page',
    route: '/projects',
    canonicalPath: '/projects',
    title: 'Projects',
    description:
      'Projects covering front end, machine learning, school associated courses, and research topics',
    type: 'website',
  },
  {
    name: 'static books page',
    route: '/books',
    canonicalPath: '/books',
    title: 'Books',
    description: 'Books covering a variety of topics',
    type: 'website',
  },
];

const dynamicPages: MetadataExpectation[] = [
  {
    name: 'project detail page',
    route: '/projects/cardgame',
    canonicalPath: '/projects/cardgame',
    title: 'Card Game',
    description: 'Building a fullstack React/GraphQL/Django card game',
    type: 'article',
  },
  {
    name: 'book detail page',
    route: '/books/accelerate',
    canonicalPath: '/books/accelerate',
    title: 'Accelerate: The Science of Lean Software and DevOps Review',
    description:
      'A practical, evidence-backed review of the definitive DevOps and software delivery performance book.',
    type: 'article',
  },
  {
    name: 'project tag page',
    route: '/projects/tags/javascript',
    canonicalPath: '/projects/tags/javascript',
    title: 'JavaScript',
    description: 'All things javascript',
    type: 'website',
  },
  {
    name: 'book tag page',
    route: '/books/tags/management',
    canonicalPath: '/books/tags/management',
    title: 'Management',
    description: 'Everything management related',
    type: 'website',
  },
  {
    name: 'book category page',
    route: '/books/categories/weekly-notes',
    canonicalPath: '/books/categories/weekly-notes',
    title: 'Weekly Notes',
    description:
      "Weekly Notes are randomly curated links and resources of things I've learned in the past week. They include jams, podcasts and things I'm learning",
    type: 'website',
  },
];

const expectUniqueMeta = async (
  page: Page,
  selector: string,
  expectedContent: string
) => {
  const metadata = page.locator(selector);
  await expect(metadata).toHaveCount(1);
  await expect(metadata).toHaveAttribute('content', expectedContent);
};

const expectPageMetadata = async (
  page: Page,
  metadata: MetadataExpectation
) => {
  const response = await page.goto(metadata.route);
  expect(response?.ok()).toBeTruthy();

  const expectedUrl = `${SITE_ORIGIN}${metadata.canonicalPath}`;
  const canonical = page.locator('link[rel="canonical"]');

  await expect(canonical).toHaveCount(1);
  await expect(canonical).toHaveAttribute('href', expectedUrl);
  await expectUniqueMeta(page, 'meta[property="og:url"]', expectedUrl);
  await expectUniqueMeta(page, 'meta[property="og:type"]', metadata.type);
  await expectUniqueMeta(page, 'meta[name="twitter:card"]', 'summary');
  await expectUniqueMeta(page, 'meta[name="twitter:title"]', metadata.title);
  await expectUniqueMeta(
    page,
    'meta[name="twitter:description"]',
    metadata.description
  );
  await expectUniqueMeta(page, 'meta[name="twitter:image"]', SOCIAL_IMAGE);
};

for (const metadata of staticPages) {
  test(`${metadata.name} emits unique page-specific metadata`, async ({
    page,
  }) => {
    await expectPageMetadata(page, metadata);
  });
}

for (const metadata of dynamicPages) {
  test(`${metadata.name} emits unique page-specific metadata`, async ({
    page,
  }) => {
    await expectPageMetadata(page, metadata);
  });
}

test('query strings and hashes are excluded from canonical metadata', async ({
  page,
}) => {
  const metadata: MetadataExpectation = {
    name: 'projects query URL',
    route: '/projects?utm_source=metadata#selected-work',
    canonicalPath: '/projects',
    title: 'Projects',
    description:
      'Projects covering front end, machine learning, school associated courses, and research topics',
    type: 'website',
  };

  await expectPageMetadata(page, metadata);
});
