import type { Meta, StoryObj } from '@storybook/react-vite';
import { Figure, Media } from '@lue-ui/react';
import { Prism } from './support/art.js';

/** An image or a media frame with its caption. Contract: `apps/docs/contracts/figure.json`. */
const meta = {
  title: 'Blocks/Figure',
  component: Figure,
  subcomponents: { Media },
} satisfies Meta<typeof Figure>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { caption: 'Light pools where glass meets the surface.' },
  render: (args) => <Figure {...args}><Media ratio="16 / 7"><Prism /></Media></Figure>,
};
