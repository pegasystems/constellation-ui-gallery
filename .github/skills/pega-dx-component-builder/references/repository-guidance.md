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

- `AGENTS.md`
- `Component_Build_Guide.md`
- `best practices.md`
- `LAUNCHPAD_VS_PLATFORM.md` (required for data, actions, case IDs, rule names)
- `README.md`
- the closest existing component under `src/components/`
- `src/components/shared/utils.ts` (`getMappedKey`)

## Local Implementation Expectations

- Use TypeScript React components and functional patterns.
- Prefer `@pega/cosmos-react-core` primitives over custom UI or third-party design systems.
- Keep Storybook stories realistic by mocking `PCore` or `getPConnect` only as much as needed.
- For Storybook controls, prefer explicit `argTypes` ordering, use `select` controls for props with a known supported value list, and expose `hideLabel` as a single boolean control instead of `labelHidden`.
- In story defaults, use `hideLabel: false` for field-style components and do not add a parallel `labelHidden` arg.
- For field-style component props, keep `hideLabel` in the public TypeScript API even when the Cosmos component still expects `labelHidden={hideLabel}` internally.
- Match repo field patterns by typing `disabled`, `readOnly`, and `required` as booleans while still coercing runtime string `'true'` values with the shared `[readOnly, required, disabled].map(...)` block used by `MaskedInput` and `DateInput`.
- Prefer `getPConnect: () => typeof PConnect` for component props (types from `@pega/pcore-pconnect-typedefs` via `src/pega-globals.d.ts`); avoid duplicating one-off `PegaConnect`, `PegaActionsApi`, or `PegaStateProps` interfaces when the component only needs calls off `getPConnect()`.
- Prefer bare `PCore.*` over `(window as any).PCore`. Cast incomplete Storybook/test mocks with `as unknown as typeof PCore` / `as unknown as typeof PConnect`.
- When a component has multiple stories beyond the default one, document them in `Docs.mdx` under an `Example` or `Examples` section using `Story` blocks.
- Keep tests focused on rendering, behavior, and integration boundaries that can run without a live Pega environment.

## Launchpad / Dual-Environment Expectations

Components are expected to run on **Pega Platform and Launchpad** unless the gallery marks them unsupported.

- Use `getMappedKey` from `src/components/shared/utils.ts` for property names, data-page names, and local-action / flow-type names. Do not hard-code `pyID`, `pzInsKey`, `pxObjClass`, `pyStatusWork`, `pyLabel`, etc. as runtime object keys.
- Read the current case id via `PCore.getConstants().CASE_INFO.CASE_INFO_ID`, not hard-coded paths like `caseInfo.businessID` or `.pyID`.
- Use `getPConnect().getActionsApi()` and `PCore.getSemanticUrlUtils()` for navigation — never hand-build URLs.
- Before calling optional Platform-only REST DX APIs (for example APIs behind `readDataObject` / `getDataObjectView`), check `PCore.getRestClient().doesRestApiExist('…')` and provide a fallback, or explicitly leave the component unsupported on Launchpad.
- Prefer capability detection over `if (isLaunchpad)` branches.
- In Storybook and Jest, stub at least `getNameSpaceUtils().getDefaultQualifiedName` and `getEnvironmentInfo().getKeyMapping` whenever `getMappedKey` is used; stub `getRestClient().doesRestApiExist` when optional APIs are gated.

See `LAUNCHPAD_VS_PLATFORM.md` for full patterns and examples (`CardGallery`, `KanbanBoard`, `Calendar`, `UtilityList`, `NetworkDiagram`).

## Registration Guidance

- Inspect `src/component-list.json` when adding a new component.
- Treat `src/component-list.js`, `Pega_Extensions/`, and `store/` as generated or build-linked outputs unless the task specifically asks to refresh them.

## Suggested Search Pattern

1. Identify the closest component by behavior and DX component type.
2. Compare its `index.tsx`, `config.json`, story, docs, and tests.
3. Reuse that structure before introducing a new pattern.
