<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/button.vue'
import Progress from '@/components/ui/progress.vue'

const upload = ref(40)
</script>

<template>
  <div class="grid max-w-md gap-8">
    <div class="flex flex-col gap-3">
      <p class="kicker">Determinate: step it</p>
      <Progress v-model="upload" label="Uploading photos" />
      <div class="flex gap-2">
        <Button @click="upload = Math.max(0, upload - 10)">−10</Button>
        <Button @click="upload = Math.min(100, upload + 10)">+10</Button>
      </div>
    </div>
    <div class="flex flex-col gap-3">
      <p class="kicker">Complete, and unknown length</p>
      <Progress :model-value="100" label="Finished" />
      <Progress label="Waiting for the server" />
    </div>
    <div class="flex flex-col gap-3">
      <p class="kicker">Spoken text instead of a percentage</p>
      <Progress :model-value="38" label="Importing contacts" value-text="3 of 8 files" />
    </div>
  </div>
</template>
