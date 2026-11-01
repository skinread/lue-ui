import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, Button, Cluster, Grid, Stack } from '@lue-ui/react';

/**
 * The materials every component is made of (ADR-0010): thick glass, chrome and metal, lit by the ambient light. They
 * are classes, not components: `.lue-glass` (with `data-tier` and `data-caustic`), `.lue-chrome-text`, `.lue-tile` and
 * `.lue-avatar`. Increased contrast, reduced transparency and forced colours turn every one of them opaque and plain.
 */
const meta = {
  title: 'Foundations/Materials',
  tags: ['!autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const pane = { padding: 'var(--lue-space-l)', minBlockSize: '11rem', display: 'grid', alignContent: 'start', gap: 'var(--lue-space-2xs)' };

/** Overlay glass for menus, cards and popovers; modal glass for dialogs; clear glass for frames with nothing to read. */
export const Glass: Story = {
  render: () => (
    <Grid min="14rem">
      <div className="lue-glass" style={pane}>
        <h3 className="lue-h3">Overlay</h3>
        <p>Menus, cards and popovers.</p>
      </div>
      <div className="lue-glass" data-tier="modal" style={pane}>
        <h3 className="lue-h3">Modal</h3>
        <p>Dialogs and drawers, over the scrim.</p>
      </div>
      <div className="lue-glass" data-tier="clear" style={pane} aria-hidden="true" />
    </Grid>
  ),
};

/** `data-caustic`: the light the glass gathered, pooled along its lower lip. Keep it for one hero object. */
export const Caustic: Story = {
  render: () => (
    <div className="lue-glass" data-tier="modal" data-caustic="" style={{ ...pane, maxInlineSize: '24rem', paddingBlockEnd: 'var(--lue-space-xl)' }}>
      <h3 className="lue-h3">Studio light</h3>
      <p>Glass, rim and caustic.</p>
      <Cluster>
        <Button variant="primary">Save scene</Button>
        <Button>Reset</Button>
      </Cluster>
    </div>
  ),
};

/** Chrome on display type: sky above, a dark horizon, a warm floor. Large text only (3:1). */
export const ChromeText: Story = {
  render: () => (
    <Stack gap="xs">
      <p className="lue-chrome-text" style={{ margin: 0, font: '600 clamp(4rem, 14vi, 9rem)/0.9 var(--lue-font-family-display)' }}>Lue</p>
      <h2 className="lue-chrome-text" style={{ margin: 0 }}>Light, held in glass</h2>
    </Stack>
  ),
};

/** Polished metal: icon tiles, and avatars in a chrome bezel. */
export const Metal: Story = {
  render: () => (
    <Cluster gap="l">
      <span className="lue-tile" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M12 3l8 9-8 9-8-9z" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
      </span>
      <span className="lue-tile" data-size="lg" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M12 3l8 9-8 9-8-9z" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
      </span>
      <Avatar name="Ada Lovelace" />
      <Avatar name="Grace Hopper" size="lg" />
    </Cluster>
  ),
};
