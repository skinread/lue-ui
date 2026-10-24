import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Card, CardLink, Grid, Tag } from '@lue-ui/react';

/**
 * A glass panel for one item. With a `CardLink` in its heading, the whole card is that link; other buttons and links
 * stay usable on top. Contract: `apps/docs/contracts/card.json`.
 */
const meta = {
  title: 'Components/Card',
  component: Card,
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card style={{ maxInlineSize: '22rem' }}>
      <h3 className="lue-h3">Loom</h3>
      <p>A weaving journal, built with the platform.</p>
    </Card>
  ),
};

export const Linked: Story = {
  render: () => (
    <Grid min="16rem">
      {['Loom', 'Kiln', 'Lathe'].map((name) => (
        <Card key={name}>
          <h3 className="lue-h3"><CardLink href={`#${name.toLowerCase()}`}>{name}</CardLink></h3>
          <p>A case study in building with the platform.</p>
          <p><Tag>Case study</Tag></p>
          <Button size="sm">Save {name}</Button>
        </Card>
      ))}
    </Grid>
  ),
};
