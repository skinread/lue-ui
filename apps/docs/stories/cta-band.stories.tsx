import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, CtaBand, Field, TextInput } from '@lue-ui/react';

/** A heading, a sentence and a short form in a glass band. Contract: `apps/docs/contracts/cta-band.json`. */
const meta = {
  title: 'Blocks/CTA band',
  component: CtaBand,
} satisfies Meta<typeof CtaBand>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Newsletter: Story = {
  args: {
    kicker: 'Journal',
    title: 'Notes on light, glass and the web',
    lede: "One letter when there's something worth reading. Unsubscribe in one click.",
  },
  render: (args) => (
    <CtaBand {...args}>
      <form action="#subscribe">
        <Field label="Email address" controlId="newsletter-email"><TextInput type="email" autoComplete="email" required /></Field>
        <Button type="submit" variant="primary">Subscribe</Button>
      </form>
    </CtaBand>
  ),
};
