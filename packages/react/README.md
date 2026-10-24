# Lue UI React

Thin React 19 adapters that render exactly the HTML core's markup ([ADR-0001](../../docs/architecture/adr/0001-component-model.md)).
Private for now.

```tsx
import '@lue-ui/tokens/tokens.css';
import '@lue-ui/css';
import { Button, Field, TextInput } from '@lue-ui/react';
```

| Component | Contract |
| --- | --- |
| `Button` | [button.json](../../apps/docs/contracts/button.json) |
| `Field`, `TextInput`, `ErrorSummary`, `useValidation` | [field.json](../../apps/docs/contracts/field.json) |
| `Select` | [select.json](../../apps/docs/contracts/select.json) |
| `Dialog`, `DialogTrigger` | [dialog.json](../../apps/docs/contracts/dialog.json) |
| `Menu`, `MenuTrigger`, `MenuItem`, `LueElements` | [menu.json](../../apps/docs/contracts/menu.json) |

- **Server rendering works**; components with state or effects are marked `'use client'`. Mount `<LueElements />` once
  to register the custom elements after hydration.
- **No portals,** and Dialog opens with `showModal()`, never React's `open` attribute.
- Adapters never render `data-lue-*` behaviour markers; they do the same work with state.

Build: `pnpm --filter @lue-ui/react build` (`tools/build-js.mjs`): `tsc` per file with declarations, so `'use client'`
survives, and a 1 KB budget per adapter (Brotli, React excluded). Subpaths: `@lue-ui/react/button`, `…/dialog`, and so on.
