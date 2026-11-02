<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{ title?: string; /** Heading level of the title, so the page outline stays in order. */ level?: 2 | 3 | 4; class?: HTMLAttributes['class'] }>(), { level: 2 })
</script>

<template>
  <!-- Header and body each draw their own 1px edge and own corners. Nothing is clipped by a parent, so the header fill never leaves an anti-aliased gap where it meets the edge. -->
  <section :class="cn('flex min-w-0 flex-col break-inside-avoid', props.class)">
    <!-- The header is a primary face sitting on its own slab. -->
    <header
      v-if="props.title"
      class="rounded-t-md border border-b-(length:--depth) border-primary-slab bg-primary px-[calc(1rem-var(--stroke-edge))] py-3 text-on-primary"
    >
      <component :is="`h${props.level}`" class="heading text-xl">{{ props.title }}</component>
    </header>
    <div
      :class="
        cn(
          'flex flex-1 flex-col gap-3 border border-edge bg-surface p-[calc(1rem-var(--stroke-edge))]',
          props.title ? 'rounded-b-md border-t-0' : 'rounded-md',
        )
      "
    >
      <slot />
    </div>
  </section>
</template>
