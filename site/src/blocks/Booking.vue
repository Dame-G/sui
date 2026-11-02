<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import type { DateValue } from '@internationalized/date'
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'
import DateRangePicker from '@/components/ui/date-range-picker.vue'
import Select from '@/components/ui/select.vue'
import TimeField from '@/components/ui/time-field.vue'
import { toast } from '@/components/ui/toast.vue'

const stay = shallowRef<{ start: DateValue | undefined; end: DateValue | undefined }>({ start: undefined, end: undefined })
const arrival = ref()
const guests = ref('2')
const counts = ['1', '2', '3', '4'].map((n) => ({ value: n, label: n === '1' ? '1 guest' : `${n} guests` }))
</script>

<template>
  <Card title="Book a stay">
    <DateRangePicker v-model="stay" label="Dates" hint="Pick a check-in and a check-out." />
    <div class="grid gap-6 sm:grid-cols-2">
      <TimeField v-model="arrival" label="Arrival" />
      <Select v-model="guests" label="Guests" :options="counts" />
    </div>
    <Button block @click="toast({ title: 'Request sent', description: 'We will confirm within the hour.', tone: 'success' })">Request booking</Button>
  </Card>
</template>
