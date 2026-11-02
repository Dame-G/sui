import { computed, reactive, ref, watch } from 'vue'
import { buildPalette, contrast, defaultBrand, derivePrimary, isHex, type Contrast, type Scheme } from '@/site/palette'

export { contrast, isHex }

export const fonts = {
  bricolage: "'Bricolage Grotesque', 'Avenir Next', system-ui, sans-serif",
  serif: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
  system: 'ui-sans-serif, system-ui, sans-serif',
  mono: "'Geist Mono', ui-monospace, Menlo, Consolas, monospace",
} as const
export type FontKey = keyof typeof fonts
export type SchemeChoice = 'light' | 'dark' | 'auto'
export type ContrastChoice = 'normal' | 'high' | 'auto'

export const defaults = {
  brand: defaultBrand,
  radius: 8,
  depth: 2,
  font: 'bricolage' as FontKey,
  scheme: 'light' as SchemeChoice,
  contrast: 'normal' as ContrastChoice,
}
type Theme = typeof defaults
// Presets set the four design tokens; they leave the reader's scheme and contrast choice alone.
export const presets: Record<string, Pick<Theme, 'brand' | 'radius' | 'depth' | 'font'>> = {
  Sui: { brand: defaults.brand, radius: 8, depth: 2, font: 'bricolage' },
  Ember: { brand: '#e8653a', radius: 4, depth: 3, font: 'bricolage' },
  Moss: { brand: '#6fae4a', radius: 14, depth: 2, font: 'system' },
  Plum: { brand: '#b46bd0', radius: 10, depth: 3, font: 'serif' },
  Slate: { brand: '#7389a3', radius: 0, depth: 4, font: 'mono' },
}

function load(): Theme {
  try {
    const raw = localStorage.getItem('sui-theme-v2')
    if (raw) return { ...defaults, ...JSON.parse(raw) }
  } catch {
    /* storage unavailable */
  }
  return { ...defaults }
}
export const theme = reactive<Theme>(load())

// ---- what the system prefers (only used for the "auto" choices) -----------------------------
function pref(query: string) {
  const r = ref(false)
  try {
    const mq = window.matchMedia(query)
    r.value = mq.matches
    mq.addEventListener('change', (e) => (r.value = e.matches))
  } catch {
    /* no matchMedia */
  }
  return r
}
const systemDark = pref('(prefers-color-scheme: dark)')
const systemMore = pref('(prefers-contrast: more)')

export const resolvedScheme = computed<Scheme>(() => (theme.scheme === 'auto' ? (systemDark.value ? 'dark' : 'light') : theme.scheme))
export const resolvedContrast = computed<Contrast>(() => (theme.contrast === 'auto' ? (systemMore.value ? 'high' : 'normal') : theme.contrast))

const brand = computed(() => (isHex(theme.brand) ? theme.brand : defaults.brand))
const palette = computed(() => buildPalette(brand.value, resolvedScheme.value, resolvedContrast.value))

export const primary = computed(() => palette.value.tokens['--color-primary']!)
/** Every contrast pair for the current scheme and contrast level, each already settled to pass if it can. */
export const report = computed(() => palette.value.rows)
export const reportIssues = computed(() => palette.value.issues)

const sm = () => Math.round(theme.radius / 2)
const lg = () => theme.radius * 2

/** The four design tokens, plus the dark and high-contrast overrides that depend on the brand. */
export const themeCss = computed(() => {
  const light = buildPalette(brand.value, 'light', 'normal').tokens
  const dark = buildPalette(brand.value, 'dark', 'normal').tokens
  let css = `@theme {
  --color-brand: ${brand.value};
  --color-primary: ${light['--color-primary']};
  --font-sans: ${fonts[theme.font as FontKey]};
  --radius-sm: ${sm()}px;
  --radius-md: ${theme.radius}px;
  --radius-lg: ${lg()}px;
  --depth: ${theme.depth}px;
}`
  if (theme.scheme !== 'light') {
    const block = `  --color-primary: ${dark['--color-primary']};
  --color-primary-soft: ${dark['--color-primary-soft']};`
    css += `

/* Dark: add data-scheme="${theme.scheme}" to <html>. Only the brand-dependent colours are listed; the rest of the dark palette ships in sui-theme.css. */
${
  theme.scheme === 'auto'
    ? `@media (prefers-color-scheme: dark) {\n  :root[data-scheme='auto'] {\n${block.replace(/^/gm, '  ')}\n  }\n}`
    : `:root[data-scheme='dark'] {\n${block}\n}`
}`
  }
  if (theme.contrast !== 'normal') {
    css += `

/* High contrast: add data-contrast="${theme.contrast === 'auto' ? 'auto' : 'high'}" to <html>. It ships in sui-theme.css; nothing to paste. */`
  }
  return css
})

// ---- DTCG (Design Tokens Community Group) export ----------------------------------------------
const colourNotes: Record<string, string> = {
  page: 'Page background.',
  surface: 'Raised surfaces: cards, fields, panels.',
  'surface-tint': 'Wells and neutral chips.',
  paper: 'Warm off-white used behind code and long text.',
  ink: 'Body text and the focus ring. 7:1 on every background.',
  muted: 'Secondary text. Meets the text contrast minimum on surface and tint.',
  brand: 'Your brand colour. Decorative only, never carries text.',
  primary: 'Action colour, derived from the brand so its text colour passes 7:1.',
  'on-primary': 'Text on the primary colour.',
  'primary-soft': 'Soft tint of the primary colour.',
  'info-soft': 'Soft tint for the info tone (the primary tint).',
  success: 'Success text and edge.',
  'success-soft': 'Success tint.',
  warning: 'Warning text and edge.',
  'warning-soft': 'Warning tint.',
  danger: 'Danger text, edge and destructive action colour.',
  'danger-soft': 'Danger tint.',
  'on-danger': 'Text on the danger colour.',
  edge: '1px frames.',
  'edge-strong': 'Control edges and neutral slabs.',
  focus: 'The 2px focus ring.',
  selection: 'Text selection.',
  scrim: 'Behind modal panels.',
}

/** The theme as a DTCG token file. Colours carry the light value, with the other modes under `$extensions`. */
export function toDtcg() {
  const modes = {
    light: buildPalette(brand.value, 'light', 'normal').tokens,
    dark: buildPalette(brand.value, 'dark', 'normal').tokens,
    'light-high-contrast': buildPalette(brand.value, 'light', 'high').tokens,
    'dark-high-contrast': buildPalette(brand.value, 'dark', 'high').tokens,
  }
  const color: Record<string, unknown> = { $type: 'color', $description: 'Colour tokens. $value is the light scheme; other modes are in $extensions["sui.modes"].' }
  for (const key of Object.keys(modes.light)) {
    const name = key.replace('--color-', '')
    color[name] = {
      $value: modes.light[key],
      $description: colourNotes[name] ?? name,
      $extensions: { 'sui.modes': Object.fromEntries(Object.entries(modes).slice(1).map(([m, t]) => [m, t[key]])) },
    }
  }
  const dim = (value: string, $description: string) => ({ $value: value, $description })
  return {
    $description: `sui theme tokens. Brand ${brand.value}, action colour ${derivePrimary(brand.value)}.`,
    color,
    dimension: {
      $type: 'dimension',
      radius: { sm: dim(`${sm()}px`, 'Small corners.'), md: dim(`${theme.radius}px`, 'Default corners.'), lg: dim(`${lg()}px`, 'Large corners.') },
      depth: dim(`${theme.depth}px`, 'How far the slab reaches under a raised face.'),
      stroke: { edge: dim('1px', 'Edge width. 2px in high contrast.'), focus: dim('2px', 'Focus ring width. 3px in high contrast.') },
      size: {
        control: dim('3rem', 'The one control height.'),
        tap: dim('2.75rem', 'Minimum touch target.'),
        chip: dim('1.5rem', 'Chip and tag height.'),
        check: dim('1.5rem', 'Checkbox, radio and switch size.'),
      },
    },
    fontFamily: {
      $type: 'fontFamily',
      sans: { $value: fonts[theme.font as FontKey].split(',').map((f) => f.trim().replace(/^'|'$/g, '')), $description: 'Body and headings.' },
      mono: { $value: ['Geist Mono', 'ui-monospace', 'Menlo', 'Consolas', 'monospace'], $description: 'Labels (kicker) and figures (numeral).' },
    },
    fontWeight: {
      $type: 'fontWeight',
      regular: dim('400', 'Body text.'),
      medium: dim('500', 'Controls and headings.'),
      strong: dim('600', 'Labels and emphasis. There is no bold.'),
    },
    duration: {
      $type: 'duration',
      tap: dim('80ms', 'State changes: hover, press.'),
      fade: dim('140ms', 'Panels appearing.'),
      move: dim('220ms', 'Things sliding or growing. All durations become ~0 under reduced motion.'),
    },
    cubicBezier: { $type: 'cubicBezier', out: { $value: [0.2, 0, 0, 1], $description: 'The one easing curve.' } },
  }
}
export const dtcgJson = computed(() => JSON.stringify(toDtcg(), null, 2))

// ---- apply to the live page -------------------------------------------------------------------------
watch(
  [() => theme.brand, () => theme.radius, () => theme.depth, () => theme.font, () => theme.scheme, () => theme.contrast, palette],
  () => {
    const el = document.documentElement
    const root = el.style
    for (const [k, v] of Object.entries(palette.value.tokens)) root.setProperty(k, v)
    root.setProperty('--radius-sm', `${sm()}px`)
    root.setProperty('--radius-md', `${theme.radius}px`)
    root.setProperty('--radius-lg', `${lg()}px`)
    root.setProperty('--depth', `${theme.depth}px`)
    root.setProperty('--font-sans', fonts[theme.font as FontKey])
    // The attributes switch the CSS-only parts (colour-scheme, heavier strokes, hover mixes).
    el.dataset.scheme = theme.scheme
    el.dataset.contrast = theme.contrast
    try {
      localStorage.setItem('sui-theme-v2', JSON.stringify({ ...theme }))
    } catch {
      /* storage unavailable */
    }
  },
  { immediate: true },
)

export function applyPreset(name: string) {
  Object.assign(theme, presets[name] ?? presets.Sui)
}
