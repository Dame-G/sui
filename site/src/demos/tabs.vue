<script setup lang="ts">
import { ref } from 'vue'
import Switch from '@/components/ui/switch.vue'
import Tabs from '@/components/ui/tabs.vue'
import TextField from '@/components/ui/text-field.vue'

const current = ref('account')
const name = ref('Ada Lovelace')
const email = ref(true)
const tabs = [
  { value: 'account', label: 'Account' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'billing', label: 'Billing' },
]
const inbox = ref('unread')
const counted = [
  { value: 'unread', label: 'Unread', count: 12 },
  { value: 'flagged', label: 'Flagged', count: 3 },
  { value: 'archived', label: 'Archived' },
  { value: 'spam', label: 'Spam', count: 0, disabled: true },
]
</script>

<template>
  <div class="grid gap-8">
    <div class="grid gap-3">
      <span class="kicker">With panels</span>
      <Tabs v-model="current" :tabs="tabs" class="max-w-lg">
        <template #account><TextField v-model="name" label="Display name" /></template>
        <template #notifications><Switch v-model="email" label="Email me weekly summaries" /></template>
        <template #billing><p class="text-muted">Team plan, 8 of 10 seats used.</p></template>
      </Tabs>
    </div>
    <div class="grid gap-3">
      <span class="kicker">Counts and a disabled tab</span>
      <Tabs v-model="inbox" :tabs="counted">
        <template #unread><p class="text-muted">12 unread messages.</p></template>
        <template #flagged><p class="text-muted">Messages you starred.</p></template>
        <template #archived><p class="text-muted">Archived mail.</p></template>
        <template #spam><p class="text-muted">Unavailable.</p></template>
      </Tabs>
    </div>
    <div class="grid gap-3">
      <span class="kicker">Vertical</span>
      <Tabs :tabs="tabs" orientation="vertical" class="max-w-lg">
        <template #account><p class="text-muted">Use the up and down arrow keys.</p></template>
        <template #notifications><p class="text-muted">What reaches your inbox.</p></template>
        <template #billing><p class="text-muted">Plan and invoices.</p></template>
      </Tabs>
    </div>
  </div>
</template>
