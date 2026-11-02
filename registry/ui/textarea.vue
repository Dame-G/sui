<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useAttrs, watch, type HTMLAttributes } from 'vue'
import Field from '@/components/ui/field.vue'
import { cn } from '@/lib/utils'

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
  loading?: boolean
  maxlength?: number
  /** Show how many characters are used (of `maxlength` if set). */
  counter?: boolean
  /** Grow with the text instead of scrolling; the resize handle goes away. */
  autoGrow?: boolean
  class?: HTMLAttributes['class']
}>()
const model = defineModel<string>({ default: '' })
const attrs = useAttrs()
const area = ref<HTMLTextAreaElement>()

const count = computed(() => model.value.length)
const counterText = computed(() => (props.maxlength ? `${count.value} of ${props.maxlength} characters` : `${count.value} characters`))

function grow() {
  const el = area.value
  if (!props.autoGrow || !el) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight + el.offsetHeight - el.clientHeight}px`
}
onMounted(grow)
watch(model, () => nextTick(grow))
</script>

<template>
  <Field :label="props.label" :hint="props.hint" :error="props.error" :required="props.required" :optional="props.optional" :hide-label="props.hideLabel" :disabled="props.disabled" :class="props.class">
    <template #default="{ id, describedby, invalid }">
    <div class="relative">
      <textarea
        :id="id"
        ref="area"
        v-model="model"
        rows="4"
        :readonly="props.readonly"
        :disabled="props.disabled"
        :required="props.required"
        :maxlength="props.maxlength"
        :aria-invalid="invalid ? true : undefined"
        :aria-busy="props.loading || undefined"
        :aria-describedby="[describedby, props.counter && `${id}-count`, attrs['aria-describedby']].filter(Boolean).join(' ') || undefined"
        :class="
          cn(
            'well min-h-control w-full min-w-0 p-[calc(0.75rem-var(--stroke-edge))] leading-normal',
            props.autoGrow ? 'resize-none overflow-hidden' : 'resize-y',
            props.loading && 'pe-10',
            props.readonly && 'bg-surface-tint/40',
          )
        "
        v-bind="attrs"
      />
      <span v-if="props.loading" class="field-spinner absolute end-0 top-3" aria-hidden="true" />
    </div>
    <span v-if="props.counter" :id="`${id}-count`" class="sr-only">{{ counterText }}</span>
        </template>
    <template v-if="props.counter" #aside><span aria-hidden="true" class="numeral">{{ props.maxlength ? `${count} / ${props.maxlength}` : count }}</span></template>
  </Field>
</template>
