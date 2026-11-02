<script setup lang="ts">
import { computed, ref } from 'vue'
import TagsInput from '@/components/ui/tags-input.vue'

const tags = ref(['design', 'vue'])
const empty = ref<string[]>([])
const few = ref(['one'])
const fewError = computed(() => (few.value.length < 2 ? 'Add at least two topics.' : undefined))
</script>

<template>
  <div class="grid items-start gap-6 md:grid-cols-2">
    <TagsInput v-model="tags" label="Topics" hint="Enter or comma adds, Backspace removes." />
    <TagsInput v-model="empty" label="Empty" placeholder="Type and press Enter" />
    <TagsInput v-model="few" label="Error" :error="fewError" required />
    <TagsInput :model-value="['ada', 'grace']" label="Saving" loading />
    <TagsInput :model-value="['ada', 'grace']" label="Read only" readonly />
    <TagsInput :model-value="['ada', 'grace']" label="Disabled" disabled />
  </div>
</template>
