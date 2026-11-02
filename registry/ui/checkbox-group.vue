<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import Checkbox from '@/components/ui/checkbox.vue'
import Fieldset from '@/components/ui/fieldset.vue'

const props = defineProps<{
  legend: string
  options: { value: string; label: string; disabled?: boolean }[]
  /** Adds a first checkbox that checks or clears everything; it shows the indeterminate state for a partial pick. */
  selectAll?: string
  hint?: string
  error?: string
  disabled?: boolean
  orientation?: 'vertical' | 'horizontal'
  class?: HTMLAttributes['class']
}>()
const model = defineModel<string[]>({ default: () => [] })

const pickable = computed(() => props.options.filter((o) => !o.disabled).map((o) => o.value))
const all = computed<boolean | 'indeterminate'>(() => {
  const n = pickable.value.filter((v) => model.value.includes(v)).length
  return n === 0 ? false : n === pickable.value.length ? true : 'indeterminate'
})

function toggle(value: string, on: boolean | 'indeterminate') {
  model.value = on === true ? [...model.value, value] : model.value.filter((v) => v !== value)
}
function toggleAll(on: boolean | 'indeterminate') {
  const kept = model.value.filter((v) => !pickable.value.includes(v))
  model.value = on === true ? [...kept, ...pickable.value] : kept
}
</script>

<template>
  <Fieldset
    :legend="props.legend"
    :hint="props.hint"
    :error="props.error"
    :disabled="props.disabled"
    :orientation="props.orientation"
    :class="props.class"
  >
    <Checkbox v-if="props.selectAll" :model-value="all" :label="props.selectAll" class="font-medium" @update:model-value="toggleAll" />
    <Checkbox
      v-for="o in props.options"
      :key="o.value"
      :model-value="model.includes(o.value)"
      :label="o.label"
      :disabled="o.disabled"
      :class="props.selectAll && props.orientation !== 'horizontal' ? 'ms-7' : undefined"
      @update:model-value="toggle(o.value, $event)"
    />
  </Fieldset>
</template>
