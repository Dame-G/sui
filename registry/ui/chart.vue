<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

export interface ChartSeries {
  name: string
  data: number[]
}

const props = withDefaults(
  defineProps<{
    /** What is being shown, not a look: every type uses the same drawing language. */
    type?: 'line' | 'area' | 'bar'
    categories: string[]
    series: ChartSeries[]
    /** Pixel height of the plot; the width is the container's. Defaults to 280, or 48 for a sparkline. */
    height?: number
    /** Stack bars and areas on top of each other instead of side by side / overlapping. Positive and negative values stack away from zero on their own sides. */
    stacked?: boolean
    /** Formats a value for the axis, the tooltip and the screen-reader table. */
    format?: (value: number) => string
    /** Appended to the default number format (`%`, ` ms`). Ignored when `format` is set. */
    unit?: string
    /** Fix the bottom or top of the value axis. A line may float above zero; bars and areas always include it. */
    min?: number
    max?: number
    /** Draw the axes and gridlines. Off gives a bare line. */
    axes?: boolean
    /** A compact trend: just the line (or area) and its last point, no axes or legend. */
    sparkline?: boolean
    /** Show the legend (also the way to hide a series). Defaults to on for more than one series. */
    legend?: boolean
    loading?: boolean
    label?: string
    class?: HTMLAttributes['class']
  }>(),
  { type: 'line', height: undefined, axes: true, legend: undefined, stacked: false },
)

const uid = useId()
const H = computed(() => props.height ?? (props.sparkline ? 48 : 280))
const bare = computed(() => props.sparkline || !props.axes)

// ---- size ------------------------------------------------------------------------------------
const root = ref<HTMLElement | null>(null)
const width = ref(640)
let observer: ResizeObserver | undefined
onMounted(() => {
  if (!root.value) return
  width.value = Math.max(48, Math.round(root.value.clientWidth))
  observer = new ResizeObserver(([entry]) => {
    if (entry) width.value = Math.max(48, Math.round(entry.contentRect.width))
  })
  observer.observe(root.value)
})
onBeforeUnmount(() => observer?.disconnect())

// ---- data ------------------------------------------------------------------------------------
const hidden = ref<Set<number>>(new Set())
const visible = computed(() => props.series.map((s, index) => ({ ...s, index })).filter((s) => !hidden.value.has(s.index)))
const showLegend = computed(() => props.legend ?? (!props.sparkline && props.series.length > 1))
const N = computed(() => props.categories.length)
const empty = computed(() => !N.value || !visible.value.length)
const stackOn = computed(() => props.stacked && props.type !== 'line')

const minus = (s: string) => s.replace(/^-/, '−') // a real minus sign in what is drawn
const numFmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 })
const compactFmt = new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 })
const fmtVal = (v: number) => (props.format ? props.format(v) : numFmt.format(v) + (props.unit ?? ''))
const fmtTick = (v: number) => (props.format ? props.format(v) : compactFmt.format(v) + (props.unit ?? ''))

/** Where each visible series sits on each category: `from` is its baseline, `to` its value (stacked: the running total on its own side of zero). */
const stacks = computed(() => {
  const pos = props.categories.map(() => 0)
  const neg = props.categories.map(() => 0)
  return visible.value.map((s) => {
    const from: number[] = []
    const to: number[] = []
    props.categories.forEach((_, i) => {
      const v = s.data[i] ?? 0
      if (!stackOn.value) {
        from.push(0)
        to.push(v)
      } else if (v >= 0) {
        from.push(pos[i]!)
        pos[i]! += v
        to.push(pos[i]!)
      } else {
        from.push(neg[i]!)
        neg[i]! += v
        to.push(neg[i]!)
      }
    })
    return { ...s, from, to }
  })
})

// ---- layout ----------------------------------------------------------------------------------
const CHAR = 7.2 // a 12px mono glyph
const SLAB = 2
const longest = computed(() => Math.max(...props.categories.map((c) => c.length), 1))
/** Long labels lean back 35 degrees instead of colliding. Decided from a rough width, so it does not depend on the margins it sets. */
const rotated = computed(() => {
  if (bare.value || N.value < 2) return false
  const rough = (width.value - 64) / Math.max(1, props.type === 'bar' ? N.value : N.value - 1)
  // Short labels ("Jan") are thinned out instead; only long ones lean.
  return longest.value > 5 && longest.value * CHAR + 10 > rough
})
/** A leaning label is cut at 14 characters (the tooltip and the table have the whole name). */
const MAXLEAN = 14
const shown = (c: string) => (rotated.value && c.length > MAXLEAN ? `${c.slice(0, MAXLEAN - 1)}\u2026` : c)
const MT = computed(() => (bare.value ? 8 : 14))
const MB = computed(() => (bare.value ? 8 : rotated.value ? Math.round(Math.min(longest.value, MAXLEAN) * CHAR * 0.57) + 26 : 30))
const plotH = computed(() => Math.max(20, H.value - MT.value - MB.value))

/** "Nice" tick steps: 1, 2, 5 times a power of ten. */
function niceNum(range: number, round: boolean) {
  const exp = Math.floor(Math.log10(range))
  const f = range / 10 ** exp
  const nf = round ? (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) : f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10
  return nf * 10 ** exp
}
const scale = computed(() => {
  const all = stacks.value.flatMap((s) => [...s.to, ...s.from])
  let lo = all.length ? Math.min(...all) : 0
  let hi = all.length ? Math.max(...all) : 1
  if (props.type === 'line') {
    // A line floats above zero when the data does, unless zero is close enough to be worth showing.
    if (lo > 0 && lo < hi * 0.5) lo = 0
    if (hi < 0 && hi > lo * 0.5) hi = 0
  } else {
    lo = Math.min(0, lo)
    hi = Math.max(0, hi)
  }
  const fixLo = props.min !== undefined
  const fixHi = props.max !== undefined
  if (fixLo) lo = props.type === 'bar' ? Math.min(props.min!, 0) : props.min!
  if (fixHi) hi = props.type === 'bar' ? Math.max(props.max!, 0) : props.max!
  if (hi <= lo) hi = lo + 1
  const target = Math.min(6, Math.max(3, Math.round(plotH.value / 56) + 1))
  const step = niceNum((hi - lo) / (target - 1), true)
  if (!fixLo) lo = Math.floor(lo / step + 1e-9) * step
  if (!fixHi) hi = Math.ceil(hi / step - 1e-9) * step
  const ticks: number[] = []
  for (let v = Math.ceil(lo / step - 1e-9) * step; v <= hi + step * 1e-6; v += step) ticks.push(+v.toFixed(10))
  return { lo, hi, ticks }
})

const margin = computed(() => {
  if (bare.value) return { l: 6, r: 6 }
  const widest = Math.max(...scale.value.ticks.map((t) => minus(fmtTick(t)).length), 1)
  // The last label is centred under its point: let it hang over the plot's right edge without being cut.
  const last = props.categories[N.value - 1]?.length ?? 0
  const r = rotated.value || props.type === 'bar' ? 14 : Math.max(14, Math.ceil((last * CHAR) / 2) - 4)
  // A leaning first label reaches back past the first point: leave room for it.
  const lean = rotated.value ? Math.ceil(shown(props.categories[0] ?? '').length * CHAR * 0.82) + 4 - inset.value : 0
  return { l: Math.max(Math.round(widest * CHAR + 18), lean), r }
})
const plot = computed(() => ({
  x: margin.value.l,
  y: MT.value,
  w: Math.max(10, width.value - margin.value.l - margin.value.r),
  h: plotH.value,
}))
const spread = computed(() => props.type !== 'bar') // lines and areas run edge to edge; bars sit in bands
const inset = computed(() => (bare.value ? 5 : 8))
const step = computed(() => (spread.value ? (N.value > 1 ? (plot.value.w - 2 * inset.value) / (N.value - 1) : 0) : plot.value.w / Math.max(1, N.value)))
const band = computed(() => (spread.value ? (N.value > 1 ? step.value : plot.value.w) : step.value))
const cx = (i: number) =>
  spread.value ? (N.value > 1 ? plot.value.x + inset.value + i * step.value : plot.value.x + plot.value.w / 2) : plot.value.x + (i + 0.5) * step.value
const y = (v: number) => plot.value.y + plot.value.h * (1 - (v - scale.value.lo) / (scale.value.hi - scale.value.lo))
const zeroInside = computed(() => scale.value.lo < 0 && scale.value.hi > 0)

const labelStep = computed(() => {
  const unit = band.value || 1
  return Math.max(1, Math.ceil((rotated.value ? 15 : longest.value * CHAR + 10) / unit))
})

// ---- shapes ----------------------------------------------------------------------------------
const SHAPES = ['circle', 'square', 'diamond', 'up', 'down'] as const
/** One marker outline centred on (x, y): every series has its own shape, so colour is never the only cue. */
function marker(index: number, x: number, yy: number, r: number) {
  const s = SHAPES[index % SHAPES.length]
  const f = (n: number) => n.toFixed(2)
  if (s === 'circle') return `M${f(x - r)} ${f(yy)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`
  if (s === 'square') return `M${f(x - r * 0.85)} ${f(yy - r * 0.85)}h${f(r * 1.7)}v${f(r * 1.7)}h${f(-r * 1.7)}Z`
  if (s === 'diamond') return `M${f(x)} ${f(yy - r * 1.25)}L${f(x + r * 1.25)} ${f(yy)}L${f(x)} ${f(yy + r * 1.25)}L${f(x - r * 1.25)} ${f(yy)}Z`
  if (s === 'up') return `M${f(x)} ${f(yy - r * 1.2)}L${f(x + r * 1.2)} ${f(yy + r)}L${f(x - r * 1.2)} ${f(yy + r)}Z`
  return `M${f(x)} ${f(yy + r * 1.2)}L${f(x + r * 1.2)} ${f(yy - r)}L${f(x - r * 1.2)} ${f(yy - r)}Z`
}
const colour = (index: number) => `var(--color-chart-${(index % 5) + 1})`

const pt = (i: number, v: number) => `${cx(i).toFixed(2)} ${y(v).toFixed(2)}`
const linePath = (s: { to: number[] }) => (s.to.length < 2 ? '' : s.to.map((v, i) => `${i ? 'L' : 'M'}${pt(i, v)}`).join(''))
const areaPath = (s: { from: number[]; to: number[] }) => {
  if (s.to.length < 2) return ''
  const top = s.to.map((v, i) => `${i ? 'L' : 'M'}${pt(i, v)}`).join('')
  // The fill's floor is zero, or the edge of the axis when zero is off the chart.
  const floor = (v: number) => Math.min(scale.value.hi, Math.max(scale.value.lo, v))
  const back = s.from.map((v, i) => `L${pt(i, floor(v))}`).reverse().join('')
  return `${top}${back}Z`
}

/** A bar outline with rounded corners only on the ends you ask for. */
function barShape(x: number, w: number, top: number, bottom: number, roundTop: boolean, roundBottom: boolean) {
  const h = bottom - top
  if (h <= 0) return ''
  const r = Math.min(3, w / 2, h / 2)
  const a = roundTop ? r : 0
  const b = roundBottom ? r : 0
  const f = (n: number) => n.toFixed(2)
  return (
    `M${f(x)} ${f(top + a)}` +
    (a ? `Q${f(x)} ${f(top)} ${f(x + a)} ${f(top)}` : '') +
    `H${f(x + w - a)}` +
    (a ? `Q${f(x + w)} ${f(top)} ${f(x + w)} ${f(top + a)}` : '') +
    `V${f(bottom - b)}` +
    (b ? `Q${f(x + w)} ${f(bottom)} ${f(x + w - b)} ${f(bottom)}` : '') +
    `H${f(x + b)}` +
    (b ? `Q${f(x)} ${f(bottom)} ${f(x)} ${f(bottom - b)}` : '') +
    'Z'
  )
}
const bars = computed(() => {
  if (props.type !== 'bar') return []
  const n = stackOn.value ? 1 : stacks.value.length
  const gap = n > 1 ? 3 : 0
  const group = Math.min(band.value * 0.72, n * 56 + gap * (n - 1))
  const bw = Math.max(2, (group - gap * (n - 1)) / n)
  // In a stack only the outermost segment on each side is rounded.
  const outerPos = props.categories.map((_, i) => stacks.value.reduce((k, s, idx) => ((s.to[i] ?? 0) >= 0 ? idx : k), -1))
  const outerNeg = props.categories.map((_, i) => stacks.value.reduce((k, s, idx) => ((s.to[i] ?? 0) < 0 ? idx : k), -1))
  return stacks.value.flatMap((s, k) =>
    props.categories.flatMap((_, i) => {
      const to = s.to[i]!
      const from = s.from[i]!
      const top = y(Math.max(to, from))
      const bottom = y(Math.min(to, from))
      if (bottom - top < 0.5) return []
      const neg = to < from || (to === from && to < 0)
      const x = cx(i) - group / 2 + (stackOn.value ? 0 : k * (bw + gap))
      const w = stackOn.value ? group : bw
      const roundTop = !neg && (!stackOn.value || outerPos[i] === k)
      const roundBottom = neg && (!stackOn.value || outerNeg[i] === k)
      // The slab sits under every bar, or in a stack under the segment that rests on zero.
      const slab = !neg && (!stackOn.value || from === 0) && bottom - top > SLAB + 3 ? SLAB : 0
      const full = barShape(x, w, top, bottom, roundTop, roundBottom)
      const face = slab ? barShape(x, w, top, bottom - slab, roundTop, false) : ''
      const glyphY = neg ? bottom - 9 : top + 9
      return [{ key: `${s.index}-${i}`, index: s.index, full, face, slab, gx: x + w / 2, gy: glyphY, glyph: w >= 14 && bottom - top >= 26 }]
    }),
  )
})

// ---- interaction -----------------------------------------------------------------------------
const active = ref<number | null>(null)
const svg = ref<SVGSVGElement | null>(null)
function move(e: PointerEvent) {
  if (!svg.value || empty.value) return
  const box = svg.value.getBoundingClientRect()
  const px = e.clientX - box.left
  let i: number
  if (N.value < 2) i = 0
  else if (spread.value) i = Math.round((px - plot.value.x - inset.value) / step.value)
  else i = Math.floor((px - plot.value.x) / step.value)
  active.value = Math.min(N.value - 1, Math.max(0, i))
}
function key(e: KeyboardEvent) {
  const last = N.value - 1
  const at = active.value
  if (e.key === 'ArrowRight') active.value = at === null ? 0 : Math.min(last, at + 1)
  else if (e.key === 'ArrowLeft') active.value = at === null ? last : Math.max(0, at - 1)
  else if (e.key === 'Home') active.value = 0
  else if (e.key === 'End') active.value = last
  else if (e.key === 'Escape') active.value = null
  else return
  e.preventDefault()
}
// A mouse click focuses the plot too; only a keyboard arrival should open the first value.
function onFocus(e: FocusEvent) {
  if ((e.target as HTMLElement).matches(':focus-visible')) active.value ??= 0
}
const soleVisible = (i: number) => visible.value.length === 1 && !hidden.value.has(i)
function toggle(index: number) {
  const next = new Set(hidden.value)
  if (next.has(index)) next.delete(index)
  else if (props.series.length - next.size > 1) next.add(index) // always keep one series showing
  hidden.value = next
}

const tipEl = ref<HTMLElement | null>(null)
const tipW = ref(160)
watch([active, width], () => nextTick(() => (tipW.value = tipEl.value?.offsetWidth ?? tipW.value)))
const tip = computed(() => {
  const i = active.value
  if (i === null || empty.value) return null
  const x = cx(i)
  // Sits to the right of the point, and flips to its left when it would run off the chart.
  let left = x + 14
  if (left + tipW.value > width.value - 2) left = x - 14 - tipW.value
  left = Math.max(2, left)
  const rows = stacks.value.map((s) => ({ index: s.index, name: s.name, value: minus(fmtVal(s.data[i] ?? 0)) }))
  const total = stackOn.value && rows.length > 1 ? minus(fmtVal(stacks.value.reduce((t, s) => t + (s.data[i] ?? 0), 0))) : null
  return { title: props.categories[i]!, rows, total, left, top: Math.max(0, plot.value.y - 4) }
})
const summary = computed(() => (tip.value ? `${tip.value.title}: ${tip.value.rows.map((r) => `${r.name} ${r.value}`).join(', ')}` : ''))
const aria = computed(() => {
  const what = props.label ?? `${props.type} chart`
  return `${what}: ${props.series.map((s) => s.name).join(', ')} across ${props.categories.length} categories. Use the arrow keys to read each value.`
})
const clip = computed(() => (props.min !== undefined || props.max !== undefined ? `url(#${uid}-clip)` : undefined))
const showMarkers = computed(() => !bare.value && N.value <= 24)
</script>

<template>
  <div ref="root" :class="cn('grid min-w-0 gap-3', props.class)">
    <!-- The legend is also the way to hide a series; a hidden one keeps its chip, struck through. It starts where the plot starts. -->
    <div v-if="showLegend && !props.loading" class="flex flex-wrap gap-2" :style="{ paddingInlineStart: `${bare ? 0 : margin.l}px` }">
      <button
        v-for="(s, i) in props.series"
        :key="s.name"
        type="button"
        :aria-pressed="!hidden.has(i)"
        :aria-disabled="soleVisible(i) || undefined"
        :class="
          cn(
            'edge-start slab-sm keep-colors inline-flex min-h-8 cursor-pointer items-center gap-2 py-1 ps-[max(calc(0.75rem-var(--stroke-edge)-var(--depth-bold)),0.625rem)] pe-[calc(0.75rem-var(--stroke-edge))] text-sm leading-tight text-ink transition-state select-none',
            '[--_bg:var(--color-surface)] [--_tone:var(--_c)] hover:[--_bg:var(--color-wash-hover)] focus-ring',
            hidden.has(i) && '[--_tone:var(--color-edge-strong)] text-muted line-through',
            soleVisible(i) && 'cursor-default',
          )
        "
        :style="{ '--_c': colour(i) }"
        @click="toggle(i)"
      >
        <svg viewBox="-7 -7 14 14" class="size-3.5 shrink-0" aria-hidden="true">
          <path :d="marker(i, 0, 0, 4.5)" :class="hidden.has(i) ? 'fill-none stroke-edge-strong' : 'fill-(--_c) stroke-(--_c)'" stroke-width="1.5" stroke-linejoin="round" />
        </svg>
        {{ s.name }}
      </button>
    </div>

    <!-- Loading: the same striped, pulsing placeholder as Skeleton, at the chart's height. -->
    <div
      v-if="props.loading"
      role="status"
      aria-busy="true"
      aria-label="Loading chart"
      class="stripes w-full animate-pulse-soft rounded-md bg-skeleton motion-reduce:animate-none"
      :style="{ height: `${H}px` }"
    />

    <div
      v-else
      class="relative rounded-md focus-ring"
      tabindex="0"
      role="img"
      :aria-label="aria"
      @keydown="key"
      @focus="onFocus"
      @blur="active = null"
      @pointerleave="active = null"
    >
      <svg ref="svg" :width="width" :height="H" class="keep-colors block max-w-full touch-pan-y select-none" aria-hidden="true" @pointermove="move" @pointerdown="move">
        <defs>
          <clipPath :id="`${uid}-clip`"><rect :x="plot.x - 8" :y="plot.y - 8" :width="plot.w + 16" :height="plot.h + 16" /></clipPath>
          <linearGradient v-for="s in stacks" :id="`${uid}-g${s.index}`" :key="s.index" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" :style="{ stopColor: colour(s.index) }" stop-opacity="0.3" />
            <stop offset="1" :style="{ stopColor: colour(s.index) }" stop-opacity="0.03" />
          </linearGradient>
        </defs>

        <!-- gridlines: solid hairlines, horizontal only (dashed means disabled in sui); zero and the floor are stronger -->
        <g v-if="!bare" class="numeral text-xs">
          <template v-if="!empty">
            <g v-for="t in scale.ticks" :key="t">
              <line v-if="t !== 0 && t !== scale.lo" :x1="plot.x" :x2="plot.x + plot.w" :y1="y(t)" :y2="y(t)" class="chart-grid" />
              <text :x="plot.x - 10" :y="y(t)" text-anchor="end" dominant-baseline="central" class="fill-muted">{{ minus(fmtTick(t)) }}</text>
            </g>
            <line :x1="plot.x" :x2="plot.x + plot.w" :y1="plot.y + plot.h" :y2="plot.y + plot.h" class="stroke-edge-strong" stroke-width="1" shape-rendering="crispEdges" />
            <line v-if="zeroInside" :x1="plot.x" :x2="plot.x + plot.w" :y1="y(0)" :y2="y(0)" class="stroke-edge-strong" stroke-width="1" shape-rendering="crispEdges" />
          </template>
          <line v-else :x1="plot.x" :x2="plot.x + plot.w" :y1="plot.y + plot.h" :y2="plot.y + plot.h" class="stroke-edge-strong" stroke-width="1" shape-rendering="crispEdges" />
          <template v-for="(c, i) in props.categories" :key="c + i">
            <text
              v-if="i % labelStep === 0"
              :x="rotated ? cx(i) + 4 : cx(i)"
              :y="plot.y + plot.h + (rotated ? 14 : 20)"
              :text-anchor="rotated ? 'end' : 'middle'"
              :transform="rotated ? `rotate(-35 ${cx(i) + 4} ${plot.y + plot.h + 14})` : undefined"
              class="fill-muted"
            >{{ shown(c) }}</text>
          </template>
        </g>

        <!-- the active category: a wash behind bars, a hairline through lines -->
        <rect v-if="active !== null && props.type === 'bar'" :x="plot.x + active * band" :y="plot.y" :width="band" :height="plot.h" class="fill-wash-hover" />
        <line v-if="active !== null && props.type !== 'bar'" :x1="cx(active)" :x2="cx(active)" :y1="plot.y" :y2="plot.y + plot.h" class="stroke-ink" stroke-width="1" shape-rendering="crispEdges" />

        <!-- series -->
        <g :clip-path="clip">
          <template v-if="props.type === 'bar'">
            <g v-for="b in bars" :key="b.key" :style="{ '--_c': colour(b.index) }" class="chart-in">
              <!-- the whole bar in its slab colour, then the face laid over all but the bottom 2px -->
              <path v-if="b.face" :d="b.full" class="fill-[color-mix(in_srgb,var(--_c),black_32%)]" />
              <path :d="b.face || b.full" class="fill-(--_c)" />
              <path v-if="b.glyph" :d="marker(b.index, b.gx, b.gy, 3)" class="fill-surface" fill-opacity="0.9" />
            </g>
          </template>
          <template v-else>
            <g v-for="s in stacks" :key="s.index" :style="{ '--_c': colour(s.index) }">
              <path v-if="props.type === 'area'" :d="areaPath(s)" :fill="`url(#${uid}-g${s.index})`" class="chart-in" />
              <path :d="linePath(s)" fill="none" pathLength="1" class="chart-draw stroke-(--_c)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
              <!-- Points are drawn when there is room; on a sparkline only the last and the active one. -->
              <template v-for="(v, i) in s.to" :key="i">
                <path
                  v-if="showMarkers || active === i || (bare && i === s.to.length - 1)"
                  :d="marker(s.index, cx(i), y(v), active === i ? 5.5 : bare ? 3.5 : 3.5)"
                  :class="cn('chart-in', active === i || (bare && i === s.to.length - 1) ? 'fill-(--_c) stroke-(--_c)' : 'fill-surface stroke-(--_c)')"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
              </template>
            </g>
          </template>
        </g>

        <text v-if="empty" :x="width / 2" :y="plot.y + plot.h / 2" text-anchor="middle" dominant-baseline="central" class="kicker fill-muted text-xs">No data to show</text>
      </svg>

      <!-- tooltip: the shared floating panel, one for every series at the category -->
      <div
        v-if="tip"
        ref="tipEl"
        class="panel pointer-events-none absolute grid min-w-36 gap-1.5 px-3 py-2.5 text-sm transition-[left,top] duration-(--duration-fade) ease-out print:hidden"
        :style="{ left: `${tip.left}px`, top: `${tip.top}px` }"
      >
        <p class="kicker">{{ tip.title }}</p>
        <p v-for="r in tip.rows" :key="r.index" class="flex items-center gap-2" :style="{ '--_c': colour(r.index) }">
          <svg viewBox="-7 -7 14 14" class="keep-colors size-3 shrink-0" aria-hidden="true"><path :d="marker(r.index, 0, 0, 4.5)" class="fill-(--_c)" /></svg>
          <span class="min-w-0 flex-1 truncate">{{ r.name }}</span>
          <span class="numeral font-medium">{{ r.value }}</span>
        </p>
        <p v-if="tip.total" class="flex items-center gap-2 border-t border-edge pt-1.5 text-muted">
          <span class="flex-1">Total</span>
          <span class="numeral font-medium text-ink">{{ tip.total }}</span>
        </p>
      </div>
      <p class="sr-only" aria-live="polite">{{ summary }}</p>
    </div>

    <!-- The data, for anyone who can't see the picture. -->
    <!-- The clip lives on a wrapper: a table ignores sr-only's 1px size and its width would widen the whole page. -->
    <div v-if="!props.loading" class="sr-only">
      <table>
        <caption>{{ aria }}</caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
            <th v-for="s in props.series" :key="s.name" scope="col">{{ s.name }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(c, i) in props.categories" :key="c + i">
            <th scope="row">{{ c }}</th>
            <td v-for="s in props.series" :key="s.name">{{ fmtVal(s.data[i] ?? 0) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
