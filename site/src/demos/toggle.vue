<script setup lang="ts">
import { ref } from 'vue'
import Toggle from '@/components/ui/toggle.vue'

const bold = ref(true)
const italic = ref(false)
const underline = ref(false)
const starred = ref(false)
</script>

<template>
  <div class="grid gap-6">
    <div class="flex flex-wrap items-center gap-2">
      <Toggle v-model="bold" aria-label="Bold">Bold</Toggle>
      <Toggle v-model="italic" aria-label="Italic">Italic</Toggle>
      <Toggle v-model="underline" aria-label="Underline">Underline</Toggle>
      <Toggle :model-value="true" disabled>Disabled, on</Toggle>
      <Toggle disabled>Disabled</Toggle>
    </div>
    <div><Toggle v-model="starred">{{ starred ? 'Starred' : 'Star' }}</Toggle></div>
  </div>
</template>
