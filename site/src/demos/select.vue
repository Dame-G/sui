<script setup lang="ts">
import { ref } from 'vue'
import Select from '@/components/ui/select.vue'

const fruit = ref<string>()
const roles = ref<string[]>(['read'])
const region = ref<string>('eu')
const picked = ref<string>()
const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'mango', label: 'Mango' },
  { value: 'pear', label: 'Pear' },
  { value: 'durian', label: 'Durian (sold out)', disabled: true },
]
const roleOptions = [
  { value: 'read', label: 'Read', description: 'View everything' },
  { value: 'write', label: 'Write', description: 'Create and edit' },
  { value: 'admin', label: 'Admin', description: 'Manage people and billing' },
]
const regions = [
  { value: 'us-e', label: 'US East', group: 'Americas' },
  { value: 'us-w', label: 'US West', group: 'Americas' },
  { value: 'eu', label: 'Frankfurt', group: 'Europe' },
  { value: 'uk', label: 'London', group: 'Europe' },
  { value: 'ap', label: 'Singapore', group: 'Asia Pacific' },
]
</script>

<template>
  <div class="grid items-start gap-6 md:grid-cols-2">
    <Select v-model="fruit" :options="options" label="Fruit" placeholder="Pick a fruit" hint="Durian is sold out." />
    <Select v-model="roles" :options="roleOptions" label="Roles" multiple clearable placeholder="Choose roles" />
    <Select v-model="region" :options="regions" label="Region" clearable />
    <Select v-model="picked" :options="options" label="Favourite fruit" required placeholder="Pick one" :error="picked ? undefined : 'Pick a fruit to continue.'" />
    <Select model-value="pear" :options="options" label="Locked" disabled />
    <Select :options="[]" label="Loading" loading placeholder="Fetching options…" />
  </div>
</template>
