<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { today, getLocalTimeZone } from '@internationalized/date'
import type { DateRange } from 'reka-ui'
import DateRangePicker from '@/components/ui/date-range-picker.vue'

const now = today(getLocalTimeZone())
const stay = shallowRef<DateRange>({ start: undefined, end: undefined })
const long = shallowRef<DateRange>({ start: now, end: now.add({ days: 40 }) })
const longError = computed(() => (long.value.start && long.value.end && long.value.end.compare(long.value.start.add({ days: 30 })) > 0 ? 'Bookings are limited to 30 nights.' : undefined))
const report = shallowRef<DateRange>({ start: now.subtract({ days: 6 }), end: now })
const presets = [
  { label: 'Last 7 days', value: { start: now.subtract({ days: 6 }), end: now } },
  { label: 'Last 30 days', value: { start: now.subtract({ days: 29 }), end: now } },
  { label: 'This month', value: { start: now.set({ day: 1 }), end: now } },
]
</script>

<template>
  <div class="grid items-start gap-6 md:grid-cols-2">
    <DateRangePicker v-model="stay" label="Dates of stay" placeholder="Check in – check out" :min-value="now" required hint="From today onwards." />
    <DateRangePicker v-model="report" label="Report period" :presets="presets" footer start-name="from" end-name="to" :max-value="now" />
    <DateRangePicker v-model="long" label="Long booking" :error="longError" />
    <DateRangePicker label="Locked" disabled />
  </div>
</template>
