<script setup lang="ts">
import { shallowRef } from 'vue'
import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date'
import type { DateRange } from 'reka-ui'
import RangeCalendar from '@/components/ui/range-calendar.vue'

const now = today(getLocalTimeZone())
const across = shallowRef<DateRange>({ start: new CalendarDate(2026, 11, 26), end: new CalendarDate(2026, 12, 4) })
const quick = shallowRef<DateRange>({ start: undefined, end: undefined })
const booked = shallowRef<DateRange>({ start: undefined, end: undefined })

const presets = [
  { label: 'Last 7 days', value: { start: now.subtract({ days: 6 }), end: now } },
  { label: 'Last 30 days', value: { start: now.subtract({ days: 29 }), end: now } },
]
const holidays = [now.add({ days: 3 }), now.add({ days: 10 })]
// Sundays are closed.
const closed = (d: { toDate: (tz: string) => Date }) => d.toDate(getLocalTimeZone()).getDay() === 0
</script>

<template>
  <div class="flex flex-wrap items-start gap-x-12 gap-y-8">
    <div class="grid gap-2">
      <p class="kicker">Across a month boundary</p>
      <RangeCalendar v-model="across" />
    </div>
    <div class="grid gap-2">
      <p class="kicker">Presets and Clear</p>
      <RangeCalendar v-model="quick" :presets="presets" footer />
    </div>
    <div class="grid gap-2">
      <p class="kicker">Marked days, Sundays closed, next 21 days</p>
      <RangeCalendar v-model="booked" :marked="holidays" :disabled-date="closed" :min-value="now" :max-value="now.add({ days: 21 })" />
    </div>
  </div>
</template>
