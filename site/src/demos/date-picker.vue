<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { today, getLocalTimeZone, type DateValue } from '@internationalized/date'
import Card from '@/components/ui/card.vue'
import DatePicker from '@/components/ui/date-picker.vue'

const now = today(getLocalTimeZone())
const due = shallowRef<DateValue>()
const delivery = shallowRef<DateValue>(now.add({ days: 6 }))
const start = shallowRef<DateValue>(now.subtract({ days: 12 }))
const startError = computed(() => (start.value && start.value.compare(now) < 0 ? 'Choose today or a later date.' : undefined))
const day = shallowRef<DateValue>()
const busy = [now.add({ days: 1 }), now.add({ days: 4 })]
// Not on weekends.
const weekend = (d: DateValue) => [0, 6].includes(d.toDate(getLocalTimeZone()).getDay())
</script>

<template>
  <div class="grid items-start gap-6 md:grid-cols-2">
    <DatePicker v-model="due" label="Due date" placeholder="Pick a due date" :min-value="now" required hint="Today or later." />
    <DatePicker v-model="delivery" label="Delivery" :min-value="now" :max-value="now.add({ days: 30 })" footer optional />
    <DatePicker v-model="start" label="Start date" :error="startError" />
    <DatePicker label="Locked" disabled />
    <Card title="Schedule a call" class="md:col-span-2 md:max-w-sm">
      <DatePicker v-model="day" label="Day" :disabled-date="weekend" :marked="busy" :min-value="now" footer name="day" hint="Dots are busy days." />
      <p class="numeral text-sm text-muted">Submits as <span class="text-ink">{{ day?.toString() ?? 'nothing yet' }}</span></p>
    </Card>
  </div>
</template>
