<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ScrollAreaCorner, ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <ScrollAreaRoot type="auto" :class="cn('relative h-64 overflow-hidden rounded-md bg-surface shadow-frame', props.class)">
    <!-- Focusable so the keyboard can scroll it; the ring is drawn inside, where the clip cannot cut it. -->
    <ScrollAreaViewport tabindex="0" class="size-full rounded-[inherit] p-4 focus-inset"><slot /></ScrollAreaViewport>
    <ScrollAreaScrollbar
      orientation="vertical"
      class="flex w-3 touch-none p-0.5 transition-state select-none hover:bg-wash-hover"
    >
      <ScrollAreaThumb class="relative flex-1 rounded-full bg-edge-strong transition-state hover:bg-ink" />
    </ScrollAreaScrollbar>
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
