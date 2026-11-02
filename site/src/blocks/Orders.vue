<script setup lang="ts">
import { ref } from 'vue'
import Badge from '@/components/ui/badge.vue'
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'
import DataTable from '@/components/ui/data-table.vue'
import { toast } from '@/components/ui/toast.vue'

const people = ['Ada', 'Linus', 'Grace', 'Alan', 'Margaret', 'Dennis', 'Barbara', 'Ken']
const states = ['Paid', 'Pending', 'Refunded'] as const
const tones = { Paid: 'success', Pending: 'warning', Refunded: 'neutral' } as const
const rows = people.map((customer, i) => ({ id: 1040 + i, customer, status: states[i % 3]!, total: 40 + ((i * 53) % 260) }))
const columns = [
  { key: 'id', label: 'Order', sortable: true },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'status', label: 'Status', sortable: true, filter: 'select' as const },
  { key: 'total', label: 'Total', sortable: true, align: 'end' as const, format: 'currency' as const },
]
const selected = ref<(string | number)[]>([])
</script>

<template>
  <Card title="Orders">
    <DataTable v-model:selected="selected" label="Orders" :columns="columns" :rows="rows" row-key="id" selectable searchable :page-size="5" row-label="customer">
      <template #cell-status="{ value }"><Badge :tone="tones[value as keyof typeof tones]">{{ value }}</Badge></template>
    </DataTable>
    <div class="flex items-center gap-3">
      <Button :disabled="!selected.length" @click="toast({ title: `Refunded ${selected.length}`, tone: 'success' })">Refund selected</Button>
      <span class="numeral text-sm text-muted">{{ selected.length }} selected</span>
    </div>
  </Card>
</template>
