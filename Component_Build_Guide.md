# Component Build & Documentation Guide

> **Welcome to the Confluence of the Constellation UI Gallery** – this file is the one‑stop reference for anyone who wants to add a new Pega extension component to the gallery or understand the structure of an existing one.

---

## 1️⃣ Quick Overview – List of Existing Components

> **Status legend:** blank = actively maintained in the gallery · **Deprecated** = still available, prefer OOB alternative · **Limited** = supported only for narrow / partial use cases

| Component                                   | Short Description                                                                            | Status     | Notes / reason                                                                  | Docs                                                                      | Launchpad Support |
| ------------------------------------------- | -------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | :---------------: |
| **Pega_Extensions_ActionableButton**        | A button that can trigger Pega actions or workflows.                                         |            |                                                                                 | [Docs](./src/components/Pega_Extensions_ActionableButton/Docs.mdx)        |        Yes        |
| **Pega_Extensions_Banner**                  | Displays a banner message, typically for notifications or alerts.                            |            |                                                                                 | [Docs](./src/components/Pega_Extensions_Banner/Docs.mdx)                  |        No         |
| **Pega_Extensions_BannerInput**             | Combines a banner with an input field for quick data entry.                                  | Deprecated | Prefer instruction-text banners in Pega '26                                     | [Docs](./src/components/Pega_Extensions_BannerInput/Docs.mdx)             |        Yes        |
| **Pega_Extensions_BarCode**                 | Generates and scans barcodes.                                                                |            |                                                                                 | [Docs](./src/components/Pega_Extensions_BarCode/Docs.mdx)                 |        No         |
| **Pega_Extensions_Calendar**                | Calendar view for selecting dates, with support for events.                                  |            |                                                                                 | [Docs](./src/components/Pega_Extensions_Calendar/Docs.mdx)                |        Yes        |
| **Pega_Extensions_CameraCapture**           | Lets users take photos using their device camera and save them directly as case attachments. |            |                                                                                 | [Docs](./src/components/Pega_Extensions_CameraCapture/Docs.mdx)           |        No         |
| **Pega_Extensions_CardGallery**             | Displays items in a card‑style gallery layout.                                               | Deprecated | Prefer Insight-based gallery templates in Pega '26                              | [Docs](./src/components/Pega_Extensions_CardGallery/Docs.mdx)             |    In Progress    |
| **Pega_Extensions_CaseLauncher**            | Launches Pega cases or tasks from the UI.                                                    |            |                                                                                 | [Docs](./src/components/Pega_Extensions_CaseLauncher/Docs.mdx)            |        Yes        |
| **Pega_Extensions_CaseReference**           | References a Pega case, showing key details.                                                 | Limited    | Prefer OOB Case Reference except for current-case / custom-ID preview use cases | [Docs](./src/components/Pega_Extensions_CaseReference/Docs.mdx)           |        Yes        |
| **Pega_Extensions_ChatGenAI**               | Integrates generative AI chat into the application.                                          | Deprecated | Prefer Pega Platform agent functionality                                        | [Docs](./src/components/Pega_Extensions_ChatGenAI/Docs.mdx)               |        No         |
| **Pega_Extensions_CheckboxRow**             | A row of checkboxes with optional triggers.                                                  |            |                                                                                 | [Docs](./src/components/Pega_Extensions_CheckboxRow/Docs.mdx)             |        No         |
| **Pega_Extensions_CheckboxTrigger**         | Checkbox that triggers actions on change.                                                    |            |                                                                                 | [Docs](./src/components/Pega_Extensions_CheckboxTrigger/Docs.mdx)         |        No         |
| **Pega_Extensions_CompareTableLayout**      | Displays data in a comparison table format.                                                  |            |                                                                                 | [Docs](./src/components/Pega_Extensions_CompareTableLayout/Docs.mdx)      |        No         |
| **Pega_Extensions_CPQTree**                 | Reads the CPQ Tree structure and displays it in Constellation.                               | Limited    | Read-only; not full CPQ application support                                     | [Docs](./src/components/Pega_Extensions_CPQTree/Docs.mdx)                 |        No         |
| **Pega_Extensions_CustomKPIGauge**          | Gauge widget for a single numeric value from a data page, with zones, target, and legend.    |            |                                                                                 | [Docs](./src/components/Pega_Extensions_CustomKPIGauge/Docs.mdx)          |        Yes        |
| **Pega_Extensions_DisplayAttachments**      | Renders file attachments with download links.                                                |            |                                                                                 | [Docs](./src/components/Pega_Extensions_DisplayAttachments/Docs.mdx)      |        No         |
| **Pega_Extensions_DisplayBrackets**         | Displays tournament brackets from a JSON structure.                                          |            |                                                                                 | [Docs](./src/components/Pega_Extensions_DisplayBrackets/Docs.mdx)         |    In Progress    |
| **Pega_Extensions_DisplayPDF**              | Shows PDF documents inline.                                                                  |            |                                                                                 | [Docs](./src/components/Pega_Extensions_DisplayPDF/Docs.mdx)              |        Yes        |
| **Pega_Extensions_DynamicHierarchicalForm** | Dynamically builds a hierarchical form based on data.                                        |            |                                                                                 | [Docs](./src/components/Pega_Extensions_DynamicHierarchicalForm/Docs.mdx) |        No         |
| **Pega_Extensions_EditableTableLayout**     | Table layout with inline editing capabilities.                                               |            |                                                                                 | [Docs](./src/components/Pega_Extensions_EditableTableLayout/Docs.mdx)     |        No         |
| **Pega_Extensions_FieldGroupAsRow**         | Groups multiple fields into a single row layout.                                             |            |                                                                                 | [Docs](./src/components/Pega_Extensions_FieldGroupAsRow/Docs.mdx)         |        No         |
| **Pega_Extensions_FormFullWidth**           | Expands a form to full width of container.                                                   |            |                                                                                 | [Docs](./src/components/Pega_Extensions_FormFullWidth/Docs.mdx)           |        Yes        |
| **Pega_Extensions_FormWithVerticalStepper** | Vertical Screen flow with navigation                                                         |            |                                                                                 | [Docs](./src/components/Pega_Extensions_FormWithVerticalStepper/Docs.mdx) |        No         |
| **Pega_Extensions_GanttChart**              | Visualizes tasks or events in a Gantt chart.                                                 |            |                                                                                 | [Docs](./src/components/Pega_Extensions_GanttChart/Docs.mdx)              |        No         |
| **Pega_Extensions_HierarchicalFormAsTasks** | Presents hierarchical forms in a task‑list style.                                            |            |                                                                                 | [Docs](./src/components/Pega_Extensions_HierarchicalFormAsTasks/Docs.mdx) |        No         |
| **Pega_Extensions_IframeWrapper**           | Embeds external content within an iframe.                                                    |            |                                                                                 | [Docs](./src/components/Pega_Extensions_IframeWrapper/Docs.mdx)           |        No         |
| **Pega_Extensions_ImageCarousel**           | Carousel for images with navigation controls.                                                |            |                                                                                 | [Docs](./src/components/Pega_Extensions_ImageCarousel/Docs.mdx)           |        No         |
| **Pega_Extensions_ImageMagnify**            | Magnifies images on hover or click.                                                          |            |                                                                                 | [Docs](./src/components/Pega_Extensions_ImageMagnify/Docs.mdx)            |        No         |
| **Pega_Extensions_JawLayout**               | Displays an interactive jaw like structure.                                                  |            |                                                                                 | [Docs](./src/components/Pega_Extensions_JawLayout/Docs.mdx)               |        No         |
| **Pega_Extensions_KanbanBoard**             | Kanban board layout for task management.                                                     |            |                                                                                 | [Docs](./src/components/Pega_Extensions_KanbanBoard/Docs.mdx)             |    In Progress    |
| **Pega_Extensions_LangSwitch**              | Language and timezone preference panel.                                                      | Deprecated | Prefer language switch via the operator menu in Pega '26                        | [Docs](./src/components/Pega_Extensions_LangSwitch/Docs.mdx)              |        No         |
| **Pega_Extensions_Map**                     | Displays maps with markers and overlays.                                                     |            |                                                                                 | [Docs](./src/components/Pega_Extensions_Map/Docs.mdx)                     |        No         |
| **Pega_Extensions_MarkdownInput**           | Text area that supports Markdown formatting.                                                 |            |                                                                                 | [Docs](./src/components/Pega_Extensions_MarkdownInput/Docs.mdx)           |        No         |
| **Pega_Extensions_MaskedInput**             | Input field with masking (e.g., phone, SSN).                                                 | Deprecated | Prefer OOB formatted inputs on form fields in Pega '26                          | [Docs](./src/components/Pega_Extensions_MaskedInput/Docs.mdx)             |        Yes        |
| **Pega_Extensions_Meter**                   | Visual meter for displaying progress or value ranges.                                        |            |                                                                                 | [Docs](./src/components/Pega_Extensions_Meter/Docs.mdx)                   |        No         |
| **Pega_Extensions_NetworkDiagram**          | Graphical network diagram with nodes and links.                                              |            |                                                                                 | [Docs](./src/components/Pega_Extensions_NetworkDiagram/Docs.mdx)          |    In Progress    |
| **Pega_Extensions_OAuthConnect**            | Handles OAuth authentication flows.                                                          |            |                                                                                 | [Docs](./src/components/Pega_Extensions_OAuthConnect/Docs.mdx)            |        No         |
| **Pega_Extensions_PasswordInput**           | Secure password input with strength indicator.                                               |            |                                                                                 | [Docs](./src/components/Pega_Extensions_PasswordInput/Docs.mdx)           |        Yes        |
| **Pega_Extensions_QRCode**                  | Generates and scans QR codes.                                                                |            |                                                                                 | [Docs](./src/components/Pega_Extensions_QRCode/Docs.mdx)                  |        No         |
| **Pega_Extensions_RangeSlider**             | Slider for selecting a numeric range.                                                        |            |                                                                                 | [Docs](./src/components/Pega_Extensions_RangeSlider/Docs.mdx)             |        No         |
| **Pega_Extensions_RatingLayout**            | Star or numeric rating component.                                                            |            |                                                                                 | [Docs](./src/components/Pega_Extensions_RatingLayout/Docs.mdx)            |        No         |
| **Pega_Extensions_Scheduler**               | Scheduling UI for events and appointments.                                                   |            |                                                                                 | [Docs](./src/components/Pega_Extensions_Scheduler/Docs.mdx)               |        No         |
| **Pega_Extensions_Shortcuts**               | Provides keyboard shortcuts for quick actions.                                               | Deprecated | Prefer the OOB Shortcuts widget in Pega '26                                     | [Docs](./src/components/Pega_Extensions_Shortcuts/Docs.mdx)               |    In Progress    |
| **Pega_Extensions_SignatureCapture**        | Capture user signatures via touch or mouse.                                                  | Deprecated | Prefer paragraph field as signature in Pega 26.1.2                              | [Docs](./src/components/Pega_Extensions_SignatureCapture/Docs.mdx)        |        Yes        |
| **Pega_Extensions_StarRatingInput**         | Input for star‑based ratings.                                                                |            |                                                                                 | [Docs](./src/components/Pega_Extensions_StarRatingInput/Docs.mdx)         |        Yes        |
| **Pega_Extensions_StatusBadge**             | Badge showing status with color coding.                                                      | Deprecated | Prefer formatting a text field as status in an Insight                          | [Docs](./src/components/Pega_Extensions_StatusBadge/Docs.mdx)             |        Yes        |
| **Pega_Extensions_TaskList**                | Displays a list of tasks with actions.                                                       |            |                                                                                 | [Docs](./src/components/Pega_Extensions_TaskList/Docs.mdx)                |        No         |
| **Pega_Extensions_TrendDisplay**            | Shows trends over time (charts, graphs).                                                     |            |                                                                                 | [Docs](./src/components/Pega_Extensions_TrendDisplay/Docs.mdx)            |        No         |
| **Pega_Extensions_UtilityList**             | Generic list component for utilities.                                                        |            |                                                                                 | [Docs](./src/components/Pega_Extensions_UtilityList/Docs.mdx)             |    In Progress    |
| **shared**                                  | Shared utilities and hooks used by multiple components.                                      |            |                                                                                 | N/A                                                                       |        N/A        |

---

## 2️⃣ Folder Layout & Naming Convention

Every component lives in its own folder under `src/components` and follows the **`Pega_Extensions_<ComponentName>`** pattern. The folder typically contains:

- `Docs.mdx` – Markdown + JSX documentation.
- `config.json` – Pega metadata used by Designer.
- `demo.stories.tsx` – Storybook demo.
- `demo.test.tsx` – Jest + React‑Testing‑Library tests.
- `index.tsx` – The React component.
- `styles.ts` – Optional styled‑components.
- `localizations.json` – (optional) i18n strings.
- `shared/create-nonce` – Imported to secure script tags.
- `../shared/utils` – `getMappedKey` for Platform/Launchpad key and rule-name mapping (import whenever you touch property names, data pages, or local actions).

> **Tip:** The folder name _must_ match the `name` and `componentKey` fields in `config.json`.

> **Launchpad:** See [LAUNCHPAD_VS_PLATFORM.md](./LAUNCHPAD_VS_PLATFORM.md) before wiring PCore data or actions.

---

## 3️⃣ `config.json` – Pega Blueprint

| Key                    | Meaning                                                                   | Typical Value                   | Notes                                                                                       |
| ---------------------- | ------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------- |
| `name`                 | Unique identifier                                                         | `"Pega_Extensions_<Name>"`      | Must match folder name                                                                      |
| `label`                | UI label shown in Designer                                                | `"<Human readable label>"`      |                                                                                             |
| `description`          | Short description                                                         | `"<Short description>"`         |                                                                                             |
| `organization`         | Owning org                                                                | `"Pega"`                        |                                                                                             |
| `version`              | Semantic version                                                          | `"4.0.0"`                       |                                                                                             |
| `library`              | Library name                                                              | `"Lib"`                         |                                                                                             |
| `allowedApplications`  | Array of Pega apps that can use the component                             | `[]`                            |                                                                                             |
| `componentKey`         | Same as `name`                                                            | `"Pega_Extensions_<Name>"`      |                                                                                             |
| `type`                 | Component type (`Field`, `Template`, etc.)                                | `"Field"`                       |                                                                                             |
| `subtype`              | Sub‑type (e.g., `Text`, `DETAILS`)                                        | `"Text"`                        |                                                                                             |
| `properties`           | Array of property objects that describe the UI fields exposed to Designer | See component‑specific examples | Each object includes `name`, `label`, `format`, and optional `defaultValue`, `source`, etc. |
| `defaultConfig`        | Default prop values that Pega will use                                    | `{"label": "@L $this.label"}`   | Optional                                                                                    |
| `buildDate`            | ISO timestamp of the last build                                           | `"2025-09-29T17:46:21.831Z"`    |                                                                                             |
| `infinityVersion`      | Pega Infinity version                                                     | `"25.1.0-95"`                   |                                                                                             |
| `packageCosmosVersion` | Cosmos version                                                            | `"8.4.1"`                       |                                                                                             |

> **Tip:** Keep `config.json` in sync with the component’s `index.tsx` – the `properties` array is what Designer will expose to the user.

---

## 4️⃣ `index.tsx` – The Component Skeleton

```tsx
import { withConfiguration, Flex, FormControl, FormField, Text } from '@pega/cosmos-react-core';
import { useEffect, useState } from 'react';
import StyledWrapper from './styles';
import '../shared/create-nonce';
import { getMappedKey } from '../shared/utils';

export enum MyComponentProps {/* Define any enum‑style props if needed */}

type MyComponentExtProps = {
  /* Custom props that will be exposed to Designer */
  label: string;
  value: string;
  dataPage?: string;
  getPConnect?: any;
  readOnly?: boolean;
  testId?: string;
};

export const PegaExtensionsMyComponent = (props: MyComponentExtProps) => {
  const { label, value, dataPage, getPConnect, readOnly, testId } = props;
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const [internal, setInternal] = useState(value);

  useEffect(() => {
    if (!readOnly) {
      // Prefer mapped property names when writing back to the case
      actions.updateFieldValue('.' + getMappedKey('myField'), internal);
    }
  }, [internal, readOnly, actions]);

  useEffect(() => {
    if (!dataPage || !getPConnect) return;
    const caseId = pConn.getValue((window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID);
    const payload = {
      dataViewParameters: [{ [getMappedKey('pyID')]: caseId }],
    };
    (window as any).PCore.getDataApiUtils()
      .getData(getMappedKey(dataPage), payload, pConn.getContextName())
      .then((response: any) => {
        /* map response rows with getMappedKey('pyLabel'), etc. */
      });
  }, [dataPage, getPConnect, pConn]);

  return (
    <Flex container={{ direction: 'column' }}>
      <FormField label={label} testId={testId}>
        <FormControl>{readOnly ? <Text>{internal}</Text> : <StyledWrapper>{/* UI */}</StyledWrapper>}</FormControl>
      </FormField>
    </Flex>
  );
};

export default withConfiguration(PegaExtensionsMyComponent);
```

### Dual-environment (Platform + Launchpad) rules

Gallery components should run on **Pega Platform and Launchpad**. When you touch data, case identity, actions, or rule names:

1. Import and use `getMappedKey` from `../shared/utils` for property names, data-page names, and local-action / flow-type names.
2. Read the current case id via `PCore.getConstants().CASE_INFO.CASE_INFO_ID` — not hard-coded `pyID` or `caseInfo.businessID`.
3. Navigate with `getActionsApi()` and `PCore.getSemanticUrlUtils()` — never hand-build URLs.
4. Before calling Platform-only DX REST APIs (for example `getDataObjectView` / `readDataObject`), check `PCore.getRestClient().doesRestApiExist('…')` and provide a fallback, or mark the component as not Launchpad-supported.
5. Do **not** branch on `isLaunchpad`; prefer key mapping and capability detection.

Full details, examples, and Storybook stub requirements: **[LAUNCHPAD_VS_PLATFORM.md](./LAUNCHPAD_VS_PLATFORM.md)**.

---

## 5️⃣ `styles.ts` – Optional Styled‑Components

```ts
import styled from 'styled-components';

const StyledWrapper = styled.div`
  /* Example styles */
  display: flex;
  align-items: center;
`;

export default StyledWrapper;
```

---

## 6️⃣ `Docs.mdx` – Documentation for Designers

```mdx
import { Meta, Canvas, ArgsTable } from '@storybook/addon-docs';

<Meta title='Fields/MyComponent' />

# MyComponent

This component renders a custom UI and synchronizes with Pega state.

## Props

<ArgsTable story='Primary' />

## Demo

<Canvas>
  <Story name='Primary' />
</Canvas>
```

---

## 7️⃣ `demo.stories.tsx` – Storybook Story

```tsx
import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsMyComponent, type PegaExtensionsMyComponentProps } from './index';

export default {
  title: 'Fields/MyComponent',
  argTypes: {
    getPConnect: { table: { disable: true } },
  },
  component: PegaExtensionsMyComponent,
} as const;

const Template: StoryObj<PegaExtensionsMyComponentProps> = (args) => {
  const props = {
    getPConnect: () => ({
      getActionsApi: () => ({ updateFieldValue: () => {}, openWorkByHandle: () => {} }),
      getContextName: () => 'app/primary_1',
      getValue: () => 'CASE-1',
      getLocalizedValue: (v: string) => v,
    }),
    ...args,
  };
  return <PegaExtensionsMyComponent {...props} />;
};

export const Primary = Template.bind({});
Primary.args = {
  label: 'Demo Label',
  value: 'Initial value',
};

if (!window.PCore) {
  (window as any).PCore = {};
}
(window as any).PCore = {
  ...(window as any).PCore,
  getConstants: () => ({ CASE_INFO: { CASE_INFO_ID: 'ID' } }),
  getNameSpaceUtils: () => ({
    getDefaultQualifiedName: (name: string) => name,
  }),
  getEnvironmentInfo: () => ({
    getKeyMapping: (key: string) => key,
  }),
  getRestClient: () => ({
    doesRestApiExist: () => true,
  }),
  getDataApiUtils: () => ({
    getData: () => Promise.resolve({ data: { data: [] } }),
  }),
  getSemanticUrlUtils: () => ({
    getActions: () => ({ ACTION_OPENWORKBYHANDLE: 'openWorkByHandle' }),
    getResolvedSemanticURL: () => '',
  }),
};
```

> **Launchpad:** If the component uses `getMappedKey`, always stub `getNameSpaceUtils` and `getEnvironmentInfo().getKeyMapping`. If it gates optional APIs, stub `getRestClient().doesRestApiExist`. See [LAUNCHPAD_VS_PLATFORM.md](./LAUNCHPAD_VS_PLATFORM.md) §8.

---

## 8️⃣ `demo.test.tsx` – Jest + React‑Testing‑Library

```tsx
import { render, screen } from '@testing-library/react';
import { PegaExtensionsMyComponent } from './index';

const mockPConnect = {
  getActionsApi: () => ({ updateFieldValue: jest.fn() }),
  getStateProps: () => ({ value: 'myField' }),
  getValue: jest.fn(),
};

beforeAll(() => {
  (window as any).PCore = {
    getNameSpaceUtils: () => ({ getDefaultQualifiedName: (n: string) => n }),
    getEnvironmentInfo: () => ({ getKeyMapping: (k: string) => k }),
    getConstants: () => ({ CASE_INFO: { CASE_INFO_ID: 'ID' } }),
  };
});

test('renders label and value', () => {
  render(<PegaExtensionsMyComponent label='Test' value='Hello' getPConnect={() => mockPConnect} />);
  expect(screen.getByText('Test')).toBeInTheDocument();
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

---

## 9️⃣ `localizations.json` – Optional i18n

```json
{
  "en": {
    "myLabel": "My Label"
  },
  "es": {
    "myLabel": "Mi Etiqueta"
  }
}
```

---

## 🔧 Build, Test & Deploy

```bash
# Format and lint
npm run lint

# Type‑check
npm run typecheck

# Run tests
npm test

# Build component bundle
npm run build

# Start Storybook
npm run storybook
```

---

## 📚 Further Reading

- [Launchpad vs Platform](./LAUNCHPAD_VS_PLATFORM.md) — dual-environment API and key-mapping rules
- [Best practices](./best%20practices.md) — Constellation DX component guidelines
- [AGENTS.md](./AGENTS.md) — context for coding agents working in this repo
- [Pega Cosmos React Core Docs](https://docs.pega.com)
- [Storybook MDX Docs](https://storybook.js.org/docs/react/essentials/docs)
- [Styled‑Components](https://styled-components.com/docs)
- [Jest](https://jestjs.io/docs/getting-started)

---

**Happy building!**
