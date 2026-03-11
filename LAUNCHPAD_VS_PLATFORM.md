# Launchpad vs Pega Platform: Differences for Component Authors

Components in this gallery run in **both** Pega Platform and **Launchpad**. This document only covers **differences** between the two environments that affect how you write components. For general component best practices, see [best practices.md](./best%20practices.md).

---

## 1. IDs and keys

| Concept        | Pega Platform       | Launchpad / other contexts |
| -------------- | ------------------- | -------------------------- |
| Case/work ID   | Often `pyID`        | May be `businessID`, `ID`, or another mapped key |
| Internal key   | Often `pzInsKey`    | May be `ID` or a different internal identifier   |
| Class name     | Often `pxObjClass`   | May be exposed as `class` or another property     |

**Implications:**

- Do **not** hard-code `pyID`, `pzInsKey`, or `pxObjClass` in component logic or URLs.
- Resolve identifiers via **PCore** (e.g. `PCore.getEnvironmentInfo().getKeyMapping(...)`) or via props/configuration provided by the host.
- Use PCore actions (`openWorkByHandle`, `createWork`, etc.) and pass the identifiers they expect; let the runtime map them per environment.

---

## 2. Rule names (properties, data pages, views)

- **Platform**: Rule names are often used with a default ruleset/namespace.
- **Launchpad**: Namespace/ruleset context can differ; the same logical rule may have a different qualified name.

**Implications:**

- **Always** qualify rule names via namespace utilities (e.g. `PCore.getNameSpaceUtils().getDefaultQualifiedName('<RuleName>')`) for:
  - Properties (e.g. `pyStatusWork`, `pyLabel`)
  - Data pages / data objects
  - Views / sections / field groups
- Do **not** embed application-specific ruleset prefixes in component code; keep components reusable and let configuration/PCore resolve the correct qualified name.

---

## 3. Response and data shape

- **Platform**: REST and data APIs return a certain envelope (e.g. `data`, `content`, caseInfo).
- **Launchpad**: Envelope and property paths can differ.

**Implications:**

- Do **not** depend on raw REST response shape. Use **PCore data APIs** only:
  - `PCore.getDataApiUtils().getData()`, `getDataObjectView()`, `getCaseEditLock()`, `updateCaseEditFieldsData()`
  - `PCore.getUserApi().getOperatorDetails()`
  - `PCore.getViewResources().fetchViewResources()`
- In Storybook/tests, stub these helpers with the minimal shape your component needs so the same story works for both Platform and Launchpad.

---

## 4. Navigation and actions

- **Platform**: Actions resolve to Platform-specific URLs and APIs.
- **Launchpad**: The same logical action may map to different routes or backend APIs.

**Implications:**

- Do **not** build URLs or router targets by hand. Use:
  - `getPConnect().getActionsApi()` (e.g. `openWorkByHandle`, `openLocalAction`, `createWork`)
  - `PCore.getSemanticUrlUtils().getActions()` (e.g. `ACTION_OPENWORKBYHANDLE`)
- Pass only the logical identifiers and class; let PCore (and the host) translate them per environment.

---

## 5. Case metadata and property names

- **Platform**: Common properties include `pyStatusWork`, `pyLabel`, `pxCreateOpName`, `pyDueDate`, etc.
- **Launchpad**: The same concepts may be exposed under different property names or via a different view/model.

**Implications:**

- Prefer mapping case data to a **neutral shape** (e.g. `status`, `title`, `description`, `assignee`, `dueDate`) inside the component, and perform the “property name → neutral field” mapping at the boundary using PCore or configuration.
- Use localization/label utilities (`PCore.getLocaleUtils()`, `getPConnect().getLocalizedValue()`) so labels are not tied to a single environment’s property names.

---

## 6. Styling and theming

- Layout and theming should **behave the same** in both environments. Do not add environment-specific CSS or theme branches (e.g. “only in Launchpad”); use Constellation design tokens and a single theme so the component looks and behaves consistently.

---

## 7. Storybook and tests

- Stories and mocks should support **both** environments:
  - Stub `getEnvironmentInfo().getKeyMapping`, `getNameSpaceUtils().getDefaultQualifiedName`, and any data/action APIs your component uses.
  - Mock data can include both Platform-style fields (`pyID`, `pzInsKey`, `pyStatusWork`) and Launchpad-style aliases; components should consume them only via abstractions (e.g. resolved keys, normalized props), not by reading a single environment’s fields directly.
- When testing, verify that **abstractions** (e.g. key mapping, namespacing, data access) are used and that the component still behaves correctly when keys or response shapes differ.

---

## 8. Configuration over environment checks

- Prefer **configuration and PCore** to resolve environment differences (IDs, rule names, data shape) rather than `if (isLaunchpad)` or similar branches in component code. That keeps a single code path and makes the component robust to future environment changes.
