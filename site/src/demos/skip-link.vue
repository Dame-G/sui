<script setup lang="ts">
import SkipLink from '@/components/ui/skip-link.vue'
</script>

<template>
  <div class="grid max-w-xl gap-4">
    <p class="kicker">Click in this box, then press Tab</p>
    <div class="relative grid gap-3 rounded-md border border-edge p-4" tabindex="-1">
      <SkipLink to="skip-demo-target">Skip to the demo content</SkipLink>
      <nav aria-label="Demo" class="flex gap-4 text-muted"><span>Home</span><span>Docs</span><span>Pricing</span></nav>
      <div id="skip-demo-target" tabindex="-1" class="rounded-sm bg-surface-tint p-3 outline-none focus:outline-2 focus:outline-primary">Main content: focus lands here.</div>
    </div>
    <p class="text-muted">Put it first in the page. It stays hidden until the keyboard reaches it. This site uses one too.</p>
  </div>
</template>
