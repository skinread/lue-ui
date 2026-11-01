import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { Center, Cluster, Grid, Sidebar, Stack, Switcher } from '@lue-ui/react';

const Tile = ({ children }: { children: ReactNode }) => (
  <div style={{ padding: '1rem', borderRadius: '12px', background: 'var(--lue-color-bg-surface)' }}>{children}</div>
);

/**
 * Six intrinsic primitives: each responds to its container's width with no media or container queries. Resize the
 * canvas to see them change. Contract: `apps/docs/contracts/layout.json`.
 */
const meta = {
  title: 'Components/Layout',
  component: Stack,
  subcomponents: { Cluster, Grid, Sidebar, Switcher, Center },
} satisfies Meta<typeof Stack>;
export default meta;
type Story = StoryObj<typeof meta>;

export const StackStory: Story = {
  name: 'Stack',
  render: () => <Stack gap="s"><Tile>One</Tile><Tile>Two</Tile><Tile>Three</Tile></Stack>,
};
export const ClusterStory: Story = {
  name: 'Cluster',
  render: () => (
    <Cluster as="ul" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {['Accessibility', 'Design systems', 'CSS', 'Typography', 'Research'].map((t) => <li key={t}><Tile>{t}</Tile></li>)}
    </Cluster>
  ),
};
export const GridStory: Story = {
  name: 'Grid',
  render: () => <Grid min="12rem">{['One', 'Two', 'Three', 'Four'].map((t) => <Tile key={t}>{t}</Tile>)}</Grid>,
};
export const SidebarStory: Story = {
  name: 'Sidebar',
  render: () => <Sidebar width="14rem"><Tile>Filters</Tile><Tile>Results: they stack under the filters once this would be narrower than half the width.</Tile></Sidebar>,
};
export const SwitcherStory: Story = {
  name: 'Switcher',
  render: () => <Switcher threshold="36rem"><Tile>Plan</Tile><Tile>Build</Tile><Tile>Ship</Tile></Switcher>,
};
export const CenterStory: Story = {
  name: 'Center',
  render: () => <Center max="40ch"><Tile>A column no wider than 40ch, centred, with the page gutter on both sides.</Tile></Center>,
};
