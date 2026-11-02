<script setup lang="ts">
import { onMounted, type HTMLAttributes } from 'vue'
import { announce } from '@/lib/announce'
import { cn } from '@/lib/utils'

const props = defineProps<{ label?: string; /** Say the label aloud when the spinner appears (default true). */ announce?: boolean; class?: HTMLAttributes['class'] }>()

// A spinner that appears is news to a screen reader: say what is loading, once.
onMounted(() => props.announce !== false && announce(props.label ?? 'Loading'))
</script>

<template>
  <span role="status" :class="cn('inline-flex items-center gap-2 text-ink', props.class)">
    <!-- A solid arc travels round a still track of faint dashes: the progress bar bent into a ring. -->
    <svg viewBox="0 0 24 24" class="size-7 flex-none text-primary" fill="none" stroke-width="4.5" aria-hidden="true">
      <circle cx="12" cy="12" r="9" pathLength="36" stroke-dasharray="1.5 1.5" class="stroke-[color-mix(in_srgb,currentcolor_22%,transparent)]" />
      <circle
        cx="12"
        cy="12"
        r="9"
        pathLength="36"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-dasharray="11 25"
        class="origin-center animate-ring motion-reduce:animate-none"
      />
    </svg>
    <span v-if="props.label" class="text-sm font-medium text-muted">{{ props.label }}</span>
    <span v-else class="sr-only">Loading</span>
  </span>
</template>
