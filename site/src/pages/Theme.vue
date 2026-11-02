<script setup lang="ts">
import PageHeader from '@/site/PageHeader.vue'
import { ref, watch } from 'vue'
import { applyPreset, defaults, dtcgJson, fonts, isHex, presets, primary, report, reportIssues, resolvedContrast, resolvedScheme, theme, themeCss, type ContrastChoice, type SchemeChoice } from '@/site/theme'
import CodeBlock from '@/components/CodeBlock.vue'
import InfoTip from '@/components/InfoTip.vue'
import Badge from '@/components/ui/badge.vue'
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'
import Checkbox from '@/components/ui/checkbox.vue'
import Collapsible from '@/components/ui/collapsible.vue'
import ColorPicker from '@/components/ui/color-picker.vue'
import DataTable from '@/components/ui/data-table.vue'
import Fieldset from '@/components/ui/fieldset.vue'
import Notice from '@/components/ui/notice.vue'
import Progress from '@/components/ui/progress.vue'
import Select from '@/components/ui/select.vue'
import Slider from '@/components/ui/slider.vue'
import Switch from '@/components/ui/switch.vue'
import Tabs from '@/components/ui/tabs.vue'
import ToggleGroup from '@/components/ui/toggle-group.vue'
import TextField from '@/components/ui/text-field.vue'
import { toast } from '@/components/ui/toast.vue'

const hex = ref(theme.brand)
const radius = ref([theme.radius])
const depth = ref([theme.depth])
const font = ref<string>(theme.font)
const demoText = ref('')
const demoCheck = ref(true)
const demoSwitch = ref(true)
const tabs = [
  { value: 'one', label: 'Tab one' },
  { value: 'two', label: 'Tab two' },
]
const fontOptions = [
  { value: 'bricolage', label: 'Bricolage' },
  { value: 'serif', label: 'Serif' },
  { value: 'system', label: 'System' },
  { value: 'mono', label: 'Mono' },
]
const schemeOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto' },
]
const contrastOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'auto', label: 'Auto' },
]
function setScheme(v: string | string[] | undefined) {
  if (typeof v === 'string') theme.scheme = v as SchemeChoice
}
function setContrast(v: string | string[] | undefined) {
  if (typeof v === 'string') theme.contrast = v as ContrastChoice
}
const presetNames = Object.keys(presets).map((p) => ({ value: p, label: p }))
const preset = ref<string>()
const swatches = Object.values(presets).map((p) => p.brand)
const derived = [
  { name: 'primary', cls: 'bg-primary' },
  { name: 'hover', cls: 'bg-primary-hover' },
  { name: 'press', cls: 'bg-primary-press' },
  { name: 'slab', cls: 'bg-primary-slab' },
  { name: 'soft', cls: 'bg-primary-soft' },
]
const columns = [
  { key: 'pair', label: 'Pair', sortable: true },
  { key: 'ratio', label: 'Ratio', sortable: true },
  { key: 'min', label: 'Needs', sortable: true },
  { key: 'result', label: 'Result' },
]
const rows = () => report.value.map((r) => ({ pair: r.pair, ratio: Number(r.ratio.toFixed(2)), min: r.min, result: r.ok ? 'Pass' : 'Fail' }))

// The brand colour picker edits the theme as you drag; only a valid colour ever reaches it.
watch(hex, (v) => {
  if (isHex(v)) theme.brand = v
})
function setRadius(v: number[] | undefined) {
  radius.value = v ?? [0]
  theme.radius = radius.value[0] ?? 0
}
function setDepth(v: number[] | undefined) {
  depth.value = v ?? [0]
  theme.depth = depth.value[0] ?? 0
}
function setFont(v: string | string[] | undefined) {
  if (typeof v === 'string') {
    font.value = v
    theme.font = v as keyof typeof fonts
  }
}
function sync() {
  hex.value = theme.brand
  radius.value = [theme.radius]
  depth.value = [theme.depth]
  font.value = theme.font
}
function pickPreset(v: string | string[] | undefined) {
  if (typeof v !== 'string') return
  preset.value = v
  applyPreset(v)
  sync()
}
function reset() {
  preset.value = undefined
  Object.assign(theme, defaults)
  sync()
}
function downloadTokens() {
  const url = URL.createObjectURL(new Blob([dtcgJson.value], { type: 'application/json' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'sui.tokens.json'
  a.click()
  URL.revokeObjectURL(url)
  toast({ title: 'Tokens downloaded', description: 'sui.tokens.json, in the Design Tokens format.', tone: 'success' })
}
async function copyCss() {
  try {
    await navigator.clipboard.writeText(themeCss.value)
    toast({ title: 'Theme copied', description: 'Paste it into your sui-theme.css.', tone: 'success' })
  } catch {
    toast({ title: 'Could not copy', description: 'Select the CSS below instead.', tone: 'danger' })
  }
}
</script>

<template>
  <div class="flex flex-col">
    <PageHeader kicker="Theme" title="Four tokens, one look">Brand colour, radius, slab depth and font re-theme everything. This whole site is live: try it.</PageHeader>
    <div class="mx-auto w-full flex max-w-7xl flex-col gap-10 px-6 py-12">

    <div class="flex flex-col items-start gap-8 lg:flex-row">
      <Card title="Tokens" class="w-full lg:sticky lg:top-24 lg:w-96 lg:shrink-0">
        <Fieldset legend="Preset">
          <Select :model-value="preset" :options="presetNames" placeholder="Choose a preset" @update:model-value="pickPreset" />
        </Fieldset>

        <Fieldset legend="Colour">
          <ColorPicker v-model="hex" label="Brand colour" :swatches="swatches" />
        </Fieldset>

        <Fieldset legend="Shape">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <span class="kicker flex items-center gap-1">Radius · <span class="numeral">{{ theme.radius }}px</span>
                <InfoTip label="radius" tip="How round every corner is. Slabs keep their bottom edge true at any radius." /></span>
              <Slider label="Corner radius" :model-value="radius" :min="0" :max="16" @update:model-value="setRadius" />
            </div>
            <div class="flex flex-col gap-2">
              <span class="kicker flex items-center gap-1">Slab depth · <span class="numeral">{{ theme.depth }}px</span>
                <InfoTip label="slab depth" tip="How thick the darker bottom edge under a raised face is. 0 is flat." /></span>
              <Slider label="Slab depth" :model-value="depth" :min="0" :max="4" @update:model-value="setDepth" />
            </div>
          </div>
        </Fieldset>

        <Fieldset legend="Font">
          <Select :model-value="font" :options="fontOptions" @update:model-value="setFont" />
        </Fieldset>

        <Fieldset legend="Scheme">
          <ToggleGroup :model-value="theme.scheme" :options="schemeOptions" stretch @update:model-value="setScheme" />
        </Fieldset>

        <Fieldset legend="Contrast">
          <ToggleGroup :model-value="theme.contrast" :options="contrastOptions" stretch @update:model-value="setContrast" />
        </Fieldset>

        <div><Button @click="reset">Reset</Button></div>
      </Card>

      <div class="flex w-full min-w-0 grow flex-col gap-8">
        <Card title="Derived from your brand">
          <p class="text-sm text-muted">
            Brand <code class="numeral">{{ theme.brand }}</code> becomes <code class="numeral">{{ primary }}</code>, moved until text on it
            passes 7:1. The other states are mixed from that.
          </p>
          <div class="flex flex-wrap gap-3">
            <div v-for="d in derived" :key="d.name" class="flex flex-col gap-1.5">
              <div :class="[d.cls, 'h-12 w-20 rounded-md shadow-frame']"></div>
              <span class="kicker">{{ d.name }}</span>
            </div>
          </div>
        </Card>

        <Card title="Preview">
          <div class="flex flex-wrap items-center gap-3">
            <Button>Primary action</Button>
            <Badge tone="info">Info</Badge>
            <Badge tone="success">Success</Badge>
            <Badge tone="warning">Warning</Badge>
            <Badge tone="danger">Danger</Badge>
          </div>
          <TextField v-model="demoText" label="Name" placeholder="Type here" />
          <div class="flex flex-wrap gap-6">
            <Checkbox v-model="demoCheck" label="Checkbox" />
            <Switch v-model="demoSwitch" label="Switch" />
          </div>
          <Progress :model-value="58" label="Uploading" />
          <Tabs :tabs="tabs">
            <template #one><p>Panels, edges and buttons all follow the tokens.</p></template>
            <template #two><p>Second panel.</p></template>
          </Tabs>
          <Notice title="Saved">Your changes are live for everyone on this workspace.</Notice>
        </Card>

        <Card title="Contrast">
          <p class="text-sm text-muted">
            Colours are moved until they pass: body text 7:1, other text {{ resolvedContrast === 'high' ? '7:1' : '4.5:1' }}, edges and
            focus {{ resolvedContrast === 'high' ? '4.5:1' : '3:1' }}. Showing {{ resolvedScheme }} at {{ resolvedContrast }} contrast.
          </p>
          <Notice v-if="reportIssues.length" tone="danger" title="Some pairs cannot pass">{{ reportIssues.join(', ') }}. Pick a different brand colour.</Notice>
          <Notice v-else tone="success" title="Every pair passes">{{ report.length }} of {{ report.length }} checks meet their minimum.</Notice>
          <Collapsible title="Show every check"><DataTable :columns="columns" :rows="rows()" /></Collapsible>
        </Card>

        <div class="flex flex-col gap-3">
          <h2 class="heading text-2xl">Your tokens</h2>
          <p class="text-muted">Paste into your <code class="numeral">src/styles/sui-theme.css</code>, replacing the matching lines.</p>
          <CodeBlock :code="themeCss" lang="css" />
          <div class="flex flex-wrap gap-3">
            <Button @click="copyCss">Copy CSS</Button>
            <Button @click="downloadTokens">Download tokens (DTCG)</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
