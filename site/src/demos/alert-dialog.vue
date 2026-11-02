<script setup lang="ts">
import { ref } from 'vue'
import AlertDialog from '@/components/ui/alert-dialog.vue'
import Button from '@/components/ui/button.vue'

const status = ref('Project is safe.')
const slowOpen = ref(false)
const working = ref(false)
const result = ref('not run')
function runSlow() {
  working.value = true
  setTimeout(() => {
    working.value = false
    result.value = 'deleted'
  }, 1800)
}
</script>

<template>
  <div class="grid gap-8">
    <div class="flex flex-col items-start gap-3">
      <span class="kicker">Destructive · {{ status }}</span>
      <AlertDialog
        title="Delete this project?"
        description="All files and history are permanently removed. This can't be undone."
        confirm-label="Delete project"
        @confirm="status = 'Project deleted.'"
      >
        <template #trigger><Button>Delete project</Button></template>
      </AlertDialog>
    </div>
    <div class="flex flex-col items-start gap-3">
      <span class="kicker">Slow action: stays open and busy until done · {{ result }}</span>
      <AlertDialog
        v-model:open="slowOpen"
        title="Delete 3,000 files?"
        description="This takes a moment and can't be undone."
        confirm-label="Delete files"
        :loading="working"
        @confirm="runSlow"
      >
        <template #trigger><Button>Delete files</Button></template>
      </AlertDialog>
    </div>
    <div class="flex flex-col items-start gap-3">
      <span class="kicker">Not dismissible: Escape does nothing</span>
      <AlertDialog title="Leave without saving?" description="Choose a button." confirm-label="Leave" cancel-label="Keep editing" :dismissible="false">
        <template #trigger><Button>Leave page</Button></template>
      </AlertDialog>
    </div>
  </div>
</template>
