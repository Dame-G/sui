<script setup lang="ts">
import Button from '@/components/ui/button.vue'
import Notice from '@/components/ui/notice.vue'
</script>

<template>
  <div class="grid max-w-xl gap-8">
    <div class="flex flex-col gap-3">
      <p class="kicker">Tones</p>
      <Notice title="Heads up">Your trial ends in 3 days. Add a payment method to keep your projects.</Notice>
      <Notice tone="success" title="Payment received">A receipt is on its way to your inbox.</Notice>
      <Notice tone="warning" title="Almost out of space">You have used 92% of your storage.</Notice>
      <Notice tone="danger" title="Couldn't save your changes">Check your connection and try again.</Notice>
      <Notice tone="neutral" title="Scheduled maintenance" />
    </div>
    <div class="flex flex-col gap-3">
      <p class="kicker">With an action</p>
      <Notice tone="warning" title="Your plan changes next month">
        <div class="grid items-start gap-3">
          <p>We'll move you to the new pricing automatically. Nothing changes until then.</p>
          <div><Button>Review billing</Button></div>
        </div>
      </Notice>
    </div>
  </div>
</template>
