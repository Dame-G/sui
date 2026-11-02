<script setup lang="ts">
import { onMounted, type HTMLAttributes } from 'vue'
import { announce } from '@/lib/announce'
import { cn } from '@/lib/utils'

const props = defineProps<{
  title: string
  description?: string
  /** Say "title. description" aloud when this appears, for results that empty out after a search or filter. */
  announce?: boolean
  class?: HTMLAttributes['class']
}>()
onMounted(() => props.announce && announce(props.description ? `${props.title}. ${props.description}` : props.title))
</script>

<template>
  <!-- A calm tinted well: nothing is loading and nothing is broken, there is just nothing here yet. -->
  <div
    :class="
      cn(
        'flex min-w-0 flex-col items-center gap-3 rounded-md bg-surface px-6 py-10 text-center shadow-frame',
        props.class,
      )
    "
  >
    <div class="grid size-12 place-items-center rounded-md bg-surface-tint text-muted">
      <slot name="icon">
        <svg viewBox="0 0 24 24" class="size-6" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 8l2.5-4h13L21 8v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8z" />
          <path d="M3 8h5l1 3h6l1-3h5" />
        </svg>
      </slot>
    </div>
    <div class="grid max-w-sm gap-1">
      <p class="heading text-xl">{{ props.title }}</p>
      <p v-if="props.description" class="leading-normal text-muted">{{ props.description }}</p>
    </div>
    <div v-if="$slots.default" class="mt-1 flex flex-wrap justify-center gap-2"><slot /></div>
  </div>
</template>
