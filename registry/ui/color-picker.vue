<script setup lang="ts">
import { ref, useId, watch, type HTMLAttributes } from 'vue'
import {
  ColorAreaArea,
  ColorAreaRoot,
  ColorAreaThumb,
  ColorSliderRoot,
  ColorSliderThumb,
  ColorSliderTrack,
  ColorSwatch,
  ColorSwatchPickerItem,
  ColorSwatchPickerItemSwatch,
  ColorSwatchPickerRoot,
} from 'reka-ui'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    label: string
    swatches?: string[]
    error?: string
    disabled?: boolean
    class?: HTMLAttributes['class']
  }>(),
  { swatches: () => ['#2c95b4', '#005f7c', '#2e7d4f', '#d89614', '#d6561f', '#b3261e', '#7a3e9d', '#242424'] },
)
const model = defineModel<string>({ default: '#2c95b4' })
const id = useId()

// The hex field edits a draft and only commits a valid colour, so half-typed text never reaches the model.
const draft = ref(model.value)
watch(model, (v) => (draft.value = v))
const HEX = /^#?([0-9a-f]{6})$/i
function commit() {
  const m = HEX.exec(draft.value.trim())
  if (m) model.value = `#${m[1]!.toLowerCase()}`
  else draft.value = model.value
}

// The same thumb as the slider: a button face on a primary slab.
const thumb =
  'slab slab-sm slab-primary slab-thin block size-check cursor-grab bg-surface bg-clip-padding transition-state focus-ring active:slab-flat active:cursor-grabbing data-[disabled]:cursor-not-allowed'
</script>

<template>
  <div role="group" :aria-labelledby="`${id}-label`" :aria-describedby="props.error ? `${id}-error` : undefined" :class="cn('grid w-full min-w-0 gap-3', props.class)">
    <p :id="`${id}-label`" class="kicker">{{ props.label }}</p>

    <!-- The area: saturation across, lightness up. Its colours come from the picked hue. -->
    <ColorAreaRoot v-slot="{ style }" v-model="model" color-space="hsl" x-channel="saturation" y-channel="lightness" :disabled="props.disabled">
      <ColorAreaArea
        :style="style"
        :class="
          cn(
            'relative h-40 w-full cursor-crosshair touch-none rounded-md border border-edge-strong',
            props.disabled && 'cursor-not-allowed opacity-50',
          )
        "
      >
        <!-- the thumb is a ring: an inner surface line, an outer ink line -->
        <ColorAreaThumb
          class="block size-5 cursor-grab rounded-full border-2 border-surface shadow-[0_0_0_1px_var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:cursor-grabbing"
        />
      </ColorAreaArea>
    </ColorAreaRoot>

    <ColorSliderRoot v-model="model" color-space="hsl" channel="hue" :disabled="props.disabled" class="group relative flex h-control w-full touch-none items-center select-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50">
      <ColorSliderTrack class="relative block h-3 grow rounded-sm border border-edge-strong" />
      <ColorSliderThumb :class="thumb" />
    </ColorSliderRoot>

    <ColorSwatchPickerRoot v-model="model" :disabled="props.disabled" class="flex flex-wrap gap-2" aria-label="Swatches">
      <ColorSwatchPickerItem
        v-for="c in props.swatches"
        :key="c"
        :value="c"
        class="slab slab-thin slab-sm inline-grid size-9 cursor-pointer place-items-center bg-surface bg-clip-padding p-0.5 transition-state [--_ring:var(--color-edge-strong)] hover:[--_ring:var(--color-ink)] focus-ring data-[state=checked]:[--_ring:var(--color-primary-slab)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
      >
        <ColorSwatchPickerItemSwatch class="size-full rounded-[max(0px,calc(var(--radius-sm)-var(--stroke-edge)-2px))] bg-(--reka-color-swatch-color)" />
      </ColorSwatchPickerItem>
    </ColorSwatchPickerRoot>

    <div class="flex items-center gap-2">
      <ColorSwatch :color="model" class="size-control shrink-0 rounded-md border border-edge-strong bg-(--reka-color-swatch-color)" />
      <input
        :id="id"
        v-model="draft"
        :disabled="props.disabled"
        :aria-invalid="props.error ? true : undefined"
        aria-label="Hex colour"
        spellcheck="false"
        autocomplete="off"
        class="well numeral h-control w-full min-w-0 px-[calc(1rem-var(--stroke-edge))] uppercase"
        @blur="commit"
        @keydown.enter="commit"
      />
    </div>

    <p v-if="props.error" :id="`${id}-error`" class="flex items-start gap-1 text-sm/[1.4286] font-medium text-danger">
      <svg viewBox="0 0 256 256" class="mt-0.5 size-3.5 shrink-0" fill="currentColor" aria-hidden="true">
        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" />
      </svg>
      {{ props.error }}
    </p>
  </div>
</template>
