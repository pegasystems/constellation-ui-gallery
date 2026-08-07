# Official Pega Guidance

This summary is derived from the Pega documentation pages for Constellation DX components and for PCore and PConnect public APIs.

## Constellation DX Component Guidance

- Constellation DX components are intended for advanced front-end developers extending out-of-the-box Constellation behavior when existing assets are insufficient.
- Components should fit into the Constellation design system and behave like first-class App Studio components.
- Library mode is the preferred operating mode in newer DX Component Builder releases, but this repository still provides working standalone gallery patterns that should be followed unless the task requires library-specific work.
- When implementing new components, stay aligned with documented component types, structure, and config metadata rather than inventing ad hoc conventions.

Primary source:

- https://docs.pega.com/bundle/constellation-dx-components/page/constellation-dx-components/custom-components/custom-components.html

## PCore And PConnect Public API Guidance

- Use `getPConnect()` and `PCore` as the supported bridge between the component and the Constellation orchestration layer.
- Prefer public APIs for state, actions, events, messaging, and container interactions rather than reaching into private internal objects.
- Verify action and data access patterns against existing repo usage or official docs before coding.
- Treat mocked Storybook behavior as a testing aid only; do not confuse mock implementations with guaranteed runtime contracts.

Primary source:

- https://docs.pega.com/bundle/pcore-pconnect/page/pcore-pconnect-public-apis/api/using-pcore-pconnect-public-apis.html

## Best-Practice Implications For This Repo

- Reuse Constellation presentational components from `@pega/cosmos-react-core`.
- Keep styling theme-aware and avoid hard-coded UI patterns that diverge from Constellation.
- Use PConnect or PCore only where there is an actual runtime need.
- Document assumptions whenever the official docs do not fully specify a runtime contract needed by the task.

## Launchpad-Safe API Usage

Official PCore/PConnect docs describe the public bridge, but **not every Platform API exists on Launchpad**. In this repository:

- Prefer public data helpers (`getDataApiUtils`, `getDataPageUtils`) over raw REST and over assuming a fixed response envelope.
- Resolve identifiers and rule names with the repo helper `getMappedKey` (namespace + key mapping) — see `LAUNCHPAD_VS_PLATFORM.md`.
- Treat case identity constants (`PCore.getConstants().CASE_INFO.*`) as the supported way to read case context.
- Use Actions API + Semantic URL utils for open/create/preview flows.
- When an API may be missing on Launchpad, detect it with `PCore.getRestClient().doesRestApiExist('…')` and degrade gracefully, or mark the component unsupported.

Do not invent Launchpad-only private APIs. If behavior cannot be achieved with documented public APIs plus the patterns in `LAUNCHPAD_VS_PLATFORM.md`, stop and report the gap.
