# CPQTree (Pega_Extensions_CPQTree) — Design Document

## 1. Purpose

`Pega_Extensions_CPQTree` renders a CPQ (Configure–Price–Quote) product configuration tree inside Constellation UI.

It:

- Loads a CPQ “Tree” (or “TreeGroup”) response from a Pega data page.
- Normalizes and annotates the response so individual quantities and configuration fields are _editable_ via PCore.
- Renders a hierarchical, expandable master list of Products → Main Spec → Configuration Fields + Child Specs.
- Optionally renders a Details panel that shows a Constellation view for the selected product/spec.

This document describes the implementation as shipped in `version: 4.0.1` (see [src/components/Pega_Extensions_CPQTree/config.json](config.json)).

## 2. Scope and Non‑Goals

**In scope**

- Tree traversal and view-model creation (`useTreeBuilder`, `utils.ts`).
- Field editing (quantity and config fields) and persistence via data page (`useTreeActions`).
- Expansion state and controlled field values (`useExpandedState`, `useFieldValues`).
- Optional details view loading with transient context (`loadDetails`).

**Non‑goals (by design)**

- Virtualization for very large trees.
- Persisting unsaved changes outside the component lifecycle.
- Advanced validation / error recovery UX (beyond basic progress indicator + console warnings).

## 3. Runtime Environment

The component is designed to run inside a Pega Constellation runtime where the global `window.PCore` API exists.

Key PCore dependencies:

- `PCore.getDataApiUtils().getData(dataPage, payload)` for loading and saving.
- `PCore.getContextTreeManager()` for pagelist + view node registration.
- `PCore.createPConnect(messageConfig)` and `getPConnect()` for dispatching store updates.
- `PCore.getViewResources()` and `getDataObjectView()` for details panel view loading.

In Storybook, `demo.stories.tsx` provides a lightweight `window.PCore` mock so the component can render and basic interactions can be exercised without a running Infinity server.

UI framework:

- Uses Cosmos React Core components (`@pega/cosmos-react-core`) and styled-components.

## 4. Component Surface Area

### 4.1 Main Export

The main React component is exported as `PegaExtensionsCPQTree` and wrapped by `withConfiguration`.

- Implementation: [src/components/Pega_Extensions_CPQTree/index.tsx](index.tsx)

### 4.2 Props

`CPQTreeProps` (from [src/components/Pega_Extensions_CPQTree/index.tsx](index.tsx)):

- `heading?: string`
  - Heading text shown above the tree. Defaults to a localized value: `getPConnect().getLocalizedValue('Site independent products')`.
- `dataPage: string` (**required**)
  - Data page name used to load the CPQ tree. Also reused as the “save” endpoint by sending a `changes` payload.
- `childrenPropertyName?: string | RegExp`
  - Pattern used to find child arrays when traversing the server response.
  - Default is `'Tree|Configuration'` which is treated as a regex.
- `displayPropertyName?: string`
  - Display property for product/spec labeling (default `'Name'`).
- `idPropertyName?: string`
  - Identifier property for product nodes (default `'ProductID'`), used in some ID extraction paths.
- `showDetailsInfo?: boolean`
  - If `true`, enables a right-side details panel and makes product/spec labels clickable to load details.
- `readOnly?: boolean`
  - If `true`, disables editing and renders values as text.
- `detailsDataPage?: string`
  - Data page used by `getDataObjectView` for details meta (default `'D_Details'`).
- `detailsViewName?: string`
  - Constellation view name to render in the details panel (default `'InfoDetails'`).
- `getPConnect: any`
  - Standard Pega DX integration entrypoint.

### 4.3 Component Configuration (Builder)

The builder metadata is defined in [src/components/Pega_Extensions_CPQTree/config.json](config.json). Important fields:

- `componentKey`: `Pega_Extensions_CPQTree`
- `type`: `Field` (subtype `Text`) — this is a DX catalog classification.
- Properties exposed:
  - `heading`, `dataPage`, `childrenPropertyName`, `showDetailsInfo`, `detailsDataPage`, `detailsViewName`, `readOnly`, plus standard visibility.
- Defaults:
  - `childrenPropertyName: "Tree|Configuration"`
  - `detailsDataPage: "D_Details"`
  - `detailsViewName: "InfoDetails"`

## 5. Data Model

### 5.1 Input Shapes

The component supports multiple server response shapes (see sample JSONs):

- **Tree root**: `response.Tree: any[]` (e.g., sample1, sample2)
- **TreeGroup root**: `response.TreeGroup: any[]` (e.g., sample3)
- **Single root node**: `response` itself is treated as a node if no array root is found.

The CPQ tree typically includes:

- `Type: 'site' | 'product'`
- A site node with `ID: 'NoSite'` and nested products in `.Tree`.
- Product nodes with `ProductOffer` containing:
  - `ChildSpecificationsList` where the **first item** is treated as the **main child spec**.
  - Each spec can have `Configuration` array and nested `ChildSpecificationsList`.

### 5.2 Canonical Identifiers

Several identifier fields exist across the shapes:

- Site/product node IDs: `ID` and sometimes `ProductID`.
- Spec IDs: `pyID` and/or `SpecID`.

The component generally uses:

- Product key: `extractProductId(product)` → `product.ID || product[idPropertyName] || fallback`.
- Child spec key for details: `pyID || SpecID || generatedId`.

### 5.3 View-Model Nodes

Tree nodes are represented by `CustomTreeNode`:

- Definition: [src/components/Pega_Extensions_CPQTree/CustomTree.types.ts](CustomTree.types.ts)
- Extends Cosmos `TreeNode`, and adds:
  - `nodes?: CustomTreeNode[]` (children)
  - `label`, `href`, `id`, `objclass`
  - `itemData?: any` (raw backing object)

The top-level render path in `index.tsx` does not render a Cosmos Tree widget; it renders a custom list that consumes the `objects: CustomTreeNode[]` created by the tree builder.

## 6. High-Level Architecture

### 6.1 Major Modules

- **UI Entry**: [src/components/Pega_Extensions_CPQTree/index.tsx](index.tsx)
  - Orchestrates hooks, renders product rows, and optionally the details panel.

- **Tree builder**: [src/components/Pega_Extensions_CPQTree/hooks/useTreeBuilder.ts](hooks/useTreeBuilder.ts)
  - Converts raw CPQ objects into `CustomTreeNode[]`.
  - For product nodes, injects a synthetic “configuration section” node.
  - Builds/sets property paths used for PCore integration.

- **Data loader**: [src/components/Pega_Extensions_CPQTree/hooks/useCPQTreeData.ts](hooks/useCPQTreeData.ts)
  - Fetches the data page, finds root arrays, locates “site node” if present.
  - Invokes the tree builder.
  - Initializes expanded state + controlled field values on first load.
  - Exposes `reloadTree(updatedData?)` for post-save refresh.

- **State hooks**:
  - Expanded sets: [src/components/Pega_Extensions_CPQTree/hooks/useExpandedState.ts](hooks/useExpandedState.ts)
  - Controlled values map: [src/components/Pega_Extensions_CPQTree/hooks/useFieldValues.ts](hooks/useFieldValues.ts)

- **Action/persistence hook**: [src/components/Pega_Extensions_CPQTree/hooks/useTreeActions.ts](hooks/useTreeActions.ts)
  - Updates local state.
  - Dispatches updates into PCore store.
  - Persists changes by calling the same data page with `dataViewParameters.changes`.
  - Reloads the tree using returned updated data.

- **Details loader**: `loadDetails` in [src/components/Pega_Extensions_CPQTree/utils.ts](utils.ts)
  - Loads Constellation view resources once per view name.
  - Renders the view into a transient context using node data from the tree.

### 6.2 Flow Overview

```mermaid
flowchart TD
  A[Render PegaExtensionsCPQTree] --> B[useCPQTreeData loads dataPage]
  B --> C[useTreeBuilder.loadTree builds CustomTreeNode[]]
  C --> D[initialize fieldValues + expanded sets]
  D --> E[Render ProductRow list]
  E --> F[User edits quantity or config]
  F --> G[useTreeActions: updateFieldValue + dispatch to PCore]
  G --> H[save via dataPage with changes payload]
  H --> I[reloadTree(updatedData) -> rebuild nodes]

  E --> J[User clicks details]
  J --> K[findNodeById -> nodeData]
  K --> L[loadDetails -> transient view component]
```

## 7. Data Loading and Tree Construction

### 7.1 Root Discovery

`useCPQTreeData` finds the correct root array using `findRootTree`:

- Tries `childrenPropertyName` (string treated as regex) to find a matching array.
- Falls back to `response.Tree` or `response.pxResults`.

Then it optionally detects a **site node** (via `findSiteNode`) and, if present, processes only its `.Tree` products.

TreeGroup nuance:

- If the response has `TreeGroup`, `useCPQTreeData` sets the `parentPath` to `TreeGroup[siteIndex]` so property-path building can produce correct paths.

### 7.2 Tree Traversal and Node IDs

`useTreeBuilder.loadTree`:

- Uses a `WeakSet` (`visitedItems`) to avoid circular recursion.
- Uses a hard cap `MAX_DEPTH` (100).
- Generates stable-ish node IDs via `generateNodeId` with fallbacks and (optionally) index suffix.

### 7.3 Special Handling for Product Nodes

When `item.Type === 'product'`, the builder:

1. Extracts or normalizes `ProductOffer` (supports alternate `.Tree[0].ChildSpecification` shape).
2. Calls `buildProductPropertyPaths(item, currentPath)` to add `pxPropertyPath` on:
   - ProductOffer and other quantity-bearing objects
   - Leaf config items (points at `.ConfiguredFieldValue`)
   - Leaf spec quantities (points at `.quantity`)
3. Calls `findAndRegisterPageLists(processedProductOffer, productOfferPath, getPConnect)` so editable property paths are registered with PCore.
4. Creates a **synthetic “Configuration” node** under the product with child nodes for:
   - Each config field in `mainChildSpec.Configuration`
   - Each child spec in `mainChildSpec.ChildSpecificationsList`

This synthetic node is a view-model convenience; the rendered UI mostly uses `ProductRow` and reads directly from `product.itemData.ProductOffer`.

### 7.4 Why Property Paths Matter

PCore updates need correct “view nodes” and “pagelist nodes” registered so Constellation can bind and update list properties.

The implementation sets `pxPropertyPath` values and then registers view nodes for those paths.

- Path generation uses **0-based indexes** and bracket notation (e.g., `TreeGroup[0].Tree[0].ProductOffer...`).
- Persistence payload conversion (in `useTreeActions`) converts these paths to Pega’s expected indexing format.

## 8. UI Rendering and Interaction

### 8.1 Layout

The main UI uses a master/details layout:

- Left: product list with nested rows.
- Right: details panel (only if `showDetailsInfo === true`).

Styled containers are defined in [src/components/Pega_Extensions_CPQTree/styles.tsx](styles.tsx).

### 8.2 Rendering Strategy

`index.tsx` renders:

- A header (localized `heading`).
- A list: `objects.map(...)` and renders only nodes where `node.itemData.Type === 'product'` using `ProductRow`.

`ProductRow` renders:

- Product header row (expand/collapse product section).
- Optional config header row (expand/collapse config section) unless the main spec name duplicates the product name.
- Main spec row (optional) and its config fields.
- Child specs as nested `ChildSpecRow` components.
- “Extra” configuration groups collected from top-level specs beyond the main spec.

Child specs can recursively render:

- Quantity (only if spec has no children).
- Nested config fields.
- Nested child specs.

### 8.3 Controlled Field Values

The UI uses a local `Map<string,string>` of controlled values (`useFieldValues`).

Field ID conventions:

- Main spec quantity: `${configSectionId}-main-spec`
- Config fields: `generateConfigFieldId(configSectionId, index)`
- Child specs: `generateChildSpecId(configSectionId, index)`
- Nested child spec config fields: `${childSpecId}-field-${configIndex}`

This design decouples the UI from raw data mutation timing, and enables immediate UI response even when persistence is async.

### 8.4 Expansion State

`useExpandedState` maintains three sets:

- `expandedProducts`
- `expandedConfigSections`
- `expandedChildSpecs`

On first load, `useCPQTreeData` expands all products and config sections by default.

## 9. Editing, Persistence, and Reload

### 9.1 Two Update Channels

When a user changes a value, the component updates through two channels:

1. **Local controlled state**

- `updateFieldValue(fieldId, value)` to update the UI.

2. **PCore + server persistence**

- Dispatch to PCore store (if present) using `actions.updateFieldValue()` and `actions.triggerFieldChange()`.
- Call the same `dataPage` with a `changes` payload to persist and re-evaluate business rules.

### 9.2 Change Tracking

`useTreeActions` accumulates all user edits since mount in a `Map<changePath, {path,value}>`.

- Multiple edits to the same path overwrite the previous value.
- When `dataPage` changes, the accumulated change set is cleared.

### 9.3 Path Conversion for Save

The tree builder emits JS-style paths with 0-based indices:

- Example: `TreeGroup[0].Tree[0].ProductOffer.ChildSpecificationsList[5].quantity`

The save API expects Pega’s 1-based list addressing for some lists:

- `Tree[0]` becomes `Tree(1)`
- `ChildSpecificationsList[5]` becomes `ChildSpecificationsList(6)`
- `Configuration[2]` becomes `Configuration[3]` but remains in brackets (implementation choice)

This conversion is implemented in `buildChangePath` in [src/components/Pega_Extensions_CPQTree/hooks/useTreeActions.ts](hooks/useTreeActions.ts).

Config field updates:

- `pxPropertyPath` points to `.ConfiguredFieldValue`.
- `buildChangePath(..., isConfigField=true)` appends `.FieldValue`.

### 9.4 Reload Strategy

After saving, the data page returns an updated tree. The component calls:

- `reloadTree(updatedTreeData)`

This causes:

- Rebuild of `CustomTreeNode[]` using the latest server-side structure.
- Minimal UI disruption: expansion state and controlled values remain in React state.

## 10. Details Panel Design

### 10.1 Entry

If `showDetailsInfo` is enabled:

- Product name becomes a link-like button.
- Child spec label becomes a link-like button (only when the spec has children).

Clicking calls `handleLoadDetails(key)` in `index.tsx`.

### 10.2 Node Lookup

Before loading details, the component finds the selected node’s data using:

- `findNodeById(objects, key)`

`findNodeById` searches:

- Node `itemData.ID`, `pyID`, `SpecID`, `ProductID`.
- If product: searches `ProductOffer.ChildSpecificationsList` recursively.
- If the Tree structure contains `LineItem`, it merges it into the found spec.

### 10.3 View Rendering (Transient Context)

`loadDetails` uses a transient context pattern:

- First call per `detailsViewName`:
  - Calls `getDataObjectView(detailsDataPage, detailsViewName, { caseInstanceKey: id })` to fetch view meta.
  - Updates view resources and caches the viewName.
- Every call:
  - Creates/updates a transient item with `data: { content: nodeData }`.
  - Creates a PConnect environment using that transient context.
  - Calls `createComponent(meta)` to render the view.

The returned element is stored in `detailsContent` state and rendered in the right panel.

## 11. Styling and Accessibility

### 11.1 Styling

- Uses `styled-components` wrappers around Cosmos primitives.
- Indentation uses `TREE_CONSTANTS.DEPTH_INDENT` (24px per depth).
- Some colors are hard-coded (e.g., border colors, select border) in [src/components/Pega_Extensions_CPQTree/constants.ts](constants.ts) and [src/components/Pega_Extensions_CPQTree/styles.tsx](styles.tsx).

### 11.2 Accessibility

Key a11y choices:

- Expand/collapse icons are clickable; child spec quantity dropdowns are aria-labeled via `ariaLabelledById` bound to the visible spec label.
- Config field controls use the visible field name span as the accessible name (`aria-labelledby`).
- Storybook disables the `nested-interactive` a11y rule due to nested buttons/interactive regions.

Potential caveat:

- Some rows use a `Button variant='link'` wrapping text; ensure nested interactive controls do not end up inside the same clickable region.

## 12. Performance Considerations

- Tree building is recursive with a `WeakSet` and `MAX_DEPTH` protection.
- Controlled values are stored in a `Map`, and updates clone the map (expected for React state).
- `useCPQTreeData` contains request de-duping and abort logic to avoid stale updates.
- There is no virtualization; very large trees will increase DOM size and render time.

## 13. Testing and Storybook

- Story: [src/components/Pega_Extensions_CPQTree/demo.stories.tsx](demo.stories.tsx)
  - Provides 3 sample datasets (`sample1.json`, `sample2.json`, `sample3.json`).
  - Mocks key PCore behaviors (data fetch, view rendering) to enable Storybook interaction.

- Test: [src/components/Pega_Extensions_CPQTree/demo.test.tsx](demo.test.tsx)
  - Smoke test that renders the Default story and asserts the heading and one product/spec label.

- Docs: [src/components/Pega_Extensions_CPQTree/Docs.mdx](Docs.mdx)
  - Minimal: component overview + props.

## 14. Packaging / Distribution

This repository appears to include built extension artifacts under:

- `Pega_Extensions/4.0.1/` (e.g., bundled JS, manifest, maps)
- `store/Pega_Extensions/4.0.1/` (config mirrors)

The source of truth for behavior is the `src/components/Pega_Extensions_CPQTree/*` folder; the built artifacts correspond to the packaged extension version.

## 15. Known Constraints and Edge Cases

- `childrenPropertyName` is treated as a regex when it’s a string. For default `'Tree|Configuration'`, this can match multiple keys; traversal relies on `visitedItems` to prevent loops.
- Some data shapes store `ProductOffer` under a Tree/ChildSpecification structure; `extractProductOffer` bridges this.
- For config and spec objects that don’t have `pxPropertyPath`, UI rows attempt to synthesize one from the parent spec’s path.
- Save path conversion uses mixed list addressing: parentheses for Tree and ChildSpecificationsList, brackets for Configuration.

## 16. Appendix: Key File Map

- Entry + orchestration: [src/components/Pega_Extensions_CPQTree/index.tsx](index.tsx)
- Hooks:
  - [src/components/Pega_Extensions_CPQTree/hooks/useCPQTreeData.ts](hooks/useCPQTreeData.ts)
  - [src/components/Pega_Extensions_CPQTree/hooks/useTreeBuilder.ts](hooks/useTreeBuilder.ts)
  - [src/components/Pega_Extensions_CPQTree/hooks/useTreeActions.ts](hooks/useTreeActions.ts)
  - [src/components/Pega_Extensions_CPQTree/hooks/useExpandedState.ts](hooks/useExpandedState.ts)
  - [src/components/Pega_Extensions_CPQTree/hooks/useFieldValues.ts](hooks/useFieldValues.ts)
- UI components:
  - [src/components/Pega_Extensions_CPQTree/components/ProductRow.tsx](components/ProductRow.tsx)
  - [src/components/Pega_Extensions_CPQTree/components/ChildSpecRow.tsx](components/ChildSpecRow.tsx)
  - [src/components/Pega_Extensions_CPQTree/components/ConfigFieldRow.tsx](components/ConfigFieldRow.tsx)
  - [src/components/Pega_Extensions_CPQTree/components/FieldComponent.tsx](components/FieldComponent.tsx)
- Utilities + PCore integration: [src/components/Pega_Extensions_CPQTree/utils.ts](utils.ts)
- Constants/types/styles:
  - [src/components/Pega_Extensions_CPQTree/constants.ts](constants.ts)
  - [src/components/Pega_Extensions_CPQTree/CustomTree.types.ts](CustomTree.types.ts)
  - [src/components/Pega_Extensions_CPQTree/styles.tsx](styles.tsx)
