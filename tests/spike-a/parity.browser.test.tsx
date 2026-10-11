// The React adapters must render the same DOM as the HTML core: same elements, attributes and text.
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { html } from './fixture-html.js';
import { App } from './fixture.js';

/** A comparable outline of a DOM tree: tags, sorted attributes and trimmed text. */
function outline(node: Node): unknown {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent!.trim() || null;
  if (!(node instanceof Element)) return null;
  const attributes = [...node.attributes].map((a) => `${a.name}=${a.value}`).sort();
  const children = [...node.childNodes].map(outline).filter((c) => c !== null);
  return { tag: node.localName, attributes, children };
}
const parse = (markup: string) => {
  const template = document.createElement('template');
  template.innerHTML = markup.trim();
  return outline(template.content.firstElementChild!);
};

describe('markup parity', () => {
  it('React renders the HTML fixture exactly', () => {
    expect(parse(renderToStaticMarkup(<App />))).toEqual(parse(html));
  });
});
