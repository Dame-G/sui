<script setup lang="ts">
import { computed, ref } from 'vue'
import Checkbox from '@/components/ui/checkbox.vue'

const terms = ref(true)
const news = ref(false)
const files = ref([true, false, false])
const names = ['report.pdf', 'budget.xlsx', 'notes.md']
const all = computed<boolean | 'indeterminate'>({
  get: () => (files.value.every(Boolean) ? true : files.value.some(Boolean) ? 'indeterminate' : false),
  set: (v) => (files.value = files.value.map(() => v === true)),
})
</script>

<template>
  <div class="grid items-start gap-8 md:grid-cols-2">
    <div class="grid gap-1">
      <Checkbox v-model="terms" label="I accept the terms" />
      <Checkbox v-model="news" label="Email me updates" description="At most one a month." />
      <Checkbox :model-value="true" label="Disabled, checked" disabled />
      <Checkbox :model-value="false" label="Disabled" disabled />
    </div>
    <div class="grid gap-1">
      <Checkbox v-model="all" label="Select all" />
      <div class="grid gap-1 ps-7">
        <Checkbox v-for="(n, i) in names" :key="n" v-model="files[i]" :label="n" />
      </div>
    </div>
  </div>
</template>
