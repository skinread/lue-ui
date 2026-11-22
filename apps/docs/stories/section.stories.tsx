import type { Meta, StoryObj } from '@storybook/react-vite';
import { Actions, Section, Wrap } from '@lue-ui/react';

/**
 * A section of a page, named by its heading, with a head for an action beside it; the page's column (Wrap); a row of
 * actions that wraps. Contract: `apps/docs/contracts/section.json`.
 */
const meta = {
  title: 'Blocks/Section',
  component: Section,
  subcomponents: { Wrap, Actions },
} satisfies Meta<typeof Section>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Wrap>
      <Section id="work" title="Selected work" action={<a className="lue-button" data-variant="quiet" href="#all">All projects</a>}>
        <p>Three case studies in building with the platform.</p>
        <Actions>
          <a className="lue-button" data-variant="primary" href="#loom">Read Loom</a>
          <a className="lue-button" href="#kiln">Read Kiln</a>
        </Actions>
      </Section>
    </Wrap>
  ),
};
