<script setup lang="ts">
import { ref } from 'vue'
import ToggleGroup from '@/components/ui/toggle-group.vue'

const view = ref('grid')
const period = ref('month')
const stretched = ref('week')
const options = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
  { value: 'board', label: 'Board' },
]
const periods = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
]
const withDisabled = [
  { value: 'a', label: 'Free' },
  { value: 'b', label: 'Team' },
  { value: 'c', label: 'Scale', disabled: true },
]
const pick = ref('a')
</script>

<template>
  <div class="grid items-start gap-6 md:grid-cols-2">
    <ToggleGroup v-model="view" :options="options" />
    <ToggleGroup v-model="period" :options="periods" />
    <ToggleGroup v-model="pick" :options="withDisabled" />
    <ToggleGroup v-model="stretched" :options="periods" stretch />
  </div>
</template>
