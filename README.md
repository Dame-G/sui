# sui (simple ui)

Accessible Vue components you download and own, with one distinct look you theme through tokens. 76 components on Reka UI and Tailwind v4.

```sh
bunx shadcn-vue@latest add https://sui.dame.gg/r/button.json
```

Docs, components and theme playground: https://sui.dame.gg

```sh
bun install
bun dev          # docs site at http://localhost:5173
bun run check    # typecheck + lint
bun test tests   # palette contrast + registry output
bun run smoke    # install every component into a fresh app
bun run audit    # axe + mobile overflow on the built site
```

`registry/` is the source; `site/` is the docs. MIT.
