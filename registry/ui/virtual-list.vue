<script setup lang="ts" generic="T">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    items: T[]
    /** Every row is exactly this tall (px). Leave it out and rows are measured as they are drawn, starting from `estimate`. */
    itemHeight?: number
    estimate?: number
    /** Any CSS length: the height of the scrolling window. */
    height?: string
    /** Rows drawn beyond the edges of the window. */
    overscan?: number
    /** Names the list for screen readers. */
    label: string
    /** Message when there are no items. */
    empty?: string
    class?: HTMLAttributes['class']
  }>(),
  { estimate: 48, height: '20rem', overscan: 4 },
)
defineSlots<{ item(props: { item: T; index: number }): unknown }>()

const scroller = ref<HTMLElement>()
const scrollTop = ref(0)
const viewH = ref(320)

// ---- row geometry: fixed, or measured as rows appear --------------------------------------------
const measured = shallowRef(new Map<number, number>())
const version = ref(0)
const heightOf = (i: number) => props.itemHeight ?? measured.value.get(i) ?? props.estimate
const offsets = computed(() => {
  void version.value
  const out = new Float64Array(props.items.length + 1)
  for (let i = 0; i < props.items.length; i++) out[i + 1] = out[i]! + heightOf(i)
  return out
})
const total = computed(() => offsets.value[props.items.length] ?? 0)
function indexAt(y: number) {
  let lo = 0
  let hi = props.items.length
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (offsets.value[mid + 1]! <= y) lo = mid + 1
    else hi = mid
  }
  return lo
}
const first = computed(() => Math.max(0, indexAt(scrollTop.value) - props.overscan))
const last = computed(() => Math.min(props.items.length, indexAt(scrollTop.value + viewH.value) + 1 + props.overscan))
const shown = computed(() => props.items.slice(first.value, last.value).map((item, k) => ({ item, index: first.value + k })))

let ro: ResizeObserver | undefined
let frame = 0
function track(el: unknown) {
  if (el instanceof HTMLElement && !props.itemHeight) ro?.observe(el)
}
onMounted(() => {
  ro = new ResizeObserver((entries) => {
    let changed = false
    for (const e of entries) {
      const el = e.target as HTMLElement
      if (el === scroller.value) {
        viewH.value = el.clientHeight
        continue
      }
      const i = Number(el.dataset.index)
      const h = Math.round(e.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight)
      if (measured.value.get(i) !== h) {
        measured.value.set(i, h)
        changed = true
      }
    }
    if (changed && !frame) frame = requestAnimationFrame(() => ((frame = 0), version.value++))
  })
  if (scroller.value) {
    ro.observe(scroller.value)
    viewH.value = scroller.value.clientHeight
  }
})
onBeforeUnmount(() => {
  ro?.disconnect()
  cancelAnimationFrame(frame)
})
watch(
  () => props.items.length,
  () => {
    measured.value = new Map()
    version.value++
  },
)

// ---- keyboard: the window is one tab stop and scrolls like a native list -------------------------
const step = computed(() => props.itemHeight ?? props.estimate)
function onKey(e: KeyboardEvent) {
  const el = scroller.value
  if (!el) return
  const by: Record<string, number> = { ArrowDown: step.value, ArrowUp: -step.value, PageDown: el.clientHeight, PageUp: -el.clientHeight }
  if (e.key in by) el.scrollTop += by[e.key]!
  else if (e.key === 'Home') el.scrollTop = 0
  else if (e.key === 'End') el.scrollTop = total.value
  else return
  e.preventDefault()
}

/** Scrolls so that row `index` is at the top of the window. */
async function scrollToIndex(index: number) {
  await nextTick()
  if (scroller.value) scroller.value.scrollTop = offsets.value[Math.max(0, Math.min(index, props.items.length - 1))] ?? 0
}
defineExpose({ scrollToIndex })
</script>

<template>
  <p v-if="!props.items.length" :class="cn('rounded-md px-4 py-10 text-center text-muted shadow-frame', props.class)">{{ props.empty ?? 'Nothing to show.' }}</p>
  <div
    v-else
    ref="scroller"
    role="list"
    tabindex="0"
    :aria-label="props.label"
    :class="cn('relative overflow-auto overscroll-contain rounded-md bg-surface shadow-frame focus-inset', props.class)"
    :style="{ height: props.height }"
    @scroll.passive="scrollTop = ($event.target as HTMLElement).scrollTop"
    @keydown="onKey"
  >
    <div class="relative" :style="{ height: `${total}px` }">
      <div class="absolute inset-x-0 top-0" :style="{ transform: `translateY(${offsets[first] ?? 0}px)` }">
        <div
          v-for="row in shown"
          :key="row.index"
          :ref="track"
          role="listitem"
          :data-index="row.index"
          :aria-setsize="props.items.length"
          :aria-posinset="row.index + 1"
          class="border-t border-edge first:border-t-0"
          :style="props.itemHeight ? { height: `${props.itemHeight}px` } : undefined"
        >
          <slot name="item" :item="row.item" :index="row.index" />
        </div>
      </div>
    </div>
  </div>
</template>
