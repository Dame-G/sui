<script setup lang="ts">
import { shallowRef } from 'vue'
import { today, getLocalTimeZone, type DateValue } from '@internationalized/date'
import Calendar from '@/components/ui/calendar.vue'

const now = today(getLocalTimeZone())
const picked = shallowRef<DateValue>(now)
const limited = shallowRef<DateValue>()
const events = shallowRef<DateValue>()

const marked = [now.add({ days: 2 }), now.add({ days: 5 }), now.add({ days: 9 })]
// Weekends can't be picked.
const noWeekends = (d: DateValue) => [0, 6].includes(d.toDate(getLocalTimeZone()).getDay())
</script>

<template>
  <div class="flex flex-wrap items-start gap-x-12 gap-y-8">
    <div class="grid gap-2">
      <p class="kicker">Click the month to jump by year</p>
      <Calendar v-model="picked" />
    </div>
    <div class="grid gap-2">
      <p class="kicker">Next 30 days, weekdays only</p>
      <Calendar v-model="limited" :min-value="now" :max-value="now.add({ days: 30 })" :disabled-date="noWeekends" />
    </div>
    <div class="grid gap-2">
      <p class="kicker">Marked days, with Today and Clear</p>
      <Calendar v-model="events" :marked="marked" footer />
    </div>
  </div>
</template>
