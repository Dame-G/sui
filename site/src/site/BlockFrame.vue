<script setup lang="ts">
import { ref } from 'vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ToggleGroup from '@/components/ui/toggle-group.vue'

defineProps<{ name: string; source: string }>()
const view = ref('preview')
const views = [
  { value: 'preview', label: 'Preview' },
  { value: 'code', label: 'Code' },
]
</script>

<template>
  <!-- One block: the file you would take, then the thing itself. The code is one switch away. -->
  <section class="flex min-w-0 flex-col gap-3">
    <div class="flex items-center justify-between gap-4">
      <span class="font-mono text-sm text-muted">{{ name }}.vue</span>
      <ToggleGroup v-model="view" :options="views" class="shrink-0" />
    </div>
    <div v-if="view === 'preview'" class="min-w-0"><slot /></div>
    <CodeBlock v-else :code="source" />
  </section>
</template>
