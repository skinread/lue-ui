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
| `Accordion` | [accordion.json](../../apps/docs/contracts/accordion.json) |
| `Alert` | [alert.json](../../apps/docs/contracts/alert.json) |
| `Avatar` | [avatar.json](../../apps/docs/contracts/avatar.json) |
| `Breadcrumb` | [breadcrumb.json](../../apps/docs/contracts/breadcrumb.json) |
| `Button` | [button.json](../../apps/docs/contracts/button.json) |
| `Card`, `CardLink` | [card.json](../../apps/docs/contracts/card.json) |
| `Carousel` | [carousel.json](../../apps/docs/contracts/carousel.json) |
| `ChoiceGroup`, `Checkbox` | [checkbox.json](../../apps/docs/contracts/checkbox.json) |
| `Dialog`, `DialogTrigger` | [dialog.json](../../apps/docs/contracts/dialog.json) |
| `Disclosure` | [disclosure.json](../../apps/docs/contracts/disclosure.json) |
| `Divider` | [divider.json](../../apps/docs/contracts/divider.json) |
| `Drawer` | [drawer.json](../../apps/docs/contracts/drawer.json) |
| `Field`, `TextInput`, `ErrorSummary`, `useValidation` | [field.json](../../apps/docs/contracts/field.json) |
| `Icon` | [icon.json](../../apps/docs/contracts/icon.json) |
| `Kbd` | [kbd.json](../../apps/docs/contracts/kbd.json) |
| `Stack`, `Cluster`, `Grid`, `Sidebar`, `Switcher`, `Center` | [layout.json](../../apps/docs/contracts/layout.json) |
| `Link` | [link.json](../../apps/docs/contracts/link.json) |
| `Menu`, `MenuTrigger`, `MenuItem`, `LueElements` | [menu.json](../../apps/docs/contracts/menu.json) |
| `Pagination` | [pagination.json](../../apps/docs/contracts/pagination.json) |
| `Popover`, `PopoverTrigger` | [popover.json](../../apps/docs/contracts/popover.json) |
| `Progress`, `Meter` | [progress.json](../../apps/docs/contracts/progress.json) |
| `QuantityStepper` | [quantity-stepper.json](../../apps/docs/contracts/quantity-stepper.json) |
| `ChoiceGroup`, `Radio` | [radio-group.json](../../apps/docs/contracts/radio-group.json) |
| `Rating` | [rating.json](../../apps/docs/contracts/rating.json) |
| `Search` | [search.json](../../apps/docs/contracts/search.json) |
| `SegmentedControl` | [segmented-control.json](../../apps/docs/contracts/segmented-control.json) |
| `Select` | [select.json](../../apps/docs/contracts/select.json) |
| `SkipLink` | [skip-link.json](../../apps/docs/contracts/skip-link.json) |
| `Spinner`, `Skeleton` | [spinner.json](../../apps/docs/contracts/spinner.json) |
| `SwatchPicker` | [swatch-picker.json](../../apps/docs/contracts/swatch-picker.json) |
| `Switch` | [switch.json](../../apps/docs/contracts/switch.json) |
| `Table` | [table.json](../../apps/docs/contracts/table.json) |
| `Tabs` | [tabs.json](../../apps/docs/contracts/tabs.json) |
| `Tag` | [tag.json](../../apps/docs/contracts/tag.json) |
| `Textarea` | [textarea.json](../../apps/docs/contracts/textarea.json) |
| `ToastRegion`, `showToast` | [toast.json](../../apps/docs/contracts/toast.json) |
| `ToggleButton` | [toggle-button.json](../../apps/docs/contracts/toggle-button.json) |
| `Toggletip` | [toggletip.json](../../apps/docs/contracts/toggletip.json) |
| `Toolbar` | [toolbar.json](../../apps/docs/contracts/toolbar.json) |
| `Tooltip`, `tooltipTrigger` | [tooltip.json](../../apps/docs/contracts/tooltip.json) |
| `VisuallyHidden` | [visually-hidden.json](../../apps/docs/contracts/visually-hidden.json) |

- **Server rendering works**; components with state or effects are marked `'use client'`. Mount `<LueElements />` once
  to register the custom elements after hydration.
- **No portals,** and Dialog opens with `showModal()`, never React's `open` attribute.
- Adapters never render `data-lue-*` behaviour markers; they do the same work with state.
- **Every prop is documented in JSDoc**, and react-docgen reads it: it's the props table on each component's Storybook
  docs page and on its Markdown page (`pnpm docs-ai`). A new prop needs a JSDoc comment, or `pnpm docs-ai` fails. Other
  props go to the element the adapter renders (`className` adds to its class).

Build: `pnpm --filter @lue-ui/react build` (`tools/build-js.mjs`): `tsc` per file with declarations, so `'use client'`
survives, and a 1 KB budget per adapter (Brotli, React excluded). Subpaths: `@lue-ui/react/button`, `…/dialog`, and so on.
