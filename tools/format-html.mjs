// Indents serialised HTML (React's renderToStaticMarkup writes one line) for people to read: one element per line,
// short text kept with its tags, and React's &#x27; and &quot; in text shown as typed. Used by the Storybook docs
// page's HTML block and by tools/build-ai-docs.mjs.
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const text = (value) => value.replaceAll('&#x27;', "'").replaceAll('&quot;', '"');

/** @param {string} html @returns {string} */
export function formatHtml(html) {
  const tokens = html.match(/<!--[\s\S]*?-->|<\/?[^>]+>|[^<]+/g) ?? [];
  const lines = [];
  const pad = (depth) => '  '.repeat(depth);
  let depth = 0;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.startsWith('</')) {
      depth = Math.max(0, depth - 1);
      lines.push(`${pad(depth)}${token}`);
      continue;
    }
    if (token.startsWith('<') && !token.startsWith('<!')) {
      const name = token.slice(1).match(/^[\w-]+/)?.[0]?.toLowerCase() ?? '';
      const inner = tokens[i + 1];
      const close = tokens[i + 2];
      // <p>Short text</p> stays on one line.
      if (inner && !inner.startsWith('<') && close === `</${name}>` && token.length + inner.length + close.length < 100) {
        lines.push(`${pad(depth)}${token}${text(inner)}${close}`);
        i += 2;
        continue;
      }
      lines.push(`${pad(depth)}${token}`);
      if (!VOID.has(name) && !token.endsWith('/>')) depth++;
      continue;
    }
    if (token.trim()) lines.push(`${pad(depth)}${text(token.trim())}`);
  }
  return lines.join('\n');
}
