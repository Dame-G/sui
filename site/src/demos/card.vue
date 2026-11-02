<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'
import TextField from '@/components/ui/text-field.vue'

const email = ref('')
</script>

<template>
  <div class="grid items-start gap-6 md:grid-cols-2">
    <div class="flex flex-col gap-2">
      <p class="kicker">With a title</p>
      <Card title="Join the waitlist">
        <TextField v-model="email" label="Email" type="email" placeholder="you@example.com" />
        <div><Button>Notify me</Button></div>
      </Card>
    </div>
    <div class="flex flex-col gap-2">
      <p class="kicker">Without a title</p>
      <Card>
        <p class="font-medium">Plain surface</p>
        <p class="text-muted">Leave the title out and the header goes away; the body keeps its padding and edge.</p>
      </Card>
    </div>
  </div>
</template>
