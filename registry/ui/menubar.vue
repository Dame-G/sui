<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarPortal,
  MenubarRoot,
  MenubarTrigger,
} from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{
  menus: { value: string; label: string; items: { value: string; label: string; disabled?: boolean; shortcut?: string }[] }[]
  class?: HTMLAttributes['class']
}>()
const emit = defineEmits<{ select: [menu: string, item: string] }>()
</script>

<template>
  <!-- A framed strip of menus. The open one is the primary tone: a soft fill with an edge. -->
  <MenubarRoot :class="cn('flex w-fit items-center gap-1 rounded-md bg-surface p-1 shadow-frame', props.class)">
    <MenubarMenu v-for="menu in props.menus" :key="menu.value" :value="menu.value">
      <MenubarTrigger
        :class="
          cn(
            'inline-flex h-tap cursor-pointer items-center rounded-[max(0px,calc(var(--radius-md)-2px))] border border-transparent px-3 font-medium text-ink transition-state select-none',
            'hover:bg-wash-hover hover:shadow-[inset_0_0_0_var(--stroke-edge)_var(--color-wash-ring)] active:bg-wash-press focus-ring',
            'data-[highlighted]:bg-wash-hover data-[state=open]:border-primary data-[state=open]:bg-primary-soft data-[state=open]:text-primary data-[state=open]:shadow-none',
          )
        "
      >
        {{ menu.label }}
      </MenubarTrigger>
      <MenubarPortal>
        <MenubarContent
          :side-offset="8"
          :align-offset="-4"
          :collision-padding="8"
          class="panel w-max max-w-[min(28rem,calc(100vw-2rem))] min-w-48 p-1"
        >
          <MenubarItem
            v-for="item in menu.items"
            :key="item.value"
            :value="item.value"
            :disabled="item.disabled"
            class="menu-item"
            @select="emit('select', menu.value, item.value)"
          >
            <span class="min-w-0 flex-1">{{ item.label }}</span>
            <span v-if="item.shortcut" class="numeral text-sm text-muted">{{ item.shortcut }}</span>
          </MenubarItem>
        </MenubarContent>
      </MenubarPortal>
    </MenubarMenu>
  </MenubarRoot>
</template>
