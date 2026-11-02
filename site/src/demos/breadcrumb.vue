<script setup lang="ts">
import Breadcrumb from '@/components/ui/breadcrumb.vue'
import Button from '@/components/ui/button.vue'

const short = [{ label: 'Home', href: '#/' }, { label: 'Components', href: '#/components' }, { label: 'Breadcrumb' }]
const deep = [
  { label: 'Home', href: '#/' },
  { label: 'Projects', href: '#/' },
  { label: 'Quarterly planning workspace', href: '#/' },
  { label: 'Documents', href: '#/' },
  { label: 'Roadmap draft with a really long file name.md' },
]
</script>

<template>
  <div class="grid gap-8">
    <div class="flex flex-col gap-2">
      <p class="kicker">Short</p>
      <Breadcrumb :items="short" />
    </div>
    <div class="flex flex-col gap-2">
      <p class="kicker">Deep, long names wrap in a narrow space</p>
      <Breadcrumb :items="deep" class="max-w-md" />
    </div>
    <div class="flex flex-col gap-2">
      <p class="kicker">In a page header</p>
      <div class="flex max-w-2xl flex-wrap items-end justify-between gap-4 border-b border-edge pb-4">
        <div class="flex flex-col gap-2">
          <Breadcrumb :items="short" />
          <h3 class="heading text-3xl">Breadcrumb</h3>
        </div>
        <Button>Edit page</Button>
      </div>
    </div>
  </div>
</template>
