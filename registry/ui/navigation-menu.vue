<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuRoot,
  NavigationMenuTrigger,
} from 'reka-ui'
import { cn } from '@/lib/utils'

export interface NavItem {
  value: string
  label: string
  href?: string
  children?: { label: string; description?: string; href: string }[]
}

const props = defineProps<{ items: NavItem[]; label?: string; class?: HTMLAttributes['class'] }>()
const active = defineModel<string>({ default: '' })

// A top-level entry: the same box whether current or not, so nothing shifts. Current page = the horizontal nav list's look (a primary face on its slab).
const top = (value: string) =>
  cn(
    'slab slab-thin inline-flex h-control cursor-pointer items-center gap-1 px-[calc(0.75rem-var(--stroke-edge))] font-medium text-ink transition-state select-none [--_ring:transparent]',
    'hover:bg-wash-hover hover:[--_ring:var(--color-wash-ring)] active:bg-wash-press focus-ring',
    'data-[state=open]:bg-wash-hover',
    active.value === value && 'bg-primary-soft text-primary [--_ring:var(--color-primary-slab)] hover:[--_ring:var(--color-primary-slab)]',
  )
</script>

<template>
  <NavigationMenuRoot :aria-label="props.label ?? 'Main'" :class="cn('relative flex w-fit', props.class)">
    <NavigationMenuList class="m-0 flex list-none items-center gap-1 p-0">
      <NavigationMenuItem v-for="item in props.items" :key="item.value" :value="item.value" class="relative">
        <template v-if="item.children">
          <NavigationMenuTrigger :class="top(item.value)">
            {{ item.label }}
            <svg viewBox="0 0 16 16" class="size-4 shrink-0 transition-transform duration-(--duration-tap) ease-(--ease-out) [[data-state=open]>&]:rotate-180" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M3 6l5 5 5-5" />
            </svg>
          </NavigationMenuTrigger>
          <!-- The flyout: a floating panel with a title and a muted line for each destination. -->
          <NavigationMenuContent
            class="panel absolute top-full left-0 mt-2 grid w-80 max-w-[calc(100vw-2rem)] gap-1 p-1"
          >
            <NavigationMenuLink
              v-for="child in item.children"
              :key="child.href"
              :href="child.href"
              class="menu-item flex-col items-start justify-center gap-0.5 py-2"
              @click="active = item.value"
            >
              <span class="font-medium leading-snug">{{ child.label }}</span>
              <span v-if="child.description" class="text-sm leading-snug text-muted">{{ child.description }}</span>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </template>
        <NavigationMenuLink v-else :href="item.href" :active="active === item.value" :class="top(item.value)" @click="active = item.value">
          {{ item.label }}
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenuRoot>
</template>
