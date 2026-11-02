<script setup lang="ts">
import { ref } from 'vue'
import Badge from '@/components/ui/badge.vue'
import Card from '@/components/ui/card.vue'
import List from '@/components/ui/list.vue'

const threads = [
  { value: 'launch', title: 'Launch checklist', description: 'Ada: the docs still need a pass' },
  { value: 'budget', title: 'Budget review', description: 'Linus: numbers attached' },
  { value: 'offsite', title: 'Team offsite', description: 'Grace: dates are locked' },
  { value: 'hiring', title: 'Hiring plan', description: 'Alan: two roles open', disabled: true },
  { value: 'roadmap', title: 'Roadmap Q3', description: 'Margaret: draft v2' },
]
const plans = [
  { value: 'free', title: 'Free', description: '1 project' },
  { value: 'team', title: 'Team', description: '10 projects, shared themes' },
  { value: 'scale', title: 'Scale', description: 'Unlimited, priority support' },
]
const current = ref('budget')
const plan = ref('team')
const follow = ref('launch')
const unread: Record<string, number> = { launch: 3, offsite: 1 }
</script>

<template>
  <div class="grid gap-8 md:grid-cols-2">
    <Card title="Current place" class="md:row-span-2">
      <List v-model="current" label="Inbox" mode="current" :items="threads">
        <template #trailing="{ item }"><Badge v-if="unread[item.value]" tone="info">{{ unread[item.value] }}</Badge></template>
      </List>
      <p class="text-muted">Tab in once, then arrows, Home, End or type “bu”. Enter or Space chooses; the disabled row is skipped.</p>
    </Card>
    <Card title="Choosing one"><List v-model="plan" label="Plan" :items="plans" /></Card>
    <Card title="Follow focus"><List v-model="follow" label="Threads" follow-focus :items="threads.slice(0, 3)" /></Card>
    <Card title="Empty"><List label="Nothing" :items="[]" empty="No threads yet." /></Card>
    <Card title="Loading"><List label="Loading" :items="[]" loading /></Card>
  </div>
</template>
