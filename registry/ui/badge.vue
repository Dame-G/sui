<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger'
    class?: HTMLAttributes['class']
  }>(),
  { tone: 'neutral' },
)

const tones = {
  neutral: 'tone-neutral',
  info: 'tone-info',
  success: 'tone-success',
  warning: 'tone-warning',
  danger: 'tone-danger',
}
</script>

<template>
  <span
    :class="
      cn(
        // a stamp: a tinted chip with a side slab in its tone
        'edge-start slab-sm kicker inline-flex min-h-7 w-fit max-w-full items-center gap-2 ps-[max(calc(0.75rem-var(--stroke-edge)-var(--depth-bold)),0.625rem)] pe-[calc(0.75rem-var(--stroke-edge))] pt-[0.15em] whitespace-nowrap text-(--_ink)',
        tones[props.tone],
        props.class,
      )
    "
  >
    <slot />
  </span>
</template>
