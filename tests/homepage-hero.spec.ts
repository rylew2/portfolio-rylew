import { expect, test } from '@playwright/test';

import { profile } from '../lib/profile';

const positioning =
  'I build reliable, accessible web applications for public-interest and regulated services, working across React, TypeScript, Python, Node.js, and AWS.';

const relativeLuminance = (color: string) => {
  const channels = color
    .match(/\d+(\.\d+)?/g)
    ?.slice(0, 3)
    .map(Number);
  if (!channels || channels.length !== 3) {
    throw new Error(`Unable to parse computed color: ${color}`);
  }

  const [red, green, blue] = channels.map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

const contrastRatio = (foreground: string, background: string) => {
  const lighter = Math.max(
    relativeLuminance(foreground),
    relativeLuminance(background)
  );
  const darker = Math.min(
    relativeLuminance(foreground),
    relativeLuminance(background)
  );

  return (lighter + 0.05) / (darker + 0.05);
};

test('home hero identifies Ryan and offers the primary next actions', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const hero = page.getByLabel('Page introduction');

  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(
    hero.getByRole('heading', { name: profile.name, exact: true, level: 1 })
  ).toHaveCount(1);
  await expect(
    hero.getByText(`${profile.role} · ${profile.location}`, { exact: true })
  ).toBeVisible();
  await expect(hero.getByText(positioning, { exact: true })).toBeVisible();

  const actions = hero.locator('.hero-actions');
  const actionLinks = actions.getByRole('link');
  await expect(actionLinks).toHaveCount(3);
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

  const actionBox = await actions.boundingBox();
  expect(actionBox).not.toBeNull();

  let previousBottom = 0;
  for (const action of await actionLinks.all()) {
    const box = await action.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs((box?.width ?? 0) - (actionBox?.width ?? 0))).toBeLessThan(
      1
    );
    expect(box?.y ?? 0).toBeGreaterThanOrEqual(previousBottom);
    previousBottom = (box?.y ?? 0) + (box?.height ?? 0);
  }

  for (const action of await actionLinks.all()) {
    let reachedAction = false;
    for (let tabCount = 0; tabCount < 20; tabCount += 1) {
      await page.keyboard.press('Tab');
      if (
        await action.evaluate((element) => element === document.activeElement)
      ) {
        reachedAction = true;
        break;
      }
    }

    expect(reachedAction).toBe(true);
    await expect(action).toBeFocused();
    const focusStyle = await action.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        outlineStyle: style.outlineStyle,
        outlineWidth: Number.parseFloat(style.outlineWidth),
      };
    });
    expect(focusStyle.outlineStyle).not.toBe('none');
    expect(focusStyle.outlineWidth).toBeGreaterThanOrEqual(2);
  }
});

test('primary hero action meets contrast in dark mode', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('theme', 'dark');
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  const colors = await page
    .getByLabel('Primary actions')
    .getByRole('link', { name: 'View projects' })
    .evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        background: style.backgroundColor,
        foreground: style.color,
      };
    });

  expect(
    contrastRatio(colors.foreground, colors.background)
  ).toBeGreaterThanOrEqual(4.5);
});
