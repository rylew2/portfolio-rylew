import { expect, test } from '@playwright/test';

test("homepage hero presents Ryan's identity and primary routes", async ({
  page,
}) => {
  await page.goto('/');

  const hero = page.getByLabel('Page introduction');
  const heading = page.getByRole('heading', { level: 1 });

  await expect(heading).toHaveCount(1);
  await expect(heading).toHaveText('Ryan Lewis');
  await expect(
    hero.getByText('Senior Software Engineer · Brooklyn, New York', {
      exact: true,
    })
  ).toBeVisible();
  await expect(
    hero.getByText(
      'I build accessible, maintainable digital services with React, TypeScript, Python, and Node.js.',
      { exact: true }
    )
  ).toBeVisible();

  await expect(
    hero.getByRole('link', { name: 'View projects', exact: true })
  ).toHaveAttribute('href', '/projects');
  await expect(
    hero.getByRole('link', { name: 'Resume', exact: true })
  ).toHaveAttribute('href', '/Ryan-Lewis-Resume.pdf');
  await expect(
    hero.getByRole('link', { name: 'Contact', exact: true })
  ).toHaveAttribute('href', 'mailto:ryanlewis312@gmail.com');
});
