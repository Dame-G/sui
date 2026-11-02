<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Label, type LabelProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<LabelProps & { required?: boolean; optional?: boolean; class?: HTMLAttributes['class'] }>()
</script>

<template>
  <Label :for="props.for" :as="props.as" :as-child="props.asChild" :class="cn('kicker inline-flex w-fit items-center gap-1', props.class)">
    <slot />
    <!-- Said in words, and hidden from screen readers: they hear "required" from the control itself. -->
    <span v-if="props.required || props.optional" aria-hidden="true" class="font-regular">{{ props.required ? 'Required' : 'Optional' }}</span>
  </Label>
</template>
