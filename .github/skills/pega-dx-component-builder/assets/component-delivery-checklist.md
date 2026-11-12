# Component Delivery Checklist

Use this checklist before concluding the task.

- Folder name follows `Pega_Extensions_<Name>`.
- `config.json` `name` and `componentKey` match the folder.
- `index.tsx` exports a typed component and wraps it with `withConfiguration`.
- Field-style components keep `hideLabel` as the public prop, pass `labelHidden={hideLabel}` only to Cosmos controls, and avoid exposing `labelHidden` as part of the component API.
- Field-style components type `disabled`, `readOnly`, and `required` as booleans and use the shared coercion pattern so runtime string `'true'` values still behave correctly.
- `getPConnect` follows repo conventions: `getPConnect: () => typeof PConnect` (from `@pega/pcore-pconnect-typedefs`), without duplicate local `PegaConnect` or related helper interfaces.
- Required PConnect or PCore usage is verified against repo examples or official docs.
- Launchpad safety (see `LAUNCHPAD_VS_PLATFORM.md`):
  - Property names, data-page names, and local-action / flow-type names go through `getMappedKey` (or equivalent namespace + key mapping).
  - No hard-coded `pyID` / `pzInsKey` / `pxObjClass` / `pyStatusWork` / `pyLabel` (etc.) as runtime object keys.
  - Current case id uses `PCore.getConstants().CASE_INFO.*`, not hard-coded paths.
  - Navigation uses Actions API + Semantic URL utils (no hand-built URLs).
  - Optional Platform-only APIs are gated with `doesRestApiExist`, or the component is explicitly not Launchpad-supported.
  - No `isLaunchpad` feature switches when mapping or capability detection suffices.
- `Docs.mdx` explains the component and matches the live props.
- `demo.stories.tsx` renders with workable mocks for missing runtime services, including `getNameSpaceUtils`, `getEnvironmentInfo().getKeyMapping`, and `getRestClient().doesRestApiExist` when used.
- Storybook Props/Controls row order is defined by the component props or story args type, with related fields grouped in the desired display order.
- TypeScript/JSDoc comments on component props and story-only args provide the table descriptions.
- `argTypes` only override inferred behavior when needed, such as conditional visibility, hidden rows, or controls/defaults that cannot be inferred; ordinary inferred controls and descriptions are not redundantly specified.
- Storybook conditional controls reflect relevant `config.json` visibility rules where supported.
- Constrained props use inferred controls from literal union types when sufficient; add explicit control options only when inference is inadequate. Use a single boolean `hideLabel` control when relevant.
- Additional stories are referenced from `Docs.mdx` in an `Example` or `Examples` section.
- `demo.test.tsx` covers the important behavior that can run in Jest.
- `styles.ts` and `localizations.json` exist only when justified.
- Source registration files are updated if the component must appear in the gallery.
- Launchpad support status in `Component_Build_Guide.md` is accurate if the component is new or its support level changed.
- `npm run lint` and the relevant tests were run, or any skipped validation is explicitly reported.
