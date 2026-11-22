import type { Meta, StoryObj } from '@storybook/react-vite';
import { Figure, Hero, Media } from '@lue-ui/react';
import { Prism, Satin } from './support/art.js';

/**
 * A page's opening statement, named by its h1: kicker, headline, lede and actions beside an object. With a figure as
 * the object it is the split hero; `layout="center"` for a single message. Contract: `apps/docs/contracts/hero.json`.
 */
const meta = {
  title: 'Blocks/Hero',
  component: Hero,
  args: {
    kicker: 'Design and engineering studio',
    title: 'Interfaces that hold their light.',
    lede: 'Lue Studio designs and builds accessible, platform-native products - calm to use, alive to touch.',
    actions: (
      <>
        <a className="lue-button" data-variant="primary" data-size="lg" href="#work">View selected work</a>
        <a className="lue-button" data-size="lg" href="#journal">Read the journal</a>
      </>
    ),
  },
} satisfies Meta<typeof Hero>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Statement: Story = { args: { backdrop: <Satin />, object: <Prism /> } };

/** A case study's opener: the object is a figure, with its caption. */
export const Split: Story = {
  args: {
    kicker: 'Case study · Loom',
    title: 'A design system that catches the light',
    lede: 'A weaving journal needed one system for web and print; we built it on the platform.',
    object: <Figure caption="The Loom journal's home page."><Media ratio="5 / 4"><Prism /></Media></Figure>,
  },
};

export const Centred: Story = { args: { layout: 'center', backdrop: <Satin /> } };
