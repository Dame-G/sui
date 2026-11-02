// Reads a registry .vue file and lists what it takes: props (with JSDoc and defaults), v-model, events and slots.
// Lives in site/ because `typescript` is a dependency of the site workspace. Shared by the docs (a Vite virtual module), scripts/gen-llms.ts and anyone else who wants the API as data.
import ts from 'typescript'
import { parse } from 'vue/compiler-sfc'

export interface PropInfo {
  name: string
  type: string
  required: boolean
  default?: string
  description?: string
}
export interface ComponentApi {
  props: PropInfo[]
  /** v-model bindings: `modelValue` or a named one. */
  models: PropInfo[]
  events: { name: string; type: string }[]
  slots: string[]
  /** Props inherited from a type outside the file (e.g. Reka's PrimitiveProps). */
  extends: string[]
}

const text = (n: ts.Node, sf: ts.SourceFile) => n.getText(sf).replace(/\s+/g, ' ').trim()

export function extractApi(source: string): ComponentApi {
  const api: ComponentApi = { props: [], models: [], events: [], slots: [], extends: [] }
  const { descriptor } = parse(source)
  const code = descriptor.scriptSetup?.content ?? ''
  if (descriptor.template?.content) {
    for (const m of descriptor.template.content.matchAll(/<slot\b([^>]*)>/g)) {
      const name = /\bname="([^"]+)"/.exec(m[1]!)?.[1] ?? 'default'
      if (!api.slots.includes(name)) api.slots.push(name)
    }
  }
  if (!code) return api
  const sf = ts.createSourceFile('c.ts', code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)

  const local = new Map<string, ts.TypeNode | ts.InterfaceDeclaration>()
  sf.forEachChild((n) => {
    if (ts.isInterfaceDeclaration(n)) local.set(n.name.text, n)
    if (ts.isTypeAliasDeclaration(n)) local.set(n.name.text, n.type)
  })

  const doc = (m: ts.Node) => {
    const d = (m as unknown as { jsDoc?: { comment?: string | { text: string }[] }[] }).jsDoc?.[0]?.comment
    return typeof d === 'string' ? d.trim() : Array.isArray(d) ? d.map((p) => p.text).join('').trim() : undefined
  }

  const members = (node: ts.Node, into: PropInfo[]) => {
    if (ts.isParenthesizedTypeNode(node)) return members(node.type, into)
    if (ts.isIntersectionTypeNode(node)) return node.types.forEach((t) => members(t, into))
    if (ts.isTypeLiteralNode(node) || ts.isInterfaceDeclaration(node)) {
      for (const m of node.members) {
        if (!ts.isPropertySignature(m) || !m.type) continue
        into.push({ name: m.name.getText(sf), type: text(m.type, sf), required: !m.questionToken, description: doc(m) })
      }
      if (ts.isInterfaceDeclaration(node)) for (const h of node.heritageClauses ?? []) h.types.forEach((t) => api.extends.push(text(t, sf)))
      return
    }
    if (ts.isTypeReferenceNode(node)) {
      const name = node.typeName.getText(sf)
      const found = local.get(name)
      if (found) return members(found, into)
      api.extends.push(text(node, sf))
    }
  }

  const call = (n: ts.CallExpression, name: string) => ts.isIdentifier(n.expression) && n.expression.text === name

  const visit = (n: ts.Node) => {
    if (ts.isCallExpression(n)) {
      if (call(n, 'withDefaults') && n.arguments[0] && ts.isCallExpression(n.arguments[0])) {
        const inner = n.arguments[0]
        if (call(inner, 'defineProps') && inner.typeArguments?.[0]) members(inner.typeArguments[0], api.props)
        const defs = n.arguments[1]
        if (defs && ts.isObjectLiteralExpression(defs)) {
          for (const p of defs.properties) {
            const key = p.name?.getText(sf)
            const val = ts.isPropertyAssignment(p) ? text(p.initializer, sf) : ts.isMethodDeclaration(p) ? '(computed)' : undefined
            const prop = api.props.find((x) => x.name === key)
            if (prop && val !== undefined) prop.default = val.replace(/^\(\) => /, '')
          }
        }
        return
      }
      if (call(n, 'defineProps') && n.typeArguments?.[0]) members(n.typeArguments[0], api.props)
      if (call(n, 'defineModel')) {
        const [first, second] = n.arguments
        const named = first && ts.isStringLiteral(first)
        const opts = named ? second : first
        let def: string | undefined
        if (opts && ts.isObjectLiteralExpression(opts)) {
          const d = opts.properties.find((p) => p.name?.getText(sf) === 'default')
          if (d && ts.isPropertyAssignment(d)) def = text(d.initializer, sf).replace(/^\(\) => /, '')
        }
        api.models.push({ name: named ? first.text : 'modelValue', type: n.typeArguments?.[0] ? text(n.typeArguments[0], sf) : 'unknown', required: false, default: def })
      }
      if (call(n, 'defineEmits') && n.typeArguments?.[0]) {
        const t = n.typeArguments[0]
        if (ts.isTypeLiteralNode(t)) {
          for (const m of t.members) {
            if (ts.isPropertySignature(m) && m.type) api.events.push({ name: m.name.getText(sf), type: text(m.type, sf) })
            else if (ts.isCallSignatureDeclaration(m)) {
              const [ev, ...rest] = m.parameters
              const t0 = ev?.type
              if (t0 && ts.isLiteralTypeNode(t0) && ts.isStringLiteral(t0.literal)) {
                api.events.push({ name: t0.literal.text, type: `[${rest.map((p) => text(p, sf)).join(', ')}]` })
              }
            }
          }
        }
      }
    }
    ts.forEachChild(n, visit)
  }
  visit(sf)
  api.extends = [...new Set(api.extends)]
  return api
}
