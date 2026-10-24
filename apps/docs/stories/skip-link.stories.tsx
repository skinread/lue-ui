import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { SkipLink } from '@lue-ui/react';

/**
 * The first focusable element on the page: hidden until it has focus, then pinned to the top of the viewport. Press
 * Tab in the canvas to see it. Contract: `apps/docs/contracts/skip-link.json`.
 */
const meta = {
  title: 'Components/Skip link',
  component: SkipLink,
  args: { children: 'Skip to main content' },
  render: (args) => (
    <>
      <SkipLink {...args} />
      <nav aria-label="Site"><a href="#work">Work</a></nav>
      <div id="main" tabIndex={-1}><h1>Projects</h1></div>
    </>
  ),
} satisfies Meta<typeof SkipLink>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Focused, it shows. */
export const Focused: Story = {
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Skip to main content' });
    // Firefox sometimes drops the first focus() while the story settles, so retry it.
    await waitFor(() => {
      link.focus();
      return expect(link).toHaveFocus();
    });
    await expect(link.getBoundingClientRect().width).toBeGreaterThan(100);
  },
};
