<script setup lang="ts">
import { useAttrs, type HTMLAttributes } from 'vue'
import Field from '@/components/ui/field.vue'
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })
const props = defineProps<{
  label: string
  hint?: string
  prefix?: string
  suffix?: string
  error?: string
  required?: boolean
  optional?: boolean
  hideLabel?: boolean
  readonly?: boolean
  disabled?: boolean
  loading?: boolean
  class?: HTMLAttributes['class']
}>()
const model = defineModel<string>({ default: '' })
const attrs = useAttrs()

// The well draws the outer edge; each segment draws its own inner corners (radius minus the 1px edge), so nothing is clipped and no anti-aliased gap opens at the corners.
const segment = 'inline-flex shrink-0 items-center bg-surface-tint px-3 text-muted'
</script>

<template>
  <Field v-slot="{ id, describedby, invalid }" :label="props.label" :hint="props.hint" :error="props.error" :required="props.required" :optional="props.optional" :hide-label="props.hideLabel" :disabled="props.disabled" :class="props.class">
    <div
      :data-invalid="invalid ? '' : undefined"
      :data-disabled="props.disabled ? '' : undefined"
      :data-readonly="props.readonly ? '' : undefined"
      class="well field-well h-control items-stretch"
    >
      <span
        v-if="props.prefix || $slots.prefix"
        :class="cn(segment, 'rounded-s-[max(0px,calc(var(--radius-md)-var(--stroke-edge)))] border-e border-edge-strong', props.disabled && 'bg-transparent')"
      >
        <slot name="prefix">{{ props.prefix }}</slot>
      </span>
      <input
        :id="id"
        v-model="model"
        :readonly="props.readonly"
        :disabled="props.disabled"
        :required="props.required"
        :aria-invalid="invalid ? true : undefined"
        :aria-busy="props.loading || undefined"
        :aria-describedby="describedby"
        class="min-w-0 flex-1 bg-transparent px-[calc(1rem-var(--stroke-edge))] text-ink outline-none placeholder:text-muted disabled:cursor-not-allowed"
        v-bind="attrs"
      />
      <span v-if="props.loading" class="field-spinner self-center" aria-hidden="true" />
      <span
        v-if="props.suffix || $slots.suffix"
        :class="cn(segment, 'rounded-e-[max(0px,calc(var(--radius-md)-var(--stroke-edge)))] border-s border-edge-strong', props.disabled && 'bg-transparent')"
      >
        <slot name="suffix">{{ props.suffix }}</slot>
      </span>
    </div>
  </Field>
</template>
