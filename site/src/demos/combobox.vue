<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import Card from '@/components/ui/card.vue'
import Combobox from '@/components/ui/combobox.vue'

const country = ref<string>('nz')
const visited = ref<string[]>(['jp', 'se'])
const plan = ref<string>()
const tags = ref<string[]>(['design'])
const needed = ref<string[]>([])
const options = [
  { value: 'au', label: 'Australia' },
  { value: 'ca', label: 'Canada' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'nz', label: 'New Zealand' },
  { value: 'se', label: 'Sweden' },
]
const plans = [
  { value: 'free', label: 'Free', description: 'One project', group: 'Personal' },
  { value: 'pro', label: 'Pro', description: 'Unlimited projects', group: 'Personal' },
  { value: 'team', label: 'Team', description: 'Shared workspaces, roles', group: 'Business' },
  { value: 'scale', label: 'Scale', description: 'SSO and audit log', group: 'Business' },
]
const tagOptions = ['design', 'research', 'engineering'].map((t) => ({ value: t, label: t }))

// Options that arrive after a moment.
const reviewer = ref<string>()
const people = ref<{ value: string; label: string }[]>([])
const loading = ref(true)
const timer = setTimeout(() => {
  people.value = ['Ada Lovelace', 'Alan Turing', 'Grace Hopper'].map((n) => ({ value: n, label: n }))
  loading.value = false
}, 1500)
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="grid items-start gap-6 md:grid-cols-2">
    <Combobox v-model="country" :options="options" label="Home country" placeholder="Search countries" hint="Start typing to filter." />
    <Combobox v-model="visited" :options="options" label="Countries visited" placeholder="Add more" multiple clearable />
    <Combobox v-model="plan" :options="plans" label="Plan" placeholder="Choose a plan" optional />
    <Combobox v-model="tags" :options="tagOptions" label="Tags" placeholder="Type, then Enter" multiple freeform hint="Pick one, or type your own." />
    <Combobox v-model="needed" :options="options" label="Countries" placeholder="Add a country" multiple required :error="needed.length ? undefined : 'Choose at least one country.'" />
    <Combobox model-value="ca" :options="options" label="Locked" disabled />
    <Card title="Assign a reviewer" class="md:col-span-2 md:max-w-sm">
      <Combobox v-model="reviewer" :options="people" label="Reviewer" placeholder="Search people" :loading="loading" clearable />
    </Card>
  </div>
</template>
