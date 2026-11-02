<script setup lang="ts">
import { components } from '@registry/components'
import Button from '@/components/ui/button.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import FlowField from '@/site/FlowField.vue'

const install = `bunx shadcn-vue@latest add ${location.origin}/r/button.json`
</script>

<template>
  <div class="relative grid grow place-items-center overflow-hidden px-6 py-24">
    <FlowField class="print:hidden" />

    <section class="relative flex w-full max-w-xl flex-col items-center gap-8 text-center">
      <div class="flex flex-col items-center gap-4">
        <h1 class="heading text-8xl leading-none">sui</h1>
        <p class="max-w-md text-xl leading-normal text-muted">
          {{ components.length }} accessible Vue components you own, in one look you theme with a few tokens.
        </p>
      </div>

      <CodeBlock :code="install" lang="bash" class="w-full text-start" />

      <div class="flex flex-wrap justify-center gap-3">
        <Button as="a" href="#/start">Get started</Button>
        <Button as="a" href="#/components">Components</Button>
        <Button as="a" href="#/theme">Theme</Button>
      </div>
    </section>
  </div>
</template>
