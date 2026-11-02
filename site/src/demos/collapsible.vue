<script setup lang="ts">
import { ref } from 'vue'
import Collapsible from '@/components/ui/collapsible.vue'
import Switch from '@/components/ui/switch.vue'

const open = ref(false)
const compact = ref(false)
const faq = [
  ['What is included?', 'Every component, its theme tokens and the cn() helper. Nothing else.'],
  ['Can I change it?', 'It is your code now. Edit the file.'],
  ['How do I update?', 'Run the add command again and review the diff.'],
  ['Is it accessible?', 'Behaviour and keyboard handling come from Reka UI.'],
]
</script>

<template>
  <div class="grid max-w-lg gap-8">
    <div class="grid gap-3">
      <span class="kicker">Questions · first one starts open</span>
      <Collapsible v-for="([q, a], i) in faq" :key="q" :title="q!" :open="i === 0">{{ a }}</Collapsible>
    </div>
    <div class="grid gap-3">
      <span class="kicker">Controlled · {{ open ? 'open' : 'closed' }}</span>
      <Collapsible v-model:open="open" title="Advanced options">
        <div class="grid gap-3">
          <Switch v-model="compact" label="Compact rows" />
          <p class="text-muted">These options are rarely needed, so they stay out of the way.</p>
        </div>
      </Collapsible>
    </div>
  </div>
</template>
