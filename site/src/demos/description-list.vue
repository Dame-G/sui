<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'
import DescriptionList from '@/components/ui/description-list.vue'

const contact = [
  { label: 'Name', text: 'Grace Hopper' },
  { label: 'Email', text: 'grace@example.com', badge: 'Verified', badgeTone: 'success' as const, action: 'Edit' },
  { label: 'Phone', text: '+1 202 555 0143', badge: 'Unconfirmed', badgeTone: 'warning' as const },
  { label: 'Billing address', text: '1 Hopper Way, Arlington VA', action: 'Edit' },
]
const facts = [{ text: 'Statement covers 12 September' }, { text: 'Due 31 October', badge: 'In 9 days', badgeTone: 'info' as const }, { text: 'Paid in full', badge: 'Settled', badgeTone: 'success' as const }]
const editing = ref('')
</script>

<template>
  <div class="grid gap-6 md:grid-cols-2">
    <Card title="Billing contact" class="md:col-span-2">
      <DescriptionList :items="contact" @action="(item) => (editing = item.label ?? '')" />
      <p class="mt-3 text-muted">{{ editing ? `Editing ${editing}` : 'Click an Edit action: it fires an event.' }}</p>
    </Card>
    <Card title="Plain facts"><DescriptionList :items="facts" /></Card>
    <Card title="Action slot">
      <DescriptionList :items="contact.slice(0, 2)">
        <template #action><Button>Copy</Button></template>
      </DescriptionList>
    </Card>
    <Card title="Loading"><DescriptionList :items="[]" loading /></Card>
    <Card title="Empty"><DescriptionList :items="[]" empty="No details yet." /></Card>
  </div>
</template>
