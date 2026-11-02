<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

export interface NavItem {
  value: string
  label: string
  href?: string
}
export interface NavSection {
  title?: string
  items: NavItem[]
}

const props = withDefaults(
  defineProps<{
    sections: NavSection[]
    orientation?: 'vertical' | 'horizontal'
    /** Vertical only: the current row runs out to the container's end edge instead of stopping at its padding, like a marker on a page's margin. */
    flush?: boolean
    label?: string
    class?: HTMLAttributes['class']
  }>(),
  { orientation: 'vertical' },
)
const active = defineModel<string>({ default: '' })
const first = (label: string) => Array.from(label)[0] ?? ''
</script>

<template>
  <nav
    :aria-label="props.label ?? 'Navigation'"
    :class="
      cn(
        props.orientation === 'vertical'
          ? 'grid w-full min-w-48 content-start gap-5 bg-surface p-3'
          : 'flex w-full flex-wrap items-center gap-x-3 gap-y-2 bg-surface p-2',
        props.class,
      )
    "
  >
    <div
      v-for="(section, i) in props.sections"
      :key="section.title ?? i"
      :class="
        props.orientation === 'vertical'
          ? 'grid gap-1'
          : cn('flex flex-wrap items-center gap-1', i > 0 && 'border-s border-edge ps-3')
      "
    >
      <p v-if="section.title" :class="cn(props.orientation === 'vertical' ? 'section-label px-3 pb-1' : 'kicker px-2')">{{ section.title }}</p>
      <!-- Every row is the same box, active or not, so nothing shifts. Vertical: the active row is a slab turned on its side. Horizontal: a face on its slab. -->
      <component
        :is="item.href ? 'a' : 'button'"
        v-for="item in section.items"
        :key="item.value"
        :href="item.href"
        :type="item.href ? undefined : 'button'"
        :aria-current="active === item.value ? 'page' : undefined"
        :class="
          cn(
            'flex min-h-control cursor-pointer items-center gap-2 py-1 text-start leading-tight whitespace-nowrap text-ink transition-state select-none',
            'hover:shadow-[inset_0_0_0_var(--stroke-edge)_var(--color-wash-ring)] hover:[background-color:var(--color-wash-hover)] active:[background-color:var(--color-wash-press)] focus-ring',
            props.orientation === 'vertical'
              ? 'edge-start w-full ps-[max(calc(0.75rem-var(--stroke-edge)-var(--depth-bold)),0.625rem)] pe-[calc(0.75rem-var(--stroke-edge))] [--_bg:transparent] [--_tone:transparent]'
              : 'slab slab-thin px-[calc(1rem-var(--stroke-edge))] [--_ring:transparent]',
            active === item.value &&
              (props.orientation === 'vertical'
                ? cn(
                    '[--_bg:var(--color-primary-soft)] [--_tone:var(--color-primary)] font-medium text-primary hover:shadow-none',
                    // flush: out to the container's edge, square and borderless on that side so it joins the container's own border
                    props.flush && 'w-auto -me-3 !rounded-e-none !border-e-0',
                  )
                : '[--_ring:var(--color-primary-slab)] bg-primary-soft font-medium text-primary hover:shadow-none'),
          )
        "
        @click="active = item.value"
      >
        <!-- the opinion: the first letter is strong, so a list reads as an index you can scan down the left edge -->
        <span><span class="font-strong">{{ first(item.label) }}</span>{{ item.label.slice(first(item.label).length) }}</span>
      </component>
    </div>
  </nav>
</template>
