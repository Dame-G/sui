<script setup lang="ts">
import Button from '@/components/ui/button.vue'
import ButtonGroup from '@/components/ui/button-group.vue'
</script>

<template>
  <div class="flex flex-wrap items-start gap-x-12 gap-y-8">
    <div class="flex flex-col gap-2">
      <p class="kicker">Horizontal</p>
      <ButtonGroup>
        <Button>Day</Button>
        <Button>Week</Button>
        <Button disabled>Month</Button>
      </ButtonGroup>
    </div>
    <div class="flex flex-col gap-2">
      <p class="kicker">Vertical</p>
      <ButtonGroup orientation="vertical">
        <Button>Top</Button>
        <Button>Middle</Button>
        <Button>Bottom</Button>
      </ButtonGroup>
    </div>
  </div>
</template>
