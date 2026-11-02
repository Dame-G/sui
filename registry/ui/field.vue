<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, useId, watch, type HTMLAttributes } from 'vue'
import { Label } from 'reka-ui'
import { announce } from '@/lib/announce'
import { cn } from '@/lib/utils'

// The shared anatomy every sui field has: a label (with Required / Optional said in words), the control, then a hint or an error, and an aside for a counter.
// Bind `id`, `describedby` and `invalid` from the scoped slot onto the control.
const props = defineProps<{
  label: string
  hint?: string
  error?: string
  required?: boolean
  optional?: boolean
  hideLabel?: boolean
  id?: string
  disabled?: boolean
  class?: HTMLAttributes['class']
}>()

const autoId = useId()
const id = computed(() => props.id ?? autoId)

// A message set by <Form> from the browser's own validation (a required field left empty). A message you pass as `error` wins.
const nativeError = ref<string>()
const shownError = computed(() => props.error || nativeError.value)
const describedby = computed(() => [props.hint && !shownError.value && `${id.value}-hint`, shownError.value && `${id.value}-error`].filter(Boolean).join(' ') || undefined)

// An error that shows up later is news to a screen reader: say it once. (At first render it is read with the field.)
watch(
  () => props.error,
  (now, before) => now && now !== before && announce(now, 'assertive'),
)

// Fields register with the surrounding <Form>, if there is one.
interface FormContext {
  register: (entry: FormEntry) => void
  unregister: (id: string) => void
}
interface FormEntry {
  id: string
  label: () => string
  error: () => string | undefined
  setNative: (message?: string) => void
}
const form = inject<FormContext | null>('sui-form', null)
const entry: FormEntry = { id: '', label: () => props.label, error: () => props.error, setNative: (m) => (nativeError.value = m) }
function clearNative() {
  nativeError.value = undefined
}
onMounted(() => {
  entry.id = id.value
  form?.register(entry)
  document.getElementById(id.value)?.addEventListener('input', clearNative)
})
onBeforeUnmount(() => {
  form?.unregister(entry.id)
  document.getElementById(entry.id)?.removeEventListener('input', clearNative)
})
</script>

<template>
  <div :class="cn('grid min-w-0 content-start gap-2', props.class)" :data-disabled="props.disabled ? '' : undefined">
    <div :class="props.hideLabel ? 'sr-only' : 'flex items-baseline justify-between gap-3'">
      <Label :id="`${id}-label`" :for="id" class="kicker">{{ props.label }}</Label>
      <!-- Said in words, only for the rarer case: a required field marks itself, an optional one is marked when most are required. -->
      <span v-if="props.required || props.optional" class="kicker font-regular" aria-hidden="true">{{ props.required ? 'Required' : 'Optional' }}</span>
    </div>
    <slot :id="id" :describedby="describedby" :invalid="!!shownError" />
    <div v-if="shownError || props.hint || $slots.aside" class="flex items-start justify-between gap-3">
      <p v-if="shownError" :id="`${id}-error`" class="flex min-w-0 items-start gap-1 text-sm/[1.4286] font-medium text-danger">
        <svg viewBox="0 0 256 256" class="mt-0.5 size-3.5 shrink-0" fill="currentColor" aria-hidden="true">
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" />
        </svg>
        {{ shownError }}
      </p>
      <p v-else-if="props.hint" :id="`${id}-hint`" class="min-w-0 text-sm/[1.4286] text-muted">{{ props.hint }}</p>
      <span v-if="$slots.aside" class="ms-auto shrink-0 text-sm/[1.4286] text-muted"><slot name="aside" /></span>
    </div>
  </div>
</template>
