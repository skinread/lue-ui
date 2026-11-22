import type { Meta, StoryObj } from '@storybook/react-vite';
import { Figure, Media, MediaText } from '@lue-ui/react';
import { Prism } from './support/art.js';

/** A figure beside a short passage; they stack when narrow. Contract: `apps/docs/contracts/media-text.json`. */
const meta = {
  title: 'Blocks/Media and text',
  component: MediaText,
  args: {
    kicker: 'Case study · Kiln',
    title: 'An editorial platform for a ceramics studio',
    media: <Figure caption="Kiln's journal on a phone."><Media ratio="5 / 4"><Prism /></Media></Figure>,
    actions: <a className="lue-button" href="#kiln">Read the case study</a>,
    children: <p className="lue-excerpt">Two sentences on the brief, the constraint that made it interesting, and what shipped.</p>,
  },
} satisfies Meta<typeof MediaText>;
export default meta;
type Story = StoryObj<typeof meta>;

export const MediaFirst: Story = { name: 'Media first' };
export const MediaLast: Story = { name: 'Media last', args: { mediaPosition: 'end' } };
