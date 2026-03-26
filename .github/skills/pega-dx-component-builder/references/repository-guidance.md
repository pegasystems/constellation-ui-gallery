# Repository Guidance

This repository is a Pega Constellation DX component gallery. Use the existing codebase as the primary implementation guide for structure and file naming.

## Repo-Specific Facts

- Components live under `src/components/Pega_Extensions_<Name>/`.
- Typical files are `index.tsx`, `config.json`, `Docs.mdx`, `demo.stories.tsx`, `demo.test.tsx`, and optional `styles.ts` or `localizations.json`.
- The component folder name must match `config.json` `name` and `componentKey`.
- Components are wrapped with `withConfiguration` and usually import `../shared/create-nonce`.
- The gallery uses Storybook and Jest. Standard validation commands are `npm run lint`, `npm run fix`, and `npm run test`.
- Source registration currently starts from `src/component-list.json`. Generated or derived outputs should not be the first edit target unless the workflow explicitly requires it.

## Files To Read Before Implementing

- `Component_Build_Guide.md`
- `best practices.md`
- `README.md`
- the closest existing component under `src/components/`

## Local Implementation Expectations

- Use TypeScript React components and functional patterns.
- Prefer `@pega/cosmos-react-core` primitives over custom UI or third-party design systems.
- Keep Storybook stories realistic by mocking `PCore` or `getPConnect` only as much as needed.
- For Storybook controls, prefer explicit `argTypes` ordering, use `select` controls for props with a known supported value list, and expose `hideLabel` as a single boolean control instead of `labelHidden`.
- In story defaults, use `hideLabel: false` for field-style components and do not add a parallel `labelHidden` arg.
- For field-style component props, keep `hideLabel` in the public TypeScript API even when the Cosmos component still expects `labelHidden={hideLabel}` internally.
- Match repo field patterns by typing `disabled`, `readOnly`, and `required` as booleans while still coercing runtime string `'true'` values with the shared `[readOnly, required, disabled].map(...)` block used by `MaskedInput` and `DateInput`.
- Prefer `getPConnect?: any` for component props unless the repo already provides a shared stronger type; avoid duplicating one-off `PegaConnect`, `PegaActionsApi`, or `PegaStateProps` interfaces when the component only needs calls off `getPConnect()`.
- When a component has multiple stories beyond the default one, document them in `Docs.mdx` under an `Example` or `Examples` section using `Story` blocks.
- Keep tests focused on rendering, behavior, and integration boundaries that can run without a live Pega environment.

## Registration Guidance

- Inspect `src/component-list.json` when adding a new component.
- Treat `src/component-list.js`, `Pega_Extensions/`, and `store/` as generated or build-linked outputs unless the task specifically asks to refresh them.

## Suggested Search Pattern

1. Identify the closest component by behavior and DX component type.
2. Compare its `index.tsx`, `config.json`, story, docs, and tests.
3. Reuse that structure before introducing a new pattern.
