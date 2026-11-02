<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'
import Command from '@/components/ui/command.vue'
import { toast } from '@/components/ui/toast.vue'

const open = ref(false)
const items = [
  { value: 'new', label: 'New project', group: 'Create' },
  { value: 'invite', label: 'Invite teammates', group: 'Create' },
  { value: 'import', label: 'Import data', group: 'Create' },
  { value: 'billing', label: 'Billing', group: 'Go to' },
  { value: 'members', label: 'Members', group: 'Go to' },
  { value: 'settings', label: 'Settings', group: 'Go to' },
]
</script>

<template>
  <Card title="Quick find">
    <p class="text-muted">Anything in the app is two keystrokes away.</p>
    <div><Button @click="open = true">Search…</Button></div>
    <Command v-model:open="open" :items="items" placeholder="Search actions…" @select="toast({ title: String($event) })" />
  </Card>
</template>
