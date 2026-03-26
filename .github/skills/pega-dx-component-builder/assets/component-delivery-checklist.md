# Component Delivery Checklist

Use this checklist before concluding the task.

- Folder name follows `Pega_Extensions_<Name>`.
- `config.json` `name` and `componentKey` match the folder.
- `index.tsx` exports a typed component and wraps it with `withConfiguration`.
- Field-style components keep `hideLabel` as the public prop, pass `labelHidden={hideLabel}` only to Cosmos controls, and avoid exposing `labelHidden` as part of the component API.
- Field-style components type `disabled`, `readOnly`, and `required` as booleans and use the shared coercion pattern so runtime string `'true'` values still behave correctly.
- `getPConnect` follows repo conventions, typically `getPConnect?: any`, without duplicate local `PegaConnect` or related helper interfaces unless a shared type already exists.
- Required PConnect or PCore usage is verified against repo examples or official docs.
- `Docs.mdx` explains the component and matches the live props.
- `demo.stories.tsx` renders with workable mocks for missing runtime services.
- Storybook controls use `select` inputs for constrained props, keep key custom props near the top of the controls table, and use a single boolean `hideLabel` control when relevant.
- Additional stories are referenced from `Docs.mdx` in an `Example` or `Examples` section.
- `demo.test.tsx` covers the important behavior that can run in Jest.
- `styles.ts` and `localizations.json` exist only when justified.
- Source registration files are updated if the component must appear in the gallery.
- `npm run lint` and the relevant tests were run, or any skipped validation is explicitly reported.
