<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/button.vue'
import NavigationMenu from '@/components/ui/navigation-menu.vue'

const second = ref('docs')
const href = '#/components/navigation-menu'
const site = [
  { value: 'docs', label: 'Docs', href },
  {
    value: 'guides',
    label: 'Guides',
    children: [
      { label: 'Getting started', description: 'Install a component in a minute.', href },
      { label: 'Theming', description: 'Change the brand, radius and depth.', href },
      { label: 'Linting', description: 'Keep compositions on the rules.', href },
      { label: 'Migrating', description: 'Move an existing app over.', href },
    ],
  },
  { value: 'blog', label: 'Blog', href },
  { value: 'changelog', label: 'Changelog', href },
]
</script>

<template>
  <div class="grid min-h-72 content-start gap-8">
    <div class="grid gap-3">
      <span class="kicker">Links and a flyout, in a header</span>
      <div class="flex flex-wrap items-center justify-between gap-4 rounded-md px-4 py-2 shadow-frame">
        <span class="heading text-xl">sui</span>
        <NavigationMenu v-model="second" :items="site" />
        <Button>Get started</Button>
      </div>
    </div>
  </div>
</template>
