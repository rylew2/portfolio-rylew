import { expect, test } from '@playwright/test';

import { profile } from '../lib/profile';

const positioning =
  'I build reliable, accessible web applications for public-interest and regulated services, working across React, TypeScript, Python, Node.js, and AWS.';

test('home hero identifies Ryan and offers the primary next actions', async ({
  page,
}) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const hero = page.getByLabel('Page introduction');

  await expect(
    hero.getByRole('heading', { name: profile.name, exact: true, level: 1 })
  ).toHaveCount(1);
  await expect(
    hero.getByText(`${profile.role} · ${profile.location}`, { exact: true })
  ).toBeVisible();
  await expect(hero.getByText(positioning, { exact: true })).toBeVisible();

  const actions = hero.locator('.hero-actions');
  await expect(actions.getByRole('link')).toHaveCount(3);
  await expect(
    actions.getByRole('link', { name: 'View projects' })
  ).toHaveAttribute('href', '/projects');

  const resume = actions.getByRole('link', { name: 'Resume' });
  await expect(resume).toHaveAttribute('href', profile.links.resume ?? '');
  await expect(resume).toHaveAttribute('target', '_blank');
  await expect(resume).toHaveAttribute('rel', 'noreferrer');

  await expect(actions.getByRole('link', { name: 'Contact' })).toHaveAttribute(
    'href',
    `mailto:${profile.links.email}`
  );
});
