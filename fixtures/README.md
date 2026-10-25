# Consumer fixtures

Three small apps that install `@lue-ui/tokens` and `@lue-ui/css` the way a consumer would, build with their default
CSS pipeline, and check that our CSS comes out unlowered ([ADR-0002](../docs/architecture/adr/0002-native-css-core-tailwind-bridge.md),
RFC-0001 §9). CI runs them on every push; a failure blocks.

```bash
pnpm build && pnpm fixtures
```

| Fixture | Pipeline | Recipe |
| --- | --- | --- |
| `vite` | Vite 8 defaults (Lightning CSS minify) | `import '@lue-ui/tokens/tokens.css'; import '@lue-ui/css'; import '@lue-ui/css/fonts.css';` (with `--fonts`, the check also wants every font URL to resolve to an emitted file) |
| `tailwind` | Vite 8 + `@tailwindcss/vite` 4 | `@import "tailwindcss"; @import "@lue-ui/tokens/tokens.css"; @import "@lue-ui/tokens/tailwind.css"; @import "@lue-ui/css" layer(components);` |
| `next` | Next 16 App Router, Turbopack | The Vite recipe in `app/layout.tsx`, plus `"browserslist": ["baseline newly available"]`. Also renders every React adapter from `@lue-ui/react`'s built `dist`: a server component and a `'use client'` island, so a server-unsafe import or a lost `'use client'` fails `next build` |

`check.js` fails unless the built CSS keeps: the layer order (checked as the order in which layer names first appear,
since minifiers split our one statement), colours as `oklch()`, fluid sizes in `vi`, the zero-specificity OS-theme
selector, the increased-contrast media query, `@property --lue-angle`, component CSS with logical properties - and has
no `light-dark()` and no colour token lowered to `rgb()` or hex. With `--tailwind` it also wants a utility that reads our
variables and Lue inside Tailwind's `components` layer.

## What the fixtures found (2026-10-24)

- **Next lowers colours by default.** With no browserslist, Next's CSS pipeline rewrites every `oklch()` token to hex
  plus an `@supports (color: lab(…))` copy. A Baseline browserslist (`baseline newly available`) stops it. This is the
  "ship a browserslist config" item in RFC-0001 §9.
- **TypeScript rejected `import '@lue-ui/css'`** (a side-effect import of a module without types). `@lue-ui/css` now
  has a `types` condition pointing at an empty `lue.d.ts`.
- **Minifiers split the layer statement** (ours and Vite's are both Lightning CSS), but keep each name in place, so the
  order holds. Our own files re-add the full statement after minifying.
- **Vite adds `-webkit-` prefixes** (`-webkit-backdrop-filter`, `-webkit-mask`), and so does Next without a browserslist. They're additions, not
  rewrites, so the check only notes them.
