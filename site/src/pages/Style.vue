<script setup lang="ts">
import PageHeader from '@/site/PageHeader.vue'
import OnThisPage from '@/site/OnThisPage.vue'
import { ref } from 'vue'
import Badge from '@/components/ui/badge.vue'
import Button from '@/components/ui/button.vue'
import Checkbox from '@/components/ui/checkbox.vue'
import IconButton from '@/components/ui/icon-button.vue'
import Kbd from '@/components/ui/kbd.vue'
import Select from '@/components/ui/select.vue'
import Switch from '@/components/ui/switch.vue'
import TextField from '@/components/ui/text-field.vue'

const tones = ['neutral', 'info', 'success', 'warning', 'danger'] as const
const options = [{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }]
const moved = ref(false)

// The state matrix: every cell is the real component. Hover, press and focus need a pointer or keyboard, so they are the legend below it.
const on = ref(true)
const toc = [{ id: 'sec-1', label: 'The slab' }, { id: 'sec-2', label: 'States' }, { id: 'sec-3', label: 'Tones and marks' }, { id: 'sec-4', label: 'Controls' }, { id: 'sec-5', label: 'Shape and space' }, { id: 'sec-6', label: 'Type and icons' }, { id: 'sec-7', label: 'Panels and motion' }, { id: 'sec-8', label: 'The rules' }]
</script>

<template>
  <div class="flex flex-col">
    <PageHeader kicker="Style" title="One look, a few rules">Everything in sui follows this page. A new component is right when it looks like it belongs here.</PageHeader>
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-12 lg:flex-row">
      <div class="flex min-w-0 grow flex-col gap-16">

    <!-- 1. the slab -->
    <section id="sec-1" class="flex flex-col gap-6">
      <div class="flex flex-col gap-1">
        <p class="kicker">01 · The slab</p>
        <h2 class="heading text-2xl">A raised face on a darker edge</h2>
        <p class="text-muted">Pressing sinks the face onto it. A tone edge is the same slab turned on its side.</p>
      </div>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div class="flex flex-col gap-2">
          <div class="slab slab-primary grid h-control place-items-center bg-primary text-on-primary type-button">Raised</div>
          <span class="kicker">slab</span>
        </div>
        <div class="flex flex-col gap-2">
          <div class="slab slab-primary slab-flat grid h-control place-items-center bg-primary text-on-primary type-button">Pressed</div>
          <span class="kicker">slab-flat</span>
        </div>
        <div class="flex flex-col gap-2">
          <div class="edge-start tone-info grid h-control items-center px-3 type-button text-(--_ink)">On its side</div>
          <span class="kicker">edge-start</span>
        </div>
        <div class="flex flex-col gap-2">
          <div class="well grid h-control items-center px-4 text-muted">Sunk</div>
          <span class="kicker">well</span>
        </div>
      </div>
    </section>

    <!-- 2. states -->
    <section id="sec-2" class="flex flex-col gap-6">
      <div class="flex flex-col gap-1">
        <p class="kicker">02 · States</p>
        <h2 class="heading text-2xl">Every control answers the same way</h2>
        <p class="text-muted">Hover washes, press sinks, focus rings, disabled goes dashed, busy goes dashed and tinted, error turns danger.</p>
      </div>

      <div class="grid gap-4 sm:grid-cols-3">
        <div class="flex flex-col gap-2">
          <div class="grid h-control place-items-center rounded-md border border-edge-strong bg-wash-hover type-button">Hover</div>
          <span class="kicker">a wash over the face</span>
        </div>
        <div class="flex flex-col gap-2">
          <div class="slab slab-flat grid h-control place-items-center bg-wash-press type-button">Press</div>
          <span class="kicker">the slab sinks</span>
        </div>
        <div class="flex flex-col gap-2">
          <div class="grid h-control place-items-center rounded-md border border-edge-strong outline-2 outline-offset-2 outline-focus type-button">Focus</div>
          <span class="kicker">2px ring, outside</span>
        </div>
      </div>

      <div class="relative overflow-x-auto">
        <div class="grid min-w-3xl grid-cols-5 items-start gap-x-6 gap-y-6">
          <span />
          <span class="kicker">Rest</span>
          <span class="kicker">Disabled</span>
          <span class="kicker">Busy</span>
          <span class="kicker">Error</span>

          <span class="kicker pt-3">Button</span>
          <div><Button>Save</Button></div>
          <div><Button disabled>Save</Button></div>
          <div><Button loading>Save</Button></div>
          <span class="pt-3 text-muted">·</span>

          <span class="kicker pt-3">Text field</span>
          <TextField label="Name" hide-label placeholder="Ada" />
          <TextField label="Name" hide-label model-value="Ada" disabled />
          <TextField label="Name" hide-label model-value="Ada" loading />
          <TextField label="Name" hide-label model-value="" error="Required" />

          <span class="kicker pt-3">Select</span>
          <Select :options="options" placeholder="Pick one" />
          <Select :options="options" model-value="a" disabled />
          <Select :options="options" model-value="a" loading />
          <Select :options="options" error="Pick one" />

          <span class="kicker pt-3">Checkbox</span>
          <div><Checkbox v-model="on" label="Agree" /></div>
          <div><Checkbox :model-value="true" label="Agree" disabled /></div>
          <span class="pt-3 text-muted">·</span>
          <span class="pt-3 text-muted">·</span>

          <span class="kicker pt-3">Switch</span>
          <div><Switch v-model="on" label="Alerts" /></div>
          <div><Switch :model-value="true" label="Alerts" disabled /></div>
          <span class="pt-3 text-muted">·</span>
          <span class="pt-3 text-muted">·</span>
        </div>
      </div>
    </section>

    <!-- 3. tones, stripes, dashes -->
    <section id="sec-3" class="flex flex-col gap-6">
      <div class="flex flex-col gap-1">
        <p class="kicker">03 · Tones and marks</p>
        <h2 class="heading text-2xl">Colour means something</h2>
        <p class="text-muted">Five soft tones for status. Stripes mean still to do. A dashed edge means disabled or busy, and nothing else.</p>
      </div>
      <div class="flex flex-wrap gap-3">
        <Badge v-for="t in tones" :key="t" :tone="t">{{ t }}</Badge>
      </div>
      <div class="grid gap-6 sm:grid-cols-2">
        <div class="flex flex-col gap-2">
          <div class="stripes h-control rounded-md border border-edge"></div>
          <span class="kicker">stripes · loading, remaining</span>
        </div>
        <div class="flex flex-col gap-2">
          <div class="dashed-edge h-control rounded-md"></div>
          <span class="kicker">dashed-edge · disabled, busy</span>
        </div>
      </div>
    </section>

    <!-- 4. controls -->
    <section id="sec-4" class="flex flex-col gap-6">
      <div class="flex flex-col gap-1">
        <p class="kicker">04 · Controls</p>
        <h2 class="heading text-2xl">One height</h2>
        <p class="text-muted">Every single-line control is 48px. Anything you tap is at least 44px, however small it looks.</p>
      </div>
      <div class="flex flex-wrap items-end gap-4">
        <Button>Button</Button>
        <TextField label="Field" hide-label placeholder="Field" class="w-48" />
        <Select :options="options" placeholder="Select" class="w-48" />
        <IconButton label="Search">
          <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        </IconButton>
      </div>
    </section>

    <!-- 5. shape and space -->
    <section id="sec-5" class="flex flex-col gap-6">
      <div class="flex flex-col gap-1">
        <p class="kicker">05 · Shape and space</p>
        <h2 class="heading text-2xl">Three radii, three gaps</h2>
        <p class="text-muted">Radius follows the layer: small for parts inside a control, medium for controls and panels, large almost never.</p>
      </div>
      <div class="grid gap-8 sm:grid-cols-2">
        <div class="flex items-end gap-6">
          <div class="flex flex-col gap-2"><div class="size-16 rounded-sm border border-edge-strong"></div><span class="kicker">sm · chips</span></div>
          <div class="flex flex-col gap-2"><div class="size-16 rounded-md border border-edge-strong"></div><span class="kicker">md · controls</span></div>
          <div class="flex flex-col gap-2"><div class="size-16 rounded-lg border border-edge-strong"></div><span class="kicker">lg · rare</span></div>
        </div>
        <div class="flex items-end gap-8">
          <div class="flex flex-col gap-2">
            <div class="flex flex-col gap-2"><div class="h-2 w-10 rounded-sm bg-muted"></div><div class="h-control w-20 rounded-md border border-edge-strong"></div></div>
            <span class="kicker">gap-2 · label to control</span>
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex flex-col gap-6"><div class="h-5 w-20 rounded-sm border border-edge-strong"></div><div class="h-5 w-20 rounded-sm border border-edge-strong"></div></div>
            <span class="kicker">gap-6 · field to field</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. type and icons -->
    <section id="sec-6" class="flex flex-col gap-6">
      <div class="flex flex-col gap-1">
        <p class="kicker">06 · Type and icons</p>
        <h2 class="heading text-2xl">Three weights, one mono</h2>
        <p class="text-muted">Mono is for labels and figures only. Icons are 1.75px strokes at 16 or 20px, drawn in the text colour.</p>
      </div>
      <div class="grid gap-6 sm:grid-cols-2">
        <div class="flex flex-col gap-2">
          <span class="kicker">Kicker · labels</span>
          <span class="heading text-2xl">Heading, medium</span>
          <span>Body text, regular, comfortable to read.</span>
          <span class="font-medium">Emphasis, medium</span>
          <span class="font-strong">Strong, used sparingly</span>
          <span class="numeral">1,204.50 numeral</span>
        </div>
        <div class="flex items-center gap-6">
          <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
          <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
          <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
          <span class="kicker">size-4 · size-5</span>
        </div>
      </div>
    </section>

    <!-- 7. floating panels and motion -->
    <section id="sec-7" class="flex flex-col gap-6">
      <div class="flex flex-col gap-1">
        <p class="kicker">07 · Floating panels and motion</p>
        <h2 class="heading text-2xl">Menus, selects and popovers share one panel</h2>
        <p class="text-muted">One surface (<code class="numeral">panel</code>) with a frame, a slab and one soft drop; every row inside is a <code class="numeral">menu-item</code>. It arrives in 140ms and moves in 220ms. Reduced motion zeroes every duration.</p>
      </div>
      <div class="grid items-start gap-8 sm:grid-cols-2">
        <div class="w-64 rounded-md bg-surface p-1 shadow-float">
          <div class="rounded-sm px-3 py-2">Rename</div>
          <div class="rounded-sm bg-wash-hover px-3 py-2">Duplicate</div>
          <div class="flex items-center justify-between rounded-sm px-3 py-2">Open <Kbd>⌘O</Kbd></div>
        </div>
        <div class="flex flex-col gap-4">
          <div class="relative h-control overflow-hidden rounded-md border border-edge bg-paper">
            <div
              class="absolute top-1 left-1 size-10 rounded-md bg-primary transition-transform duration-(--duration-move) ease-(--ease-out)"
              :class="moved ? 'translate-x-40' : ''"
            ></div>
          </div>
          <div class="flex items-center gap-3">
            <Button @click="moved = !moved">Move</Button>
            <span class="kicker">tap 80 · fade 140 · move 220 ms</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 8. rules -->
    <section id="sec-8" class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <p class="kicker">08 · The rules</p>
        <h2 class="heading text-2xl">What never changes</h2>
      </div>
      <ul class="grid gap-3 leading-normal">
        <li><span class="font-medium">No variants, no sizes.</span> One design per component. You edit your copy.</li>
        <li><span class="font-medium">Tone is meaning,</span> not decoration: neutral, info, success, warning, danger.</li>
        <li><span class="font-medium">Colours come from tokens.</span> Brand, radius, depth and font re-theme everything.</li>
        <li><span class="font-medium">Compose, don't restyle.</span> Pages position components with layout classes; the linter enforces it.</li>
        <li><span class="font-medium">Everything is reachable</span> by keyboard, named for screen readers, and readable in dark and high contrast.</li>
      </ul>
    </section>
  </div>
      <aside class="hidden lg:block lg:w-64 lg:shrink-0"><OnThisPage :items="toc" /></aside>
    </div>
  </div>
</template>
