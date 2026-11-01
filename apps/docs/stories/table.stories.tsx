import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table } from '@lue-ui/react';

const rows = [['Loom', 'Weaving journal', 128, '2026'], ['Kiln', 'Glaze calculator', 64, '2025'], ['Lathe', 'Turning planner', 212, '2024']] as const;

/**
 * A data table with a caption, in a region the keyboard can scroll sideways. Number cells align to the end with
 * `data-numeric`. Contract: `apps/docs/contracts/table.json`.
 */
const meta = {
  title: 'Components/Table',
  component: Table,
  args: {
    caption: 'Hours by project',
    children: (
      <>
        <thead><tr><th scope="col">Project</th><th scope="col">What it is</th><th scope="col" data-numeric="">Hours</th><th scope="col" data-numeric="">Year</th></tr></thead>
        <tbody>
          {rows.map(([name, what, hours, year]) => (
            <tr key={name}><th scope="row">{name}</th><td>{what}</td><td data-numeric="">{hours}</td><td data-numeric="">{year}</td></tr>
          ))}
        </tbody>
      </>
    ),
  },
} satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
/** In a narrow container it scrolls sideways; Tab to it and use the arrow keys. */
export const Narrow: Story = { render: (args) => <div style={{ maxInlineSize: '18rem' }}><Table {...args} /></div> };
