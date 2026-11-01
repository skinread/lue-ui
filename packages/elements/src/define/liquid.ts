import { installLiquid } from '../liquid/behaviour.js';

// Installs the liquid key once per page, however many bundles import it.
const KEY = Symbol.for('lue-ui.liquid');
const g = globalThis as { [KEY]?: true };
if (!g[KEY]) {
  g[KEY] = true;
  installLiquid(document);
}
