<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/button.vue'
import VirtualList from '@/components/ui/virtual-list.vue'

const emails = Array.from({ length: 20000 }, (_, i) => ({
  id: i,
  from: ['Ada', 'Linus', 'Grace', 'Alan', 'Margaret'][i % 5]!,
  subject: `Message ${i + 1}: ${['Quarterly numbers', 'Lunch?', 'Re: the release', 'Heads up', 'Invoice attached'][i % 5]}`,
}))
// Rows of different heights are measured as they appear.
const notes = Array.from({ length: 3000 }, (_, i) => ({
  id: i,
  text: `Note ${i + 1}. ${'A longer note wraps onto more lines and the list keeps up. '.repeat(1 + ((i * 7) % 4))}`,
}))
const list = ref<{ scrollToIndex: (index: number) => void }>()
</script>

<template>
  <div class="grid gap-8 md:grid-cols-2">
    <div class="grid content-start gap-2">
      <p class="kicker">20,000 rows, a fixed height each</p>
      <VirtualList ref="list" :items="emails" :item-height="52" height="20rem" label="Mailbox">
        <template #item="{ item, index }">
          <div class="flex h-full items-center gap-3 px-4">
            <span class="numeral w-14 text-sm text-muted">{{ index + 1 }}</span>
            <span class="min-w-0 flex-1 truncate"><span class="font-medium">{{ item.from }}</span> {{ item.subject }}</span>
          </div>
        </template>
      </VirtualList>
      <div class="flex flex-wrap items-center gap-3">
        <Button @click="list?.scrollToIndex(12345)">Jump to 12,346</Button>
        <p class="text-muted">Focus it for arrows, Page Up and Down, Home and End.</p>
      </div>
    </div>
    <div class="grid content-start gap-2">
      <p class="kicker">3,000 rows, heights measured as they appear</p>
      <VirtualList :items="notes" height="20rem" label="Notes">
        <template #item="{ item }"><p class="px-4 py-3 leading-normal">{{ item.text }}</p></template>
      </VirtualList>
    </div>
  </div>
</template>
