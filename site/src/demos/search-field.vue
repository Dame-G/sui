<script setup lang="ts">
import { computed, ref } from 'vue'
import Card from '@/components/ui/card.vue'
import EmptyState from '@/components/ui/empty-state.vue'
import SearchField from '@/components/ui/search-field.vue'

const typed = ref('ap')
const submitted = ref('')
const busy = ref('slow query')
const q = ref('')
const items = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Mango', 'Pear']
const hits = computed(() => items.filter((i) => i.toLowerCase().includes(q.value.trim().toLowerCase())))
</script>

<template>
  <div class="grid items-start gap-6 md:grid-cols-2">
    <SearchField v-model="typed" label="Clear with ✕ or Esc" placeholder="Search" />
    <SearchField v-model="submitted" label="With a button" placeholder="Search" action="Search" />
    <SearchField v-model="busy" label="Searching" loading />
    <SearchField label="Disabled" model-value="" placeholder="Search" disabled />
    <Card title="Filter a list" class="md:col-span-2 md:max-w-md">
      <SearchField v-model="q" label="Fruit" placeholder="Try “ap” or “zz”" />
      <ul v-if="hits.length" class="grid">
        <li v-for="h in hits" :key="h" class="border-b border-edge py-2 last:border-b-0">{{ h }}</li>
      </ul>
      <EmptyState v-else title="No matches" :description="`Nothing is called “${q}”.`" />
    </Card>
  </div>
</template>
