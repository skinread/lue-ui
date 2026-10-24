// lueMaterials — the material contrast rules (ADR-0009): text and boundaries on glass, glass buttons, ambient light,
// satin and metal, checked worst-case against every backdrop they can meet, in every theme context, from the token
// source. Ported from tools/directions/palettes.mjs (Pass 2), which checked the palette seeds instead.
//
// Worst case means: glass over white, black and every fill (through the scrim for modals), reading the backdrop
// filter both ways; prism buttons with up to three overlapping tones; gradients with the midpoint of every adjacent
// pair (linear gradients interpolate in encoded sRGB). In the -more contexts glass and buttons turn opaque (CSS), so
// only the multi-tone fills are checked there, at raised minimums. A failure fails the build.
import { BLACK, WHITE, contrast, filtered, fromToken, over } from './color.js';

const THEME = 'theme';

export function lueMaterials() {
  return {
    name: 'lue-materials',
    build({ resolver, context }) {
      const problems = [];
      let count = 0;
      for (const ctx of Object.keys(resolver.source.modifiers[THEME].contexts)) {
        const set = resolver.apply({ theme: ctx, density: 'default' });
        const rows = ctx.endsWith('-more') ? moreRules(set) : rules(set);
        count += rows.length;
        for (const { what, ratio, min } of rows) {
          if (ratio < min) problems.push(`${ctx}: ${what} is ${ratio.toFixed(2)}:1, needs ${min}:1`);
        }
        const tightest = Math.min(...rows.map((r) => r.ratio / r.min));
        context.logger.info({ group: 'plugin', label: 'lue-materials', message: `${ctx}: ${rows.length} rules, tightest margin ×${tightest.toFixed(2)}` });
      }
      if (problems.length) context.logger.error({ group: 'plugin', label: 'lue-materials', message: `${problems.length} material contrast failures:\n  ${problems.join('\n  ')}` });
      else context.logger.info({ group: 'plugin', label: 'lue-materials', message: `${count} material rules pass` });
    },
  };
}

/** Readers over a resolved token set. */
function read(set) {
  const token = (id) => {
    const t = set[id];
    if (!t) throw new Error(`lue-materials: missing token ${id}`);
    return t;
  };
  const solid = (id) => fromToken(token(id).$value).col;
  const translucent = (id) => fromToken(token(id).$value); // { col, alpha }
  const stops = (id) => token(id).$value.map((s) => fromToken(s.color).col);
  const number = (id) => token(id).$value;
  const group = (prefix) => Object.keys(set).filter((id) => id.startsWith(prefix)).sort();
  return { solid, translucent, stops, number, group };
}

const worstOf = (fgs, bgs) => {
  let lo = Infinity;
  for (const f of fgs) for (const b of bgs) lo = Math.min(lo, contrast(f, b));
  return lo;
};
const withMids = (t) => [...t, ...t.slice(1).map((c, i) => over(c, 0.5, t[i]))];

function moreRules(set) {
  const { solid, stops } = read(set);
  const rows = [];
  const worst = (what, fgs, bgs, min) => rows.push({ what, ratio: worstOf(fgs, bgs), min });
  worst('fg-on-accent on multi-tone fill (marks, step numbers)', [solid('color.fg.on-accent')], withMids(stops('material.prism-fill')), 7);
  worst('fg-on-accent on multi-tone fill (active)', [solid('color.fg.on-accent')], withMids(stops('material.prism-fill-active')), 7);
  worst('switch bead (on) vs multi-tone track', [solid('material.bead-on')], withMids(stops('material.prism-fill')), 4.5);
  return rows;
}

function rules(set) {
  const { solid, translucent, stops, number, group } = read(set);
  const rows = [];
  const worst = (what, fgs, bgs, min) => rows.push({ what, ratio: worstOf(fgs, bgs), min });
  const fg = (role) => solid(`color.fg.${role}`);
  const canvas = solid('color.bg.canvas');
  const surfaces = [canvas, solid('color.bg.surface'), solid('color.bg.surface-subtle')];

  const chrome = stops('material.chrome'); // every stop, the dispersion band included
  const dispersion = stops('material.dispersion');
  const fill = stops('material.prism-fill');
  const fillActive = stops('material.prism-fill-active');
  const ring = stops('material.prism-ring');
  const ambient = group('material.ambient.').map((id) => translucent(id));
  const glows = ambient.map((a) => over(a.col, a.alpha, canvas));
  // Ambient layers can overlap, so text may sit on two glows at once.
  const doubled = ambient.flatMap((a) => ambient.map((b) => over(a.col, a.alpha, over(b.col, b.alpha, canvas))));

  worst('fg-on-accent on multi-tone fill (marks, step numbers)', [fg('on-accent')], withMids(fill), 4.5);
  worst('fg-on-accent on multi-tone fill (active)', [fg('on-accent')], withMids(fillActive), 4.5);
  worst('switch bead (on) vs multi-tone track', [solid('material.bead-on')], withMids(fill), 3);
  worst('chrome ring on canvas and surfaces', chrome, surfaces, 3);
  worst('fg-default on ambient prism light', [fg('default')], glows, 7);
  worst('fg-muted on ambient prism light', [fg('muted')], glows, 4.5);
  worst('fg-accent on ambient prism light', [fg('accent')], glows, 4.5);
  worst('fg-default on overlapping ambient light', [fg('default')], doubled, 7);
  worst('fg-muted on overlapping ambient light', [fg('muted')], doubled, 4.5);
  worst('fg-accent on overlapping ambient light', [fg('accent')], doubled, 4.5);

  // Glass: (scrim for modals) → backdrop filter, both readings → tint at its alpha → sheen.
  const scrim = translucent('color.overlay.scrim');
  const glassFilter = { contrast: number('material.glass.contrast'), brightness: number('material.glass.brightness') };
  const glassSheen = number('material.glass.sheen');
  const glassOver = (tier, backdrop) => {
    const tint = translucent(`material.glass.${tier}`);
    const b = tier === 'modal' ? over(scrim.col, scrim.alpha, backdrop) : backdrop;
    return filtered(b, glassFilter).map((fb) => {
      const tinted = over(tint.col, tint.alpha, fb);
      return glassSheen ? over(WHITE, glassSheen, tinted) : tinted;
    });
  };
  const backdrops = [WHITE, BLACK, canvas, solid('color.bg.surface'), solid('color.bg.inverse'), fg('default'), ...fill, ...glows];
  for (const tier of ['overlay', 'modal']) {
    const glass = backdrops.flatMap((b) => glassOver(tier, b));
    worst(`fg-default on ${tier} glass (worst backdrop)`, [fg('default')], glass, 7);
    worst(`fg-muted on ${tier} glass`, [fg('muted')], glass, 4.5);
    worst(`fg-accent on ${tier} glass`, [fg('accent')], glass, 4.5);
    worst(`fg-critical on ${tier} glass`, [fg('critical')], glass, 4.5);
    worst(`focus-ring on ${tier} glass`, [solid('color.focus.ring')], glass, 3);
    worst(`chrome ring on ${tier} glass`, chrome, glass, 3);
  }

  // Glass buttons sit on surfaces, ambient light, glass or satin — never straight on photography. Outside glass they
  // blur their own backdrop; inside glass they don't (a glass parent is a backdrop root), so both are checked.
  const glassAll = ['overlay', 'modal'].flatMap((tier) => backdrops.flatMap((b) => glassOver(tier, b)));
  const satin = group('material.satin.').map((id) => solid(id));
  const buttonFilter = { contrast: number('material.button.contrast'), brightness: number('material.button.brightness') };
  const buttonBackdrops = [...surfaces, ...glows, ...doubled, ...glassAll, ...satin].flatMap((b) => [b, ...filtered(b, buttonFilter)]);
  const dark = contrast(fg('default'), WHITE) < contrast(fg('default'), BLACK) === false; // light text → a dark theme
  const buttonSheen = number('material.button.sheen');
  const sheen = (c) => (dark ? over(WHITE, buttonSheen, c) : c); // a white sheen only hurts light text
  const pane = (id) => {
    const t = translucent(id);
    return buttonBackdrops.map((b) => sheen(over(t.col, t.alpha, b)));
  };
  const neutral = pane('material.button.tint');
  const blobs = group('material.iridescence.').map((id) => translucent(id));
  const prismPanes = (baseId) => {
    const base = translucent(baseId);
    const out = [];
    for (const backdrop of buttonBackdrops) {
      const b0 = over(base.col, base.alpha, backdrop);
      out.push(sheen(b0));
      for (const a of blobs) {
        const one = over(a.col, a.alpha, b0);
        out.push(sheen(one));
        for (const b of blobs) {
          const two = over(b.col, b.alpha, one);
          out.push(sheen(two));
          for (const c of blobs) out.push(sheen(over(c.col, c.alpha, two)));
        }
      }
    }
    return out;
  };
  worst('fg-default on neutral glass button', [fg('default')], neutral, 4.5);
  worst('fg-default on prism glass button (up to 3 tones)', [fg('default')], prismPanes('material.button.prism-base'), 4.5);
  worst('fg-default on prism glass button, pressed', [fg('default')], prismPanes('material.button.prism-base-active'), 4.5);
  worst('fg-default on danger glass button', [fg('default')], pane('material.button.danger'), 4.5);
  worst('fg-default on pressed toggle', [fg('default')], pane('material.button.pressed'), 4.5);
  worst('fg-muted on disabled glass button (advisory)', [fg('muted')], neutral, 3);
  worst('fg-accent on quiet button hover (neutral glass)', [fg('accent')], neutral, 4.5);
  worst('fg-critical ring vs canvas and glass', [fg('critical')], [canvas, solid('color.bg.surface'), ...glassAll], 3);
  worst('multi-tone ring (selected, on) as a boundary', withMids(ring), [...surfaces, ...glassAll], 3);
  worst('dispersion band of the chrome ring', dispersion, [...surfaces, ...glassAll], 3);
  worst('fg-default on satin', [fg('default')], satin, 7);
  worst('fg-muted on satin', [fg('muted')], satin, 4.5);
  worst('fg-accent on satin', [fg('accent')], satin, 4.5);
  worst('fg-default on liquid metal (avatars, tiles)', [fg('default')], stops('material.metal'), 4.5);
  return rows;
}
