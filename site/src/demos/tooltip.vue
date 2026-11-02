<script setup lang="ts">
import Avatar from '@/components/ui/avatar.vue'
import Button from '@/components/ui/button.vue'
import Kbd from '@/components/ui/kbd.vue'
import Tooltip from '@/components/ui/tooltip.vue'
</script>

<template>
  <div class="grid max-w-md gap-8">
    <div class="flex flex-col gap-2">
      <p class="kicker">Hover or focus</p>
      <div class="flex flex-wrap items-center gap-3">
        <Tooltip content="Saves without publishing"><Button>Save draft</Button></Tooltip>
        <Tooltip content="Ada Lovelace"><Avatar fallback="AL" /></Tooltip>
        <Tooltip content="Open the command palette"><span><Kbd>Ctrl</Kbd> <Kbd>K</Kbd></span></Tooltip>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <p class="kicker">Move across these: the next ones open at once</p>
      <div class="flex gap-2">
        <Tooltip content="Bold"><Button>B</Button></Tooltip>
        <Tooltip content="Italic"><Button>I</Button></Tooltip>
        <Tooltip content="Underline"><Button>U</Button></Tooltip>
      </div>
    </div>
    <p class="text-muted">A tooltip carries a short hint, never something you need to act on. On touch, a tap shows it for a moment.</p>
  </div>
</template>
