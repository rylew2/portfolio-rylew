import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { Result } from 'axe-core';

const openChat = async (page: import('@playwright/test').Page) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const launcher = page.getByRole('button', { name: 'Open chat' });
  await launcher.click();

  return launcher;
};

const seriousViolations = (violations: Result[]) =>
  violations
    .filter(({ impact }) => impact === 'serious' || impact === 'critical')
    .map(({ id, impact, help, nodes }) => ({
      id,
      impact,
      help,
      targets: nodes.map((node) => node.target),
    }));

test.describe('chat widget accessibility', () => {
  test('opens a named modal dialog and restores launcher focus on Escape', async ({
    page,
  }) => {
    const launcher = await openChat(page);
    const dialog = page.getByRole('dialog', { name: 'Chat with Ryan' });

    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(launcher).toHaveCount(0);
    await expect(
      dialog.getByRole('textbox', { name: 'Your question' })
    ).toBeFocused();

    await page.keyboard.press('Escape');

    await expect(dialog).toBeHidden();
    await expect(page.getByRole('button', { name: 'Open chat' })).toBeFocused();
  });

  test('cycles Tab and Shift+Tab within the open dialog', async ({ page }) => {
    await openChat(page);
    const dialog = page.getByRole('dialog', { name: 'Chat with Ryan' });
    const closeButton = dialog.getByRole('button', { name: 'Close chat' });
    const input = dialog.getByRole('textbox', { name: 'Your question' });
    const sendButton = dialog.getByRole('button', { name: 'Send' });

    await input.fill('Keyboard test');
    await expect(sendButton).toBeEnabled();

    await closeButton.focus();
    await page.keyboard.press('Shift+Tab');
    await expect(sendButton).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(closeButton).toBeFocused();
  });

  test('provides a visible bounded multiline composer and character count', async ({
    page,
  }) => {
    await openChat(page);
    const dialog = page.getByRole('dialog', { name: 'Chat with Ryan' });
    const label = dialog.getByText('Your question', { exact: true });
    const input = dialog.getByRole('textbox', { name: 'Your question' });

    await expect(label).toBeVisible();
    await expect(input).toHaveAttribute('maxlength', '1000');
    await expect(input).toHaveJSProperty('tagName', 'TEXTAREA');
    await expect(dialog.getByText('0 / 1000', { exact: true })).toBeVisible();

    await input.fill('Twelve chars');

    await expect(dialog.getByText('12 / 1000', { exact: true })).toBeVisible();
  });

  test('exposes added messages as a polite log and loading as status text', async ({
    page,
  }) => {
    await page.route('**/api/chat', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 750));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ response: 'Keyboard navigation is supported.' }),
      });
    });
    await openChat(page);

    const dialog = page.getByRole('dialog', { name: 'Chat with Ryan' });
    const log = dialog.getByRole('log');
    await expect(log).toHaveAttribute('aria-live', 'polite');
    await expect(log).toHaveAttribute('aria-relevant', 'additions text');

    await dialog
      .getByRole('textbox', { name: 'Your question' })
      .fill('Does the chat support keyboards?');
    await dialog.getByRole('button', { name: 'Send' }).click();

    await expect(
      log.getByText('Does the chat support keyboards?', { exact: true })
    ).toBeVisible();
    await expect(dialog.getByRole('status')).toContainText(
      /AI assistant is responding/i
    );
    await expect(
      log.getByText('Keyboard navigation is supported.', { exact: true })
    ).toBeVisible();
  });

  test('keeps focus trapped and Escape available while loading', async ({
    page,
  }) => {
    let releaseResponse = () => {};
    const responseGate = new Promise<void>((resolve) => {
      releaseResponse = resolve;
    });

    await page.route('**/api/chat', async (route) => {
      await responseGate;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ response: 'Done.' }),
      });
    });
    await openChat(page);

    const dialog = page.getByRole('dialog', { name: 'Chat with Ryan' });
    const closeButton = dialog.getByRole('button', { name: 'Close chat' });
    await dialog
      .getByRole('textbox', { name: 'Your question' })
      .fill('Keep keyboard focus safe');

    try {
      await dialog.getByRole('button', { name: 'Send' }).click();
      await expect(dialog.getByRole('status')).toBeVisible();
      await expect(closeButton).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(closeButton).toBeFocused();
      await page.keyboard.press('Shift+Tab');
      await expect(closeButton).toBeFocused();

      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
      await expect(
        page.getByRole('button', { name: 'Open chat' })
      ).toBeFocused();
    } finally {
      releaseResponse();
    }
  });

  test('uses third-person assistant and error copy', async ({ page }) => {
    await page.route('**/api/chat', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Unavailable' }),
      });
    });
    await openChat(page);

    const dialog = page.getByRole('dialog', { name: 'Chat with Ryan' });
    await expect(dialog).toContainText(
      'This AI assistant represents Ryan and can answer questions about his projects, skills, and experience.'
    );
    await expect(dialog).not.toContainText(/I['’]m an AI assistant/i);

    await dialog
      .getByRole('textbox', { name: 'Your question' })
      .fill('How can I get in touch?');
    await dialog.getByRole('button', { name: 'Send' }).click();

    await expect(dialog).toContainText(/contact Ryan directly via email/i);
    await expect(dialog).not.toContainText(/reach out to me|contact me/i);
  });

  test('preserves visitor and assistant line breaks', async ({ page }) => {
    await page.route('**/api/chat', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          response: 'First assistant line\nSecond assistant line',
        }),
      });
    });
    await openChat(page);

    const dialog = page.getByRole('dialog', { name: 'Chat with Ryan' });
    const log = dialog.getByRole('log');
    await dialog
      .getByRole('textbox', { name: 'Your question' })
      .fill('First visitor line\nSecond visitor line');
    await dialog.getByRole('button', { name: 'Send' }).click();

    const visitorMessage = log
      .locator(':scope > div')
      .filter({ hasText: /^First visitor line\s+Second visitor line$/ });
    const assistantMessage = log
      .locator(':scope > div')
      .filter({ hasText: /^First assistant line\s+Second assistant line$/ });

    await expect(visitorMessage).toHaveCount(1);
    await expect(assistantMessage).toHaveCount(1);
    await expect(visitorMessage).toHaveCSS('white-space', 'pre-wrap');
    await expect(assistantMessage).toHaveCSS('white-space', 'pre-wrap');
  });

  test('removes panel and loading-dot animation for reduced motion', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.route('**/api/chat', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 750));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ response: 'Done.' }),
      });
    });
    await openChat(page);

    const dialog = page.getByRole('dialog', { name: 'Chat with Ryan' });
    await expect(dialog).toHaveCSS('animation-name', 'none');

    await dialog
      .getByRole('textbox', { name: 'Your question' })
      .fill('Motion preference');
    await dialog.getByRole('button', { name: 'Send' }).click();

    await expect(
      dialog.getByRole('status').locator('span[aria-hidden="true"]').first()
    ).toHaveCSS('animation-name', 'none');
  });

  test('uses non-smooth scrolling when reduced motion is requested', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(() => {
      const testWindow = window as Window & {
        __chatScrollBehaviors: ScrollBehavior[];
      };
      testWindow.__chatScrollBehaviors = [];
      Element.prototype.scrollIntoView = function (
        options?: boolean | ScrollIntoViewOptions
      ) {
        testWindow.__chatScrollBehaviors.push(
          typeof options === 'object' && options.behavior
            ? options.behavior
            : 'auto'
        );
      };
    });
    await page.route('**/api/chat', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ response: 'Reduced motion respected.' }),
      });
    });
    await openChat(page);

    const dialog = page.getByRole('dialog', { name: 'Chat with Ryan' });
    await dialog
      .getByRole('textbox', { name: 'Your question' })
      .fill('How should messages scroll?');
    await dialog.getByRole('button', { name: 'Send' }).click();
    await expect(
      dialog.getByText('Reduced motion respected.', { exact: true })
    ).toBeVisible();

    await expect
      .poll(() =>
        page.evaluate(
          () =>
            (
              window as Window & {
                __chatScrollBehaviors: ScrollBehavior[];
              }
            ).__chatScrollBehaviors.length
        )
      )
      .toBeGreaterThan(0);
    const scrollBehaviors = await page.evaluate(
      () =>
        (
          window as Window & {
            __chatScrollBehaviors: ScrollBehavior[];
          }
        ).__chatScrollBehaviors
    );
    expect(scrollBehaviors.every((behavior) => behavior === 'auto')).toBe(true);
  });

  test('has no serious axe violations while open', async ({ page }) => {
    await openChat(page);
    await expect(
      page.getByRole('dialog', { name: 'Chat with Ryan' })
    ).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags([
        'wcag2a',
        'wcag2aa',
        'wcag21a',
        'wcag21aa',
        'wcag22aa',
        'best-practice',
      ])
      .analyze();

    expect(seriousViolations(results.violations)).toEqual([]);
  });
});
