<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { cn } from '@/lib/utils'

type Mark = number | { value: number; label?: string }
const props = withDefaults(
  defineProps<{
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    name?: string
    /** The control's accessible name. A two-thumb range reads "<label> minimum" and "<label> maximum". */
    label?: string
    /** Id of a visible label (a Field's `${id}-label`) to name a single thumb instead of `label`. */
    labelledby?: string
    /** What a screen reader hears for the value, e.g. "$40": a string (shared) or a function of the value and thumb index. */
    valueText?: string | ((value: number, index: number) => string)
    /** Ticks along the track, each optionally with a label. */
    marks?: Mark[]
    class?: HTMLAttributes['class']
  }>(),
  { min: 0, max: 100, step: 1 },
)
const model = defineModel<number[]>({ default: () => [0] })

const ticks = computed(() =>
  (props.marks ?? []).map((m) => {
    const value = typeof m === 'number' ? m : m.value
    return { value, label: typeof m === 'number' ? String(m) : (m.label ?? String(m.value)), at: ((value - props.min) / (props.max - props.min)) * 100 }
  }),
)
const hasMarks = computed(() => ticks.value.length > 0)
const nameOf = (i: number) => {
  if (props.labelledby && model.value.length === 1) return undefined
  const base = props.label ?? 'Value'
  return model.value.length === 2 ? `${base} ${i === 0 ? 'minimum' : 'maximum'}` : base
}
const textOf = (v: number, i: number) => (typeof props.valueText === 'function' ? props.valueText(v, i) : props.valueText)
</script>

<template>
  <SliderRoot
    v-model="model"
    :min="props.min"
    :max="props.max"
    :step="props.step"
    :disabled="props.disabled"
    :name="props.name"
    :class="cn('group relative flex w-full touch-none items-center select-none data-[disabled]:cursor-not-allowed', hasMarks ? 'h-[calc(var(--spacing-control)+1.25rem)] pb-5' : 'h-control', props.class)"
  >
    <!-- the groove: pressed in, like the segmented track; the chosen span fills in primary -->
    <SliderTrack
      class="relative h-2 grow rounded-sm border border-edge-strong bg-surface-tint bg-clip-padding shadow-well group-data-[disabled]:border-dashed group-data-[disabled]:bg-transparent group-data-[disabled]:shadow-none"
    >
      <SliderRange class="absolute h-full rounded-[max(0px,calc(var(--radius-sm)-var(--stroke-edge)))] bg-primary group-data-[disabled]:bg-muted/35" />
    </SliderTrack>
    <!-- marks: a tick under the groove and a label under that; they are decoration, the value text carries the meaning -->
    <div v-if="hasMarks" class="pointer-events-none absolute inset-x-2.5 bottom-0 h-5" aria-hidden="true">
      <span v-for="t in ticks" :key="t.value" class="absolute top-0 -translate-x-1/2 text-xs leading-none text-muted" :style="{ left: `${t.at}%` }">
        <span class="mx-auto mb-1 block h-1.5 w-px bg-edge-strong" />
        <span class="numeral">{{ t.label }}</span>
      </span>
    </div>
    <!-- the thumb: a small button face on a primary slab that sinks when pressed -->
    <SliderThumb
      v-for="(v, i) in model"
      :key="i"
      :aria-label="nameOf(i)"
      :aria-labelledby="model.length === 1 ? props.labelledby : undefined"
      :aria-valuetext="textOf(v, i)"
      class="slab slab-sm slab-primary slab-thin block size-check cursor-grab bg-surface bg-clip-padding transition-state focus-ring active:slab-flat active:cursor-grabbing data-[disabled]:slab-flat data-[disabled]:dashed-edge data-[disabled]:cursor-not-allowed data-[disabled]:border-transparent"
    />
  </SliderRoot>
</template>
