// A virtual module, `virtual:sui-props`: every registry component's API (props, v-model, events, slots), read from the source.
import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'
import { extractApi } from './props-lib.ts'

const ui = fileURLToPath(new URL('../registry/ui', import.meta.url))
const ID = 'virtual:sui-props'

export function suiProps(): Plugin {
  return {
    name: 'sui-props',
    resolveId: (id) => (id === ID ? `\0${ID}` : undefined),
    load(id) {
      if (id !== `\0${ID}`) return
      const out: Record<string, unknown> = {}
      for (const f of readdirSync(ui).filter((f) => f.endsWith('.vue'))) {
        try {
          out[f.replace(/\.vue$/, '')] = extractApi(readFileSync(`${ui}/${f}`, 'utf8'))
        } catch {
          /* a file mid-edit: skip it until the next change */
        }
      }
      return `export default ${JSON.stringify(out)}`
    },
    handleHotUpdate({ file, server }) {
      if (!file.startsWith(ui) || !file.endsWith('.vue')) return
      const mod = server.moduleGraph.getModuleById(`\0${ID}`)
      if (mod) server.moduleGraph.invalidateModule(mod)
    },
  }
}
