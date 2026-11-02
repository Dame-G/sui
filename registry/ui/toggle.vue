<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Toggle } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
const model = defineModel<boolean>({ default: false })
</script>

<template>
  <Toggle
    v-model="model"
    :class="
      cn(
        // off: an outline button. on: a value you set, the primary face on its slab.
        'slab slab-quiet type-button relative inline-flex h-control cursor-pointer items-center justify-center gap-1 bg-surface bg-clip-padding px-[calc(1rem-var(--stroke-edge))] whitespace-nowrap text-ink transition-state select-none focus-ring',
        'data-[state=off]:hover:[--_ring:var(--color-ink)] data-[state=off]:hover:[box-shadow:inset_0_0_0_100vmax_var(--color-wash-hover)]',
        'data-[state=off]:active:[--_ring:var(--color-ink)] data-[state=off]:active:[box-shadow:inset_0_0_0_100vmax_var(--color-wash-press)]',
        'data-[state=on]:slab-primary data-[state=on]:bg-primary data-[state=on]:bg-clip-border data-[state=on]:text-on-primary data-[state=on]:hover:bg-primary-hover data-[state=on]:active:slab-flat data-[state=on]:active:bg-primary-press',
        'disabled:slab-flat disabled:dashed-edge disabled:cursor-not-allowed disabled:border-transparent disabled:bg-transparent disabled:text-muted disabled:data-[state=on]:slab-flat disabled:data-[state=on]:bg-transparent disabled:data-[state=on]:text-muted',
        props.class,
      )
    "
  >
    <slot />
  </Toggle>
</template>
