import { installTooltip } from '../tooltip/behaviour.js';

// Installs the data-lue-tooltip behaviour once per page, however many bundles import it.
const KEY = Symbol.for('lue-ui.tooltip');
const g = globalThis as { [KEY]?: true };
if (!g[KEY]) {
  g[KEY] = true;
  installTooltip(document);
}
