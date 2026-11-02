<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

// Decorative by default. Give one a `label` (say, on the first of a group) and it reads as a busy status instead.
const props = defineProps<{ label?: string; class?: HTMLAttributes['class'] }>()
</script>

<template>
  <!-- A faint tint with the same diagonal stripes as the busy button and the progress bar, pulsing. -->
  <div
    :role="props.label ? 'status' : undefined"
    :aria-label="props.label"
    :aria-busy="props.label ? true : undefined"
    :aria-hidden="props.label ? undefined : true"
    :class="cn('stripes block h-4 w-full animate-pulse-soft rounded-md bg-skeleton motion-reduce:animate-none', props.class)"
  />
</template>
