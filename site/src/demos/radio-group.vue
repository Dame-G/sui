<script setup lang="ts">
import { ref } from 'vue'
import RadioGroup from '@/components/ui/radio-group.vue'

const plan = ref('team')
const billing = ref('annual')
const options = [
  { value: 'free', label: 'Free' },
  { value: 'team', label: 'Team' },
  { value: 'scale', label: 'Scale' },
]
const withDisabled = [
  { value: 'free', label: 'Free' },
  { value: 'team', label: 'Team' },
  { value: 'scale', label: 'Scale', disabled: true },
]
const tiers = [
  { value: 'monthly', label: 'Monthly', description: '$12 a month, cancel any time.' },
  { value: 'annual', label: 'Annual', description: '$99 a year, two months free.' },
]
</script>

<template>
  <div class="grid items-start gap-8 md:grid-cols-2">
    <RadioGroup v-model="plan" :options="options" />
    <RadioGroup v-model="billing" :options="tiers" />
    <RadioGroup model-value="free" :options="withDisabled" />
    <RadioGroup model-value="team" :options="options" disabled />
  </div>
</template>
