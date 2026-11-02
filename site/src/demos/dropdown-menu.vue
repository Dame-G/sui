<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/button.vue'
import DropdownMenu from '@/components/ui/dropdown-menu.vue'

const picked = ref('nothing yet')
const items = [
  { value: 'rename', label: 'Rename', shortcut: 'F2' },
  { value: 'duplicate', label: 'Duplicate', shortcut: 'Ctrl D' },
  { value: 'archive', label: 'Archive' },
  { value: 'delete', label: 'Delete', disabled: true },
]
const longer = Array.from({ length: 12 }, (_, i) => ({ value: `ws-${i + 1}`, label: `Workspace ${i + 1}` }))
</script>

<template>
  <div class="grid gap-8">
    <div class="flex flex-col items-start gap-3">
      <span class="kicker">Actions · you picked: {{ picked }}</span>
      <DropdownMenu :items="items" @select="picked = $event">
        <template #trigger><Button>Actions</Button></template>
      </DropdownMenu>
    </div>
    <div class="flex flex-col items-start gap-3">
      <span class="kicker">A long list scrolls with the arrow keys</span>
      <DropdownMenu :items="longer" @select="picked = $event">
        <template #trigger><Button>Switch workspace</Button></template>
      </DropdownMenu>
    </div>
  </div>
</template>
