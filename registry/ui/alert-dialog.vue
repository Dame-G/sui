<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'reka-ui'

const props = withDefaults(
  defineProps<{
    title: string
    description?: string
    confirmLabel?: string
    cancelLabel?: string
    /** The confirmed action is running: the button shows busy, ignores presses, and the dialog stays open until you set this back to false. */
    loading?: boolean
    /** false: Escape does nothing, so the choice has to be made with a button. */
    dismissible?: boolean
  }>(),
  { confirmLabel: 'Delete', cancelLabel: 'Cancel', dismissible: true },
)
const emit = defineEmits<{ confirm: [] }>()
const open = defineModel<boolean>('open', { default: false })

const cancel = ref<{ $el: HTMLElement }>()
// Least destructive first: focus lands on Cancel, never on the danger button.
function onOpenAutoFocus(e: Event) {
  const el = cancel.value?.$el
  if (!el) return
  e.preventDefault()
  el.focus()
}
function onEscape(e: Event) {
  if (!props.dismissible || props.loading) e.preventDefault()
}
// The dialog closes after the action, unless the action is still running (then `loading` holds it open).
let waiting = false
async function confirm() {
  if (props.loading) return
  emit('confirm')
  await nextTick()
  if (props.loading) waiting = true
  else open.value = false
}
watch(
  () => props.loading,
  (busy) => {
    if (!busy && waiting) {
      waiting = false
      open.value = false
    }
  },
)

// Two looks written out here (Button has one design): the quiet outline for backing out, the danger face for the destructive action.
const outline =
  'slab type-button inline-flex h-control cursor-pointer items-center justify-center bg-surface px-[calc(1rem-var(--stroke-edge))] text-ink transition-state select-none hover:slab-ink hover:shadow-[inset_0_0_0_100vmax_var(--color-wash-hover)] active:slab-flat active:shadow-[inset_0_0_0_100vmax_var(--color-wash-press)] focus-ring'
const danger =
  'slab slab-danger type-button inline-flex h-control cursor-pointer items-center justify-center bg-danger px-[calc(1rem-var(--stroke-edge))] whitespace-nowrap text-on-primary transition-state select-none hover:bg-danger-hover active:slab-flat active:bg-danger-press focus-ring'
</script>

<template>
  <AlertDialogRoot v-model:open="open">
    <AlertDialogTrigger as-child>
      <slot name="trigger" />
    </AlertDialogTrigger>
    <AlertDialogPortal>
      <AlertDialogOverlay
        class="fixed inset-0 z-50 bg-scrim data-[state=closed]:animate-[sui-fade-out_var(--duration-fade)_var(--ease-out)_forwards] data-[state=open]:animate-[sui-fade-in_var(--duration-fade)_var(--ease-out)]"
      />
      <AlertDialogContent
        @open-auto-focus="onOpenAutoFocus"
        @escape-key-down="onEscape"
        class="edge-start tone-danger fixed top-1/2 left-1/2 z-50 grid max-h-[calc(100dvh-2rem)] w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 gap-2 overflow-hidden bg-surface p-6 pl-[calc(1.5rem-var(--depth-bold))] text-ink shadow-float data-[state=closed]:animate-[sui-dialog-out_var(--duration-fade)_var(--ease-out)_forwards] data-[state=open]:animate-[sui-dialog-in_var(--duration-fade)_var(--ease-out)]"
      >
        <AlertDialogTitle class="heading text-2xl">{{ title }}</AlertDialogTitle>
        <AlertDialogDescription v-if="description" class="text-muted">{{ description }}</AlertDialogDescription>
        <div v-if="$slots.default" class="leading-normal"><slot /></div>
        <footer class="mt-4 flex justify-end gap-2">
          <AlertDialogCancel ref="cancel" as-child :disabled="props.loading">
            <button type="button" :class="[outline, props.loading && 'cursor-not-allowed opacity-60']">{{ cancelLabel }}</button>
          </AlertDialogCancel>
          <button
            type="button"
            :class="[danger, props.loading && 'dashed-edge cursor-progress']"
            :aria-disabled="props.loading ? true : undefined"
            :aria-busy="props.loading ? true : undefined"
            @click="confirm"
          >
            <span v-if="props.loading" class="me-2 inline-block size-4 animate-ring rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none" aria-hidden="true" />
            {{ confirmLabel }}
          </button>
        </footer>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
