import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent } from 'storybook/test';
import { Cluster, Tag } from '@lue-ui/react';

/**
 * A short label in a pill. Removable tags have a button named "Remove {tag}". Contract: `apps/docs/contracts/tag.json`.
 */
const meta = {
  title: 'Components/Tag',
  component: Tag,
  args: { children: 'Design systems' },
} satisfies Meta<typeof Tag>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The remove button calls onRemove. */
export const Removable: Story = {
  args: { onRemove: fn() },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Design systems' }));
    await expect(args.onRemove).toHaveBeenCalled();
  },
};

function Filters() {
  const [tags, setTags] = useState(['Accessibility', 'CSS', 'Typography']);
  return (
    <Cluster as="ul" style={{ listStyle: 'none', padding: 0 }} aria-label="Active filters">
      {tags.map((t) => (
        <li key={t}><Tag onRemove={() => setTags(tags.filter((x) => x !== t))}>{t}</Tag></li>
      ))}
    </Cluster>
  );
}
export const List: Story = { render: () => <Filters /> };
