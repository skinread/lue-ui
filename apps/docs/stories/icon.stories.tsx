import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '@lue-ui/react';

const arrow = <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />;

/**
 * Inline SVG, sized to the text and drawn in `currentColor`. Decorative by default (hidden from assistive technology);
 * give it a `label` when it means something on its own. Lue UI ships no icon set yet. Contract:
 * `apps/docs/contracts/icon.json`.
 */
const meta = {
  title: 'Components/Icon',
  component: Icon,
  args: { children: arrow },
} satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Decorative: Story = { render: (args) => <p><Icon {...args} /> Next step</p> };
export const Labelled: Story = { args: { label: 'Next step' }, render: (args) => <p><Icon {...args} /></p> };
/** Points along the line, so it flips in right-to-left text. */
export const Mirrored: Story = { args: { mirror: true }, render: (args) => <p dir="rtl" lang="ar"><Icon {...args} /> التالي</p> };
