<script setup lang="ts">
import { ref } from 'vue'
import Badge from '@/components/ui/badge.vue'
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'
import Carousel from '@/components/ui/carousel.vue'

const hero = ref(0)
const slides = [
  { tone: 'bg-primary text-on-primary', badge: 'Own', title: 'Own the source', text: 'Every component is a file in your repo. Change the file and you have changed the component.' },
  { tone: 'bg-info-soft text-ink', badge: 'Theme', title: 'Theme the tokens', text: 'Brand, radius, depth and font are the only knobs. Contrast is checked as you turn them.' },
  { tone: 'bg-success-soft text-ink', badge: 'Lint', title: 'Lint the rules', text: 'A preset for @shadcn/lint keeps pages positioning components rather than restyling them.' },
  { tone: 'bg-warning-soft text-ink', badge: 'Reka', title: 'Accessible by default', text: 'Focus, keyboard and dismissal come from Reka UI, so the behaviour is not yours to maintain.' },
  { tone: 'bg-surface-tint text-ink', badge: 'Slab', title: 'One distinct look', text: 'Raised faces sit on a darker slab, and tone edges are slabs turned on their side.' },
]
const cards = ['Overview', 'Activity', 'Members', 'Billing', 'Settings', 'Audit log']
</script>

<template>
  <div class="grid gap-10">
    <!-- A hero: one slide at a time, the first slide in view is v-model. -->
    <div class="grid gap-2">
      <Carousel v-model:index="hero" label="What sui gives you">
        <div v-for="s in slides" :key="s.title" :class="['flex min-h-56 flex-col items-start justify-end gap-3 rounded-md p-8 shadow-frame', s.tone]">
          <Badge>{{ s.badge }}</Badge>
          <h3 class="heading text-3xl">{{ s.title }}</h3>
          <p class="max-w-md leading-normal">{{ s.text }}</p>
        </div>
      </Carousel>
      <p class="text-sm text-muted">Slide {{ hero + 1 }} of {{ slides.length }}. Arrow keys, dots, drag or swipe.</p>
    </div>

    <!-- Several at once: three on a wide track, fewer when it narrows. -->
    <Carousel :per-view="3" label="Workspace sections">
      <Card v-for="c in cards" :key="c" :title="c">
        <p class="text-muted">The {{ c.toLowerCase() }} for this workspace.</p>
        <div><Button>Open</Button></div>
      </Card>
    </Carousel>

  </div>
</template>
