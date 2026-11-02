<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuRoot,
  ContextMenuTrigger,
} from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{
  items: { value: string; label: string; disabled?: boolean; shortcut?: string }[]
  class?: HTMLAttributes['class']
}>()
const emit = defineEmits<{ select: [value: string] }>()
</script>

<template>
  <ContextMenuRoot>
    <ContextMenuTrigger as-child>
      <div :class="cn('select-none', props.class)"><slot /></div>
    </ContextMenuTrigger>
    <ContextMenuPortal>
      <ContextMenuContent :collision-padding="8" class="panel w-max max-w-[min(28rem,calc(100vw-2rem))] min-w-48 p-1">
        <ContextMenuItem
          v-for="item in props.items"
          :key="item.value"
          :value="item.value"
          :disabled="item.disabled"
          class="menu-item"
          @select="emit('select', item.value)"
        >
          <span class="min-w-0 flex-1">{{ item.label }}</span>
          <span v-if="item.shortcut" class="numeral text-sm text-muted">{{ item.shortcut }}</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>
