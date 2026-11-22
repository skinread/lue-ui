import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid, Media, ProjectCard } from '@lue-ui/react';
import { Prism } from './support/art.js';

/** A piece of work whose title links over the whole card. Contract: `apps/docs/contracts/project-card.json`. */
const meta = {
  title: 'Blocks/Project card',
  component: ProjectCard,
  args: {
    href: '#loom',
    title: 'A design system for a weaving journal',
    media: <Media><Prism /></Media>,
    meta: ['Loom', '2026'],
    excerpt: 'One line on the problem, and what changed.',
    tags: ['Systems', 'Engineering'],
  },
} satisfies Meta<typeof ProjectCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <div style={{ maxInlineSize: '22rem' }}><ProjectCard {...args} /></div>,
};

export const InAGrid: Story = {
  name: 'In a grid',
  render: () => (
    <Grid min="18rem">
      {[['Loom', 'A design system for a weaving journal', ['Systems', 'Engineering']], ['Kiln', 'An editorial platform for a ceramics studio', ['Product', 'Content']]].map(([client, title, tags]) => (
        <ProjectCard
          key={client as string}
          href={`#${(client as string).toLowerCase()}`}
          title={title}
          media={<Media><Prism /></Media>}
          meta={[client, '2026']}
          excerpt="One line on the problem, and what changed."
          tags={tags as string[]}
        />
      ))}
    </Grid>
  ),
};
