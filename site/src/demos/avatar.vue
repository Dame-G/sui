<script setup lang="ts">
import Avatar from '@/components/ui/avatar.vue'
import Badge from '@/components/ui/badge.vue'
</script>

<template>
  <div class="grid gap-8">
    <div class="flex flex-col gap-2">
      <p class="kicker">Initials, and an image that fails to load</p>
      <div class="flex flex-wrap gap-3">
        <Avatar fallback="DG" />
        <Avatar fallback="AB" />
        <Avatar src="/missing.png" alt="" fallback="KL" />
      </div>
    </div>
    <div class="flex max-w-sm flex-col gap-2">
      <p class="kicker">In context</p>
      <div v-for="p in [{ i: 'AL', n: 'Ada Lovelace', t: 'Maintainer' }, { i: 'GH', n: 'Grace Hopper', t: 'Reviewer' }]" :key="p.i" class="flex items-center gap-3 border-b border-edge py-3 last:border-b-0">
        <Avatar :fallback="p.i" />
        <div class="grid min-w-0 flex-1 leading-snug"><span class="font-medium">{{ p.n }}</span><span class="text-sm text-muted">{{ p.t }}</span></div>
        <Badge tone="success">Active</Badge>
      </div>
    </div>
  </div>
</template>
