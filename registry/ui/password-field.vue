<script setup lang="ts">
import { computed, ref, useAttrs, watch, type HTMLAttributes } from 'vue'
import Field from '@/components/ui/field.vue'
import { announce } from '@/lib/announce'

defineOptions({ inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    label: string
    hint?: string
    error?: string
    required?: boolean
    optional?: boolean
    hideLabel?: boolean
    readonly?: boolean
    disabled?: boolean
    loading?: boolean
    /** 'current' for signing in, 'new' for choosing one: it sets autocomplete so a password manager does the right thing. */
    mode?: 'current' | 'new'
    /** A checklist shown under the field: each rule is met when `test` returns true. */
    rules?: { label: string; test: (value: string) => boolean }[]
    class?: HTMLAttributes['class']
  }>(),
  { mode: 'current' },
)
const model = defineModel<string>({ default: '' })
const attrs = useAttrs()
const shown = ref(false)

const results = computed(() => (props.rules ?? []).map((r) => ({ label: r.label, met: r.test(model.value) })))
const metCount = computed(() => results.value.filter((r) => r.met).length)
const summary = computed(() => `${metCount.value} of ${results.value.length} rules met`)

// Say the count when it changes, not on every key.
watch(metCount, () => model.value && announce(summary.value))
</script>

<template>
  <Field v-slot="{ id, describedby, invalid }" :label="props.label" :hint="props.hint" :error="props.error" :required="props.required" :optional="props.optional" :hide-label="props.hideLabel" :disabled="props.disabled" :class="props.class">
    <!-- the well is the wrapper, so the reveal button sits inside it and the whole thing hovers and focuses as one field -->
    <div :data-invalid="invalid ? '' : undefined" :data-disabled="props.disabled ? '' : undefined" :data-readonly="props.readonly ? '' : undefined" class="well field-well h-control">
      <input
        :id="id"
        v-model="model"
        :type="shown ? 'text' : 'password'"
        :readonly="props.readonly"
        :disabled="props.disabled"
        :required="props.required"
        :autocomplete="props.mode === 'new' ? 'new-password' : 'current-password'"
        autocapitalize="none"
        spellcheck="false"
        :aria-invalid="invalid ? true : undefined"
        :aria-busy="props.loading || undefined"
        :aria-describedby="[describedby, props.rules?.length && `${id}-rules`].filter(Boolean).join(' ') || undefined"
        class="h-full min-w-0 flex-1 bg-transparent ps-[calc(1rem-var(--stroke-edge))] text-ink outline-none placeholder:text-muted disabled:cursor-not-allowed disabled:text-muted"
        v-bind="attrs"
      />
      <span v-if="props.loading" class="field-spinner" aria-hidden="true" />
      <button
        type="button"
        :disabled="props.disabled"
        :aria-label="shown ? 'Hide password' : 'Show password'"
        :aria-pressed="shown"
        class="field-action"
        @click="shown = !shown"
      >
        <svg v-if="!shown" viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <svg v-else viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.1 3.9M6.6 6.6A17 17 0 0 0 2 12s3.6 7 10 7a9.8 9.8 0 0 0 4.2-.9M9.9 9.9a3 3 0 0 0 4.2 4.2" />
        </svg>
      </button>
    </div>
    <!-- Met or not is said in words, never by colour alone. -->
    <div v-if="props.rules?.length" :id="`${id}-rules`" class="grid gap-1 text-sm/[1.4286]">
      <p class="text-muted">{{ summary }}</p>
      <ul class="grid gap-0.5">
        <li v-for="r in results" :key="r.label" class="flex items-center gap-2" :class="r.met ? 'text-success' : 'text-muted'">
          <svg v-if="r.met" viewBox="0 0 16 16" class="size-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 4.8" /></svg>
          <svg v-else viewBox="0 0 16 16" class="size-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="8" cy="8" r="4.5" /></svg>
          <span>{{ r.label }}<span class="sr-only">{{ r.met ? ': met' : ': not met yet' }}</span></span>
        </li>
      </ul>
    </div>
  </Field>
</template>
