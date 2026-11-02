<script setup lang="ts">
import { ref } from 'vue'
import AlertDialog from '@/components/ui/alert-dialog.vue'
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'
import DescriptionList from '@/components/ui/description-list.vue'
import Progress from '@/components/ui/progress.vue'
import { toast } from '@/components/ui/toast.vue'

const facts = [
  { label: 'Plan', text: 'Team', badge: 'Active', badgeTone: 'success' as const },
  { label: 'Seats', text: '8 of 10 used' },
  { label: 'Renews', text: '14 December 2026' },
]
const cancelling = ref(false)
function cancel() {
  cancelling.value = true
  setTimeout(() => {
    cancelling.value = false
    toast({ title: 'Plan cancelled', description: 'It stays active until 14 December.', tone: 'warning' })
  }, 800)
}
</script>

<template>
  <Card title="Billing">
    <DescriptionList :items="facts" />
    <Progress :model-value="80" label="Seats in use" />
    <div class="flex flex-wrap gap-3">
      <Button>Change plan</Button>
      <AlertDialog
        title="Cancel your plan?"
        description="Your team keeps access until the end of the billing period."
        confirm-label="Cancel plan"
        cancel-label="Keep plan"
        :loading="cancelling"
        @confirm="cancel"
      >
        <template #trigger><Button>Cancel plan</Button></template>
      </AlertDialog>
    </div>
  </Card>
</template>
