<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import {
  EditableArea,
  EditableCancelTrigger,
  EditableEditTrigger,
  EditableInput,
  EditablePreview,
  EditableRoot,
  EditableSubmitTrigger,
} from 'reka-ui'
import Field from '@/components/ui/field.vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  label: string
  hint?: string
  error?: string
  required?: boolean
  optional?: boolean
  hideLabel?: boolean
  readonly?: boolean
  loading?: boolean
  name?: string
  placeholder?: string
  disabled?: boolean
  class?: HTMLAttributes['class']
}>()
const model = defineModel<string>({ default: '' })
const emit = defineEmits<{ submit: [value: string] }>()

// Quiet icon buttons, like the dialog's close.
const icon =
  'inline-grid size-tap shrink-0 cursor-pointer place-items-center rounded-md transition-state hover:bg-wash-hover active:bg-wash-press focus-ring'
</script>

<template>
  <Field v-slot="{ id, describedby, invalid }" :label="props.label" :hint="props.hint" :error="props.error" :required="props.required" :optional="props.optional" :hide-label="props.hideLabel" :disabled="props.disabled" :class="props.class">
    <EditableRoot
      :id="id"
      :name="props.name"
      :readonly="props.readonly"
      :aria-describedby="describedby"
      :aria-invalid="invalid ? true : undefined"
      :aria-busy="props.loading || undefined"
      v-slot="{ isEditing }"
      v-model="model"
      :placeholder="props.placeholder ?? 'Click to edit'"
      :disabled="props.disabled"
      submit-mode="both"
      class="group flex min-w-0 items-center gap-1"
      @submit="(v) => emit('submit', v ?? '')"
    >
      <EditableArea class="min-w-0 flex-1">
        <!-- At rest it is plain text; the wash answers the pointer and says "you can edit me". -->
        <EditablePreview
          :class="
            cn(
              'flex h-control w-full min-w-0 cursor-text items-center truncate rounded-md border border-transparent px-[calc(1rem-var(--stroke-edge))] text-ink transition-state',
              'hover:bg-wash-hover hover:shadow-[inset_0_0_0_var(--stroke-edge)_var(--color-wash-ring)] focus-ring',
              'data-[empty]:text-muted data-[disabled]:cursor-not-allowed data-[disabled]:text-muted data-[disabled]:hover:bg-transparent data-[disabled]:hover:shadow-none',
            )
          "
        />
        <EditableInput class="well h-control w-full min-w-0 px-[calc(1rem-var(--stroke-edge))]" />
      </EditableArea>
      <template v-if="!isEditing && !props.readonly">
        <EditableEditTrigger
          aria-label="Edit"
          :class="cn(icon, 'text-muted opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100')"
        >
          <svg viewBox="0 0 16 16" class="size-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M10.5 2.5l3 3L5.5 13.5H2.5v-3z" />
            <path d="M9 4l3 3" />
          </svg>
        </EditableEditTrigger>
      </template>
      <template v-else-if="isEditing">
        <EditableSubmitTrigger aria-label="Save" :class="cn(icon, 'text-primary')">
          <svg viewBox="0 0 16 16" class="size-5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M3 8.5l3.2 3.2L13 4.8" />
          </svg>
        </EditableSubmitTrigger>
        <EditableCancelTrigger aria-label="Cancel" :class="cn(icon, 'text-muted')">
          <svg viewBox="0 0 16 16" class="size-5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true">
            <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
          </svg>
        </EditableCancelTrigger>
      </template>
    </EditableRoot>
  </Field>
</template>
