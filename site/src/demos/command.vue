<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Button from '@/components/ui/button.vue'
import Command, { type CommandItem } from '@/components/ui/command.vue'
import Kbd from '@/components/ui/kbd.vue'

const icon = {
  file: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5',
  folder: 'M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9l-.8-1.2A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z',
  save: 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-3.5-3.5',
  palette: 'M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.3-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.3A4.7 4.7 0 0 0 22 11.7C22 6.9 17.5 3 12 3z',
  home: 'm3 11 9-8 9 8M5 10v10h14V10',
  sliders: 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M14 4v4M8 10v4M16 16v4',
}

const ran = ref('nothing yet')
const open = ref(false)
const items: CommandItem[] = [
  { value: 'new-file', label: 'New file', group: 'File', icon: icon.file, description: 'Start an empty document', shortcut: ['Ctrl', 'N'] },
  { value: 'open-file', label: 'Open file…', group: 'File', icon: icon.folder, shortcut: ['Ctrl', 'O'] },
  { value: 'save', label: 'Save', group: 'File', icon: icon.save, shortcut: ['Ctrl', 'S'] },
  { value: 'find', label: 'Find in files', group: 'Edit', icon: icon.search, keywords: ['search', 'grep'], shortcut: ['Ctrl', 'F'] },
  {
    value: 'theme',
    label: 'Change theme',
    group: 'View',
    icon: icon.palette,
    description: 'Light, dark or high contrast',
    children: [
      { value: 'theme-light', label: 'Light' },
      { value: 'theme-dark', label: 'Dark' },
      { value: 'theme-contrast', label: 'High contrast', description: 'Full-strength edges' },
    ],
  },
  { value: 'home', label: 'Go to home', group: 'Go to', icon: icon.home },
  { value: 'settings', label: 'Go to settings', group: 'Go to', icon: icon.sliders },
  { value: 'export', label: 'Export as PDF', group: 'File', disabled: true, description: 'Needs a saved file' },
]

// A second palette whose results arrive late.
const remoteOpen = ref(false)
const loading = ref(false)
const remote = ref<CommandItem[]>([])
watch(remoteOpen, (o) => {
  if (!o) return
  remote.value = []
  loading.value = true
  setTimeout(() => {
    remote.value = ['Button', 'Dialog', 'Data table', 'Date picker', 'Dropdown menu'].map((t) => ({ value: t, label: t, group: 'Components', description: 'sui registry' }))
    loading.value = false
  }, 900)
})

function onKey(e: KeyboardEvent) {
  if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
    e.preventDefault()
    open.value = !open.value
  }
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="grid gap-6">
    <div class="grid gap-3">
      <span class="kicker">Groups, icons, shortcuts, a nested page and a disabled item</span>
      <div class="flex flex-wrap items-center gap-4">
        <Button @click="open = true">Open palette</Button>
        <span class="flex items-center gap-2 text-muted">or <Kbd>Ctrl</Kbd> <Kbd>J</Kbd></span>
        <span class="text-muted">Ran: <span class="numeral text-ink">{{ ran }}</span></span>
      </div>
    </div>
    <div class="grid gap-3">
      <span class="kicker">Results that arrive late</span>
      <div><Button @click="remoteOpen = true">Search the registry</Button></div>
    </div>
    <Command v-model:open="open" :items="items" @select="ran = $event" />
    <Command v-model:open="remoteOpen" :items="remote" :loading="loading" placeholder="Search components…" />
  </div>
</template>
