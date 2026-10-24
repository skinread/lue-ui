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
