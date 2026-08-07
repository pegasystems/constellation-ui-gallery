# Launchpad vs Pega Platform: Differences for Component Authors

Components in this gallery run in **both** Pega Platform and **Launchpad**. This document only covers **differences** between the two environments that affect how you write components. For general component best practices, see [best practices.md](./best%20practices.md). For folder layout and scaffolding, see [Component_Build_Guide.md](./Component_Build_Guide.md).

---

## Canonical helper: `getMappedKey`

Almost every Launchpad-safe change in this gallery goes through one shared helper:

```ts
// src/components/shared/utils.ts
export function getMappedKey(key: string): string {
  const namespacedKey = (window as any).PCore.getNameSpaceUtils().getDefaultQualifiedName(key);
  const mappedKey = (window as any).PCore.getEnvironmentInfo().getKeyMapping(namespacedKey);
  return mappedKey || namespacedKey;
}
```

**Always prefer `getMappedKey(...)`** over calling `getDefaultQualifiedName` / `getKeyMapping` inline. It:

1. Qualifies the rule/property name for the current namespace.
2. Maps Platform identifiers (for example `pyID`) to Launchpad equivalents (for example `businessID` / `ID`) when a mapping exists.
3. Falls back to the namespaced key when no mapping is registered.

Use it for:

| Use case                        | Example                                                              |
| ------------------------------- | -------------------------------------------------------------------- |
| Case / work IDs in data rows    | `item[getMappedKey('pyID')]`, `item[getMappedKey('pzInsKey')]`       |
| Class / status / label fields   | `item[getMappedKey('pxObjClass')]`, `item[getMappedKey('pyLabel')]`  |
| Data page / data object names   | `getData(getMappedKey(dataPage), …)`                                 |
| Designer-configured field names | `getMappedKey(rawStartTimeProperty \|\| 'StartTime')`                |
| Local action / flow type names  | `getMappedKey('pyStartCase')`, `getMappedKey('pyUpdateCaseDetails')` |
| Field updates on the case       | `updateFieldValue('.' + getMappedKey('pyLatLon'), value)`            |
| Data-view / filter field lists  | `{ field: getMappedKey('pyStatusWork') }`                            |

Do **not** hard-code `pyID`, `pzInsKey`, `pxObjClass`, `pyStatusWork`, `pyLabel`, `pyGUID`, etc. when reading or writing runtime data.

---

## 1. IDs and keys

| Concept      | Pega Platform      | Launchpad / other contexts                       |
| ------------ | ------------------ | ------------------------------------------------ |
| Case/work ID | Often `pyID`       | May be `businessID`, `ID`, or another mapped key |
| Internal key | Often `pzInsKey`   | May be `ID` or a different internal identifier   |
| Class name   | Often `pxObjClass` | May be exposed as `class` or another property    |

**Implications:**

- Resolve identifiers with `getMappedKey('pyID')`, `getMappedKey('pzInsKey')`, `getMappedKey('pxObjClass')`.
- When reading the **current case ID from context**, prefer PCore constants, not string paths:

  ```ts
  const caseId = getPConnect().getValue((window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID);
  ```

  Avoid hard-coded paths such as `'caseInfo.businessID'` or `'.pyID'` unless you are intentionally reading a host-provided path that is already environment-neutral.

- Use PCore actions (`openWorkByHandle`, `createWork`, `showCasePreview`, etc.) and pass the identifiers they expect; let the runtime map them per environment.

---

## 2. Rule names (properties, data pages, views, local actions)

- **Platform**: Rule names are often used with a default ruleset/namespace.
- **Launchpad**: Namespace/ruleset context can differ; the same logical rule may have a different qualified name.

**Implications:**

- Pass **every** rule-like name through `getMappedKey(...)` (or at minimum `getDefaultQualifiedName`):
  - Properties (`pyStatusWork`, `pyLabel`, `IsSelected`, …)
  - Data pages / data objects (`D_MyList`, configured `dataPage` props)
  - Views / sections / field groups
  - Local actions / flow types (`pyStartCase`, `pyUpdateCaseDetails`)
- Do **not** embed application-specific ruleset prefixes in component code.

```ts
// Good
PCore.getDataApiUtils().getData(getMappedKey(dataPage), payload, context);

// Good – local action / create work
actionsApi.openLocalAction(getMappedKey('pyUpdateCaseDetails'), options);
actionsApi.createWork(className, { flowType: getMappedKey('pyStartCase'), … });

// Bad
PCore.getDataApiUtils().getData('D_MyList', payload);
actionsApi.openLocalAction('pyUpdateCaseDetails', options);
```

---

## 3. Response and data shape

- **Platform**: REST and data APIs return a certain envelope (e.g. `data`, `content`, caseInfo).
- **Launchpad**: Envelope and property paths can differ.

**Implications:**

- Do **not** depend on raw REST response shape. Use **PCore data APIs** only:
  - `PCore.getDataApiUtils().getData()`, `getDataObjectView()`, `getCaseEditLock()`, `updateCaseEditFieldsData()`
  - `PCore.getDataPageUtils().getPageDataAsync()` (also pass mapped data-page names and parameters)
  - `PCore.getUserApi().getOperatorDetails()`
  - `PCore.getViewResources().fetchViewResources()` / `updateViewResources()`
- When iterating results, read fields with mapped keys:

  ```ts
  const pyID = getMappedKey('pyID');
  const pyLabel = getMappedKey('pyLabel');
  response.data.data.forEach((item: any) => {
    tasks.push({ id: item[pyID], title: item[pyLabel] });
  });
  ```

- In Storybook/tests, stub these helpers with the minimal shape your component needs so the same story works for both Platform and Launchpad.

---

## 4. APIs that may be missing in Launchpad

Some Platform DX APIs are **not implemented** (or not registered) in Launchpad. Do **not** assume every `PCore` method exists.

### Capability detection (preferred over `if (isLaunchpad)`)

```ts
const canReadDataObject = (window as any).PCore.getRestClient().doesRestApiExist('readDataObject');

if (!canReadDataObject) {
  // Launchpad-safe fallback – e.g. list data page + FieldValueList
  return loadStaticDetails(props);
}

// Platform path – getDataObjectView + createPConnect view
return loadDetailsViaDataObjectView(props);
```

Reference implementations: `Pega_Extensions_CardGallery/utils.ts`, `Pega_Extensions_KanbanBoard/utils.ts`.

### Practical guidance

| Prefer / check                                               | Avoid in shared components                                  |
| ------------------------------------------------------------ | ----------------------------------------------------------- |
| `doesRestApiExist('…')` before calling optional REST DX APIs | `if (isLaunchpad)` / env-name branches                      |
| `getData` + mapped parameters when object-view APIs missing  | Calling `getDataObjectView` unconditionally                 |
| `getActionsApi()` / Semantic URL utils                       | Hand-built Infinity URLs or Launchpad routes                |
| Mapped property access on list rows                          | Assuming `pyNodes` / `pyEdges` / `pyID` keys exist unmapped |

If an API is required and has no Launchpad equivalent, document the component as **not Launchpad-supported** (see the Launchpad column in [Component_Build_Guide.md](./Component_Build_Guide.md)) rather than shipping a broken path.

---

## 5. Navigation and actions

- **Platform**: Actions resolve to Platform-specific URLs and APIs.
- **Launchpad**: The same logical action may map to different routes or backend APIs.

**Implications:**

- Do **not** build URLs or router targets by hand. Use:
  - `getPConnect().getActionsApi()` — `openWorkByHandle`, `openLocalAction`, `createWork`, `showCasePreview`, `updateFieldValue`
  - `PCore.getSemanticUrlUtils().getActions()` / `getResolvedSemanticURL()` — e.g. `ACTION_OPENWORKBYHANDLE`
- Pass only logical identifiers and class (resolved via `getMappedKey`); let PCore translate them per environment.

```ts
const pzInsKey = getMappedKey('pzInsKey');
const pxObjClass = getMappedKey('pxObjClass');
const pyID = getMappedKey('pyID');

const linkURL = PCore.getSemanticUrlUtils().getResolvedSemanticURL(
  PCore.getSemanticUrlUtils().getActions().ACTION_OPENWORKBYHANDLE,
  { caseClassName: item[pxObjClass] },
  { workID: item[pyID] },
);

actionsApi.openWorkByHandle(item[pzInsKey], item[pxObjClass]);
```

---

## 6. Case metadata and property names

- **Platform**: Common properties include `pyStatusWork`, `pyLabel`, `pxCreateOpName`, `pyDueDate`, etc.
- **Launchpad**: The same concepts may be exposed under different property names or via a different view/model.

**Implications:**

- Map case/list data to a **neutral shape** inside the component (`id`, `title`, `status`, `insKey`, `classname`, …) at the boundary using `getMappedKey`.
- Designer-configured property **names** (date field, group-by field, lat/long field, …) must also be passed through `getMappedKey` before use as object keys or `updateFieldValue` targets.
- Use localization utilities (`PCore.getLocaleUtils()`, `getPConnect().getLocalizedValue()`) so labels are not tied to a single environment’s property names.

---

## 7. Styling and theming

Layout and theming should **behave the same** in both environments. Do not add environment-specific CSS or theme branches (e.g. “only in Launchpad”); use Constellation design tokens and a single theme so the component looks and behaves consistently.

---

## 8. Storybook and tests

Stories and mocks must support **both** environments. Whenever a component imports `getMappedKey` (or otherwise touches namespace / key mapping / optional REST APIs), stub at least:

```ts
(window as any).PCore = {
  getConstants: () => ({
    CASE_INFO: { CASE_INFO_ID: 'ID' /* … */ },
  }),
  getNameSpaceUtils: () => ({
    getDefaultQualifiedName: (name: string) => name,
  }),
  getEnvironmentInfo: () => ({
    getKeyMapping: (key: string) => key, // identity mapping in Storybook
  }),
  getRestClient: () => ({
    doesRestApiExist: () => true, // or false to exercise Launchpad fallback
  }),
  getDataApiUtils: () => ({/* getData, getDataObjectView, … */}),
  getSemanticUrlUtils: () => ({
    getActions: () => ({ ACTION_OPENWORKBYHANDLE: 'openWorkByHandle' }),
    getResolvedSemanticURL: () => '',
  }),
  // …other helpers the component calls
};
```

**Guidelines:**

- Mock payloads may still use Platform-style field names (`pyID`, `pzInsKey`, …) when the stub’s `getKeyMapping` is identity.
- Optionally add a story/test where `getKeyMapping` remaps keys (e.g. `pyID` → `businessID`) to prove the component does not read raw Platform keys.
- Stub `doesRestApiExist` both `true` and `false` when the component has a Launchpad fallback path.
- Verify abstractions are used: no direct `item.pyID` / `item.pzInsKey` in production component code after the mapping boundary.

---

## 9. Configuration over environment checks

Prefer **configuration, `getMappedKey`, and capability checks** (`doesRestApiExist`) over `if (isLaunchpad)` (or similar) branches. That keeps a single primary code path and stays robust as Launchpad and Platform APIs converge.

---

## 10. Quick checklist (Launchpad-safe)

Before merging a component change that touches data, actions, or case identity:

- [ ] No hard-coded `pyID` / `pzInsKey` / `pxObjClass` / `pyStatusWork` / `pyLabel` (etc.) as object keys in runtime logic
- [ ] Data page, local action, and flow-type names go through `getMappedKey` (or `getDefaultQualifiedName`)
- [ ] Current case id comes from `PCore.getConstants().CASE_INFO.*`, not a hard-coded path
- [ ] Navigation uses Actions API + Semantic URL utils (no hand-built URLs)
- [ ] Optional Platform-only APIs are gated with `doesRestApiExist` (or the component is marked unsupported on Launchpad)
- [ ] Storybook stubs include `getNameSpaceUtils`, `getEnvironmentInfo().getKeyMapping`, and any REST/data helpers used
- [ ] No `isLaunchpad` feature switches for behavior that key mapping or capability detection can solve

---

## See also

- [best practices.md](./best%20practices.md) — general DX component practices
- [Component_Build_Guide.md](./Component_Build_Guide.md) — scaffolding and Launchpad support column
- [AGENTS.md](./AGENTS.md) — instructions for coding agents working in this repo
- `.github/skills/pega-dx-component-builder/` — GitHub agent skill for building components
