import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, Cluster } from '@lue-ui/react';

const photo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 4'%3E%3Crect width='4' height='4' fill='%23738'/%3E%3Ccircle cx='2' cy='1.6' r='0.8' fill='%23dcd'/%3E%3Cellipse cx='2' cy='3.9' rx='1.5' ry='1.2' fill='%23dcd'/%3E%3C/svg%3E";

/**
 * A photo (`<img alt>`) or initials (`role="img"` with the name). Mark it decorative when the name is written beside
 * it. Contract: `apps/docs/contracts/avatar.json`.
 */
const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  args: { name: 'Ada Lovelace' },
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Initials: Story = {};
export const Photo: Story = { args: { src: photo } };
export const Large: Story = { args: { size: 'lg' } };
export const BesideAName: Story = {
  render: (args) => <Cluster><Avatar {...args} decorative /> <span>Ada Lovelace</span></Cluster>,
};
