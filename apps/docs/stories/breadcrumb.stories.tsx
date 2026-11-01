import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumb } from '@lue-ui/react';

/**
 * Where the page sits: a named `<nav>` with an ordered list of links, the last marked `aria-current="page"`. The
 * separators aren't read. Contract: `apps/docs/contracts/breadcrumb.json`.
 */
const meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  args: { items: [{ label: 'Home', href: '#home' }, { label: 'Work', href: '#work' }, { label: 'Loom', href: '#loom' }] },
} satisfies Meta<typeof Breadcrumb>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
