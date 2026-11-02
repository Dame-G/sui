<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput, NumberFieldRoot } from 'reka-ui'
import Field from '@/components/ui/field.vue'

const props = defineProps<{
  label: string
  hint?: string
  min?: number
  max?: number
  step?: number
  required?: boolean
  optional?: boolean
  hideLabel?: boolean
  readonly?: boolean
  disabled?: boolean
  loading?: boolean
  error?: string
  name?: string
  class?: HTMLAttributes['class']
}>()
const model = defineModel<number>()

// Stepper faces: a small slab, so they read as pressable next to the sunk well.
const step =
  'slab slab-quiet inline-grid size-control shrink-0 cursor-pointer place-items-center bg-surface bg-clip-padding text-ink transition-state select-none focus-ring hover:[--_ring:var(--color-ink)] hover:[box-shadow:inset_0_0_0_100vmax_var(--color-wash-hover)] active:slab-flat active:[box-shadow:inset_0_0_0_100vmax_var(--color-wash-press)] disabled:slab-flat disabled:dashed-edge disabled:cursor-not-allowed disabled:border-transparent disabled:bg-transparent disabled:text-muted disabled:[box-shadow:none]'
</script>

<template>
  <Field v-slot="{ id, describedby, invalid }" :label="props.label" :hint="props.hint" :error="props.error" :required="props.required" :optional="props.optional" :hide-label="props.hideLabel" :disabled="props.disabled" :class="props.class">
    <NumberFieldRoot
      v-model="model"
      :min="props.min"
      :max="props.max"
      :step="props.step"
      :name="props.name"
      :required="props.required"
      :readonly="props.readonly"
      :disabled="props.disabled"
      :aria-busy="props.loading || undefined"
      class="flex min-w-0 items-center gap-2"
    >
      <NumberFieldDecrement aria-label="Decrease" :disabled="props.readonly || props.disabled" :class="step">
        <svg viewBox="0 0 16 16" class="size-5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M3.5 8h9" /></svg>
      </NumberFieldDecrement>
      <div class="relative min-w-0 flex-1">
        <NumberFieldInput
          :id="id"
          :aria-invalid="invalid ? true : undefined"
          :aria-describedby="describedby"
          :class="['well numeral h-control w-full min-w-0 px-[calc(1rem-var(--stroke-edge))] text-center', props.readonly && 'bg-surface-tint/40', props.loading && 'pe-10']"
        />
        <span v-if="props.loading" class="field-spinner absolute end-0 top-1/2 -translate-y-1/2" aria-hidden="true" />
      </div>
      <NumberFieldIncrement aria-label="Increase" :disabled="props.readonly || props.disabled" :class="step">
        <svg viewBox="0 0 16 16" class="size-5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M3.5 8h9M8 3.5v9" /></svg>
      </NumberFieldIncrement>
    </NumberFieldRoot>
  </Field>
</template>
