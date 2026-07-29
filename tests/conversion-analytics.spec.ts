import { expect, test, type Locator, type Page } from '@playwright/test';
import { getContentList } from '../lib/content';

interface CapturedEvent {
  name: string;
  data?: Record<string, unknown>;
}

const installAnalyticsCapture = async (page: Page) => {
  await page.route('https://va.vercel-scripts.com/**', (route) =>
    route.abort()
  );
  await page.addInitScript(() => {
    const events: CapturedEvent[] = [];
    const testWindow = window as typeof window & {
      __conversionEvents: CapturedEvent[];
    };

    testWindow.__conversionEvents = events;
    testWindow.va = (command, payload) => {
      if (
        command === 'event' &&
        payload &&
        typeof payload === 'object' &&
        'name' in payload
      ) {
        events.push(payload as CapturedEvent);
      }
    };
  });
};

const getEvents = (page: Page) =>
  page.evaluate(
    () =>
      (
        window as typeof window & {
          __conversionEvents?: CapturedEvent[];
        }
      ).__conversionEvents ?? []
  );

const clickWithoutNavigation = async (locator: Locator) => {
  await locator.evaluate((element) => {
    element.addEventListener('click', (event) => event.preventDefault(), {
      capture: true,
      once: true,
    });
  });
  await locator.click();
};

test.beforeEach(async ({ page }) => {
  await installAnalyticsCapture(page);
});

test('tracks resume and contact conversions at their interaction sources', async ({
  page,
}) => {
  await page.goto('/about');

  await clickWithoutNavigation(
    page.locator('nav').getByRole('link', { name: 'Resume' })
  );
  await clickWithoutNavigation(
    page.getByRole('main').getByRole('link', { name: 'Résumé (PDF)' })
  );
  await clickWithoutNavigation(
    page.getByRole('contentinfo').getByRole('link', { name: 'linkedin' })
  );
  await clickWithoutNavigation(
    page.getByRole('contentinfo').getByRole('link', { name: 'email' })
  );

  await expect
    .poll(() => getEvents(page))
    .toEqual([
      {
        name: 'resume_download',
        data: { location: 'navigation' },
      },
      {
        name: 'resume_download',
        data: { location: 'about' },
      },
      {
        name: 'contact_click',
        data: { channel: 'linkedin', location: 'footer' },
      },
      {
        name: 'contact_click',
        data: { channel: 'email', location: 'footer' },
      },
    ]);
});

test('tracks project detail, demo, and source visits without changing links', async ({
  page,
}) => {
  test.slow();
  const project = getContentList('project').find(
    (item) =>
      item.slug &&
      item.title &&
      item.liveSite &&
      item.sourceCode &&
      item.path === 'projects'
  );

  if (!project) {
    throw new Error('No project has detail, demo, and source destinations.');
  }

  await page.goto('/projects');
  const card = page
    .locator('main article')
    .filter({ has: page.getByRole('heading', { name: project.title! }) })
    .first();

  const detail = card.getByRole('link', {
    name: project.title!,
    exact: true,
  });
  const demo = card.getByRole('link', { name: `${project.title} demo` });
  const source = card.getByRole('link', {
    name: `${project.title} source code`,
  });

  await expect(detail).toHaveAttribute('href', `/projects/${project.slug}`);
  await expect(demo).toHaveAttribute('href', project.liveSite!);
  await expect(source).toHaveAttribute('href', project.sourceCode!);

  await clickWithoutNavigation(detail);
  await clickWithoutNavigation(demo);
  await clickWithoutNavigation(source);

  await expect
    .poll(() => getEvents(page))
    .toEqual([
      {
        name: 'project_visit',
        data: {
          destination: 'detail',
          location: 'card',
          project_slug: project.slug,
        },
      },
      {
        name: 'project_visit',
        data: {
          destination: 'demo',
          location: 'card',
          project_slug: project.slug,
        },
      },
      {
        name: 'project_visit',
        data: {
          destination: 'source',
          location: 'card',
          project_slug: project.slug,
        },
      },
    ]);

  await page.goto(`/projects/${project.slug}`);
  const projectCallouts = page.locator('main blockquote');
  const detailDemo = projectCallouts.getByRole('link', {
    name: /^Demo:/,
  });
  const detailSource = projectCallouts.getByRole('link', {
    name: /^Source Code:/,
  });

  await expect(detailDemo).toHaveAttribute('href', project.liveSite!);
  await expect(detailSource).toHaveAttribute('href', project.sourceCode!);

  await clickWithoutNavigation(detailDemo);
  await clickWithoutNavigation(detailSource);

  await expect
    .poll(() => getEvents(page))
    .toEqual([
      {
        name: 'project_visit',
        data: {
          destination: 'demo',
          location: 'project_detail',
          project_slug: project.slug,
        },
      },
      {
        name: 'project_visit',
        data: {
          destination: 'source',
          location: 'project_detail',
          project_slug: project.slug,
        },
      },
    ]);
});

test('tracks chat opens and only successful submissions without visitor text', async ({
  page,
}) => {
  await page.route('**/api/chat', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ response: 'A safe response.' }),
    })
  );
  await page.goto('/');

  await page.getByRole('button', { name: 'Open chat' }).click();
  const question = 'PRIVATE ANALYTICS TEST QUESTION';
  await page.getByLabel('Your question').fill(question);
  await page.getByLabel('Your question').press('Enter');
  await expect(
    page.getByText('A safe response.', { exact: true })
  ).toBeVisible();

  await page.unroute('**/api/chat');
  await page.route('**/api/chat', (route) =>
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Unavailable' }),
    })
  );
  const failedQuestion = 'SECOND PRIVATE ANALYTICS TEST QUESTION';
  await page.getByLabel('Your question').fill(failedQuestion);
  await page.getByLabel('Your question').press('Enter');
  await expect(
    page.getByText(/assistant is having trouble connecting/i)
  ).toBeVisible();

  const events = await getEvents(page);
  expect(events).toEqual([
    { name: 'chat_open' },
    { name: 'chat_submit_success' },
  ]);
  expect(JSON.stringify(events)).not.toContain(question);
  expect(JSON.stringify(events)).not.toContain(failedQuestion);
});
