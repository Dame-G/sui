<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import FileUpload from '@/components/ui/file-upload.vue'

const files = ref<File[]>([])
const progress = reactive<Record<string, number>>({})
const avatar = ref<File[]>([])

// Pretend to upload: each new file fills up over a couple of seconds.
watch(files, (list) => {
  for (const f of list) {
    if (f.name in progress) continue
    progress[f.name] = 0
    const timer = setInterval(() => {
      progress[f.name] = Math.min(100, (progress[f.name] ?? 0) + 8 + Math.random() * 10)
      if (progress[f.name]! >= 100) clearInterval(timer)
    }, 250)
  }
})
</script>

<template>
  <div class="grid items-start gap-8 md:grid-cols-2">
    <FileUpload v-model="files" label="Attachments" accept=".png,.jpg,.pdf" :max-size="2 * 1024 * 1024" :max-files="3" :progress="progress" hint="Drop a 4th file, a .txt or one over 2 MB to see it refused." />
    <FileUpload v-model="avatar" label="Profile picture" accept="image/*" :max-size="500 * 1024" :multiple="false" required />
  </div>
</template>
