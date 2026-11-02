<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ToggleGroupItem, ToggleGroupRoot } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{
  options: { value: string; label: string; disabled?: boolean }[]
  /** Fill the available width, items sharing it equally. */
  stretch?: boolean
  class?: HTMLAttributes['class']
}>()
const model = defineModel<string>()
</script>

<template>
  <!-- A pressed-in track. Neighbours share one edge; the chosen piece fills its cell in primary, on a slab. -->
  <ToggleGroupRoot
    v-model="model"
    type="single"
    :class="cn('min-h-control max-w-full rounded-md bg-surface-tint shadow-well', props.stretch ? 'flex w-full' : 'inline-flex w-fit', props.class)"
  >
    <ToggleGroupItem
      v-for="o in props.options"
      :key="o.value"
      :value="o.value"
      :disabled="o.disabled"
      :class="
        cn(
          'relative inline-flex min-h-control min-w-16 cursor-pointer items-center justify-center self-stretch border border-b-[calc(var(--stroke-edge)+var(--tg-lift))] border-edge-strong bg-transparent px-[calc(1rem-var(--stroke-edge))] leading-none font-medium whitespace-nowrap text-ink transition-state [--tg-lift:0px] focus-inset',
          '-ms-px first:ms-0 first:rounded-ss-md first:rounded-es-[var(--radius-md)_calc(var(--radius-md)+var(--tg-lift))] last:rounded-se-md last:rounded-ee-[var(--radius-md)_calc(var(--radius-md)+var(--tg-lift))]',
          'hover:z-10 data-[state=off]:hover:border-(--color-wash-ring) data-[state=off]:hover:bg-wash-hover data-[state=off]:active:border-ink data-[state=off]:active:bg-wash-press',
          'data-[state=on]:z-20 data-[state=on]:border-primary-slab data-[state=on]:bg-primary data-[state=on]:text-on-primary data-[state=on]:[--tg-lift:var(--depth)] data-[state=on]:hover:bg-primary-hover data-[state=on]:active:bg-primary-press data-[state=on]:active:[--tg-lift:0px]',
          'disabled:cursor-not-allowed disabled:text-muted',
          props.stretch ? 'min-w-0 flex-1' : 'flex-none',
        )
      "
    >
      {{ o.label }}
    </ToggleGroupItem>
  </ToggleGroupRoot>
</template>
