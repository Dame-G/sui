<script setup lang="ts">
import { computed, ref } from 'vue'
import Card from '@/components/ui/card.vue'
import Chart from '@/components/ui/chart.vue'
import ToggleGroup from '@/components/ui/toggle-group.vue'

const period = ref('week')
const periods = [
  { value: 'week', label: '7 days' },
  { value: 'month', label: '4 weeks' },
  { value: 'year', label: '4 quarters' },
]
const data = {
  week: { cats: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], revenue: [3.1, 3.4, 3.2, 4.1, 4.6, 3.9, 5.2], costs: [2.2, 2.3, 2.2, 2.6, 2.8, 2.5, 3.0] },
  month: { cats: ['W1', 'W2', 'W3', 'W4'], revenue: [21, 24, 23, 29], costs: [15, 16, 16, 18] },
  year: { cats: ['Q1', 'Q2', 'Q3', 'Q4'], revenue: [62, 71, 80, 96], costs: [45, 49, 52, 58] },
}
const now = computed(() => data[period.value as keyof typeof data])
const series = computed(() => [
  { name: 'Revenue', data: now.value.revenue },
  { name: 'Costs', data: now.value.costs },
])
const total = computed(() => now.value.revenue.reduce((a, b) => a + b, 0))
const money = (v: number) => `$${v}k`
</script>

<template>
  <Card title="Revenue">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <p class="numeral text-4xl leading-none">{{ money(Math.round(total * 10) / 10) }}</p>
      <ToggleGroup v-model="period" :options="periods" />
    </div>
    <Chart type="line" :categories="now.cats" :series="series" :format="money" label="Revenue and costs" />
  </Card>
</template>
