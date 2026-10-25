// The autodocs page for every component (RFC-0001 §8): the React adapter first (its description, live example and
// props from react-docgen, which reads each prop's JSDoc), then the HTML it renders on the server - the HTML core's
// markup, which works without React - then every story, and links to the contract and the Markdown page.
import type { ComponentType, ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Controls, Description, Heading, Primary, Source, Stories, Subtitle, Title, useOf } from '@storybook/addon-docs/blocks';
import { composeStories } from '@storybook/react-vite';

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

// React escapes ' and " in text, which HTML doesn't need; shown as typed.
const text = (value: string) => value.replaceAll('&#x27;', "'").replaceAll('&quot;', '"');

/** Indents serialised HTML one element per line; text and inline content stay with their tags when short. */
export function formatHtml(html: string): string {
  const tokens = html.match(/<!--[\s\S]*?-->|<\/?[^>]+>|[^<]+/g) ?? [];
  const lines: string[] = [];
  let depth = 0;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!;
    if (token.startsWith('</')) {
      depth = Math.max(0, depth - 1);
      lines.push(`${'  '.repeat(depth)}${token}`);
      continue;
    }
    if (token.startsWith('<') && !token.startsWith('<!')) {
      const name = token.slice(1).match(/^[\w-]+/)?.[0]?.toLowerCase() ?? '';
      const inner = tokens[i + 1];
      const close = tokens[i + 2];
      // <p>Short text</p> stays on one line.
      if (inner && !inner.startsWith('<') && close === `</${name}>` && token.length + inner.length + close.length < 100) {
        lines.push(`${'  '.repeat(depth)}${token}${text(inner)}${close}`);
        i += 2;
        continue;
      }
      lines.push(`${'  '.repeat(depth)}${token}`);
      if (!VOID.has(name) && !token.endsWith('/>')) depth++;
      continue;
    }
    if (token.trim()) lines.push(`${'  '.repeat(depth)}${text(token.trim())}`);
  }
  return lines.join('\n');
}

function ServerHtml(): ReactNode {
  const { csfFile } = useOf('meta', ['meta']);
  // The primary story: the first in the file (a module's export names are sorted, so not Object.values()[0]).
  const primary = Object.values(csfFile.stories)[0]?.moduleExport;
  const composed = composeStories(csfFile.moduleExports as Parameters<typeof composeStories>[0]) as Record<string, ComponentType>;
  const name = Object.keys(composed).find((key) => csfFile.moduleExports[key] === primary);
  const First = name ? composed[name] : undefined;
  if (!First) return null;
  let html: string;
  try {
    html = formatHtml(renderToStaticMarkup(<First />));
  } catch {
    return null;
  }
  return (
    <>
      <Heading>HTML</Heading>
      <p>
        What the first example renders on the server. The same markup works without React: link <code>@lue-ui/css</code> and,
        for components with behaviour, load <code>@lue-ui/elements</code>.
      </p>
      <Source code={html} language="html" dark />
    </>
  );
}

function Links(): ReactNode {
  const { preparedMeta } = useOf('meta', ['meta']);
  const id = preparedMeta.title.split('/').pop()!.toLowerCase().replaceAll(' ', '-');
  return (
    <p>
      Contract: <a href={`./contracts/${id}.json`}>contracts/{id}.json</a> · For AI tools:{' '}
      <a href={`./components/${id}.md`}>components/{id}.md</a>, <a href="./llms.txt">llms.txt</a>
    </p>
  );
}

export function DocsPage(): ReactNode {
  return (
    <>
      <Title />
      <Subtitle />
      <Description />
      <Links />
      <Primary />
      <Controls />
      <ServerHtml />
      <Stories title="Examples" />
    </>
  );
}
