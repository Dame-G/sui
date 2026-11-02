<script setup lang="ts">
import Separator from '@/components/ui/separator.vue'
</script>

<template>
  <div class="grid gap-8">
    <div class="flex max-w-sm flex-col gap-3">
      <p class="kicker">Horizontal</p>
      <span>Above the rule</span>
      <Separator />
      <span>Below the rule</span>
    </div>
    <div class="flex flex-col gap-2">
      <p class="kicker">Vertical</p>
      <div class="flex h-6 items-center gap-3"><span>Docs</span><Separator orientation="vertical" /><span>Blog</span><Separator orientation="vertical" /><span>Changelog</span></div>
    </div>
  </div>
</template>
