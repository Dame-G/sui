<script setup lang="ts">
import Badge from '@/components/ui/badge.vue'
</script>

<template>
  <div class="grid gap-8">
    <div class="flex flex-col gap-2">
      <p class="kicker">Tones</p>
      <div class="flex flex-wrap gap-3">
        <Badge>Draft</Badge>
        <Badge tone="info">New</Badge>
        <Badge tone="success">Paid</Badge>
        <Badge tone="warning">Due soon</Badge>
        <Badge tone="danger">Overdue</Badge>
      </div>
    </div>
    <div class="flex max-w-sm flex-col gap-2">
      <p class="kicker">In context</p>
      <div class="flex items-center justify-between border-b border-edge py-3"><span>Invoice 1042</span><Badge tone="success">Paid</Badge></div>
      <div class="flex items-center justify-between border-b border-edge py-3"><span>Invoice 1043</span><Badge tone="warning">Due soon</Badge></div>
      <div class="flex items-center justify-between py-3"><span>Invoice 1044</span><Badge tone="danger">Overdue</Badge></div>
    </div>
  </div>
</template>
