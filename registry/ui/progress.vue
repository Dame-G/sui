<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { ProgressIndicator, ProgressRoot } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{
  label?: string
  hideLabel?: boolean
  hideValue?: boolean
  /** What a screen reader hears instead of the percentage, e.g. "3 of 8 files". */
  valueText?: string
  class?: HTMLAttributes['class']
}>()
// No value = indeterminate: the bar slides back and forth while the length is unknown.
const model = defineModel<number | null>({ default: null })

const indeterminate = computed(() => model.value === null || model.value === undefined)
const percent = computed(() => Math.max(0, Math.min(100, model.value ?? 0)))
const complete = computed(() => !indeterminate.value && percent.value >= 100)
const name = computed(() => props.label ?? (indeterminate.value ? 'Loading' : 'Progress'))
const showLabel = computed(() => !props.hideLabel && (!!props.label || !indeterminate.value))
const showValue = computed(() => !props.hideValue && !indeterminate.value)
</script>

<template>
  <div :class="cn('grid gap-2', props.class)">
    <div v-if="showLabel || showValue" class="flex items-baseline justify-between gap-3">
      <span v-if="showLabel" class="font-medium">{{ name }}</span>
      <span v-if="showValue" class="numeral ml-auto text-sm text-muted">{{ Math.round(percent) }}%</span>
    </div>
    <!-- The bar is a button face: primary, flat. What is left is the same shape in a faint tint, striped like a busy button. -->
    <ProgressRoot
      v-model="model"
      :aria-label="name"
      :aria-valuetext="indeterminate ? 'Loading' : (props.valueText ?? `${Math.round(percent)}%`)"
      :class="
        cn(
          'stripes relative h-3 rounded-md bg-primary-soft',
          !complete && 'animate-stripes motion-reduce:animate-none',
          indeterminate && 'overflow-hidden',
        )
      "
    >
      <ProgressIndicator
        :class="
          cn(
            'h-full rounded-md bg-primary transition-[width] duration-(--duration-move) ease-out',
            percent === 0 && !indeterminate && 'invisible',
            indeterminate && 'absolute inset-y-0 left-0 w-2/5 animate-slide transition-none motion-reduce:w-full motion-reduce:animate-none',
          )
        "
        :style="indeterminate ? undefined : { width: percent + '%' }"
      />
    </ProgressRoot>
  </div>
</template>
