<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, useId, watch, type HTMLAttributes } from 'vue'
import { announce } from '@/lib/announce'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/button.vue'
import Checkbox from '@/components/ui/checkbox.vue'
import Pagination from '@/components/ui/pagination.vue'
import Popover from '@/components/ui/popover.vue'

type Cell = string | number | Date | null | undefined
type Row = Record<string, Cell>
type Format = 'number' | 'currency' | 'date' | ((value: Cell, row: Row) => string)
interface Column {
  key: string
  label: string
  sortable?: boolean
  align?: 'start' | 'end'
  /** Adds a filter to the filter row: text (contains), select (one of the values), or number (min and max). */
  filter?: 'text' | 'select' | 'number'
  /** Options for a `select` filter. Defaults to the distinct values in the column. */
  options?: string[]
  /** How the cell is written. The raw value is still what sorts and filters, unless `value` is given. */
  format?: Format
  currency?: string
  /** What sorts and filters, when the cell shows something else (for example a custom cell slot). */
  value?: (row: Row) => Cell
  /** Starting width in px, when `resizable`. */
  width?: number
  /** Starts hidden; the Columns menu brings it back. */
  hidden?: boolean
}
interface Query {
  sort: { key: string; dir: 'asc' | 'desc' } | null
  filters: Record<string, { text?: string; select?: string; min?: number; max?: number }>
  search: string
  page: number
}

const props = withDefaults(
  defineProps<{
    columns: Column[]
    rows: Row[]
    selectable?: boolean
    pageSize?: number
    /** Field that identifies a row in `selected`. Defaults to the row's position in `rows`. */
    rowKey?: string
    /** The table's name for screen readers: it is the table's caption, hidden unless `showCaption`. */
    label?: string
    showCaption?: boolean
    /** Message when there are no rows. The `empty` slot replaces it. */
    empty?: string
    /** A search box above the table that matches any column. */
    searchable?: boolean
    searchDebounce?: number
    /** Column resizing: drag the edge, or focus it and use the arrow keys (Shift for bigger steps, Home resets, Esc cancels). */
    resizable?: boolean
    /** A Columns menu to show and hide columns. */
    columnMenu?: boolean
    /** Keeps the first column in view while the table scrolls sideways. */
    stickyFirst?: boolean
    /** Any CSS length. The table scrolls inside it and its header stays in view. */
    maxHeight?: string
    dense?: boolean
    striped?: boolean
    /** Below a medium container width every row becomes a card with the column labels beside the values. */
    cards?: boolean
    /** Server mode: the table does not sort, filter or page itself. It emits `queryChange` and shows what `rows` and `total` say. */
    manual?: boolean
    total?: number
    loading?: boolean
    error?: string
    /** Names a row's checkbox: a column key, or a function. Defaults to the first column. */
    rowLabel?: string | ((row: Row) => string)
    /** Turns on windowing once there are more rows than this. Rows are `rowHeight` tall. */
    virtual?: number
    rowHeight?: number
    class?: HTMLAttributes['class']
  }>(),
  { searchDebounce: 200, label: 'Data table' },
)
const emit = defineEmits<{ queryChange: [query: Query]; retry: [] }>()
const selected = defineModel<(string | number)[]>('selected', { default: () => [] })
const page = defineModel<number>('page', { default: 1 })
defineSlots<{
  /** Replaces the table's empty message. */
  empty?(): unknown
  /** Replaces one cell. The slot is named `cell-<column key>`. */
  [name: `cell-${string}`]: ((p: { row: Row; value: Cell }) => unknown) | undefined
}>()

const uid = useId()
const sort = ref<Query['sort']>(null)
const draft = reactive<{ search: string; filters: Query['filters'] }>({ search: '', filters: {} })
const applied = ref<{ search: string; filters: Query['filters'] }>({ search: '', filters: {} })
const filtersOpen = ref(false)
const hiddenKeys = ref(new Set(props.columns.filter((c) => c.hidden).map((c) => c.key)))
function toggleColumn(key: string, on: boolean) {
  const next = new Set(hiddenKeys.value)
  if (on) next.delete(key)
  else next.add(key)
  hiddenKeys.value = next
}
const widths = reactive<Record<string, number>>({})

const shownColumns = computed(() => props.columns.filter((c) => !hiddenKeys.value.has(c.key)))
const hasFilters = computed(() => props.columns.some((c) => c.filter))
const hasToolbar = computed(() => props.searchable || hasFilters.value || props.columnMenu)

// ---- values, text and filters -------------------------------------------------------------------
const plain = (s: unknown) => String(s ?? '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
const valueOf = (row: Row, c: Column): Cell => (c.value ? c.value(row) : row[c.key])
const raw = (v: Cell) => (v instanceof Date ? v.getTime() : v)
function display(c: Column, row: Row): string {
  const v = valueOf(row, c)
  if (v === null || v === undefined || v === '') return ''
  if (typeof c.format === 'function') return c.format(v, row)
  if (c.format === 'number') return new Intl.NumberFormat().format(Number(v))
  if (c.format === 'currency') return new Intl.NumberFormat(undefined, { style: 'currency', currency: c.currency ?? 'USD' }).format(Number(v))
  if (c.format === 'date') return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(v instanceof Date ? v : new Date(v))
  return v instanceof Date ? v.toLocaleDateString() : String(v)
}
// Numeric columns are set in the mono voice, aligned to the end.
const numeric = (c: Column) =>
  c.align === 'end' ||
  c.format === 'number' ||
  c.format === 'currency' ||
  (!c.align && !c.format && props.rows.length > 0 && props.rows.every((r) => typeof valueOf(r, c) === 'number'))
const optionsOf = (c: Column) => c.options ?? [...new Set(props.rows.map((r) => String(valueOf(r, c) ?? '')))].filter(Boolean).sort()

let timer: ReturnType<typeof setTimeout> | undefined
watch(
  draft,
  () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      applied.value = { search: draft.search.trim(), filters: JSON.parse(JSON.stringify(draft.filters)) }
    }, props.searchDebounce)
  },
  { deep: true },
)
onBeforeUnmount(() => clearTimeout(timer))

const activeFilters = computed(() =>
  Object.values(applied.value.filters).filter((f) => f.text || f.select || f.min !== undefined || f.max !== undefined).length,
)
const dirty = computed(() => !!draft.search || Object.values(draft.filters).some((f) => f.text || f.select || f.min !== undefined || f.max !== undefined))
function clearFilters() {
  draft.search = ''
  for (const k of Object.keys(draft.filters)) delete draft.filters[k]
}
const num = (e: Event) => {
  const v = (e.target as HTMLInputElement).value
  return v === '' ? undefined : Number(v)
}
const patch = (key: string, part: Partial<Query['filters'][string]>) => {
  draft.filters[key] = { ...draft.filters[key], ...part }
}

// ---- pipeline: filter, sort, page --------------------------------------------------------------
const keyOf = (row: Row, i: number): string | number => (props.rowKey ? (row[props.rowKey] as string | number) : i)
const filtered = computed(() => {
  const list = props.rows.map((row, i) => ({ row, key: keyOf(row, i), at: i }))
  if (props.manual) return list
  const { search, filters } = applied.value
  const q = plain(search)
  return list.filter(({ row }) => {
    if (q && !props.columns.some((c) => plain(display(c, row)).includes(q) || plain(valueOf(row, c)).includes(q))) return false
    for (const c of props.columns) {
      const f = filters[c.key]
      if (!f) continue
      const v = valueOf(row, c)
      if (f.text && !plain(display(c, row)).includes(plain(f.text)) && !plain(v).includes(plain(f.text))) return false
      if (f.select && String(v ?? '') !== f.select) return false
      if (f.min !== undefined && !(Number(raw(v)) >= f.min)) return false
      if (f.max !== undefined && !(Number(raw(v)) <= f.max)) return false
    }
    return true
  })
})
const sorted = computed(() => {
  if (props.manual || !sort.value) return filtered.value
  const c = props.columns.find((x) => x.key === sort.value!.key)
  if (!c) return filtered.value
  const m = sort.value.dir === 'asc' ? 1 : -1
  return [...filtered.value].sort((a, b) => {
    const x = raw(valueOf(a.row, c))
    const y = raw(valueOf(b.row, c))
    if (typeof x === 'number' && typeof y === 'number') return (x - y) * m
    return String(x ?? '').localeCompare(String(y ?? ''), undefined, { numeric: true }) * m
  })
})
const count = computed(() => (props.manual ? (props.total ?? props.rows.length) : sorted.value.length))
const visible = computed(() =>
  props.pageSize && !props.manual ? sorted.value.slice((page.value - 1) * props.pageSize, page.value * props.pageSize) : sorted.value,
)
watch([sort, applied, () => props.rows.length], () => (page.value = 1))
const pages = computed(() => (props.pageSize ? Math.max(1, Math.ceil(count.value / props.pageSize)) : 1))
watch(pages, (n) => page.value > n && (page.value = n))

watch([sort, applied, page], () => props.manual && emit('queryChange', { sort: sort.value, filters: applied.value.filters, search: applied.value.search, page: page.value }))

// none -> ascending -> descending -> none
function toggleSort(c: Column) {
  const s = sort.value
  sort.value = !s || s.key !== c.key ? { key: c.key, dir: 'asc' } : s.dir === 'asc' ? { key: c.key, dir: 'desc' } : null
  announce(sort.value ? `Sorted by ${c.label}, ${sort.value.dir === 'asc' ? 'ascending' : 'descending'}` : 'Sorting cleared')
}
const ariaSort = (key: string) => (sort.value?.key === key ? (sort.value.dir === 'asc' ? 'ascending' : 'descending') : undefined)

watch(applied, () => {
  const n = count.value
  announce(n === 0 ? 'No rows match' : `${n} row${n === 1 ? '' : 's'}`)
})

// ---- selection ---------------------------------------------------------------------------------
const picked = computed(() => new Set(selected.value))
const pageState = computed<'true' | 'false' | 'mixed'>(() => {
  const n = visible.value.filter((v) => picked.value.has(v.key)).length
  return n === 0 ? 'false' : n === visible.value.length ? 'true' : 'mixed'
})
function toggleRow(key: string | number) {
  selected.value = picked.value.has(key) ? selected.value.filter((k) => k !== key) : [...selected.value, key]
}
function togglePage() {
  const keys = visible.value.map((v) => v.key)
  selected.value = pageState.value === 'true' ? selected.value.filter((k) => !keys.includes(k)) : [...new Set([...selected.value, ...keys])]
}
watch(
  () => selected.value.length,
  (n, was) => n !== was && announce(n ? `${n} selected` : 'Selection cleared'),
)
function labelOfRow(row: Row) {
  if (typeof props.rowLabel === 'function') return props.rowLabel(row)
  const key = props.rowLabel ?? shownColumns.value[0]?.key ?? props.columns[0]?.key ?? ''
  return String(row[key] ?? 'row')
}

const range = computed(() => {
  const size = props.pageSize ?? count.value
  const from = count.value ? (page.value - 1) * size + 1 : 0
  return `${from}–${Math.min(page.value * size, count.value)} of ${count.value}`
})
const paged = computed(() => !!props.pageSize && count.value > props.pageSize)

// ---- column resize -----------------------------------------------------------------------------
const heads = ref<HTMLElement[]>([])
const start: Record<string, number> = {}
function widthOf(key: string) {
  if (widths[key]) return widths[key]
  const th = heads.value.find((h) => h?.dataset.key === key)
  return Math.round(th?.getBoundingClientRect().width ?? props.columns.find((c) => c.key === key)?.width ?? 120)
}
const MIN = 64
function setWidth(key: string, w: number) {
  // The first resize pins every column at its current width, so the others do not jump.
  for (const c of shownColumns.value) if (!widths[c.key]) widths[c.key] = widthOf(c.key)
  widths[key] = Math.max(MIN, Math.round(w))
}
function resizeKey(e: KeyboardEvent, c: Column) {
  const step = e.shiftKey ? 40 : 10
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    e.preventDefault()
    start[c.key] ??= widthOf(c.key)
    const dir = (e.key === 'ArrowRight' ? 1 : -1) * (getComputedStyle(e.currentTarget as HTMLElement).direction === 'rtl' ? -1 : 1)
    setWidth(c.key, widthOf(c.key) + dir * step)
  } else if (e.key === 'Home') {
    e.preventDefault()
    start[c.key] ??= widthOf(c.key)
    setWidth(c.key, c.width ?? 160)
  } else if (e.key === 'Escape' && start[c.key] !== undefined) {
    setWidth(c.key, start[c.key]!)
    delete start[c.key]
  }
}
function resizeDrag(e: PointerEvent, c: Column) {
  const el = e.currentTarget as HTMLElement
  el.setPointerCapture(e.pointerId)
  const x0 = e.clientX
  const w0 = widthOf(c.key)
  const rtl = getComputedStyle(el).direction === 'rtl' ? -1 : 1
  const move = (ev: PointerEvent) => setWidth(c.key, w0 + (ev.clientX - x0) * rtl)
  const up = () => {
    el.removeEventListener('pointermove', move)
    el.removeEventListener('pointerup', up)
  }
  el.addEventListener('pointermove', move)
  el.addEventListener('pointerup', up)
}
const pinned = computed(() => props.resizable && shownColumns.value.every((c) => widths[c.key]))
const tableWidth = computed(() => (pinned.value ? `${shownColumns.value.reduce((n, c) => n + widths[c.key]!, 0) + (props.selectable ? 40 : 0)}px` : undefined))

// ---- the scroll region: a tab stop and a named region only while it really overflows ------------
const scroller = ref<HTMLElement>()
const overflows = ref(false)
const scrollTop = ref(0)
const viewH = ref(384)
let ro: ResizeObserver | undefined
function measure() {
  const el = scroller.value
  if (!el) return
  overflows.value = el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1
  viewH.value = el.clientHeight || 384
}
onMounted(() => {
  // Resizable columns start pinned at their drawn widths, so each handle can report its value.
  if (props.resizable) nextTick(() => shownColumns.value.forEach((c) => (widths[c.key] ||= widthOf(c.key))))
  ro = new ResizeObserver(measure)
  if (scroller.value) ro.observe(scroller.value)
  if (scroller.value?.firstElementChild) ro.observe(scroller.value.firstElementChild)
  measure()
})
onBeforeUnmount(() => ro?.disconnect())
watch([visible, shownColumns], () => requestAnimationFrame(measure), { flush: 'post' })

// ---- windowing ---------------------------------------------------------------------------------
const virtualOn = computed(() => !!props.virtual && visible.value.length > props.virtual)
const rowH = computed(() => props.rowHeight ?? (props.dense ? 37 : 49))
const from = computed(() => (virtualOn.value ? Math.max(0, Math.floor(scrollTop.value / rowH.value) - 6) : 0))
const to = computed(() => (virtualOn.value ? Math.min(visible.value.length, Math.ceil((scrollTop.value + viewH.value) / rowH.value) + 6) : visible.value.length))
const windowed = computed(() => visible.value.slice(from.value, to.value))
const scrollMax = computed(() => props.maxHeight ?? (virtualOn.value ? '24rem' : undefined))

// ---- looks -------------------------------------------------------------------------------------
const outline =
  'slab type-button inline-flex h-control cursor-pointer items-center justify-center gap-2 bg-surface px-[calc(1rem-var(--stroke-edge))] text-ink transition-state select-none hover:slab-ink hover:shadow-[inset_0_0_0_100vmax_var(--color-wash-hover)] active:slab-flat active:shadow-[inset_0_0_0_100vmax_var(--color-wash-press)] focus-ring'
const field = 'well focus-ring h-control w-full min-w-24 px-2 font-normal normal-case'
// The same three states as List and Description list: a quiet message, pulsing bars, a danger message with a way back.
const stateCell = 'px-4 py-10 text-center'
// The same face as Checkbox, drawn on a button so a row needs no label: a bordered item, or a primary face on a thin slab.
const box = [
  'slab slab-sm relative flex size-check shrink-0 cursor-pointer items-center justify-center bg-surface bg-clip-padding transition-state [--_lift:0px] focus-ring',
  'hover:bg-wash-hover hover:[--_ring:var(--color-wash-ring)] active:bg-wash-press active:[--_ring:var(--color-ink)]',
  'aria-checked:slab-primary aria-checked:bg-primary aria-checked:bg-clip-border aria-checked:[--_lift:var(--depth-thin)] aria-checked:hover:bg-primary-hover aria-checked:active:bg-primary-press aria-checked:active:[--_lift:0px]',
  'aria-[checked=mixed]:slab-primary aria-[checked=mixed]:bg-primary aria-[checked=mixed]:bg-clip-border aria-[checked=mixed]:[--_lift:var(--depth-thin)] aria-[checked=mixed]:hover:bg-primary-hover',
].join(' ')
const rule = 'shadow-[inset_0_-2px_0_0_var(--color-edge-strong)]'
const py = computed(() => (props.dense ? 'py-1.5' : 'py-3'))
// Cells that stay put while the table scrolls sideways need a solid face, so the wash is laid on as an inset fill.
const stickyCell = (ci: number) => (props.stickyFirst && ci === 0 ? 'sticky start-0 z-10 bg-surface' + (props.selectable ? ' md:start-10' : '') : '')
const cardMode = computed(() => !!props.cards)
const wash =
  'group-not-data-[selected]:group-hover:bg-wash-hover group-not-data-[selected]:group-hover:[&.sticky]:bg-surface group-not-data-[selected]:group-hover:[&.sticky]:shadow-[inset_0_0_0_100vmax_var(--color-wash-hover)] group-data-[selected]:bg-primary-soft'
const placeholders = computed(() => Array.from({ length: Math.min(props.pageSize ?? 5, 8) }, (_, i) => i))
const colspan = computed(() => shownColumns.value.length + (props.selectable ? 1 : 0))
</script>

<template>
  <!-- The frame is drawn once, above the scroller, so nothing covers it. -->
  <div
    :class="
      cn(
        '@container relative rounded-md bg-surface',
        'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-frame',
        props.class,
      )
    "
    :aria-busy="props.loading || undefined"
  >
    <div v-if="hasToolbar" class="flex flex-wrap items-center gap-2 rounded-t-[inherit] border-b border-edge p-2">
      <label v-if="props.searchable" class="relative min-w-48 flex-1 @md:max-w-xs">
        <span class="sr-only">Search the table</span>
        <svg viewBox="0 0 24 24" class="pointer-events-none absolute start-3 top-1/2 size-5 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input v-model="draft.search" type="search" placeholder="Search" autocomplete="off" :class="cn('well focus-ring h-control w-full ps-10 pe-3 [&::-webkit-search-cancel-button]:appearance-none')" />
      </label>
      <div class="ms-auto flex flex-wrap items-center gap-2">
        <button v-if="dirty" type="button" class="type-button cursor-pointer rounded-md px-2 py-1 text-muted underline underline-offset-4 transition-state hover:text-ink focus-ring" @click="clearFilters">Clear</button>
        <button v-if="hasFilters" type="button" :class="outline" :aria-expanded="filtersOpen" :aria-controls="`${uid}-filters`" @click="filtersOpen = !filtersOpen">
          Filters<span v-if="activeFilters" class="numeral rounded-sm bg-primary px-1.5 text-sm text-on-primary">{{ activeFilters }}<span class="sr-only"> active</span></span>
        </button>
        <Popover v-if="props.columnMenu" class="w-56">
          <template #trigger><button type="button" :class="outline">Columns</button></template>
          <fieldset class="m-0 grid gap-0 border-0 p-0">
            <legend class="kicker mb-1 p-0">Show columns</legend>
            <Checkbox
              v-for="c in props.columns"
              :key="c.key"
              :label="c.label"
              :model-value="!hiddenKeys.has(c.key)"
              :disabled="!hiddenKeys.has(c.key) && shownColumns.length === 1"
              @update:model-value="toggleColumn(c.key, $event === true)"
            />
          </fieldset>
        </Popover>
      </div>
    </div>

    <div
      ref="scroller"
      :class="cn('relative overflow-auto', !hasToolbar && 'rounded-t-[inherit]', 'focus-inset')"
      :style="{ maxHeight: scrollMax }"
      :tabindex="overflows ? 0 : undefined"
      :role="overflows ? 'region' : undefined"
      :aria-label="overflows ? props.label : undefined"
      @scroll.passive="scrollTop = ($event.target as HTMLElement).scrollTop"
    >
      <table
        :class="cn('w-full border-collapse', props.resizable && 'table-fixed')"
        :style="{ width: tableWidth, minWidth: pinned ? '100%' : undefined }"
        :aria-rowcount="virtualOn ? visible.length + 1 : undefined"
        :role="cardMode ? 'table' : undefined"
      >
        <caption :class="props.showCaption ? 'kicker px-4 py-3 text-start' : 'sr-only'">{{ props.label }}</caption>
        <colgroup v-if="props.resizable">
          <col v-if="props.selectable" class="w-10" />
          <col v-for="c in shownColumns" :key="c.key" :style="{ width: widths[c.key] ? `${widths[c.key]}px` : c.width ? `${c.width}px` : undefined }" />
        </colgroup>
        <thead :class="cn(props.maxHeight || virtualOn ? 'sticky top-0 z-20' : '', cardMode && '@max-md:sr-only')" :role="cardMode ? 'rowgroup' : undefined">
          <tr aria-rowindex="1" :role="cardMode ? 'row' : undefined">
            <th
              v-if="props.selectable"
              scope="col"
              :role="cardMode ? 'columnheader' : undefined"
              :class="cn('w-10 bg-surface-tint ps-4 pe-0 text-start', py, rule, props.stickyFirst && 'sticky start-0 z-10')"
            >
              <button type="button" role="checkbox" :aria-checked="pageState" aria-label="Select all rows on this page" :class="box" @click="togglePage">
                <svg v-if="pageState === 'true'" viewBox="0 0 256 256" class="size-4 text-on-primary" fill="currentColor" aria-hidden="true">
                  <path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" />
                </svg>
                <svg v-else-if="pageState === 'mixed'" viewBox="0 0 256 256" class="size-4 text-on-primary" fill="currentColor" aria-hidden="true">
                  <rect x="48" y="108" width="160" height="40" rx="20" />
                </svg>
              </button>
            </th>
            <th
              v-for="(c, ci) in shownColumns"
              :key="c.key"
              :ref="(el) => { if (el) heads[ci] = el as HTMLElement }"
              :data-key="c.key"
              scope="col"
              :role="cardMode ? 'columnheader' : undefined"
              :aria-sort="ariaSort(c.key)"
              :class="
                cn(
                  // tinted mono heading in ink over a heavier rule
                  'kicker relative bg-surface-tint px-4 text-start whitespace-nowrap text-ink!',
                  py,
                  rule,
                  numeric(c) && 'text-end',
                  stickyCell(ci),
                  props.stickyFirst && ci === 0 && 'bg-surface-tint',
                )
              "
            >
              <button
                v-if="c.sortable"
                type="button"
                :class="
                  cn(
                    '-mx-1.5 inline-flex cursor-pointer items-center gap-1 rounded-sm px-1.5 py-0.5 uppercase transition-state hover:bg-wash-hover active:bg-wash-press focus-ring',
                    numeric(c) && 'flex-row-reverse',
                  )
                "
                @click="toggleSort(c)"
              >
                {{ c.label }}
                <svg viewBox="0 0 16 16" class="size-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M4.5 6.5L8 3l3.5 3.5" :class="sort?.key !== c.key ? 'opacity-50' : sort.dir === 'desc' ? 'opacity-25' : 'opacity-100'" />
                  <path d="M4.5 9.5L8 13l3.5-3.5" :class="sort?.key !== c.key ? 'opacity-50' : sort.dir === 'asc' ? 'opacity-25' : 'opacity-100'" />
                </svg>
                <span class="sr-only">{{ sort?.key === c.key ? `, sorted ${sort.dir === 'asc' ? 'ascending' : 'descending'}` : ', sort' }}</span>
              </button>
              <template v-else>{{ c.label }}</template>
              <!-- The resize handle is a separator you can focus: arrows resize, Shift takes bigger steps, Home resets, Esc cancels. -->
              <span
                v-if="props.resizable"
                role="separator"
                aria-orientation="vertical"
                tabindex="0"
                :aria-label="`Resize ${c.label}`"
                :aria-valuenow="widths[c.key] ?? c.width"
                :aria-valuemin="MIN"
                class="absolute inset-y-0 end-0 z-10 flex w-3 cursor-col-resize touch-none items-center justify-center outline-none after:h-1/2 after:w-px after:bg-edge-strong after:transition-state hover:after:bg-ink focus-visible:after:w-0.5 focus-visible:after:bg-primary"
                @pointerdown.prevent="resizeDrag($event, c)"
                @keydown="resizeKey($event, c)"
                @blur="delete start[c.key]"
              />
            </th>
          </tr>
          <tr v-if="filtersOpen && hasFilters" :id="`${uid}-filters`" :role="cardMode ? 'row' : undefined">
            <th v-if="props.selectable" class="bg-surface-tint" :class="props.stickyFirst && 'sticky start-0 z-10'" />
            <th v-for="(c, ci) in shownColumns" :key="c.key" scope="col" :class="cn('bg-surface-tint px-4 pb-3 text-start align-top', stickyCell(ci), props.stickyFirst && ci === 0 && 'bg-surface-tint')">
              <input
                v-if="c.filter === 'text'"
                type="search"
                :value="draft.filters[c.key]?.text ?? ''"
                :aria-label="`Filter ${c.label}`"
                placeholder="Contains…"
                :class="field"
                @input="patch(c.key, { text: ($event.target as HTMLInputElement).value })"
              />
              <select
                v-else-if="c.filter === 'select'"
                :value="draft.filters[c.key]?.select ?? ''"
                :aria-label="`Filter ${c.label}`"
                :class="field"
                @change="patch(c.key, { select: ($event.target as HTMLSelectElement).value })"
              >
                <option value="">All</option>
                <option v-for="o in optionsOf(c)" :key="o" :value="o">{{ o }}</option>
              </select>
              <span v-else-if="c.filter === 'number'" class="flex gap-1">
                <input type="number" :value="draft.filters[c.key]?.min ?? ''" :aria-label="`${c.label} minimum`" placeholder="Min" :class="cn(field, 'min-w-16')" @input="patch(c.key, { min: num($event) })" />
                <input type="number" :value="draft.filters[c.key]?.max ?? ''" :aria-label="`${c.label} maximum`" placeholder="Max" :class="cn(field, 'min-w-16')" @input="patch(c.key, { max: num($event) })" />
              </span>
            </th>
          </tr>
        </thead>
        <tbody :class="cn(props.loading && props.rows.length > 0 && 'opacity-60 transition-state')" :role="cardMode ? 'rowgroup' : undefined">
          <template v-if="props.error">
            <tr><td :colspan="colspan" :class="stateCell">
              <p class="font-medium text-danger" role="alert">{{ props.error }}</p>
              <Button class="mt-3" @click="emit('retry')">Retry</Button>
            </td></tr>
          </template>
          <template v-else-if="props.loading && !props.rows.length">
            <tr v-for="i in placeholders" :key="i" aria-hidden="true">
              <td v-if="props.selectable" class="border-t border-edge ps-4" :class="py" />
              <td v-for="c in shownColumns" :key="c.key" :class="cn('border-t border-edge px-4', py)">
                <span class="block h-4 w-3/4 animate-pulse-soft rounded-sm bg-surface-tint" />
              </td>
            </tr>
            <tr><td :colspan="colspan" class="sr-only">Loading…</td></tr>
          </template>
          <template v-else>
            <tr v-if="virtualOn && from > 0" aria-hidden="true" :style="{ height: `${from * rowH}px` }"><td :colspan="colspan" /></tr>
            <tr
              v-for="(v, i) in windowed"
              :key="v.key"
              :class="
                cn(
                  'group',
                  cardMode && '@max-md:mb-3 @max-md:block @max-md:rounded-md @max-md:border @max-md:border-edge @max-md:bg-surface @max-md:p-3',
                )
              "
              :style="virtualOn ? { height: `${rowH}px` } : undefined"
              :aria-rowindex="virtualOn ? from + i + 2 : undefined"
              :role="cardMode ? 'row' : undefined"
              :data-selected="picked.has(v.key) ? '' : undefined"
            >
              <td
                v-if="props.selectable"
                :role="cardMode ? 'cell' : undefined"
                :class="
                  cn(
                    'w-10 border-t border-edge ps-4 pe-0 align-middle transition-state group-first:border-t-0 group-data-[selected]:shadow-[inset_2px_0_0_0_var(--color-primary)] rtl:group-data-[selected]:shadow-[inset_-2px_0_0_0_var(--color-primary)]',
                    py,
                    wash,
                    props.striped && i % 2 === 1 && 'bg-surface-tint/50',
                    props.stickyFirst && 'sticky start-0 z-10 bg-surface',
                    cardMode && '@max-md:block @max-md:w-auto @max-md:border-t-0 @max-md:p-0 @max-md:pb-2',
                  )
                "
              >
                <button type="button" role="checkbox" :aria-checked="picked.has(v.key)" :aria-label="`Select ${labelOfRow(v.row)}`" :class="box" @click="toggleRow(v.key)">
                  <svg v-if="picked.has(v.key)" viewBox="0 0 256 256" class="size-4 text-on-primary" fill="currentColor" aria-hidden="true">
                    <path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" />
                  </svg>
                </button>
              </td>
              <td
                v-for="(c, ci) in shownColumns"
                :key="c.key"
                :data-label="c.label"
                :role="cardMode ? 'cell' : undefined"
                :class="
                  cn(
                    'border-t border-edge px-4 align-middle transition-state group-first:border-t-0',
                    py,
                    wash,
                    props.striped && i % 2 === 1 && 'bg-surface-tint/50',
                    numeric(c) && 'numeral text-end whitespace-nowrap',
                    virtualOn && 'overflow-hidden text-ellipsis whitespace-nowrap',
                    stickyCell(ci),
                    props.stickyFirst && ci === 0 && props.striped && i % 2 === 1 && 'bg-[color-mix(in_srgb,var(--color-surface-tint)_50%,var(--color-surface))]',
                    cardMode &&
                      '@max-md:flex @max-md:items-baseline @max-md:justify-between @max-md:gap-4 @max-md:border-t-0 @max-md:px-0 @max-md:py-1 @max-md:text-end @max-md:before:kicker @max-md:before:text-start @max-md:before:content-[attr(data-label)]',
                  )
                "
              >
                <slot :name="`cell-${c.key}`" :row="v.row" :value="valueOf(v.row, c)">{{ display(c, v.row) }}</slot>
              </td>
            </tr>
            <tr v-if="virtualOn && to < visible.length" aria-hidden="true" :style="{ height: `${(visible.length - to) * rowH}px` }"><td :colspan="colspan" /></tr>
            <tr v-if="visible.length === 0">
              <td :colspan="colspan" :class="cn(stateCell, 'text-muted')">
                <slot name="empty">{{ props.empty ?? 'Nothing to show.' }}</slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div v-if="props.selectable || paged" class="flex flex-wrap items-center justify-between gap-3 rounded-b-[inherit] border-t border-edge px-4 py-2">
      <p class="numeral text-sm text-muted">
        {{ props.selectable && selected.length ? `${selected.length} selected` : range }}
      </p>
      <Pagination v-if="paged" v-model:page="page" :total="count" :items-per-page="props.pageSize" />
    </div>
  </div>
</template>
