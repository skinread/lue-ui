import type { Meta, StoryObj } from '@storybook/react-vite';
import { Cluster, Skeleton, Spinner, Stack } from '@lue-ui/react';

/**
 * A spinner reads its words as a status; skeletons are decorative placeholders. Put `aria-busy="true"` on the region
 * that's loading. Contract: `apps/docs/contracts/spinner.json`.
 */
const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  args: { label: 'Loading projects' },
} satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: (args) => <p><Spinner {...args} /> Loading projects…</p> };
export const Skeletons: Story = {
  render: () => (
    <section aria-busy="true" aria-label="Team" style={{ maxInlineSize: '24rem' }}>
      <Cluster>
        <Skeleton shape="circle" />
        <Stack gap="2xs" style={{ flex: 1 }}>
          <Skeleton width="60%" />
          <Skeleton width="90%" />
        </Stack>
      </Cluster>
    </section>
  ),
};
