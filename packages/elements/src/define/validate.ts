import { installValidate } from '../validate/behaviour.js';

// Installs the data-lue-validate behaviour once per page, however many bundles import it.
const KEY = Symbol.for('lue-ui.validate');
const g = globalThis as { [KEY]?: true };
if (!g[KEY]) {
  g[KEY] = true;
  installValidate(document);
}
