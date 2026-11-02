<script setup lang="ts">
import { useId } from 'vue'
import Label from '@/components/ui/label.vue'

const email = useId()
const handle = useId()
const note = useId()
</script>

<template>
  <div class="grid max-w-md gap-6">
    <p class="text-muted">The bare label for a control you wire yourself. For ready-made inputs, use Field: it does the wiring for you.</p>
    <div class="grid gap-2">
      <Label :for="email" required>Email</Label>
      <input :id="email" type="email" required placeholder="you@example.com" class="well h-control w-full px-4" />
    </div>
    <div class="grid gap-2">
      <Label :for="handle" optional>Handle</Label>
      <input :id="handle" type="text" placeholder="grace" :aria-describedby="`${handle}-hint`" class="well h-control w-full px-4" />
      <p :id="`${handle}-hint`" class="text-sm text-muted">Lowercase letters and numbers only.</p>
    </div>
    <div class="grid gap-2">
      <Label :for="note">Locked</Label>
      <input :id="note" disabled value="Cannot edit" class="well h-control w-full px-4" />
    </div>
  </div>
</template>
