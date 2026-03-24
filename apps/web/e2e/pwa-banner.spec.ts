import { test, expect, type Browser, type BrowserContext, type Page } from '@playwright/test';

const E2E_HEADERS = {
  'x-e2e-bypass': '1',
};

const IOS_SAFARI_USER_AGENT = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';

async function createIosSafariPage(
  browser: Browser,
  baseURL: string
): Promise<{ context: BrowserContext; page: Page }> {
  const context = await browser.newContext({
    userAgent: IOS_SAFARI_USER_AGENT,
    extraHTTPHeaders: E2E_HEADERS,
  });
  const page = await context.newPage();

  await page.addInitScript(() => {
    Object.defineProperty(window.navigator, 'standalone', {
      configurable: true,
      value: false,
    });

    const originalMatchMedia = window.matchMedia.bind(window);
    window.matchMedia = ((query: string) => {
      if (query === '(display-mode: standalone)') {
        return {
          matches: false,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        } as MediaQueryList;
      }

      return originalMatchMedia(query);
    }) as typeof window.matchMedia;
  });

  await page.goto(`${baseURL}/`);
  return { context, page };
}

test('iPhone Safari users see Add to Home Screen instructions', async ({ browser, baseURL }) => {
  const { context, page } = await createIosSafariPage(browser, baseURL!);

  await expect(
    page.getByText('On iPhone Safari, tap Share, then Add to Home Screen to install Gymmer.')
  ).toBeVisible();

  await context.close();
});

test('shows install button when the browser exposes an install prompt', async ({ page }) => {
  await page.goto('/');

  await page.evaluate(() => {
    window.localStorage.removeItem('gymmer_pwa_install_dismissed');
    (window as Window & { __installPromptCalls?: number }).__installPromptCalls = 0;

    const installEvent = new Event('beforeinstallprompt', { cancelable: true }) as Event & {
      prompt: () => Promise<void>;
      userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
    };

    installEvent.prompt = async () => {
      (window as Window & { __installPromptCalls?: number }).__installPromptCalls = (
        (window as Window & { __installPromptCalls?: number }).__installPromptCalls ?? 0
      ) + 1;
    };
    installEvent.userChoice = Promise.resolve({ outcome: 'accepted', platform: 'web' });

    window.dispatchEvent(installEvent);
  });

  await page.getByRole('button', { name: 'Install' }).click();

  await expect.poll(async () => (
    page.evaluate(() => (window as Window & { __installPromptCalls?: number }).__installPromptCalls ?? 0)
  )).toBe(1);

  await expect(page.getByRole('button', { name: 'Install' })).toHaveCount(0);
});

test('shows offline status when connectivity drops', async ({ page, context }) => {
  await page.goto('/');

  await context.setOffline(true);
  await page.evaluate(() => {
    window.dispatchEvent(new Event('offline'));
  });

  await expect(
    page.getByText('You\'re offline. Gymmer\'s cached shell is available, but live data and edits still need a connection.')
  ).toBeVisible();

  await context.setOffline(false);
});

test('shows reload banner when a service worker update is available', async ({ page }) => {
  await page.goto('/');

  await page.evaluate(() => {
    const waitingWorker = {
      postMessage: (message: unknown) => {
        (window as Window & { __lastSkipWaitingMessage?: unknown }).__lastSkipWaitingMessage = message;
      },
    };

    window.dispatchEvent(new CustomEvent('pwa-update-available', {
      detail: {
        registration: {
          waiting: waitingWorker,
        },
      },
    }));
  });

  await expect(
    page.getByText('A new version of Gymmer is ready. Reload to update the app shell.')
  ).toBeVisible();

  await page.getByRole('button', { name: 'Reload' }).click();

  await expect.poll(async () => (
    page.evaluate(() => (window as Window & { __lastSkipWaitingMessage?: unknown }).__lastSkipWaitingMessage)
  )).toEqual({ type: 'SKIP_WAITING' });
});
