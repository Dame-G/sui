<script lang="ts">
import { ref } from 'vue'

export type ToastTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'
export interface ToastOptions {
  title: string
  description?: string
  tone?: ToastTone
  /** Milliseconds on screen. Default 5000; danger toasts and toasts with an action stay until dismissed. 0 = stay. */
  duration?: number
  /** A button on the toast, e.g. { label: 'Undo', onClick }. It dismisses the toast. */
  action?: { label: string; onClick: () => void }
  /** Firing the same key again updates that toast in place instead of stacking another. */
  key?: string
  /** Show the close button (default true). */
  closable?: boolean
}
interface ToastItem extends ToastOptions {
  id: number
  tone: ToastTone
  /** bumped when a keyed toast is updated, so its timer starts again */
  rev: number
  busy?: boolean
}

// Shared by every <Toaster />; call `toast()` from anywhere.
const items = ref<ToastItem[]>([])
let next = 0

export function toast(options: ToastOptions & { busy?: boolean }) {
  const hit = options.key ? items.value.find((t) => t.key === options.key) : undefined
  if (hit) {
    items.value = items.value.map((t) => (t === hit ? { ...options, id: t.id, tone: options.tone ?? 'info', rev: t.rev + 1 } : t))
    return hit.id
  }
  const id = next++
  items.value = [...items.value, { tone: 'info', rev: 0, ...options, id }]
  return id
}

/** A toast that follows a promise: shows `loading`, then becomes `success` or `error` in place. */
toast.promise = function <T>(
  promise: Promise<T>,
  messages: { loading: string; success: string | ((value: T) => string); error: string | ((reason: unknown) => string) },
) {
  const key = `promise-${next++}`
  toast({ key, title: messages.loading, tone: 'info', busy: true, duration: 0, closable: false })
  promise.then(
    (v) => toast({ key, title: typeof messages.success === 'function' ? messages.success(v) : messages.success, tone: 'success' }),
    (e) => toast({ key, title: typeof messages.error === 'function' ? messages.error(e) : messages.error, tone: 'danger' }),
  )
  return promise
}

/** Remove one toast (by the id `toast()` returned) or, with no argument, all of them. */
toast.dismiss = function (id?: number) {
  items.value = id === undefined ? [] : items.value.filter((t) => t.id !== id)
}
</script>

<script setup lang="ts">
import { ToastAction, ToastClose, ToastDescription, ToastProvider, ToastRoot, ToastTitle, ToastViewport } from 'reka-ui'

const props = withDefaults(defineProps<{ /** Default milliseconds a toast stays (danger and action toasts stay until dismissed). */ duration?: number }>(), { duration: 5000 })

const FOREVER = 2147483647
function durationOf(t: ToastItem) {
  if (t.duration !== undefined) return t.duration === 0 ? FOREVER : t.duration
  return t.tone === 'danger' || t.action ? FOREVER : props.duration
}
function runAction(t: ToastItem) {
  t.action?.onClick()
  dismiss(t.id)
}

// Full class names so Tailwind can see them.
const tones = {
  neutral: 'tone-neutral',
  info: 'tone-info',
  success: 'tone-success',
  warning: 'tone-warning',
  danger: 'tone-danger',
}

function dismiss(id: number) {
  items.value = items.value.filter((t) => t.id !== id)
}
</script>

<template>
  <ToastProvider :duration="props.duration" swipe-direction="right">
    <ToastRoot
      v-for="t in items"
      :key="`${t.id}-${t.rev}`"
      :duration="durationOf(t)"
      :type="t.tone === 'danger' ? 'foreground' : 'background'"
      :class="[
        'edge-start grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-[calc(0.75rem-var(--stroke-edge))] pr-2 pl-[max(calc(1rem-var(--stroke-edge)-var(--depth-bold)),0.625rem)] text-ink shadow-drop',
        'data-[state=open]:animate-[sui-toast-in_var(--duration-fade)_var(--ease-out)] data-[state=closed]:animate-[sui-toast-out_var(--duration-fade)_var(--ease-out)_forwards]',
        'data-[swipe=move]:translate-x-(--reka-toast-swipe-move-x) data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform data-[swipe=end]:animate-[sui-toast-out_var(--duration-fade)_var(--ease-out)_forwards]',
        tones[t.tone],
      ]"
      @update:open="(o: boolean) => !o && dismiss(t.id)"
    >
      <svg
        viewBox="0 0 24 24"
        class="size-6 text-(--_tone)"
        fill="none"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <template v-if="t.busy">
          <circle cx="12" cy="12" r="9" stroke-dasharray="1.5 1.5" opacity="0.3" />
          <path d="M12 3a9 9 0 0 1 9 9" class="origin-center animate-ring motion-reduce:animate-none" />
        </template>
        <template v-else-if="t.tone === 'success'">
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12.5l2.8 2.8L16.2 9.6" />
        </template>
        <template v-else-if="t.tone === 'warning'">
          <path d="M12 4.2l9 15.6H3z" />
          <path d="M12 10v4" />
          <path d="M12 17.2h.01" />
        </template>
        <template v-else-if="t.tone === 'danger'">
          <circle cx="12" cy="12" r="9" />
          <path d="M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6" />
        </template>
        <template v-else-if="t.tone === 'neutral'">
          <circle cx="12" cy="12" r="9" />
          <path d="M8.5 12h7" />
        </template>
        <template v-else>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5" />
          <path d="M12 7.9h.01" />
        </template>
      </svg>
      <div class="grid min-w-0 gap-0.5">
        <ToastTitle class="font-medium leading-snug">{{ t.title }}</ToastTitle>
        <ToastDescription v-if="t.description" class="text-sm leading-snug text-muted">{{ t.description }}</ToastDescription>
        <ToastAction v-if="t.action" as-child :alt-text="t.action.label">
          <button
            type="button"
            class="slab slab-thin slab-sm type-button mt-2 inline-flex h-9 w-fit cursor-pointer items-center bg-surface px-[calc(0.75rem-var(--stroke-edge))] text-ink transition-state select-none hover:slab-ink hover:shadow-[inset_0_0_0_100vmax_var(--color-wash-hover)] active:slab-flat focus-ring"
            @click="runAction(t)"
          >
            {{ t.action.label }}
          </button>
        </ToastAction>
      </div>
      <ToastClose
        v-if="t.closable !== false"
        aria-label="Close"
        class="inline-grid size-8 shrink-0 cursor-pointer place-items-center rounded-md transition-state hover:bg-wash-hover active:bg-wash-press focus-ring"
      >
        <svg viewBox="0 0 16 16" class="size-4" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true">
          <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
        </svg>
      </ToastClose>
    </ToastRoot>
    <ToastViewport
      class="fixed right-0 bottom-0 z-[100] m-0 flex w-96 max-w-full list-none flex-col gap-2 p-4 outline-none"
    />
  </ToastProvider>
</template>
