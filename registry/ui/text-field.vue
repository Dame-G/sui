<script setup lang="ts">
import { computed, ref, useAttrs, type HTMLAttributes } from 'vue'
import Field from '@/components/ui/field.vue'
import { focusInput } from '@/lib/utils'

defineOptions({ inheritAttrs: false })
const props = defineProps<{
  label: string
  hint?: string
  error?: string
  required?: boolean
  optional?: boolean
  hideLabel?: boolean
  readonly?: boolean
  disabled?: boolean
  /** Shows a spinner and marks the field busy. */
  loading?: boolean
  /** Adds a clear button once there is text; focus stays in the input. */
  clearable?: boolean
  /** Text before and after the value, such as "$" or "kg". Read as part of the description. */
  prefix?: string
  suffix?: string
  maxlength?: number
  /** Show how many characters are used (of `maxlength` if set). */
  counter?: boolean
  class?: HTMLAttributes['class']
}>()
const model = defineModel<string>({ default: '' })
const attrs = useAttrs()
const input = ref<HTMLInputElement>()

const count = computed(() => model.value.length)
const counterText = computed(() => (props.maxlength ? `${count.value} of ${props.maxlength} characters` : `${count.value} characters`))
const affix = computed(() => [props.prefix, props.suffix].filter(Boolean).join(' '))
const showClear = computed(() => props.clearable && !!model.value && !props.disabled && !props.readonly)

function describe(base?: string, extra?: string) {
  return [base, extra, attrs['aria-describedby'] as string | undefined].filter(Boolean).join(' ') || undefined
}
function clear() {
  model.value = ''
  input.value?.focus()
}
</script>

<template>
  <Field :label="props.label" :hint="props.hint" :error="props.error" :required="props.required" :optional="props.optional" :hide-label="props.hideLabel" :disabled="props.disabled" :class="props.class">
    <template #default="{ id, describedby, invalid }">
    <div
      :data-invalid="invalid ? '' : undefined"
      :data-disabled="props.disabled ? '' : undefined"
      :data-readonly="props.readonly ? '' : undefined"
      class="well field-well h-control"
      @mousedown="focusInput"
    >
      <span v-if="props.prefix" aria-hidden="true" class="ps-[calc(1rem-var(--stroke-edge))] text-muted">{{ props.prefix }}</span>
      <input
        :id="id"
        ref="input"
        v-model="model"
        :readonly="props.readonly"
        :disabled="props.disabled"
        :required="props.required"
        :maxlength="props.maxlength"
        :aria-invalid="invalid ? true : undefined"
        :aria-busy="props.loading || undefined"
        :aria-describedby="describe(describedby, [affix && `${id}-affix`, props.counter && `${id}-count`].filter(Boolean).join(' '))"
        :class="[
          'h-full min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-muted disabled:cursor-not-allowed disabled:text-muted',
          props.prefix ? 'ps-1.5' : 'ps-[calc(1rem-var(--stroke-edge))]',
          props.suffix || showClear || props.loading ? 'pe-1.5' : 'pe-[calc(1rem-var(--stroke-edge))]',
        ]"
        v-bind="{ ...attrs, class: undefined }"
      />
      <span v-if="props.loading" class="field-spinner" aria-hidden="true" />
      <button
        v-if="showClear"
        type="button"
        aria-label="Clear"
        class="field-action"
        @click="clear"
      >
        <svg viewBox="0 0 16 16" class="size-4" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" /></svg>
      </button>
      <span v-if="props.suffix" aria-hidden="true" class="pe-[calc(1rem-var(--stroke-edge))] text-muted">{{ props.suffix }}</span>
    </div>
    <span v-if="affix" :id="`${id}-affix`" class="sr-only">{{ affix }}</span>
    <span v-if="props.counter" :id="`${id}-count`" class="sr-only">{{ counterText }}</span>
        </template>
    <template v-if="props.counter" #aside><span aria-hidden="true" class="numeral">{{ props.maxlength ? `${count} / ${props.maxlength}` : count }}</span></template>
  </Field>
</template>
