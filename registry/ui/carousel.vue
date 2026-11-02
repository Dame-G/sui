<script setup lang="ts">
import { Comment, Fragment, Text, computed, nextTick, onBeforeUnmount, onMounted, onUpdated, ref, shallowRef, useSlots, watch, type HTMLAttributes, type VNode } from 'vue'
import { cn } from '@/lib/utils'

// Every direct child in the default slot is a slide (v-for and fragments are flattened).
const props = withDefaults(
  defineProps<{
    /** Slides shown at once, at most: fewer are shown when the track is too narrow for `minWidth`. */
    perView?: number
    /** Space between slides, in rem. */
    gap?: number
    /** The narrowest a slide may get before the carousel shows fewer at once, in rem. */
    minWidth?: number
    label?: string
    class?: HTMLAttributes['class']
  }>(),
  { perView: 1, gap: 1, minWidth: 14 },
)
// The first slide in view.
const index = defineModel<number>('index', { default: 0 })

const slots = useSlots()
const flatten = (nodes: VNode[]): VNode[] =>
  nodes.flatMap((n) =>
    n.type === Fragment
      ? flatten(n.children as VNode[])
      : n.type === Comment || (n.type === Text && !String(n.children).trim())
        ? []
        : [n],
  )
const vnodes = () => flatten(slots.default?.() ?? [])

// A function ref: inside the one-pass v-for below a plain `ref="track"` would collect an array.
const track = shallowRef<HTMLElement>()
const setTrack = (el: unknown) => (track.value = (el as HTMLElement | null) ?? undefined)
const width = ref(0)
const count = ref(0)
const dragging = ref(false)

const gapPx = computed(() => props.gap * 16)
const per = computed(() =>
  Math.max(1, Math.min(props.perView, Math.floor((width.value + gapPx.value) / (props.minWidth * 16 + gapPx.value)) || 1)),
)
const maxIndex = computed(() => Math.max(0, count.value - per.value))
const basis = computed(() => `calc((100% - ${props.gap * (per.value - 1)}rem) / ${per.value})`)

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const step = () => {
  const kids = track.value?.children
  if (!kids?.length) return 1
  return kids.length > 1 ? (kids[1] as HTMLElement).offsetLeft - (kids[0] as HTMLElement).offsetLeft : (kids[0] as HTMLElement).offsetWidth
}

// `shown` is the index the track is at; `target` is where a scroll we started is heading, so its in-between scroll events are not mistaken for a swipe.
let shown = index.value
let target: number | null = null
let settle: ReturnType<typeof setTimeout> | undefined

function go(i: number) {
  const el = track.value
  if (!el) return
  const next = Math.min(maxIndex.value, Math.max(0, i))
  shown = next
  index.value = next
  target = next
  clearTimeout(settle)
  settle = setTimeout(() => (target = null), 700)
  el.scrollTo({ left: next * step(), behavior: reduced() ? 'auto' : 'smooth' })
}

let frame = 0
function onScroll() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => {
    const el = track.value
    if (!el) return
    const s = step()
    if (target !== null) {
      if (Math.abs(el.scrollLeft - target * s) > 2) return
      target = null
    }
    const i = Math.min(maxIndex.value, Math.max(0, Math.round(el.scrollLeft / s)))
    if (i !== shown) {
      shown = i
      index.value = i
    }
  })
}
watch(index, (v) => {
  if (v !== shown) go(v)
})

// Mouse drag (touch and trackpads scroll natively).
let drag: { x: number; left: number; from: number; moved: boolean } | null = null
let swallow = false
function down(e: PointerEvent) {
  if (e.pointerType !== 'mouse' || e.button !== 0 || !track.value) return
  drag = { x: e.clientX, left: track.value.scrollLeft, from: shown, moved: false }
}
function move(e: PointerEvent) {
  const el = track.value
  if (!drag || !el) return
  const dx = e.clientX - drag.x
  if (!drag.moved && Math.abs(dx) > 5) {
    drag.moved = true
    dragging.value = true
    el.setPointerCapture(e.pointerId)
  }
  if (drag.moved) el.scrollLeft = drag.left - dx
}
async function up() {
  const el = track.value
  if (!drag || !el) return
  const moved = drag.moved
  const { left: start, from } = drag
  drag = null
  if (!moved) return
  swallow = true
  setTimeout(() => (swallow = false), 0)
  // A short, deliberate drag turns the page; a long one can cross several slides.
  const moved_by = (el.scrollLeft - start) / step()
  const to = from + (Math.abs(moved_by) > 1 ? Math.round(moved_by) : Math.abs(moved_by) > 0.18 ? Math.sign(moved_by) : 0)
  dragging.value = false
  await nextTick()
  go(to)
}
const click = (e: MouseEvent) => {
  if (swallow) {
    e.preventDefault()
    e.stopPropagation()
  }
}

function key(e: KeyboardEvent) {
  if (e.target !== e.currentTarget) return
  e.preventDefault()
  go(index.value + (e.key === 'ArrowRight' ? 1 : -1))
}

let observer: ResizeObserver | undefined
const measure = () => {
  count.value = track.value?.children.length ?? 0
  width.value = track.value?.clientWidth ?? 0
}
onMounted(() => {
  measure()
  if (index.value) track.value?.scrollTo({ left: index.value * step() })
  observer = new ResizeObserver(() => {
    measure()
    if (!dragging.value) track.value?.scrollTo({ left: shown * step() })
  })
  if (track.value) observer.observe(track.value)
})
onUpdated(measure)
onBeforeUnmount(() => {
  observer?.disconnect()
  cancelAnimationFrame(frame)
  clearTimeout(settle)
})

// The same quiet face the dialog's outline button uses, as a square.
const arrow = [
  'slab slab-thin inline-grid size-control shrink-0 cursor-pointer place-items-center bg-surface text-ink transition-state select-none',
  '[box-shadow:inset_0_0_0_100vmax_var(--_veil,transparent)] hover:slab-ink hover:[--_veil:var(--color-wash-hover)] active:slab-flat active:[--_veil:var(--color-wash-press)] focus-ring',
  'aria-disabled:cursor-not-allowed aria-disabled:opacity-40 aria-disabled:hover:slab-quiet aria-disabled:hover:[--_veil:transparent] aria-disabled:active:[--_lift:var(--depth-thin)]',
].join(' ')
</script>

<template>
  <div
    role="region"
    aria-roledescription="carousel"
    :aria-label="props.label ?? 'Carousel'"
    :class="cn('flex min-w-0 flex-col gap-3', props.class)"
    @keydown.right="key"
    @keydown.left="key"
  >
    <!-- One pass over the slides, so the count is read once per render. -->
    <template v-for="list in [vnodes()]" :key="0">
      <div class="min-w-0">
        <!-- A little room all round so slides' edges and shadows aren't cut by the scroller; the scroller never rounds its own corners. -->
        <div
          :ref="setTrack"
          tabindex="0"
          aria-live="polite"
          :class="
            cn(
              'scrollbar-none focus-ring relative -m-1 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-px-1 rounded-md p-1',
              dragging ? 'cursor-grabbing snap-none select-none' : 'cursor-grab',
            )
          "
          :style="{ gap: `${props.gap}rem` }"
          @scroll.passive="onScroll"
          @pointerdown="down"
          @pointermove="move"
          @pointerup="up"
          @pointercancel="up"
          @click.capture="click"
        >
          <div
            v-for="(slide, i) in list"
            :key="i"
            role="group"
            aria-roledescription="slide"
            :aria-label="`${i + 1} of ${list.length}`"
            class="min-w-0 shrink-0 snap-start"
            :style="{ flexBasis: basis }"
          >
            <component :is="slide" />
          </div>
        </div>
      </div>
      <!-- Controls under the track so they never cover a slide: previous, one dot per place the track can stop (the current one a primary face on its slab, wider than the rest), next. -->
      <div v-if="list.length - per > 0" class="flex items-center justify-center gap-2">
        <button type="button" aria-label="Previous slide" :aria-disabled="index <= 0 || undefined" :class="arrow" @click="index > 0 && go(index - 1)">
          <svg viewBox="0 0 16 16" class="size-5 rtl:-scale-x-100" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M10 3L5 8l5 5" />
          </svg>
        </button>
        <div class="flex flex-wrap items-center justify-center">
        <button
          v-for="n in list.length - per + 1"
          :key="n"
          type="button"
          :aria-label="`Go to slide ${n}`"
          :aria-current="index === n - 1 ? 'true' : undefined"
          class="group inline-grid h-6 min-w-6 cursor-pointer place-items-center rounded-md px-0.5 focus-ring"
          @click="go(n - 1)"
        >
          <span
            :class="
              cn(
                'block h-2.5 rounded-full border border-edge-strong bg-surface-tint transition-[width,background-color,border-color] duration-(--duration-tap) ease-(--ease-out) group-hover:bg-wash-press',
                index === n - 1 ? 'w-6 border-primary-slab bg-primary shadow-[0_1px_0_0_var(--color-primary-slab)] group-hover:bg-primary' : 'w-2.5',
              )
            "
          />
        </button>
        </div>
        <button type="button" aria-label="Next slide" :aria-disabled="index >= maxIndex || undefined" :class="arrow" @click="index < maxIndex && go(index + 1)">
          <svg viewBox="0 0 16 16" class="size-5 rtl:-scale-x-100" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M6 3l5 5-5 5" />
          </svg>
        </button>
      </div>
    </template>
  </div>
</template>
