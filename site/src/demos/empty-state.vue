<script setup lang="ts">
import Button from '@/components/ui/button.vue'
import EmptyState from '@/components/ui/empty-state.vue'
</script>

<template>
  <div class="grid items-start gap-6 md:grid-cols-2">
    <div class="flex flex-col gap-2">
      <p class="kicker">First use, with an action</p>
      <EmptyState title="No projects yet" description="Create your first project to see it here.">
        <Button>New project</Button>
      </EmptyState>
    </div>
    <div class="flex flex-col gap-2">
      <p class="kicker">No results</p>
      <EmptyState title="No matches for “overdue”" description="Try a different word, or clear your filters.">
        <Button>Clear filters</Button>
      </EmptyState>
    </div>
  </div>
</template>
