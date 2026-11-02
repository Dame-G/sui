<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
  DrawerViewport,
} from 'reka-ui'

const props = withDefaults(
  defineProps<{ title: string; description?: string; /** false: Escape and outside clicks do nothing and the corner X is hidden. */ dismissible?: boolean }>(),
  { dismissible: true },
)
const open = defineModel<boolean>('open', { default: false })

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
  if (props.dismissible === false) e.preventDefault()
}

const outline =
  'slab type-button inline-flex h-control cursor-pointer items-center justify-center bg-surface px-[calc(1rem-var(--stroke-edge))] text-ink transition-state select-none hover:slab-ink hover:shadow-[inset_0_0_0_100vmax_var(--color-wash-hover)] active:slab-flat active:shadow-[inset_0_0_0_100vmax_var(--color-wash-press)] focus-ring'
</script>

<template>
  <DrawerRoot v-model:open="open">
    <DrawerTrigger as-child>
      <slot name="trigger" />
    </DrawerTrigger>
    <DrawerPortal>
      <DrawerOverlay
        class="fixed inset-0 z-50 bg-scrim data-[state=closed]:animate-[sui-fade-out_var(--duration-fade)_var(--ease-out)_forwards] data-[state=open]:animate-[sui-fade-in_var(--duration-fade)_var(--ease-out)]"
      />
      <DrawerViewport class="pointer-events-none fixed inset-0 z-50 flex items-end justify-center">
        <!-- Header and body each draw their own edge and corners (nothing is clipped); the bottom is flush with the window. Dragging the panel down dismisses it. -->
        <DrawerContent
          ref="content"
          @open-auto-focus="onOpenAutoFocus"
          @escape-key-down="keep"
          @pointer-down-outside="keep"
          @interact-outside="keep"
          class="pointer-events-auto flex max-h-[calc(100dvh-2rem)] w-[min(36rem,100vw)] translate-y-(--drawer-swipe-movement-y) touch-none flex-col rounded-t-md text-ink shadow-drop data-[swiping]:select-none data-[state=closed]:animate-[sui-drawer-out_var(--duration-move)_var(--ease-out)_forwards] data-[state=open]:animate-[sui-drawer-in_var(--duration-move)_var(--ease-out)]"
        >
          <header
            class="flex flex-none flex-col rounded-t-md border border-b-(length:--depth) border-primary-slab bg-primary pt-2 pr-1.5 pb-1.5 pl-[calc(1.5rem-var(--stroke-edge))] text-on-primary"
          >
            <DrawerHandle class="mx-auto mb-1 h-1 w-10 cursor-grab rounded-sm bg-on-primary/50 active:cursor-grabbing" />
            <div class="flex items-center justify-between gap-3">
              <DrawerTitle class="heading min-w-0 text-xl">{{ title }}</DrawerTitle>
              <DrawerClose
                v-if="props.dismissible"
                aria-label="Close"
                class="inline-grid size-tap shrink-0 cursor-pointer place-items-center rounded-md text-on-primary transition-state hover:bg-on-primary/15 active:bg-on-primary/25 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-on-primary"
              >
                <svg viewBox="0 0 16 16" class="size-5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true">
                  <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
                </svg>
              </DrawerClose>
            </div>
          </header>
          <div data-dialog-body class="flex min-h-0 flex-1 touch-auto flex-col gap-3 border border-y-0 border-edge bg-surface pt-4">
            <DrawerDescription v-if="description" class="flex-none px-[calc(1.5rem-var(--stroke-edge))] text-muted">{{ description }}</DrawerDescription>
            <div ref="body" :role="overflowing ? 'region' : undefined" :aria-label="overflowing ? title : undefined" :tabindex="overflowing ? 0 : undefined" class="min-h-0 flex-1 overflow-auto overscroll-contain px-[calc(1.5rem-var(--stroke-edge))] leading-normal focus-inset"><slot /></div>
            <footer class="flex flex-none justify-end gap-2 px-[calc(1.5rem-var(--stroke-edge))] pt-1 pb-4">
              <slot name="footer">
                <DrawerClose as-child>
                  <button type="button" :class="outline">Close</button>
                </DrawerClose>
              </slot>
            </footer>
          </div>
        </DrawerContent>
      </DrawerViewport>
    </DrawerPortal>
  </DrawerRoot>
</template>
