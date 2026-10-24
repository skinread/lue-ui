// Vite handles CSS imports in tests.
declare module '*.css';

// Vite's import.meta.glob, used by the markup test to find every story.
interface ImportMeta {
  glob<T>(pattern: string, options: { eager: true }): Record<string, T>;
}
