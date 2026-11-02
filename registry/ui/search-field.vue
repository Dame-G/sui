<script setup lang="ts">
import { ref, useAttrs, type HTMLAttributes } from 'vue'
import Field from '@/components/ui/field.vue'
import { focusInput } from '@/lib/utils'

defineOptions({ inheritAttrs: false })
const props = defineProps<{
  label: string
  hint?: string
  error?: string
  hideLabel?: boolean
  readonly?: boolean
  disabled?: boolean
  /** Shows a spinner and marks the field busy. */
  loading?: boolean
  /** Text of a submit button at the end of the field, such as "Search". It fires `search`, like Enter. */
  action?: string
  class?: HTMLAttributes['class']
}>()
const model = defineModel<string>({ default: '' })
const emit = defineEmits<{ clear: []; search: [value: string] }>()
const attrs = useAttrs()
const input = ref<HTMLInputElement>()

function clear() {
  model.value = ''
  emit('clear')
  input.value?.focus()
}
</script>

<template>
  <Field v-slot="{ id, describedby, invalid }" :label="props.label" :hint="props.hint" :error="props.error" :hide-label="props.hideLabel" :disabled="props.disabled" :class="props.class">
    <div role="search" :aria-label="props.label" :data-invalid="invalid ? '' : undefined" :data-disabled="props.disabled ? '' : undefined" :data-readonly="props.readonly ? '' : undefined" class="well field-well h-control" @mousedown="focusInput">
      <svg viewBox="0 0 24 24" class="ms-3 size-5 shrink-0 text-muted" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        :id="id"
        ref="input"
        v-model="model"
        type="search"
        :readonly="props.readonly"
        :disabled="props.disabled"
        :aria-invalid="invalid ? true : undefined"
        :aria-busy="props.loading || undefined"
        :aria-describedby="describedby"
        enterkeyhint="search"
        autocomplete="off"
        class="h-full min-w-0 flex-1 appearance-none bg-transparent px-2 text-ink outline-none placeholder:text-muted disabled:cursor-not-allowed disabled:text-muted [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
        v-bind="attrs"
        @keydown.esc="model && ($event.preventDefault(), clear())"
        @keydown.enter="emit('search', model)"
      />
      <span v-if="props.loading" class="field-spinner" aria-hidden="true" />
      <button
        v-if="model && !props.disabled && !props.readonly"
        type="button"
        aria-label="Clear search"
        class="field-action"
        @click="clear"
      >
        <svg viewBox="0 0 16 16" class="size-4" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" /></svg>
      </button>
      <!-- the submit button is a slab of its own, so it reads as pressable inside the sunk field -->
      <button
        v-if="props.action"
        type="button"
        :disabled="props.disabled"
        class="slab slab-thin slab-primary type-button me-[calc(0.25rem-var(--stroke-edge))] inline-flex h-[calc(var(--spacing-control)-0.75rem)] shrink-0 cursor-pointer items-center bg-primary px-3 text-on-primary transition-state select-none hover:bg-primary-hover focus-ring active:slab-flat active:bg-primary-press disabled:cursor-not-allowed disabled:dashed-edge disabled:border-transparent disabled:bg-transparent disabled:text-muted"
        @click="emit('search', model)"
      >
        {{ props.action }}
      </button>
    </div>
  </Field>
</template>
