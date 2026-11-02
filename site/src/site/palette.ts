// Colour maths and the contrast-guaranteed palette. Pure functions, no Vue, so scripts can import it too.

export type Scheme = 'light' | 'dark'
export type Contrast = 'normal' | 'high'

// ---- sRGB, luminance, contrast ----------------------------------------------------------
const rgb = (hex: string) => {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as [number, number, number]
}
const hexOf = (c: readonly number[]) => '#' + c.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('')
const lin = (v: number) => (v / 255 <= 0.04045 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4)
const lum = (h: string) => {
  const [r, g, b] = rgb(h)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}
export function contrast(a: string, b: string) {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi! + 0.05) / (lo! + 0.05)
}
export const isHex = (v: string) => /^#[0-9a-f]{6}$/i.test(v)
/** `pct` of `a` over `b` (0..1). */
export function mix(a: string, b: string, pct: number) {
  const [x, y] = [rgb(a), rgb(b)]
  return hexOf(x.map((v, i) => v * pct + y[i]! * (1 - pct)))
}

// ---- OKLCH ----------------------------------------------------------------------------------
const gam = (v: number) => 255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055)
export function toOklch(hex: string) {
  const [r, g, b] = rgb(hex).map((v) => lin(v)) as [number, number, number]
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  return { L, C: Math.hypot(a, bb), h: (Math.atan2(bb, a) * 180) / Math.PI }
}
function oklchToRgb(L: number, C: number, h: number) {
  const a = C * Math.cos((h * Math.PI) / 180)
  const b = C * Math.sin((h * Math.PI) / 180)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ]
}
/** An OKLCH colour as hex; chroma is reduced until it fits in sRGB, so lightness and hue stay true. */
export function fromOklch(L: number, C: number, h: number) {
  const fits = (c: number) => oklchToRgb(L, c, h).every((v) => v >= -0.0005 && v <= 1.0005)
  let c = C
  if (!fits(c)) {
    let lo = 0
    let hi = C
    for (let i = 0; i < 18; i++) {
      const mid = (lo + hi) / 2
      if (fits(mid)) lo = mid
      else hi = mid
    }
    c = lo
  }
  return hexOf(oklchToRgb(L, c, h).map(gam))
}

/**
 * Move `fg` along lightness (hue and chroma kept) until it reaches `min` contrast on every background.
 * Returns the colour and whether it got there (a colour that cannot is reported, not hidden).
 */
export function settle(fg: string, bgs: string[], min: number) {
  const worst = (c: string) => Math.min(...bgs.map((b) => contrast(c, b)))
  if (worst(fg) >= min) return { color: fg, ok: true }
  const { L, C, h } = toOklch(fg)
  const toward = bgs.reduce((s, b) => s + lum(b), 0) / bgs.length > 0.4 ? -1 : 1
  let best = fg
  for (let step = 1; step <= 200; step++) {
    const l = L + toward * step * 0.005
    if (l < 0 || l > 1) break
    best = fromOklch(l, C, h)
    if (worst(best) >= min) return { color: best, ok: true }
  }
  const end = toward < 0 ? '#000000' : '#ffffff'
  return worst(end) >= min ? { color: end, ok: true } : { color: best, ok: false }
}
/** Pull a background toward `base` until `fg` reads on it. */
function settleBg(bg: string, fg: string, base: string, min: number) {
  let out = bg
  for (let i = 0; i < 8 && contrast(fg, out) < min; i++) out = mix(out, base, 0.5)
  return contrast(fg, out) >= min ? out : base
}

// ---- the palette ---------------------------------------------------------------------------
const BASE = {
  light: {
    page: '#ffffff', surface: '#ffffff', tint: '#d0e1e8', paper: '#fefcf7',
    ink: '#000000', muted: '#515151', edge: '#6d7d84', edgeStrong: '#767676',
    success: '#266444', successSoft: '#dcfbe8', warning: '#714a00', warningSoft: '#fdf3dc',
    danger: '#962019', dangerSoft: '#fbe9e7', onPrimary: '#ffffff', onDanger: '#ffffff',
    selection: '#9bcde3', scrim: 'rgb(8 41 50 / 0.55)',
  },
  dark: {
    page: '#0d1519', surface: '#121e23', tint: '#1d2f36', paper: '#0f191d',
    ink: '#f3f8fa', muted: '#aebcc2', edge: '#6f858d', edgeStrong: '#8197a0',
    success: '#7ad79d', successSoft: '#123122', warning: '#f0c36a', warningSoft: '#352708',
    danger: '#ff8f86', dangerSoft: '#3b1613', onPrimary: '#00212b', onDanger: '#2a0604',
    selection: '#245567', scrim: 'rgb(0 0 0 / 0.65)',
  },
}

export const defaultBrand = '#2c95b4'
const DEFAULT_PRIMARY = { light: '#005f7c', dark: '#59c0de' }

/** The action colour: the brand's hue, moved until its text colour on it passes WCAG AAA (7:1). */
export function derivePrimary(brand: string, scheme: Scheme = 'light') {
  if (brand.toLowerCase() === defaultBrand) return DEFAULT_PRIMARY[scheme]
  const on = BASE[scheme].onPrimary
  const { L, C, h } = toOklch(brand)
  const dir = scheme === 'light' ? -1 : 1
  for (let step = 0; step <= 200; step++) {
    const l = L + dir * step * 0.004
    if (l < 0 || l > 1) break
    const out = fromOklch(l, C, h)
    if (contrast(out, on) >= 7) return out
  }
  return scheme === 'light' ? '#000000' : '#ffffff'
}

export interface Row { pair: string; ratio: number; min: number; ok: boolean; kind: 'text' | 'non-text' | 'body' }

/** Every colour token for a scheme and contrast level, each one settled to pass its pair. */
export function buildPalette(brand: string, scheme: Scheme, level: Contrast) {
  const b = BASE[scheme]
  const high = level === 'high'
  const body = 7
  const text = high ? 7 : 4.5
  const nonText = high ? 4.5 : 3
  const t: Record<string, string> = {}
  const rows: Row[] = []
  const check = (pair: string, fg: string, bg: string, min: number, kind: Row['kind']) => {
    const ratio = contrast(fg, bg)
    rows.push({ pair, ratio, min, ok: ratio >= min - 0.005, kind })
  }

  const surface = b.surface
  const tint = high ? mix(b.ink, surface, 0.08) : b.tint // high contrast: a plain grey tint
  t['--color-page'] = b.page
  t['--color-surface'] = surface
  t['--color-surface-tint'] = tint
  t['--color-paper'] = b.paper
  t['--color-ink'] = settle(b.ink, [b.page, surface, tint, b.paper], body).color
  t['--color-brand'] = brand
  t['--color-selection'] = b.selection
  t['--color-scrim'] = b.scrim

  t['--color-muted'] = settle(b.muted, [surface, tint, b.page], text).color
  const primary = derivePrimary(brand, scheme)
  t['--color-primary'] = primary
  t['--color-on-primary'] = b.onPrimary
  const soft = settleBg(high ? tint : mix(brand, surface, 0.16), primary, surface, text)
  t['--color-primary-soft'] = soft
  t['--color-info-soft'] = soft

  for (const k of ['success', 'warning', 'danger'] as const) {
    const sf = high ? mix(b[k], surface, 0.1) : b[`${k}Soft` as 'successSoft']
    const fixedSoft = settleBg(sf, b[k], surface, text)
    t[`--color-${k}-soft`] = fixedSoft
    t[`--color-${k}`] = settle(b[k], [fixedSoft, surface], text).color
  }
  t['--color-on-danger'] = settle(b.onDanger, [t['--color-danger']!], text).color

  // edges: full strength in high contrast
  t['--color-edge'] = high ? t['--color-ink']! : settle(b.edge, [surface, tint], nonText).color
  t['--color-edge-strong'] = high ? t['--color-ink']! : settle(b.edgeStrong, [surface, tint], nonText).color
  t['--color-focus'] = t['--color-ink']!

  const g = (k: string) => t[`--color-${k}`]!
  check('Body text on surface', g('ink'), g('surface'), body, 'body')
  check('Button text on primary', g('on-primary'), g('primary'), 7, 'text')
  check('Primary text on surface', g('primary'), g('surface'), text, 'text')
  check('Primary text on its soft tint', g('primary'), g('primary-soft'), text, 'text')
  check('Muted text on surface', g('muted'), g('surface'), text, 'text')
  check('Muted text on tint', g('muted'), g('surface-tint'), text, 'text')
  check('Success text on its soft tint', g('success'), g('success-soft'), text, 'text')
  check('Warning text on its soft tint', g('warning'), g('warning-soft'), text, 'text')
  check('Danger text on its soft tint', g('danger'), g('danger-soft'), text, 'text')
  check('Danger button text', g('on-danger'), g('danger'), text, 'text')
  check('Frame edge on surface', g('edge'), g('surface'), nonText, 'non-text')
  check('Control edge on surface', g('edge-strong'), g('surface'), nonText, 'non-text')
  check('Focus ring on surface', g('focus'), g('surface'), 3, 'non-text')
  check('Primary face on page', g('primary'), g('page'), nonText, 'non-text')
  return { tokens: t, rows, issues: rows.filter((r) => !r.ok).map((r) => r.pair) }
}
