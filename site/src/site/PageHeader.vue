<script setup lang="ts">
import FlowField from '@/site/FlowField.vue'

defineProps<{ kicker: string; title: string }>()
</script>

<template>
  <!-- The page title sits on the same drifting lines as Home, fading out below: every page starts the same way. -->
  <header class="relative isolate overflow-hidden border-b border-edge">
    <FlowField class="flow-fade print:hidden" />
    <div class="relative mx-auto flex min-h-72 w-full max-w-7xl flex-col gap-3 px-6 py-16">
      <p class="kicker">{{ kicker }}</p>
      <h1 class="heading text-6xl leading-none">{{ title }}</h1>
      <p class="max-w-3xl text-lg leading-normal text-muted"><slot /></p>
    </div>
  </header>
</template>
