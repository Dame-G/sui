<script setup lang="ts">
import Card from '@/components/ui/card.vue'
import Chart from '@/components/ui/chart.vue'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const money = (v: number) => `${v < 0 ? '-' : ''}$${new Intl.NumberFormat().format(Math.abs(v))}`

const growth = [
  { name: 'Visitors', data: [3200, 4100, 3800, 5200, 6100, 5800, 7200, 7900, 7600, 8800, 9400, 10600] },
  { name: 'Signups', data: [410, 620, 550, 880, 1010, 960, 1300, 1520, 1440, 1730, 1910, 2250] },
]
const cashflow = [
  { name: 'In', data: [8200, 9100, 8800, 10400, 11200, 12900] },
  { name: 'Out', data: [-6400, -7100, -9600, -7800, -8300, -9100] },
]
const uptime = [{ name: 'Uptime', data: [99.9, 99.95, 99.4, 99.99, 100, 99.8, 99.92, 99.97, 98.9, 99.96, 99.99, 100] }]

const trends = [
  { title: 'Signups', value: '2,250', data: [4, 6, 5, 8, 7, 9, 12, 10, 13, 15, 14, 18] },
  { title: 'Errors', value: '5', data: [18, 16, 17, 13, 14, 11, 12, 9, 8, 9, 6, 5] },
  { title: 'Latency', value: '184 ms', data: [210, 198, 205, 190, 201, 186, 192, 180, 188, 176, 181, 184] },
]
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-2">
    <Card title="Growth" class="lg:col-span-2">
      <Chart type="line" :categories="months" :series="growth" label="Visitors and signups by month" />
    </Card>
    <Card title="Cash in and out">
      <Chart type="bar" stacked :categories="months.slice(0, 6)" :series="cashflow" :format="money" label="Money in and out by month" />
    </Card>
    <Card title="Uptime">
      <Chart type="area" :categories="months" :series="uptime" :min="98" :max="100" unit="%" :height="280" label="Uptime by month" />
    </Card>
    <Card title="Trends, loading, empty" class="lg:col-span-2">
      <div class="grid gap-6 sm:grid-cols-3">
        <div v-for="t in trends" :key="t.title" class="grid gap-1">
          <span class="kicker">{{ t.title }}</span>
          <span class="numeral text-3xl font-medium">{{ t.value }}</span>
          <Chart type="area" sparkline :categories="months" :series="[{ name: t.title, data: t.data }]" :label="`${t.title} over the year`" />
        </div>
      </div>
      <div class="grid gap-6 sm:grid-cols-2">
        <Chart loading :categories="months" :series="growth" :height="96" />
        <Chart type="bar" :categories="[]" :series="[{ name: 'Orders', data: [] }]" :height="96" />
      </div>
    </Card>
  </div>
</template>
