<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { AvatarFallback, AvatarImage, AvatarRoot } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{ src?: string; alt?: string; fallback: string; class?: HTMLAttributes['class'] }>()
</script>

<template>
  <AvatarRoot
    :class="
      cn(
        // a tinted tile with a 1px edge; initials in the mono voice, in the action colour
        'relative inline-grid size-11 shrink-0 place-items-center rounded-md border border-edge-strong bg-surface-tint bg-clip-padding',
        'font-mono text-sm leading-none font-semibold text-primary',
        props.class,
      )
    "
  >
    <AvatarImage
      v-if="props.src"
      :src="props.src"
      :alt="props.alt ?? ''"
      class="block size-full rounded-[max(0px,calc(var(--radius-md)-var(--stroke-edge)))] object-cover"
    />
    <AvatarFallback :delay-ms="300">{{ props.fallback }}</AvatarFallback>
  </AvatarRoot>
</template>
