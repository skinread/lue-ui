import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeBlock, CodeToken } from '@lue-ui/react';

/** Code in a glass panel; the block is focusable so it scrolls by keyboard. Contract: `apps/docs/contracts/code-block.json`. */
const meta = {
  title: 'Blocks/Code block',
  component: CodeBlock,
  subcomponents: { CodeToken },
} satisfies Meta<typeof CodeBlock>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { language: 'CSS', title: 'Glass button' },
  render: (args) => (
    <CodeBlock {...args}>
      <CodeToken kind="comment">/* A pane of glass that keeps its label legible */</CodeToken>{'\n'}
      .button {'{'}{'\n'}
      {'  '}<CodeToken kind="property">background-color</CodeToken>: var(--glass);{'\n'}
      {'  '}<CodeToken kind="property">backdrop-filter</CodeToken>: blur(10px) saturate(1.8);{'\n'}
      {'}'}
    </CodeBlock>
  ),
};
