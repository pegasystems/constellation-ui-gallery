# AGENTS.md — Constellation UI Gallery

Instructions for coding agents (GitHub Copilot coding agent, Cursor, and similar) working in this repository.

This gallery ships **Constellation DX components** that must work on **Pega Platform and Launchpad** unless a component is explicitly marked unsupported. Prefer existing gallery patterns over inventing new ones.

---

## Read these docs first

| Doc                                                                                                                                                                  | When to read                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [Component_Build_Guide.md](./Component_Build_Guide.md)                                                                                                               | Scaffolding a component, folder layout, `config.json`, Storybook/tests, Launchpad support column                         |
| [best practices.md](./best%20practices.md)                                                                                                                           | General Constellation DX design and development rules                                                                    |
| [LAUNCHPAD_VS_PLATFORM.md](./LAUNCHPAD_VS_PLATFORM.md)                                                                                                               | **Required** before any change that touches data APIs, case IDs, property keys, rule names, navigation, or local actions |
| [README.md](./README.md)                                                                                                                                             | Install, Storybook, lint, test, and publish overview                                                                     |
| [.github/skills/pega-dx-component-builder/SKILL.md](./.github/skills/pega-dx-component-builder/SKILL.md)                                                             | End-to-end procedure for creating or extending a component                                                               |
| [.github/skills/pega-dx-component-builder/references/repository-guidance.md](./.github/skills/pega-dx-component-builder/references/repository-guidance.md)           | Repo-specific conventions                                                                                                |
| [.github/skills/pega-dx-component-builder/references/official-pega-guidance.md](./.github/skills/pega-dx-component-builder/references/official-pega-guidance.md)     | PCore / PConnect public API summary                                                                                      |
| [.github/skills/pega-dx-component-builder/assets/component-delivery-checklist.md](./.github/skills/pega-dx-component-builder/assets/component-delivery-checklist.md) | Pre-merge delivery checklist                                                                                             |
| [.github/agents/pega-dx-component-builder.agent.md](./.github/agents/pega-dx-component-builder.agent.md)                                                             | GitHub agent persona for DX component work                                                                               |

Closest existing component under `src/components/Pega_Extensions_<Name>/` is also a primary source of truth. Reuse its structure before introducing a new pattern.

---

## Non-negotiable rules

1. **Do not invent Pega APIs.** Verify against repo usage or official docs.
2. **Prefer Cosmos.** Use `@pega/cosmos-react-core` and existing dependencies; do not add third-party UI libraries.
3. **Source only by default.** Edit `src/` (and docs). Do not hand-edit generated `Pega_Extensions/` or `store/` artifacts unless explicitly asked.
4. **Launchpad-safe by default.** Components that use data, actions, or case identity must follow [LAUNCHPAD_VS_PLATFORM.md](./LAUNCHPAD_VS_PLATFORM.md):
   - Use `getMappedKey` from `src/components/shared/utils.ts` for property names, data-page names, and local-action / flow-type names.
   - Do **not** hard-code `pyID`, `pzInsKey`, `pxObjClass`, `pyStatusWork`, `pyLabel`, etc. as runtime object keys.
   - Read case context via `PCore.getConstants().CASE_INFO.*`, not hard-coded paths like `caseInfo.businessID`.
   - Navigate with `getActionsApi()` and `PCore.getSemanticUrlUtils()` — never hand-build URLs.
   - Gate optional Platform-only REST DX APIs with `PCore.getRestClient().doesRestApiExist('…')`, or mark the component unsupported on Launchpad.
   - Do **not** use `if (isLaunchpad)` when key mapping or capability detection can solve the difference.
5. **Stub PCore fully in Storybook/tests** for every helper the component calls (`getNameSpaceUtils`, `getKeyMapping`, `getData*`, Semantic URL utils, `doesRestApiExist`, …).
6. **Match field-component conventions** when applicable: `hideLabel` public API, boolean `disabled`/`readOnly`/`required` with string `'true'` coercion, `getPConnect?: any`, `withConfiguration`, `../shared/create-nonce`.

---

## Typical workflow

1. Load the `pega-dx-component-builder` skill (under `.github/skills/`) when creating or extending a component.
2. Find the closest existing component and mirror its files: `index.tsx`, `config.json`, `Docs.mdx`, `demo.stories.tsx`, `demo.test.tsx`, optional `styles.ts` / `localizations.json`.
3. Implement the smallest viable PConnect/PCore integration; apply Launchpad mapping rules above.
4. Register discoverability via `src/component-list.json` when adding a new component (treat other list/bundle outputs as generated unless asked).
5. Validate with `npm run lint` and relevant `npm run test` (or report what was skipped).
6. Update `Component_Build_Guide.md` Launchpad support status if it changed.

---

## Validation commands

```bash
npm run lint
npm run fix          # when formatting/lint autofix is appropriate
npm run test         # or a targeted Jest path
npm run start        # Storybook, when UI verification is needed
```

---

## Out of scope unless requested

- Committing, pushing, or opening PRs without an explicit user request
- Editing release ZIPs / `store/` packaging outputs
- Expanding scope beyond the requested component or doc change

When uncertain about a PCore API’s Launchpad availability, prefer the patterns in `LAUNCHPAD_VS_PLATFORM.md` and existing components (`CardGallery`, `KanbanBoard`, `Calendar`, `UtilityList`, `NetworkDiagram`) over guessing.
