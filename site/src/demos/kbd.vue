<script setup lang="ts">
import Kbd from '@/components/ui/kbd.vue'
</script>

<template>
  <div class="grid gap-8">
    <div class="flex flex-col gap-2">
      <p class="kicker">Keys and chords</p>
      <div class="flex flex-wrap items-center gap-2">
        <Kbd>Esc</Kbd><Kbd>Enter</Kbd>
        <span class="flex gap-1"><Kbd>Ctrl</Kbd><Kbd>K</Kbd></span>
        <span class="flex gap-1"><Kbd>Shift</Kbd><Kbd>Tab</Kbd></span>
      </div>
    </div>
    <div class="flex max-w-sm flex-col gap-2">
      <p class="kicker">In context</p>
      <div class="flex items-center justify-between border-b border-edge py-3"><span>Open the command palette</span><span class="flex gap-1"><Kbd>Ctrl</Kbd><Kbd>K</Kbd></span></div>
      <div class="flex items-center justify-between py-3"><span>Close</span><Kbd>Esc</Kbd></div>
    </div>
  </div>
</template>
