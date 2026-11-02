# sui (simple ui)

Rebranded from eos. A Vue component registry (shadcn-style: users download the source) with one distinct, token-themable identity.
Stack: Bun, Vue 3, Vite, TypeScript 5.9 (not 7: no JS API, breaks the Vue compiler), Tailwind v4, Reka UI (headless behaviour).
Commands: `bun dev`, `bun run check` (typecheck + lint), `bun run build`, `bun test tests` (palette contrast + registry output), `bun run smoke` (installs all components into a fresh app; needs network), `bun run audit` (axe + 375px overflow on the built site; set `SUI_CHROME`), `bun run registry:build` (dev base URL `SUI_REGISTRY_URL`, production `https://sui.dame.gg/r`).

Layout: `registry/` = component source of truth (`ui/`, `lib/`, `theme.css`, `registry.json`). `site/` = docs + playground, imports `registry/` directly.
`scripts/build-registry.ts` emits shadcn-compatible JSON to `site/public/r/`. Components import `@/lib/utils` so the CLI rewrites it to the consumer's alias.

## Project rules
(General working rules live in `~/.claude/CLAUDE.md`.)
- Hardened (tests, CI, audit exist). Keep `bun run check`, `bun test tests` green; tests only at real boundaries.
- Don't add dependencies without asking. Live at `https://sui.dame.gg` (Cloudflare Workers static assets, `wrangler.jsonc`). Deploy with `bun run deploy` (needs `wrangler login`); `SUI_LIVE=https://sui.dame.gg/r bun run smoke` checks the live registry. Afterwards run `bun run registry:build` to put dev URLs back.
- UI work: run `bun dev` (http://localhost:5173), and after adding files `touch site/src/style.css` so Tailwind rescans. Open the result with `xdg-open`.
- Rebuilding from the original: read `Dame-G/eos` first (`packages/vue/src/components/*`, `styles/`, `tokens/src/tokens.json`).

## Design rules (the identity, carried over from the original eos library, `Dame-G/eos`; not options)
- The SLAB: a raised face sits on a darker bottom edge (`slab`, `slab-primary`...); a tone edge is a slab turned on its side (`edge-start`, Notice/Badge). Pressed = `slab-flat`.
- 1px edges, 2px slab (`--depth`), 2px focus ring (`focus-ring` / `focus-inset`), one control height (`h-control`). No blur shadows except floating panels (`shadow-float`).
- Soft tinted tones (`tone-info|success|warning|danger|neutral`), striped "still to do" areas (`stripes`), dashed edge for disabled/busy (`dashed-edge`).
- Three weights only: regular, medium, strong (no bold). Mono for labels and figures (`kicker`, `numeral`).
- No `variant`/`size` style props. One design per component; users edit their copy. A semantic `tone` is allowed on status components (Notice, Badge).
- Colours only via theme tokens (`bg-primary`, `text-ink`, `bg-primary-soft`...). Action colour states (hover/press/slab/soft) are derived in CSS from `--color-primary`, which the playground derives from the brand with a 7:1 white-text guarantee.
- Theming = tokens in `registry/theme.css` (brand/primary, radius, depth, fonts). Components never read user config.
- `bun run lint` (@shadcn/lint) enforces this on consumers of components; fix what it reports rather than disabling it. No arbitrary values or inline styles outside `registry/`.
- Card, Dialog and Sheet share one header: a primary band on a slab edge, white text. Each part draws its own border and radius; don't clip with overflow-hidden.
- A component earns a place if it has hard behaviour or a11y, or it fixes anatomy every app would rebuild slightly differently (label/error wiring, attached-segment corners, empty-state layout). One-off recipes (copy button, stat) don't.
- Orientation and density are layout props, allowed. Style variants and `size` are not.
