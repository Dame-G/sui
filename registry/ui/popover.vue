<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
const open = defineModel<boolean>('open', { default: false })
// Opened by its trigger: focus moves into it. Opened from code (open = true), e.g. a nudge or a result: leave focus where the person is.
let byTrigger = false
function onOpenAutoFocus(e: Event) {
  if (!byTrigger) e.preventDefault()
  byTrigger = false
}
</script>

<template>
  <PopoverRoot v-model:open="open">
    <PopoverTrigger as-child @pointerdown="byTrigger = true" @keydown="byTrigger = true" @click="byTrigger = true">
      <slot name="trigger" />
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        align="start"
        @open-auto-focus="onOpenAutoFocus"
        :side-offset="8"
        :collision-padding="8"
        :class="
          cn(
            'panel w-80 max-w-[calc(100vw-2rem)] p-4 focus-inset',
            props.class,
          )
        "
      >
        <slot />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
