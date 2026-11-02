<script setup lang="ts">
import { ref } from 'vue'
import Textarea from '@/components/ui/textarea.vue'
import Toolbar, { type ToolbarItem } from '@/components/ui/toolbar.vue'

const format = ref<string[]>(['bold'])
const align = ref<string[]>(['left'])
const last = ref('nothing yet')
const text = ref('Select some text and use the toolbar above.')

const formatting: ToolbarItem[] = [
  { type: 'toggle', value: 'bold', label: 'Bold' },
  { type: 'toggle', value: 'italic', label: 'Italic' },
  { type: 'toggle', value: 'underline', label: 'Underline' },
  { type: 'separator' },
  { type: 'toggle', value: 'left', label: 'Left' },
  { type: 'toggle', value: 'center', label: 'Centre' },
  { type: 'toggle', value: 'right', label: 'Right' },
  { type: 'separator' },
  { type: 'button', value: 'undo', label: 'Undo' },
  { type: 'button', value: 'redo', label: 'Redo' },
]
const clipboard: ToolbarItem[] = [
  { type: 'button', value: 'cut', label: 'Cut' },
  { type: 'button', value: 'copy', label: 'Copy' },
  { type: 'button', value: 'paste', label: 'Paste' },
]
</script>

<template>
  <div class="grid gap-8">
    <div class="grid gap-3">
      <span class="kicker">An editor toolbar · last action: {{ last }}</span>
      <Toolbar v-model:pressed="format" :items="formatting.slice(0, 3)" label="Text style" @action="last = $event">
        <template #bold><span class="font-strong">B</span></template>
        <template #italic><span class="italic">I</span></template>
        <template #underline><span class="underline">U</span></template>
      </Toolbar>
      <Toolbar v-model:pressed="align" :items="formatting.slice(4)" label="Alignment and history" @action="last = $event" />
      <Textarea v-model="text" label="Document" />
    </div>
    <div class="grid gap-3">
      <span class="kicker">Buttons only</span>
      <Toolbar :items="clipboard" label="Clipboard" @action="last = $event" />
    </div>
  </div>
</template>
