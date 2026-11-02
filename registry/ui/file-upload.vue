<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, watch, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { announce } from '@/lib/announce'
import Field from '@/components/ui/field.vue'

const props = withDefaults(
  defineProps<{
    label?: string
    /** Same syntax as the input's `accept`: ".png", "image/*", "image/png". */
    accept?: string
    /** Largest file in bytes. */
    maxSize?: number
    /** Most files in the list. Extra ones are rejected with a reason, whether picked or dropped. */
    maxFiles?: number
    hint?: string
    error?: string
    required?: boolean
    optional?: boolean
    multiple?: boolean
    /** Upload progress per file name, 0-100. A file without an entry shows no bar. */
    progress?: Record<string, number>
    class?: HTMLAttributes['class']
  }>(),
  { multiple: true },
)
// Only accepted files are in the model; rejected ones stay in the list below with their reason.
const files = defineModel<File[]>({ default: () => [] })
const rejected = ref<{ file: File; message: string }[]>([])
const emit = defineEmits<{ reject: [file: File, message: string] }>()

const input = ref<HTMLInputElement>()
const dragging = ref(false)

// Dashed edge normally means disabled or busy. Here it means "drop-ready": while a file is dragged anywhere over the
// page, the zone turns dashed primary so people see where to let go; over the zone itself it fills as well.
const pageDrag = ref(false)
let depth = 0
const hasFiles = (e: DragEvent) => !!e.dataTransfer?.types.includes('Files')
function onWinEnter(e: DragEvent) {
  if (!hasFiles(e)) return
  depth++
  pageDrag.value = true
}
function onWinLeave() {
  depth = Math.max(0, depth - 1)
  if (!depth) pageDrag.value = false
}
function onWinEnd() {
  depth = 0
  pageDrag.value = false
  dragging.value = false
}
onMounted(() => {
  window.addEventListener('dragenter', onWinEnter)
  window.addEventListener('dragleave', onWinLeave)
  window.addEventListener('drop', onWinEnd)
  window.addEventListener('dragend', onWinEnd)
})

// Image thumbnails: an object URL per image, released when the file goes.
const thumbs = reactive(new Map<File, string>())
watch(
  files,
  (list) => {
    for (const [f, url] of thumbs) if (!list.includes(f)) (URL.revokeObjectURL(url), thumbs.delete(f))
    for (const f of list) if (f.type.startsWith('image/') && !thumbs.has(f)) thumbs.set(f, URL.createObjectURL(f))
  },
  { immediate: true },
)
onBeforeUnmount(() => {
  window.removeEventListener('dragenter', onWinEnter)
  window.removeEventListener('dragleave', onWinLeave)
  window.removeEventListener('drop', onWinEnd)
  window.removeEventListener('dragend', onWinEnd)
  for (const url of thumbs.values()) URL.revokeObjectURL(url)
})

const size = (n: number) => (n < 1024 ? `${n} B` : n < 1024 ** 2 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1024 ** 2).toFixed(1)} MB`)

function matches(file: File) {
  if (!props.accept) return true
  return props.accept
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .some((t) =>
      t.startsWith('.') ? file.name.toLowerCase().endsWith(t) : t.endsWith('/*') ? file.type.startsWith(t.slice(0, -1)) : file.type === t,
    )
}

function add(list: FileList | File[]) {
  const next = props.multiple ? [...files.value] : []
  if (!props.multiple) rejected.value = []
  const limit = props.multiple ? props.maxFiles : 1
  let added = 0
  for (const file of Array.from(list)) {
    const duplicate = next.some((f) => f.name === file.name && f.size === file.size)
    const message = !matches(file)
      ? 'This file type is not accepted'
      : props.maxSize && file.size > props.maxSize
        ? `Larger than ${size(props.maxSize)}`
        : limit && !duplicate && next.length >= limit
          ? `Only ${limit} ${limit === 1 ? 'file is' : 'files are'} allowed`
          : ''
    if (message) {
      rejected.value = [...rejected.value, { file, message }]
      emit('reject', file, message)
    } else if (!duplicate) {
      next.push(file)
      added++
    }
  }
  files.value = next
  if (added) announce(`${added} ${added === 1 ? 'file' : 'files'} added`)
}
function remove(file: File) {
  files.value = files.value.filter((f) => f !== file)
  announce(`Removed ${file.name}`)
}
function onPick(e: Event) {
  const el = e.target as HTMLInputElement
  if (el.files) add(el.files)
  el.value = ''
}
function onDrop(e: DragEvent) {
  dragging.value = false
  pageDrag.value = false
  depth = 0
  if (e.dataTransfer?.files.length) add(e.dataTransfer.files)
}
function onLeave(e: DragEvent) {
  if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node | null)) dragging.value = false
}

// The same face as the outline Button: a surface on a quiet slab.
const choose =
  'slab type-button inline-flex h-control cursor-pointer items-center justify-center bg-surface px-[calc(1rem-var(--stroke-edge))] text-ink transition-state select-none hover:slab-ink hover:shadow-[inset_0_0_0_100vmax_var(--color-wash-hover)] active:slab-flat active:shadow-[inset_0_0_0_100vmax_var(--color-wash-press)] focus-ring'
</script>

<template>
  <Field
    :label="props.label ?? 'Upload files'"
    :hide-label="!props.label"
    :hint="props.hint"
    :error="props.error"
    :required="props.required"
    :optional="props.optional"
    :class="cn('gap-3', props.class)"
  >
    <template v-if="props.maxFiles && props.multiple" #aside>
      <span class="numeral">{{ files.length }} of {{ props.maxFiles }}</span>
    </template>
    <template #default="{ id, describedby }">
    <!-- A sunk, tinted well. While a file is dragged anywhere over the page the edge goes dashed primary (drop here); over the zone it fills too. -->
    <div
      :class="
        cn(
          'flex flex-col items-center gap-2 rounded-md border border-edge-strong bg-surface-tint/40 px-6 py-8 text-center shadow-well transition-state',
          pageDrag && 'border-dashed border-primary',
          dragging && 'border-primary bg-primary-soft',
        )
      "
      @dragenter.prevent="dragging = true"
      @dragover.prevent="dragging = true"
      @dragleave="onLeave"
      @drop.prevent="onDrop"
    >
      <svg viewBox="0 0 24 24" class="size-7 text-muted" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 16V4M7 9l5-5 5 5" />
        <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
      </svg>
      <button type="button" :class="choose" :aria-labelledby="`${id}-label`" :aria-describedby="describedby" @click="input?.click()">
        Choose {{ props.multiple ? 'files' : 'a file' }}
      </button>
      <p class="text-sm text-muted">or drop {{ props.multiple ? 'files' : 'a file' }} here</p>
      <p v-if="props.accept || props.maxSize" class="numeral text-xs text-muted">
        {{ [props.accept?.split(',').join(' '), props.maxSize ? `up to ${size(props.maxSize)}` : ''].filter(Boolean).join(' · ') }}
      </p>
      <input :id="id" ref="input" type="file" class="sr-only" tabindex="-1" aria-hidden="true" :accept="props.accept" :multiple="props.multiple" @change="onPick" />
    </div>

    <ul v-if="files.length || rejected.length" class="grid list-none gap-2 p-0">
      <li v-for="file in files" :key="file.name + file.size" class="grid gap-2 rounded-md border border-edge bg-surface px-3 py-2">
        <div class="flex min-h-8 items-center gap-3">
          <img v-if="thumbs.get(file)" :src="thumbs.get(file)" alt="" class="size-10 shrink-0 rounded-sm border border-edge object-cover" />
          <svg v-else viewBox="0 0 24 24" class="size-5 shrink-0 text-muted" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
            <path d="M14 3v5h5" />
          </svg>
          <span class="min-w-0 flex-1 truncate font-medium">{{ file.name }}</span>
          <span class="numeral shrink-0 text-sm text-muted">{{ size(file.size) }}</span>
          <button
            type="button"
            :aria-label="`Remove ${file.name}`"
            class="well-button size-8"
            @click="remove(file)"
          >
            <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <!-- Same bar as Progress, thinner: what is left is a striped tint, the finished part a flat primary. -->
        <div v-if="props.progress && file.name in props.progress" class="flex items-center gap-3">
          <div
            role="progressbar"
            :aria-label="`Uploading ${file.name}`"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-valuenow="Math.round(props.progress[file.name]!)"
            :class="cn('stripes h-2 flex-1 rounded-sm bg-primary-soft', props.progress[file.name]! < 100 && 'animate-stripes motion-reduce:animate-none')"
          >
            <div class="h-full rounded-sm bg-primary transition-[width] duration-(--duration-move) ease-out" :style="{ width: Math.min(100, Math.max(0, props.progress[file.name]!)) + '%' }" />
          </div>
          <span class="numeral w-10 text-end text-sm text-muted">{{ Math.round(props.progress[file.name]!) }}%</span>
        </div>
      </li>
      <li
        v-for="r in rejected"
        :key="r.file.name + r.file.size"
        role="alert"
        class="edge-start tone-danger flex items-center gap-3 py-[calc(0.5rem-var(--stroke-edge))] pr-2 pl-[max(calc(0.75rem-var(--stroke-edge)-var(--depth-bold)),0.625rem)] text-ink"
      >
        <svg viewBox="0 0 24 24" class="size-5 shrink-0 text-(--_tone)" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6" />
        </svg>
        <div class="grid min-w-0 flex-1">
          <span class="truncate font-medium">{{ r.file.name }}</span>
          <span class="text-sm">{{ r.message }}</span>
        </div>
        <button
          type="button"
          :aria-label="`Dismiss ${r.file.name}`"
          class="well-button size-8"
          @click="rejected = rejected.filter((x) => x !== r)"
        >
          <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
      </li>
    </ul>
    </template>
  </Field>
</template>