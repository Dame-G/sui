<script setup lang="ts">
import Link from '@/components/ui/link.vue'
</script>

<template>
  <div class="grid max-w-prose gap-4 leading-relaxed">
    <p>
      Read the <Link href="#/start">getting started guide</Link>, or see how
      <Link href="https://reka-ui.com" external>Reka UI</Link> handles the behaviour. External links open in a new tab.
    </p>
    <p>A link that has gone away: <Link href="#/" aria-disabled="true">archived page</Link>.</p>
  </div>
</template>
