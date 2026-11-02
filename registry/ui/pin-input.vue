<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { PinInputInput, PinInputRoot } from 'reka-ui'
import Field from '@/components/ui/field.vue'

const props = withDefaults(
  defineProps<{
    label: string
    hint?: string
    length?: number
    /** Show a wider gap after every N boxes, so 123456 reads as 123 456. */
    groupSize?: number
    /** Which characters are allowed: digits, letters and digits, or anything. */
    charset?: 'numeric' | 'alphanumeric' | 'any'
    error?: string
    required?: boolean
    optional?: boolean
    hideLabel?: boolean
    readonly?: boolean
    disabled?: boolean
    name?: string
    class?: HTMLAttributes['class']
  }>(),
  { length: 6, charset: 'any' },
)
const model = defineModel<string>({ default: '' })
const emit = defineEmits<{ complete: [value: string] }>()

const allowed = computed(() => (props.charset === 'numeric' ? /^[0-9]$/ : props.charset === 'alphanumeric' ? /^[a-zA-Z0-9]$/ : /^.$/s))

// The model is a plain string; Reka keeps one entry per box.
const boxes = computed({
  get: () => model.value.split(''),
  set: (v: string[]) => (model.value = v.filter((c) => allowed.value.test(c)).join('')),
})
function onBeforeInput(e: InputEvent) {
  if (e.data && [...e.data].some((c) => !allowed.value.test(c))) e.preventDefault()
}
const gap = (i: number) => (props.groupSize && i > 1 && (i - 1) % props.groupSize === 0 ? 'ms-3' : undefined)
</script>

<template>
  <Field v-slot="{ id, describedby, invalid }" :label="props.label" :hint="props.hint" :error="props.error" :required="props.required" :optional="props.optional" :hide-label="props.hideLabel" :disabled="props.disabled" :class="props.class">
    <PinInputRoot
      :id="id"
      v-model="boxes"
      otp
      role="group"
      :aria-labelledby="`${id}-label`"
      :name="props.name"
      :required="props.required"
      :disabled="props.disabled"
      :aria-describedby="describedby"
      class="flex gap-2"
      @complete="(v: string[]) => emit('complete', v.join(''))"
    >
      <PinInputInput
        v-for="i in props.length"
        :key="i"
        :index="i - 1"
        :aria-label="`Digit ${i} of ${props.length}`"
        :aria-invalid="invalid ? true : undefined"
        :readonly="props.readonly"
        :inputmode="props.charset === 'numeric' ? 'numeric' : undefined"
        :class="['well numeral size-control min-w-0 text-center text-lg disabled:cursor-not-allowed', gap(i), props.readonly && 'bg-surface-tint/40']"
        @beforeinput="onBeforeInput"
      />
    </PinInputRoot>
  </Field>
</template>
