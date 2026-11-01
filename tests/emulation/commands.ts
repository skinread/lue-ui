// Server-side browser command for the emulation tests (ADR-0005): Playwright's media emulation applies to the whole
// page, the test iframe included. Registered in vitest.config.ts.
import type { BrowserCommand } from 'vitest/node';

export interface MediaEmulation {
  colorScheme?: 'light' | 'dark' | 'no-preference' | null;
  contrast?: 'more' | 'no-preference' | null;
  forcedColors?: 'active' | 'none' | null;
  reducedMotion?: 'reduce' | 'no-preference' | null;
}

export const emulateMedia: BrowserCommand<[MediaEmulation]> = async (ctx, media) => {
  if (ctx.provider.name !== 'playwright') throw new Error('emulateMedia needs the Playwright provider');
  await (ctx as unknown as { page: { emulateMedia(m: MediaEmulation): Promise<void> } }).page.emulateMedia(media);
};

/**
 * Focuses the test's iframe from the outer page, keeping the focused element inside it. Keys go to the page's focused
 * frame; on a busy machine Firefox can leave that on the outer page, and window.focus() from inside doesn't fix it.
 */
export const focusTestFrame: BrowserCommand<[]> = async (ctx) => {
  if (ctx.provider.name !== 'playwright') return;
  const { frame } = ctx as unknown as { frame(): Promise<{ frameElement(): Promise<{ focus(): Promise<void> }> }> };
  await (await (await frame()).frameElement()).focus();
};
