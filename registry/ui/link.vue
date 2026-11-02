<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<PrimitiveProps & { href?: string; external?: boolean; class?: HTMLAttributes['class'] }>(),
  { as: 'a' },
)
</script>

<template>
  <!-- Action colour, underlined; the wash answers the pointer and the underline turns to ink. -->
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    :href="props.href"
    :target="props.external ? '_blank' : undefined"
    :rel="props.external ? 'noopener noreferrer' : undefined"
    :class="
      cn(
        'rounded-sm text-primary underline decoration-primary underline-offset-[0.25em] transition-state',
        'hover:bg-wash-hover hover:text-ink hover:decoration-ink active:bg-wash-press focus-ring',
        'aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:text-muted aria-disabled:decoration-dashed aria-disabled:decoration-muted',
        props.class,
      )
    "
  >
    <slot />
    <svg
      v-if="props.external"
      viewBox="0 0 16 16"
      class="ms-0.5 inline-block size-[0.85em] align-[-0.05em]"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M5 11l6-6M6 5h5v5" />
    </svg>
    <span v-if="props.external" class="sr-only"> (opens in a new tab)</span>
  </Primitive>
</template>
