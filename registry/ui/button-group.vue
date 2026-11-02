<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

const props = withDefaults(defineProps<{ orientation?: 'horizontal' | 'vertical'; class?: HTMLAttributes['class'] }>(), {
  orientation: 'horizontal',
})
</script>

<template>
  <!-- The slab rounds its bottom corners taller than wide (radius + slab depth) so a face stays a true circle. Each corner is written out logically (RTL-aware): a button keeps that shape where it keeps a corner and goes square where it joins a neighbour. Nothing is clipped by a parent, so no anti-aliased gap opens at the joins. The classes are static template text, not built in script: Tailwind needs to see them exactly, and `\_` (an underscore kept in a value) only survives in a template attribute. -->
  <div
    v-if="props.orientation === 'horizontal'"
    role="group"
    class="inline-flex w-fit max-w-full [&>*]:relative [&>*]:rounded-none [&>:hover]:z-10 [&>:focus-visible]:z-20 [&>:not(:first-child)]:-ms-px [&>:first-child]:[border-start-start-radius:var(--radius-md)] [&>:first-child]:[border-end-start-radius:var(--radius-md)_calc(var(--radius-md)+var(--\_lift,var(--depth)))] [&>:last-child]:[border-start-end-radius:var(--radius-md)] [&>:last-child]:[border-end-end-radius:var(--radius-md)_calc(var(--radius-md)+var(--\_lift,var(--depth)))]"
    :class="props.class"
  >
    <slot />
  </div>
  <div
    v-else
    role="group"
    class="inline-flex w-fit max-w-full flex-col [&>*]:relative [&>*]:rounded-none [&>:hover]:z-10 [&>:focus-visible]:z-20 [&>:not(:first-child)]:-mt-px [&>:first-child]:[border-start-start-radius:var(--radius-md)] [&>:first-child]:[border-start-end-radius:var(--radius-md)] [&>:last-child]:[border-end-start-radius:var(--radius-md)_calc(var(--radius-md)+var(--\_lift,var(--depth)))] [&>:last-child]:[border-end-end-radius:var(--radius-md)_calc(var(--radius-md)+var(--\_lift,var(--depth)))]"
    :class="props.class"
  >
    <slot />
  </div>
</template>
