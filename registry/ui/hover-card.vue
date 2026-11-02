<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { HoverCardContent, HoverCardPortal, HoverCardRoot, HoverCardTrigger } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <HoverCardRoot :open-delay="200" :close-delay="120">
    <HoverCardTrigger as-child>
      <slot name="trigger" />
    </HoverCardTrigger>
    <HoverCardPortal>
      <HoverCardContent
        align="start"
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
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
</template>
