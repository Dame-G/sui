<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui'

defineProps<{
  /** `shortcut` is a hint at the end of the row (it does not bind the key). */
  items: { value: string; label: string; disabled?: boolean; shortcut?: string }[]
}>()
const emit = defineEmits<{ select: [value: string] }>()
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <slot name="trigger" />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent
        :side-offset="8"
        :collision-padding="8"
        align="start"
        class="panel w-max max-w-[min(28rem,calc(100vw-2rem))] min-w-48 p-1"
      >
        <DropdownMenuItem
          v-for="item in items"
          :key="item.value"
          :value="item.value"
          :disabled="item.disabled"
          class="menu-item"
          @select="emit('select', item.value)"
        >
          <span class="min-w-0 flex-1">{{ item.label }}</span>
          <span v-if="item.shortcut" class="numeral text-sm text-muted">{{ item.shortcut }}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
