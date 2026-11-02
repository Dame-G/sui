<script setup lang="ts">
import { computed, ref, shallowRef, watchEffect } from 'vue'
import IconButton from '@/components/ui/icon-button.vue'
import { toast } from '@/components/ui/toast.vue'
import { highlight, sniff } from '@/site/highlight'

const props = defineProps<{ code: string; lang?: string }>()
const copied = ref(false)
const html = shallowRef('')
const lang = computed(() => props.lang ?? sniff(props.code))

// Plain text shows at once; the coloured version swaps in when the highlighter has loaded.
watchEffect((onCleanup) => {
  let stale = false
  onCleanup(() => (stale = true))
  const code = props.code
  const l = lang.value
  html.value = ''
  highlight(code, l).then((h) => !stale && (html.value = h))
})

async function copy() {
  try {
    await navigator.clipboard.writeText(props.code)
  } catch {
    toast({ title: 'Could not copy', description: 'Your browser blocked clipboard access.', tone: 'danger' })
    return
  }
  copied.value = true
  toast({ title: 'Copied', tone: 'success' })
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <!-- The copy button floats in the top corner; the code is padded so a line never runs under it. -->
  <div class="group/code relative rounded-md bg-paper shadow-frame">
    <IconButton :label="copied ? 'Copied' : 'Copy code'" class="absolute end-2 top-2 z-10 print:hidden" @click="copy">
      <svg v-if="copied" viewBox="0 0 24 24" class="text-success" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m5 12.5 4.5 4.5L19 7.5" />
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="11" height="11" rx="2.5" />
        <path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15" />
      </svg>
    </IconButton>
    <div v-if="html" :class="{ 'code-wrap': !props.code.includes('\n') }" class="code max-h-128 overflow-auto rounded-md py-4 ps-4 pe-16" v-html="html" />
    <pre v-else :class="{ 'code-wrap': !props.code.includes('\n') }" class="code max-h-128 overflow-auto rounded-md py-4 ps-4 pe-16"><code>{{ props.code }}</code></pre>
  </div>
</template>
