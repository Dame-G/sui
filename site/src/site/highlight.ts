import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import { createCssVariablesTheme } from 'shiki/core'

// Colours come from CSS variables (--code-*, set in style.css), so the highlighting follows the sui theme.
const theme = createCssVariablesTheme({ name: 'sui', variablePrefix: '--code-', variableDefaults: {}, fontStyle: true })

let loading: Promise<HighlighterCore> | undefined
function load() {
  return (loading ??= createHighlighterCore({
    themes: [theme],
    langs: [import('shiki/langs/vue.mjs'), import('shiki/langs/bash.mjs'), import('shiki/langs/css.mjs'), import('shiki/langs/json.mjs'), import('shiki/langs/typescript.mjs')],
    engine: createJavaScriptRegexEngine(),
  }))
}

export async function highlight(code: string, lang: string): Promise<string> {
  const h = await load()
  return h.codeToHtml(code.replace(/\n$/, ''), { lang, theme: 'sui' })
}

/** A cheap guess at the language, so callers rarely need to say. */
export function sniff(code: string): string {
  const t = code.trimStart()
  if (/^(bunx?|npx?|cd|git|pnpm|yarn)\s/.test(t)) return 'bash'
  if (/^(@import|@theme|@utility|:root|[.#][\w-]+\s*\{)/.test(t)) return 'css'
  if (/^[{["]/.test(t)) return 'json'
  if (/^(import|export|const|let|function|type|interface)\s/.test(t) && !/<template|<script/.test(t)) return 'typescript'
  return 'vue'
}
