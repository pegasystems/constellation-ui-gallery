---
name: pega-dx-component-builder
description: 'Create or extend a Pega Constellation DX component in this UI gallery. Use for new custom components, config.json authoring, Storybook docs, Jest tests, component registration, and safe PCore or PConnect API integration that follows repo and Pega best practices.'
argument-hint: 'Describe the component name, intent, type, designer properties, data model, actions, and any similar existing component.'
user-invocable: true
---

# Pega DX Component Builder

Use this skill when you need to create a new component in this repository or bring an incomplete component up to the repo's shipping standard.

Default operating mode:

- fully implement the component, not just scaffold it
- validate the result with practical checks
- update source files only, unless the user explicitly asks for generated artifacts
- rely on bundled guidance first and fetch live Pega docs only when deeper API confirmation is needed

## Load These References First

- [Repository guidance](./references/repository-guidance.md)
- [Official Pega guidance](./references/official-pega-guidance.md)
- [Component delivery checklist](./assets/component-delivery-checklist.md)

## When To Use

- Creating a new `Pega_Extensions_<Name>` component under `src/components/`
- Extending a component that needs new `config.json` properties, Storybook docs, or tests
- Implementing PConnect or PCore interactions such as actions, value updates, case context access, or container behavior
- Verifying that a DX component follows Constellation styling, accessibility, and repository conventions

## Inputs To Capture

- Component name and whether it is a `Field`, `Template`, or another supported DX component type
- Intended end-user behavior and any required data binding or actions
- Designer properties that must appear in `config.json`
- Similar existing components in this gallery that can serve as the closest template
- Whether the task requires documentation-only scaffolding, working behavior, or publish-ready validation

## Procedure

1. Review the repository references and inspect the closest existing component implementation before creating files.
2. Use bundled guidance first. Fetch live Pega docs only if the task depends on API details or platform behavior that are not clear from repo examples and bundled summaries.
3. Define the component contract:
   - Folder name: `src/components/Pega_Extensions_<Name>`
   - exported component name
   - `config.json` `name` and `componentKey`
   - required runtime props, default config, and any localizations or helper files
4. Implement the component with repository-aligned structure:
   - `index.tsx` for the component
   - `config.json` for Designer metadata
   - `Docs.mdx` for documentation
   - `demo.stories.tsx` for Storybook
   - `demo.test.tsx` for unit coverage
   - optional `styles.ts`, `localizations.json`, and helper modules only when justified
   - when a Storybook prop has a constrained set of supported values, expose it with a `select` control and human-readable labels rather than a free-text control
   - place important custom props near the top of Storybook `argTypes` and set explicit defaults for common DX props such as `testId: ''` and `hideLabel: false` when relevant
   - for field-style components, keep `hideLabel` as the public component prop and pass `labelHidden={hideLabel}` only to the underlying Cosmos control when that control uses the Cosmos prop name
   - for field-style components, type `disabled`, `readOnly`, and `required` as boolean props, but preserve runtime compatibility by coercing `true` and string `'true'` values with the shared `[readOnly, required, disabled].map(...)` pattern used by `MaskedInput` and `DateInput`
   - prefer `getPConnect?: any` for repo-aligned field component props and call `getActionsApi()`, `getStateProps()`, and `ignoreSuggestion()` from the returned object instead of introducing duplicate local `PegaConnect`, `PegaActionsApi`, or `PegaStateProps` interfaces unless a stronger shared type already exists in the repo
   - if you add non-default stories, add them to a `## Example` or `## Examples` section in `Docs.mdx` using `Story` blocks
5. Prefer `@pega/cosmos-react-core`, existing repo dependencies, and functional React patterns. Use `withConfiguration`, `getPConnect`, and `PCore` only where needed and only after confirming the usage pattern.
6. Keep styling theme-aware. Prefer tokens, `styled-components`, and `rem` units. Avoid direct DOM manipulation unless a dependency or browser API makes it unavoidable.
7. Update source-of-truth registration or discovery files when the new component must appear in the gallery. Inspect `src/component-list.json` first. Treat generated outputs such as `src/component-list.js`, `Pega_Extensions/`, and `store/` as build artifacts unless the task explicitly requires them.
8. Validate the implementation with the strongest practical checks for the task:
   - `npm run lint`
   - targeted or full `npm run test`
   - additional build or gallery validation if the change affects registration or packaging
9. Report assumptions, especially around unavailable runtime data, mocked PConnect behavior in Storybook, or APIs that were inferred from repo examples rather than live platform verification.

## Guardrails

- Do not invent DX component metadata. Mirror the shape and naming patterns from this repository.
- Do not hand-edit generated bundles or release artifacts unless explicitly requested.
- Do not add a package dependency for convenience if the repository already has an adequate option.
- Do not leave the component half-finished if the request implies a usable gallery component.

## Success Criteria

- The component folder matches repository naming and file conventions.
- `config.json`, implementation, docs, story, and tests are consistent with each other.
- PConnect or PCore usage is justified by repo patterns or official guidance.
- Validation results and unresolved assumptions are clearly reported.
