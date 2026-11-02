<script setup lang="ts">
import Card from '@/components/ui/card.vue'
import Spinner from '@/components/ui/spinner.vue'
</script>

<template>
  <div class="grid items-start gap-8 md:grid-cols-2">
    <div class="flex flex-col gap-3">
      <p class="kicker">Bare and labelled</p>
      <Spinner :announce="false" />
      <Spinner label="Loading your results…" :announce="false" />
    </div>
    <div class="flex flex-col gap-2">
      <p class="kicker">In context</p>
      <Card title="Recent activity">
        <div class="grid place-items-center py-6"><Spinner label="Fetching activity…" :announce="false" /></div>
      </Card>
    </div>
    <p class="text-muted md:col-span-2">A spinner that appears is spoken once to screen readers. Pass <code class="numeral">:announce="false"</code> where it would repeat.</p>
  </div>
</template>
