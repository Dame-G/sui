<script setup lang="ts">
import { shallowRef } from 'vue'
import { CalendarDate, today, getLocalTimeZone, type DateValue } from '@internationalized/date'
import DateField from '@/components/ui/date-field.vue'

const birthday = shallowRef<DateValue>(new CalendarDate(1990, 6, 14))
const start = shallowRef<DateValue>()
const late = shallowRef<DateValue>(new CalendarDate(2020, 1, 1))
const from = today(getLocalTimeZone())
</script>

<template>
  <div class="grid items-start gap-6 md:grid-cols-2">
    <DateField v-model="birthday" label="Date of birth" hint="Type the digits; arrows step." />
    <DateField v-model="start" label="Start date" :min-value="from" optional />
    <DateField v-model="late" label="Deadline" :min-value="from" error="Pick a date from today onwards" />
    <DateField label="Locked" disabled />
  </div>
</template>
