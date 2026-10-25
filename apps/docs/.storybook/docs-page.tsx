// The autodocs page for every component (RFC-0001 §8): the React adapter first (its description, live example and
// props from react-docgen, which reads each prop's JSDoc), then the HTML it renders on the server - the HTML core's
// markup, which works without React - then every story. Under the description: when to use it and what to use instead,
// from the contract's guidance, and links to the contract, the guidelines and the Markdown page.
import type { ComponentType, ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Controls, Description, Heading, Primary, Source, Stories, Subtitle, Title, useOf } from '@storybook/addon-docs/blocks';
import { composeStories } from '@storybook/react-vite';
import { formatHtml } from '../../../tools/format-html.mjs';

interface Guidance {
  useFor: string;
  insteadUse?: string[];
  content?: string[];
}
const contracts = import.meta.glob<{ guidance?: Guidance }>(['../contracts/*.json', '!../contracts/contract.schema.json'], { eager: true, import: 'default' });

/** The contract's id from the story title: "Components/Radio group" → radio-group. */
function useContractId(): string {
  const { preparedMeta } = useOf('meta', ['meta']);
  return preparedMeta.title.split('/').pop()!.toLowerCase().replaceAll(' ', '-');
}

function WhenToUse(): ReactNode {
  const id = useContractId();
  const guidance = contracts[`../contracts/${id}.json`]?.guidance;
  if (!guidance) return null;
  return (
    <>
      <Heading>When to use it</Heading>
      <p>{guidance.useFor}</p>
      {guidance.insteadUse?.length ? (
        <table>
          <thead>
            <tr><th scope="col">When</th><th scope="col">Use instead</th></tr>
          </thead>
          <tbody>
            {guidance.insteadUse.map((item) => {
              const at = item.indexOf(': ');
              return <tr key={item}><td>{at > -1 ? item.slice(0, at) : item}</td><td>{at > -1 ? item.slice(at + 2) : ''}</td></tr>;
            })}
          </tbody>
        </table>
      ) : null}
      {guidance.content?.length ? (
        <>
          <p><strong>Content</strong></p>
          <ul>{guidance.content.map((line) => <li key={line}>{line}</li>)}</ul>
        </>
      ) : null}
    </>
  );
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
  const id = useContractId();
  return (
    <p>
      <a href={`./guidelines/${id}.md`}>Guidelines</a> · Contract: <a href={`./contracts/${id}.json`}>contracts/{id}.json</a> ·
      For AI tools: <a href={`./components/${id}.md`}>components/{id}.md</a>, <a href="./llms.txt">llms.txt</a>
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
      <WhenToUse />
      <Controls />
      <ServerHtml />
      <Stories title="Examples" />
    </>
  );
}
