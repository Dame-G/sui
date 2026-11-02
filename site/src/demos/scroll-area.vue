<script setup lang="ts">
import Avatar from '@/components/ui/avatar.vue'
import ScrollArea from '@/components/ui/scroll-area.vue'

const people = [
  ['AL', 'Ada Lovelace', 'Maintainer'],
  ['LT', 'Linus Torvalds', 'Contributor'],
  ['GH', 'Grace Hopper', 'Reviewer'],
  ['AT', 'Alan Turing', 'Maintainer'],
  ['MH', 'Margaret Hamilton', 'Contributor'],
  ['DK', 'Donald Knuth', 'Reviewer'],
  ['BL', 'Barbara Liskov', 'Maintainer'],
  ['KT', 'Ken Thompson', 'Contributor'],
]
</script>

<template>
  <div class="grid max-w-sm gap-3">
    <span class="kicker">Scroll with the wheel, the bar or the keyboard</span>
    <ScrollArea class="h-56">
      <div v-for="[initials, name, role] in people" :key="name" class="flex items-center gap-3 py-2">
        <Avatar :fallback="initials!" />
        <div class="grid leading-tight">
          <span class="font-medium">{{ name }}</span>
          <span class="text-sm text-muted">{{ role }}</span>
        </div>
      </div>
    </ScrollArea>
  </div>
</template>
