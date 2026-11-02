<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'

const props = withDefaults(
  defineProps<{
    title: string
    description?: string
    /** Which edge it opens from. Logical, so 'end' is the left edge in right-to-left pages. */
    side?: 'start' | 'end'
    /** false: no overlay, the page behind stays usable and focus is not trapped. Close it with its X or Escape. */
    modal?: boolean
    /** false: Escape and outside clicks do nothing and the X is hidden. */
    dismissible?: boolean
  }>(),
  { side: 'end', modal: true, dismissible: true },
)
const open = defineModel<boolean>('open', { default: false })

// The in/out keyframes slide from the right; the start side (and RTL) mirror them.
const place = computed(() =>
  props.side === 'end'
    ? 'end-0 ltr:data-[state=open]:animate-[sui-sheet-in_var(--duration-move)_var(--ease-out)] ltr:data-[state=closed]:animate-[sui-sheet-out_var(--duration-move)_var(--ease-out)_forwards] rtl:data-[state=open]:animate-[sui-sheet-in-start_var(--duration-move)_var(--ease-out)] rtl:data-[state=closed]:animate-[sui-sheet-out-start_var(--duration-move)_var(--ease-out)_forwards]'
    : 'start-0 ltr:data-[state=open]:animate-[sui-sheet-in-start_var(--duration-move)_var(--ease-out)] ltr:data-[state=closed]:animate-[sui-sheet-out-start_var(--duration-move)_var(--ease-out)_forwards] rtl:data-[state=open]:animate-[sui-sheet-in_var(--duration-move)_var(--ease-out)] rtl:data-[state=closed]:animate-[sui-sheet-out_var(--duration-move)_var(--ease-out)_forwards]',
)

// Only the body scrolls (header and footer stay put), and it is a keyboard stop only while it actually overflows.
const body = ref<HTMLElement>()
const overflowing = ref(false)
let resize: ResizeObserver | undefined
watch(body, (el) => {
  resize?.disconnect()
  if (!el || typeof ResizeObserver === 'undefined') return
  const check = () => (overflowing.value = el.scrollHeight > el.clientHeight + 1)
  resize = new ResizeObserver(check)
  resize.observe(el)
  for (const child of el.children) resize.observe(child)
  check()
})
onBeforeUnmount(() => resize?.disconnect())

// Where focus lands: anything marked data-autofocus, else the first control in the body (not the Close button), else Reka's default.
const content = ref<{ $el: HTMLElement }>()
function onOpenAutoFocus(e: Event) {
  const root = content.value?.$el
  const target =
    root?.querySelector<HTMLElement>('[data-autofocus]') ??
    root?.querySelector<HTMLElement>('[data-dialog-body] :is(input, select, textarea, button, a[href], [tabindex]:not([tabindex="-1"]))')
  if (!target) return
  e.preventDefault()
  target.focus()
}
function keep(e: Event) {
  if (props.dismissible === false || !props.modal) e.preventDefault()
}
function keepEscape(e: Event) {
  if (props.dismissible === false) e.preventDefault()
}

const outline =
  'slab type-button inline-flex h-control cursor-pointer items-center justify-center bg-surface px-[calc(1rem-var(--stroke-edge))] text-ink transition-state select-none hover:slab-ink hover:shadow-[inset_0_0_0_100vmax_var(--color-wash-hover)] active:slab-flat active:shadow-[inset_0_0_0_100vmax_var(--color-wash-press)] focus-ring'
</script>

<template>
  <DialogRoot v-model:open="open" :modal="props.modal">
    <DialogTrigger as-child>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay
        v-if="props.modal"
        class="fixed inset-0 z-50 bg-scrim data-[state=closed]:animate-[sui-fade-out_var(--duration-fade)_var(--ease-out)_forwards] data-[state=open]:animate-[sui-fade-in_var(--duration-fade)_var(--ease-out)]"
      />
      <!-- Flush against the window edge, so it has no corners; it travels in from its side. -->
      <DialogContent
        ref="content"
        :class="['fixed inset-y-0 z-50 flex w-[min(28rem,100vw)] flex-col gap-3 overflow-hidden bg-surface text-ink shadow-float', place]"
        @open-auto-focus="onOpenAutoFocus"
        @escape-key-down="keepEscape"
        @pointer-down-outside="keep"
        @interact-outside="keep"
      >
        <header class="flex flex-none items-center justify-between gap-3 border-b-(length:--depth) border-primary-slab bg-primary py-1.5 pr-1.5 pl-6 text-on-primary">
          <DialogTitle class="heading min-w-0 text-xl">{{ title }}</DialogTitle>
          <DialogClose
            v-if="props.dismissible"
            aria-label="Close"
            class="inline-grid size-tap shrink-0 cursor-pointer place-items-center rounded-md text-on-primary transition-state hover:bg-on-primary/15 active:bg-on-primary/25 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-on-primary"
          >
            <svg viewBox="0 0 16 16" class="size-5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true">
              <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
            </svg>
          </DialogClose>
        </header>
        <DialogDescription v-if="description" class="mt-1 flex-none px-6 text-muted">{{ description }}</DialogDescription>
        <div
          ref="body"
          data-dialog-body
          :role="overflowing ? 'region' : undefined"
          :aria-label="overflowing ? title : undefined"
          :tabindex="overflowing ? 0 : undefined"
          class="min-h-0 flex-1 overflow-auto overscroll-contain px-6 pb-3 leading-normal focus-inset"
        >
          <slot />
        </div>
        <footer class="flex flex-none justify-end gap-2 px-6 pt-1 pb-4">
          <slot name="footer">
            <DialogClose as-child>
              <button type="button" :class="outline">Close</button>
            </DialogClose>
          </slot>
        </footer>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
