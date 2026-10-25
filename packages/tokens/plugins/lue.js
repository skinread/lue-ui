// Lue UI's Terrazzo plugins (ADR-0003).
//
// lueContrast - the contrast lint. Terrazzo's own `a11y/min-contrast` checks one resolved set at fixed AA/AAA levels;
// ours checks every pair declared in `$extensions.lue.pairs` at its own minimum, in every theme context, raised in the
// -more contexts (text 7:1, boundaries 4.5:1). Colours are compared as their sRGB `hex` (gamut-mapped exactly as
// the Pass 2 checker saw them). A failure fails the build.
//
// lueClaudeDesign - writes claude-design/tokens.json, the list shape the Claude Design System reads
// (docs/design/tokens.md#outputs): `color.themes` primary first; each token `{ name, value, usage }` with `value` per
// theme when it varies; literal values only; `type.groups` of text styles; the rest as `{ tokens: [...] }` lists.
//
// lueTailwind - writes tailwind.css, the Tailwind v4 bridge (ADR-0002): `@theme inline` names that point at our
// variables, so utilities follow subtree theming. Background roles drop their prefix (`bg-surface`), `fg.default`
// becomes `fg` (`text-fg`), and the rest keep their group (`text-fg-muted`, `border-border-strong`).
//
// lueSchema - fails the build if a token has no $description (a token without a usage note doesn't ship), two
// tokens would share a CSS name (`a.b-c` and `a.b.c` both become --lue-a-b-c), or body text drops below 16 px at its
// fluid minimum.

const THEME = 'theme';
const BOUNDARIES = new Set(['color.border.strong', 'color.focus.ring']);
const minFor = (id, min, more) => (more ? Math.max(min, BOUNDARIES.has(id) ? 4.5 : 7) : min);

// WCAG 2.x relative luminance and contrast from a #rrggbb hex.
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const refId = (ref) => ref.replace(/^\{|\}$/g, '');
export const contexts = (resolver) => Object.keys(resolver.source.modifiers[THEME].contexts);
export const inputFor = (theme) => ({ theme, density: 'default' });

export function lueContrast() {
  return {
    name: 'lue-contrast',
    build({ resolver, context }) {
      const problems = [];
      let pairs = 0;
      for (const ctx of contexts(resolver)) {
        const set = resolver.apply(inputFor(ctx));
        for (const [id, token] of Object.entries(set)) {
          for (const { on, min } of token.$extensions?.lue?.pairs ?? []) {
            const bg = set[refId(on)];
            if (!bg) { problems.push(`${ctx}: ${id} pairs with ${on}, which does not exist`); continue; }
            const need = minFor(id, min, ctx.endsWith('-more'));
            const ratio = contrast(token.$value.hex, bg.$value.hex);
            pairs++;
            if (ratio < need) problems.push(`${ctx}: ${id} on ${refId(on)} is ${ratio.toFixed(2)}:1, needs ${need}:1`);
          }
        }
      }
      if (problems.length) context.logger.error({ group: 'plugin', label: 'lue-contrast', message: `${problems.length} contrast failures:\n  ${problems.join('\n  ')}` });
      else context.logger.info({ group: 'plugin', label: 'lue-contrast', message: `${pairs} pairs pass across ${contexts(resolver).length} contexts` });
    },
  };
}

export function lueSchema() {
  return {
    name: 'lue-schema',
    build({ tokens, context }) {
      const problems = Object.values(tokens).filter((t) => !t.$description).map((t) => `${t.id} has no $description`);
      const names = new Map();
      for (const id of Object.keys(tokens)) {
        const name = id.replace(/\./g, '-');
        if (names.has(name)) problems.push(`${names.get(name)} and ${id} both become --lue-${name}`);
        names.set(name, id);
      }
      const body = tokens['font.size.step-0'];
      const min = body?.$extensions?.lue?.fluid?.min;
      if (!min || (min.unit === 'rem' ? min.value * 16 : min.value) < 16) problems.push('font.size.step-0 is below 16 px at its minimum');
      if (problems.length) context.logger.error({ group: 'plugin', label: 'lue-schema', message: problems.join('\n  ') });
    },
  };
}

// Literal CSS for Claude Design, which can't read var() or clamp(): fluid sizes at their 1280 px maximum (the range goes
// in the usage note), rem as px.
export const pxOf = (d) => (d.unit === 'rem' ? +(d.value * 16).toFixed(2) : d.value);
const colorCss = (c) => `oklch(${c.components.join(' ')}${c.alpha != null && c.alpha < 1 ? ` / ${c.alpha}` : ''})`;
export const literal = (token) => {
  const v = token.$value;
  const ext = token.$extensions?.lue ?? {};
  switch (token.$type) {
    case 'color': return colorCss(v);
    case 'dimension': return `${pxOf(v)}px`;
    case 'duration': return `${v.value}${v.unit}`;
    case 'cubicBezier': return ext.css ?? `cubic-bezier(${v.join(', ')})`;
    case 'fontFamily': return v.map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(', ');
    case 'number': return ext.unit ? `${v}${ext.unit}` : String(v);
    case 'gradient': return v.map((s) => `${colorCss(s.color)} ${+(s.position * 100).toFixed(2)}%`).join(', ');
    case 'typography': return `${v.fontWeight} ${pxOf(v.fontSize)}px/${v.lineHeight} ${literal({ $type: 'fontFamily', $value: v.fontFamily })}`;
    case 'shadow': return v.map((s) => `${s.inset ? 'inset ' : ''}${pxOf(s.offsetX)}px ${pxOf(s.offsetY)}px ${pxOf(s.blur)}px ${pxOf(s.spread)}px ${colorCss(s.color)}`).join(', ');
    default: return String(v);
  }
};
const fluidNote = (token, force = false) => {
  const f = token.$extensions?.lue?.fluid;
  return f && (force || !token.$description.includes(` at ${f.minViewport}`)) ? ` ${pxOf(f.min)} px at ${f.minViewport} → ${pxOf(token.$value)} px at ${f.maxViewport}.` : '';
};
const THEME_NAMES = { dark: 'Obsidian', light: 'Pearl', 'dark-more': 'Obsidian · more contrast', 'light-more': 'Pearl · more contrast' };
// Which list a token joins, by its id. Text styles go to `type`; everything unlisted joins `other`.
const SECTION = [
  [/^(color|material)\./, (t) => (t.$type === 'color' ? 'color' : t.$type === 'gradient' ? 'gradient' : 'material')],
  [/^shadow\./, () => 'shadow'], [/^space\./, () => 'spacing'], [/^(radius\.|\w+\.radius$)/, () => 'radius'],
  [/^(size\.|button\.height|dialog\.)/, () => 'size'], [/^border\./, () => 'border'], [/^focus\./, () => 'focus'],
  [/^layer\./, () => 'layer'], [/^density$/, () => 'density'], [/^motion\./, () => 'motion'], [/^font\./, () => 'font'],
];
const sectionOf = (t) => (SECTION.find(([re]) => re.test(t.id))?.[1](t) ?? 'other');

export function lueClaudeDesign({ filename = 'claude-design/tokens.json', variableName, exclude = [] }) {
  return {
    name: 'lue-claude-design',
    build({ resolver, outputFile }) {
      const ctxs = contexts(resolver);
      const sets = Object.fromEntries(ctxs.map((ctx) => [ctx, resolver.apply(inputFor(ctx))]));
      const primary = sets[ctxs[0]];
      const name = (t) => variableName(t).slice(2);
      const doc = {
        name: 'Lue UI',
        version: 1,
        meta: { source: 'packages/tokens/src (DTCG 2025.10), built by Terrazzo', primary: ctxs[0] },
        color: { note: 'Dark (obsidian) is primary. Literal OKLCH, gamut-mapped to sRGB. Every declared pair is contrast-checked in all four themes.', themes: ctxs.map((id) => ({ id, name: THEME_NAMES[id] ?? id })), tokens: [] },
        type: { families: {}, groups: [{ name: 'Text styles', note: 'Sizes at 1280 px; the fluid range is in each usage note.', styles: [] }] },
      };
      const excluded = (id) => exclude.some((glob) => id.startsWith(glob.replace(/\*$/, '')));
      for (const t of Object.values(primary).sort((a, b) => a.id.localeCompare(b.id))) {
        if (excluded(t.id)) continue;
        if (t.$type === 'typography') {
          const size = t.$value.fontSize;
          const step = Object.values(primary).find((s) => s.id.startsWith('font.size.') && pxOf(s.$value) === pxOf(size));
          const ext = t.$extensions?.lue ?? {};
          doc.type.groups[0].styles.push({
            name: name(t),
            fontFamily: literal({ $type: 'fontFamily', $value: t.$value.fontFamily }),
            fontSize: `${pxOf(size)}px`,
            lineHeight: t.$value.lineHeight,
            fontWeight: t.$value.fontWeight,
            ...(ext.letterSpacingEm ? { letterSpacing: `${ext.letterSpacingEm}em` } : {}),
            ...(ext.textTransform ? { textTransform: ext.textTransform } : {}),
            usage: `${t.$description}${step ? fluidNote(step, true) : ''}`,
          });
          continue;
        }
        if (t.id.startsWith('font.family.')) doc.type.families[t.id.split('.').pop()] = literal(t);
        const values = Object.fromEntries(ctxs.map((ctx) => [ctx, literal(sets[ctx][t.id])]));
        const same = new Set(Object.values(values)).size === 1;
        const section = sectionOf(t);
        const entry = { name: name(t), value: same ? values[ctxs[0]] : values, usage: `${t.$description}${fluidNote(t)}` };
        if (section === 'color') doc.color.tokens.push(entry);
        else (doc[section] ??= { tokens: [] }).tokens.push(entry);
      }
      outputFile(filename, JSON.stringify(doc, null, 2) + '\n');
    },
  };
}

const TAILWIND = [
  [/^color\.bg\.(.+)$/, (m) => `--color-${m[1]}`],
  [/^color\.fg\.default$/, () => '--color-fg'],
  [/^color\.(fg|border|focus|overlay)\.(.+)$/, (m) => `--color-${m[1]}-${m[2]}`],
  [/^font\.family\.(.+)$/, (m) => `--font-${m[1]}`],
  [/^font\.weight\.(.+)$/, (m) => `--font-weight-${m[1]}`],
  [/^font\.tracking\.(.+)$/, (m) => `--tracking-${m[1]}`],
  [/^font\.leading\.(.+)$/, (m) => `--leading-${m[1]}`],
  [/^space\.(.+)$/, (m) => `--spacing-${m[1]}`],
  [/^radius\.(.+)$/, (m) => `--radius-${m[1]}`],
  [/^shadow\.(raised|overlay|control)$/, (m) => `--shadow-${m[1]}`],
  [/^motion\.ease\.(.+)$/, (m) => `--ease-${m[1]}`],
];
// Text styles become --text-<style> with Tailwind's paired sub-properties.
const TEXT_PARTS = { 'line-height': 'line-height', 'letter-spacing': 'letter-spacing', 'font-weight': 'font-weight' };

export function lueTailwind({ filename = 'tailwind.css', variableName, exclude = [] }) {
  return {
    name: 'lue-tailwind',
    build({ tokens, outputFile }) {
      const excluded = (id) => exclude.some((glob) => id.startsWith(glob.replace(/\*+$/, '')));
      const lines = [];
      for (const t of Object.values(tokens).sort((a, b) => a.id.localeCompare(b.id))) {
        if (excluded(t.id)) continue;
        if (t.$type === 'typography') {
          const name = t.id.replace(/^text\./, '');
          const v = variableName(t);
          lines.push(`  --text-${name}: var(${v}-font-size);`);
          for (const [tw, ours] of Object.entries(TEXT_PARTS)) lines.push(`  --text-${name}--${tw}: var(${v}-${ours});`);
          continue;
        }
        const rule = TAILWIND.find(([re]) => re.test(t.id));
        if (rule) lines.push(`  ${rule[1](t.id.match(rule[0]))}: var(${variableName(t)});`);
      }
      outputFile(filename, `/* Lue UI → Tailwind v4 (ADR-0002). Generated by Terrazzo from packages/tokens/src; don't edit.
   Import after tailwindcss and @lue-ui/tokens/tokens.css; import @lue-ui/css into Tailwind's components layer. */
@theme inline {
${lines.join('\n')}
}
`);
    },
  };
}
