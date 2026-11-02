<script setup lang="ts">
import { ref } from 'vue'
import Card from '@/components/ui/card.vue'
import ContextMenu from '@/components/ui/context-menu.vue'

const picked = ref('nothing yet')
const items = [
  { value: 'open', label: 'Open', shortcut: 'Enter' },
  { value: 'rename', label: 'Rename', shortcut: 'F2' },
  { value: 'duplicate', label: 'Duplicate' },
  { value: 'delete', label: 'Delete', disabled: true },
]
</script>

<template>
  <div class="grid gap-3">
    <span class="kicker">Right-click, or long-press on touch · you picked: {{ picked }}</span>
    <ContextMenu :items="items" @select="picked = $event">
      <Card title="Quarterly plan" class="max-w-sm">
        <p class="text-muted">Right-click anywhere on this card for its actions.</p>
      </Card>
    </ContextMenu>
  </div>
</template>
