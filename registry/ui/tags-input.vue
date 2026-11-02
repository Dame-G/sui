<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText, TagsInputRoot } from 'reka-ui'
import Field from '@/components/ui/field.vue'

const props = defineProps<{
  label: string
  hint?: string
  placeholder?: string
  error?: string
  required?: boolean
  optional?: boolean
  hideLabel?: boolean
  readonly?: boolean
  disabled?: boolean
  loading?: boolean
  name?: string
  class?: HTMLAttributes['class']
}>()
const model = defineModel<string[]>({ default: () => [] })
</script>

<template>
  <Field v-slot="{ id, describedby, invalid }" :label="props.label" :hint="props.hint" :error="props.error" :required="props.required" :optional="props.optional" :hide-label="props.hideLabel" :disabled="props.disabled" :class="props.class">
    <!-- The container is the well; it shows focus when the input inside it does. -->
    <TagsInputRoot
      v-model="model"
      :name="props.name"
      :disabled="props.disabled"
      :aria-invalid="invalid ? true : undefined"
      :aria-busy="props.loading || undefined"
      :aria-describedby="describedby"
      :data-readonly="props.readonly ? '' : undefined"
      class="well field-well flex-wrap gap-1.5 px-[calc(0.5rem-var(--stroke-edge))] py-1.5"
    >
      <!-- A chip is a small stamp: tinted face, 1px edge, remove button on its end. -->
      <TagsInputItem
        v-for="tag in model"
        :key="tag"
        :value="tag"
        :class="['inline-flex h-chip items-center gap-1 rounded-sm border border-edge-strong bg-surface-tint ps-2 text-sm text-ink data-[state=active]:border-primary data-[state=active]:bg-primary-soft', props.readonly || props.disabled ? 'pe-2' : 'pe-px']"
      >
        <TagsInputItemText class="font-medium" />
        <!-- A 24px button: it fills the chip, and its hit area reaches 4px past the edge so it is easy to tap. -->
        <TagsInputItemDelete
          v-if="!props.readonly && !props.disabled"
          :aria-label="`Remove ${tag}`"
          class="relative inline-grid aspect-square h-full cursor-pointer place-items-center rounded-sm transition-state after:absolute after:-inset-1 after:content-[''] hover:bg-wash-press focus-ring"
        >
          <svg viewBox="0 0 16 16" class="size-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
          </svg>
        </TagsInputItemDelete>
      </TagsInputItem>
      <TagsInputInput
        :id="id"
        :placeholder="props.placeholder"
        :readonly="props.readonly"
        class="h-chip min-w-24 flex-1 bg-transparent px-1.5 text-ink outline-none placeholder:text-muted disabled:cursor-not-allowed"
      />
      <span v-if="props.loading" class="field-spinner" aria-hidden="true" />
    </TagsInputRoot>
  </Field>
</template>
