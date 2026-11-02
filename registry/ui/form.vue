<script setup lang="ts">
import { nextTick, provide, ref, type HTMLAttributes } from 'vue'
import Notice from '@/components/ui/notice.vue'
import { cn } from '@/lib/utils'

// A form that checks itself on submit. Fields inside it register themselves; if any is invalid, `submit` does not fire, a summary lists each
// problem as a link to its field, and focus moves to the summary. Uses native constraint validation (required, type, pattern...) plus
// each field's own `error`.
const props = defineProps<{ submitting?: boolean; class?: HTMLAttributes['class'] }>()
const emit = defineEmits<{ submit: [event: SubmitEvent] }>()

interface Entry {
  id: string
  label: () => string
  error: () => string | undefined
  setNative: (message?: string) => void
}
interface Problem {
  id: string
  label: string
  message: string
}

const entries = new Map<string, Entry>()
provide('sui-form', {
  register: (e: Entry) => entries.set(e.id, e),
  unregister: (id: string) => entries.delete(id),
})

const formEl = ref<HTMLFormElement>()
const summary = ref<HTMLElement>()
const problems = ref<Problem[]>([])

type Control = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
const controlOf = (id: string) => document.getElementById(id) as HTMLElement | null

function validate(): boolean {
  const found: Problem[] = []
  const ordered = [...entries.values()].sort((a, b) => {
    const x = controlOf(a.id)
    const y = controlOf(b.id)
    return x && y ? (x.compareDocumentPosition(y) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1) : 0
  })
  for (const e of ordered) {
    const el = controlOf(e.id) as Control | null
    let message = e.error()
    if (!message && el && 'checkValidity' in el && !el.checkValidity()) message = el.validationMessage || 'This field is not valid'
    e.setNative(message && !e.error() ? message : undefined)
    if (message) found.push({ id: e.id, label: e.label(), message })
  }
  problems.value = found
  return found.length === 0
}

function focusField(id: string) {
  const el = controlOf(id)
  if (!el) return
  const target = el.matches('input,textarea,select,button,[tabindex]') ? el : (el.querySelector<HTMLElement>('input,textarea,select,button,[tabindex]') ?? el)
  target.focus()
  target.scrollIntoView({ block: 'center' })
}
function focusFirstInvalid() {
  const first = problems.value[0]
  if (first) focusField(first.id)
}

async function onSubmit(event: SubmitEvent) {
  if (props.submitting) return
  if (validate()) return emit('submit', event)
  await nextTick()
  summary.value?.focus()
}

function reset() {
  formEl.value?.reset()
  problems.value = []
  entries.forEach((e) => e.setNative(undefined))
}

defineExpose({ validate, reset, focusFirstInvalid })
</script>

<template>
  <form ref="formEl" novalidate :aria-busy="props.submitting || undefined" :class="cn('grid min-w-0 content-start gap-6', props.class)" @submit.prevent="onSubmit">
    <!-- tabindex -1: focus moves here after a failed submit, so the problems are read first. -->
    <div v-if="problems.length" ref="summary" tabindex="-1" class="focus-ring rounded-md">
      <Notice tone="danger" :title="problems.length === 1 ? '1 problem to fix' : `${problems.length} problems to fix`">
        <ul class="grid gap-1">
          <li v-for="p in problems" :key="p.id">
            <a :href="`#${p.id}`" class="cursor-pointer text-danger underline underline-offset-4 focus-ring" @click.prevent="focusField(p.id)">{{ p.label }}</a>: {{ p.message }}
          </li>
        </ul>
      </Notice>
    </div>
    <slot />
  </form>
</template>
