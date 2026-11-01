import { installToggle } from '../toggle/behaviour.js';

// Installs the data-lue-toggle behaviour once per page, however many bundles import it.
const KEY = Symbol.for('lue-ui.toggle');
const g = globalThis as { [KEY]?: true };
if (!g[KEY]) {
  g[KEY] = true;
  installToggle(document);
}
