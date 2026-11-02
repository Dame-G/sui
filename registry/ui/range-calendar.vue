<script setup lang="ts">
import { computed, ref, shallowRef, type HTMLAttributes } from 'vue'
import { getLocalTimeZone, today, type DateValue } from '@internationalized/date'
import type { DateRange } from 'reka-ui'
import {
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
  RangeCalendarHeader,
  RangeCalendarNext,
  RangeCalendarPrev,
  RangeCalendarRoot,
} from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{
  minValue?: DateValue
  maxValue?: DateValue
  /** Dates that can't be picked, beyond min and max: return true to block one. */
  disabledDate?: (date: DateValue) => boolean
  /** Dates to flag with a dot (events, availability, deadlines). */
  marked?: DateValue[]
  /** Quick picks shown under the grid, e.g. { label: 'Last 7 days', value: { start, end } }. */
  presets?: { label: string; value: { start: DateValue; end: DateValue } }[]
  /** A Clear row under the grid. */
  footer?: boolean
  class?: HTMLAttributes['class']
}>()
const model = defineModel<DateRange>({ default: () => ({ start: undefined, end: undefined }) })

const isMarked = (d: DateValue) => !!props.marked?.some((m) => m.compare(d) === 0)
const blocked = (r: { start: DateValue; end: DateValue }) =>
  (!!props.minValue && r.start.compare(props.minValue) < 0) || (!!props.maxValue && r.end.compare(props.maxValue) > 0)
function choose(r: { start: DateValue; end: DateValue }) {
  model.value = { start: r.start, end: r.end }
  placeholder.value = r.start
}

// The heading drills in: days -> years -> months -> days.
const placeholder = shallowRef<DateValue>(model.value.start ?? today(getLocalTimeZone()))
const view = ref<'days' | 'months' | 'years'>('days')
const tz = getLocalTimeZone()
const now = today(tz)
const fmt = (d: DateValue, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(undefined, o).format(d.toDate(tz))

const yearStart = computed(() => placeholder.value.year - (((placeholder.value.year % 12) + 12) % 12))
const years = computed(() => Array.from({ length: 12 }, (_, i) => yearStart.value + i))
const months = computed(() => Array.from({ length: 12 }, (_, i) => placeholder.value.set({ month: i + 1, day: 1 })))
const heading = computed(() =>
  view.value === 'years'
    ? `${yearStart.value} – ${yearStart.value + 11}`
    : view.value === 'months'
      ? String(placeholder.value.year)
      : fmt(placeholder.value, { month: 'long', year: 'numeric' }),
)

function step(dir: 1 | -1) {
  placeholder.value = placeholder.value.add({ years: dir * (view.value === 'years' ? 12 : 1) })
}
function pickYear(y: number) {
  placeholder.value = placeholder.value.set({ year: y })
  view.value = 'months'
}
function pickMonth(m: DateValue) {
  placeholder.value = m
  view.value = 'days'
}
const yearOff = (y: number) =>
  (!!props.minValue && y < props.minValue.year) || (!!props.maxValue && y > props.maxValue.year)
const monthOff = (m: DateValue) =>
  (!!props.minValue && m.add({ months: 1 }).compare(props.minValue) <= 0) || (!!props.maxValue && m.compare(props.maxValue) > 0)

// The same quiet icon button as the dialog's close.
const nav =
  'inline-grid size-tap shrink-0 cursor-pointer place-items-center rounded-md transition-state hover:bg-wash-hover hover:shadow-[inset_0_0_0_var(--stroke-edge)_var(--color-wash-ring)] active:bg-wash-press active:shadow-[inset_0_0_0_var(--stroke-edge)_var(--color-ink)] focus-ring data-[disabled]:cursor-not-allowed data-[disabled]:text-muted data-[disabled]:hover:bg-transparent data-[disabled]:hover:shadow-none'

// The band behind a range lives on the cell, so it runs unbroken from day to day. The first and last days get half a band, tucked behind their face.
const band = cn(
  'relative p-0 first:rounded-s-md last:rounded-e-md',
  // (full class names, so Tailwind can see them)
  'has-[[data-selected]:not([data-selection-start]):not([data-selection-end])]:bg-primary-soft',
  'has-[[data-highlighted]:not([data-selected])]:bg-primary-soft/60',
  'has-[[data-selection-start]:not([data-selection-end])]:before:absolute has-[[data-selection-start]:not([data-selection-end])]:before:inset-y-0 has-[[data-selection-start]:not([data-selection-end])]:before:left-1/2 has-[[data-selection-start]:not([data-selection-end])]:before:right-0 has-[[data-selection-start]:not([data-selection-end])]:before:bg-primary-soft has-[[data-selection-start]:not([data-selection-end])]:rtl:before:left-0 has-[[data-selection-start]:not([data-selection-end])]:rtl:before:right-1/2',
  'has-[[data-selection-end]:not([data-selection-start])]:before:absolute has-[[data-selection-end]:not([data-selection-start])]:before:inset-y-0 has-[[data-selection-end]:not([data-selection-start])]:before:left-0 has-[[data-selection-end]:not([data-selection-start])]:before:right-1/2 has-[[data-selection-end]:not([data-selection-start])]:before:bg-primary-soft has-[[data-selection-end]:not([data-selection-start])]:rtl:before:left-1/2 has-[[data-selection-end]:not([data-selection-start])]:rtl:before:right-0',
)

const quick = 'kicker h-9 cursor-pointer rounded-md px-2 text-ink transition-state hover:bg-wash-hover hover:[box-shadow:inset_0_0_0_var(--stroke-edge)_var(--color-wash-ring)] active:bg-wash-press focus-ring disabled:cursor-not-allowed disabled:text-muted disabled:hover:bg-transparent disabled:hover:shadow-none'

// A year or month face: the same look as a day.
const pick = cn(
  'numeral h-tap cursor-pointer rounded-md border border-transparent text-ink transition-state select-none focus-inset',
  'hover:bg-wash-hover hover:[box-shadow:inset_0_0_0_var(--stroke-edge)_var(--color-wash-ring)] active:bg-wash-press',
  'aria-[current=date]:border-edge-strong',
  'data-[selected]:slab-thin data-[selected]:slab-primary data-[selected]:slab-sm data-[selected]:bg-primary data-[selected]:bg-clip-border data-[selected]:text-on-primary data-[selected]:shadow-none data-[selected]:hover:bg-primary-hover',
  'disabled:cursor-not-allowed disabled:text-muted disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:shadow-none',
)
</script>

<template>
  <RangeCalendarRoot
    v-slot="{ weekDays, grid }"
    v-model="model"
    v-model:placeholder="placeholder"
    :min-value="props.minValue"
    :max-value="props.maxValue"
    :is-date-disabled="props.disabledDate"
    fixed-weeks
    :class="cn('w-fit text-ink', props.class)"
  >
    <RangeCalendarHeader class="mb-2 flex items-center justify-between gap-2">
      <RangeCalendarPrev v-if="view === 'days'" aria-label="Previous month" :class="nav">
        <svg class="size-5" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg>
      </RangeCalendarPrev>
      <button v-else type="button" :aria-label="view === 'years' ? 'Previous years' : 'Previous year'" :class="nav" @click="step(-1)">
        <svg class="size-5" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg>
      </button>
      <!-- Click the month to pick a year; click the year to pick a month. -->
      <button
        type="button"
        :disabled="view === 'years'"
        :aria-label="view === 'days' ? `${heading}, choose year` : view === 'months' ? `${heading}, choose another year` : heading"
        :class="
          cn(
            'heading inline-flex h-tap min-w-0 cursor-pointer items-center gap-1 rounded-md px-3 text-lg transition-state',
            'hover:bg-wash-hover hover:[box-shadow:inset_0_0_0_var(--stroke-edge)_var(--color-wash-ring)] active:bg-wash-press focus-ring disabled:cursor-default disabled:hover:bg-transparent disabled:hover:shadow-none',
          )
        "
        @click="view = 'years'"
      >
        <span aria-live="polite">{{ heading }}</span>
        <svg v-if="view !== 'years'" viewBox="0 0 16 16" class="size-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 6l5 5 5-5" />
        </svg>
      </button>
      <RangeCalendarNext v-if="view === 'days'" aria-label="Next month" :class="nav">
        <svg class="size-5" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg>
      </RangeCalendarNext>
      <button v-else type="button" :aria-label="view === 'years' ? 'Next years' : 'Next year'" :class="nav" @click="step(1)">
        <svg class="size-5" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg>
      </button>
    </RangeCalendarHeader>
    <RangeCalendarGrid v-for="month in view === 'days' ? grid : []" :key="month.value.toString()" class="border-separate border-spacing-0">
      <RangeCalendarGridHead>
        <RangeCalendarGridRow>
          <RangeCalendarHeadCell v-for="day in weekDays" :key="day" class="kicker h-chip w-tap text-center font-normal">
            {{ day.slice(0, 2) }}
          </RangeCalendarHeadCell>
        </RangeCalendarGridRow>
      </RangeCalendarGridHead>
      <RangeCalendarGridBody>
        <RangeCalendarGridRow v-for="(week, i) in month.rows" :key="i">
          <RangeCalendarCell v-for="d in week" :key="d.toString()" :date="d" :class="band">
            <RangeCalendarCellTrigger
              :day="d"
              :month="month.value"
              :class="
                cn(
                  'group numeral relative z-10 inline-grid size-tap cursor-pointer place-items-center rounded-md border border-transparent text-ink transition-state select-none focus-inset',
                  'hover:bg-wash-hover hover:[box-shadow:inset_0_0_0_var(--stroke-edge)_var(--color-wash-ring)] active:bg-wash-press',
                  // today: an edge ring
                  'data-[today]:border-edge-strong',
                  // outside the shown month, quieter
                  'data-[outside-view]:text-muted',
                  // between the ends: no face of its own, it is the band; square so the band runs unbroken
                  '[&[data-selected]:not([data-selection-start]):not([data-selection-end])]:rounded-none [&[data-selected]:not([data-selection-start]):not([data-selection-end])]:border-transparent [&[data-selected]:not([data-selection-start]):not([data-selection-end])]:opacity-100 [&[data-selected]:not([data-selection-start]):not([data-selection-end])]:hover:bg-primary/10',
                  // the ends: the primary face on its slab
                  'data-[selection-start]:slab-thin data-[selection-start]:slab-primary data-[selection-start]:slab-sm data-[selection-start]:bg-primary data-[selection-start]:bg-clip-border data-[selection-start]:text-on-primary data-[selection-start]:opacity-100 data-[selection-start]:shadow-none data-[selection-start]:hover:bg-primary-hover',
                  'data-[selection-end]:slab-thin data-[selection-end]:slab-primary data-[selection-end]:slab-sm data-[selection-end]:bg-primary data-[selection-end]:bg-clip-border data-[selection-end]:text-on-primary data-[selection-end]:opacity-100 data-[selection-end]:shadow-none data-[selection-end]:hover:bg-primary-hover',
                  // can't pick: dimmed and struck through
                  'data-[disabled]:cursor-not-allowed data-[disabled]:text-muted data-[disabled]:opacity-50 data-[disabled]:hover:bg-transparent data-[disabled]:hover:shadow-none',
                  'data-[unavailable]:cursor-not-allowed data-[unavailable]:text-muted data-[unavailable]:line-through data-[unavailable]:hover:bg-transparent data-[unavailable]:hover:shadow-none',
                )
              "
            >
              <template #default="{ dayValue }">
                {{ dayValue }}
                <template v-if="isMarked(d)">
                  <span class="absolute bottom-1 size-1 rounded-full bg-primary group-data-[selected]:bg-on-primary" aria-hidden="true" />
                  <span class="sr-only">, marked</span>
                </template>
              </template>
            </RangeCalendarCellTrigger>
          </RangeCalendarCell>
        </RangeCalendarGridRow>
      </RangeCalendarGridBody>
    </RangeCalendarGrid>
    <!-- Year and month pickers: 3 x 4 faces, as tall as the day grid so the panel doesn't jump. -->
    <div v-if="view !== 'days'" class="grid h-[calc(var(--spacing-chip)+6*var(--spacing-tap))] w-[calc(7*var(--spacing-tap))] grid-cols-3 content-center gap-1">
      <template v-if="view === 'years'">
        <button
          v-for="y in years"
          :key="y"
          type="button"
          :disabled="yearOff(y)"
          :aria-current="y === now.year ? 'date' : undefined"
          :data-selected="y === (model.start?.year ?? placeholder.year) ? '' : undefined"
          :class="pick"
          @click="pickYear(y)"
        >
          {{ y }}
        </button>
      </template>
      <template v-else>
        <button
          v-for="m in months"
          :key="m.month"
          type="button"
          :disabled="monthOff(m)"
          :aria-current="m.year === now.year && m.month === now.month ? 'date' : undefined"
          :data-selected="model.start && m.year === model.start.year && m.month === model.start.month ? '' : undefined"
          :class="pick"
          @click="pickMonth(m)"
        >
          {{ fmt(m, { month: 'short' }) }}
        </button>
      </template>
    </div>
    <div v-if="view === 'days' && (props.footer || props.presets?.length)" class="mt-2 flex w-0 min-w-full flex-wrap items-center gap-1 border-t border-edge pt-2">
      <button v-for="p in props.presets" :key="p.label" type="button" :disabled="blocked(p.value)" :class="quick" @click="choose(p.value)">{{ p.label }}</button>
      <button v-if="props.footer" type="button" :disabled="!model.start" :class="cn(quick, 'ms-auto')" @click="model = { start: undefined, end: undefined }">Clear</button>
    </div>
  </RangeCalendarRoot>
</template>
