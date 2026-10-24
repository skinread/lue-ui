import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardLink, Carousel, LueElements } from '@lue-ui/react';

const projects = ['Loom', 'Kiln', 'Lathe', 'Forge', 'Quill'];

/**
 * A row of slides that scrolls and snaps, with previous and next buttons from `<lue-carousel>`. It never moves on its
 * own. Without the element, it still scrolls and swipes. Contract: `apps/docs/contracts/carousel.json`.
 */
const meta = {
  title: 'Components/Carousel',
  component: Carousel,
  args: {
    'aria-label': 'Projects',
    slides: projects.map((name) => (
      <Card key={name} as="div">
        <h3 className="lue-h3"><CardLink href={`#${name.toLowerCase()}`}>{name}</CardLink></h3>
        <p>A case study in building with the platform.</p>
      </Card>
    )),
  },
  render: (args) => <><LueElements /><Carousel {...args} /></>,
} satisfies Meta<typeof Carousel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
