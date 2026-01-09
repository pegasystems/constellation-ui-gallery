# Component Build & Documentation Guide

> **Welcome to the Confluence of the Constellation UI Gallery** – this file is the one‑stop reference for anyone who wants to add a new Pega extension component to the gallery or understand the structure of an existing one.

---

## 1️⃣ Quick Overview – List of Existing Components

| Component                                   | Short Description                                                                            | Docs                                                                      |
| ------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Pega_Extensions_ActionableButton**        | A button that can trigger Pega actions or workflows.                                         | [Docs](./src/components/Pega_Extensions_ActionableButton/Docs.mdx)        |
| **Pega_Extensions_AutoSave**                | Automatically saves form data as the user types or changes fields.                           | [Docs](./src/components/Pega_Extensions_AutoSave/Docs.mdx)                |
| **Pega_Extensions_Banner**                  | Displays a banner message, typically for notifications or alerts.                            | [Docs](./src/components/Pega_Extensions_Banner/Docs.mdx)                  |
| **Pega_Extensions_BannerInput**             | Combines a banner with an input field for quick data entry.                                  | [Docs](./src/components/Pega_Extensions_BannerInput/Docs.mdx)             |
| **Pega_Extensions_BarCode**                 | Generates and scans barcodes.                                                                | [Docs](./src/components/Pega_Extensions_BarCode/Docs.mdx)                 |
| **Pega_Extensions_Calendar**                | Calendar view for selecting dates, with support for events.                                  | [Docs](./src/components/Pega_Extensions_Calendar/Docs.mdx)                |
| **Pega_Extensions_CameraCapture**           | Lets users take photos using their device camera and save them directly as case attachments. | [Docs](./src/components/Pega_Extensions_CameraCapture/Docs.mdx)           |
| **Pega_Extensions_CardGallery**             | Displays items in a card‑style gallery layout.                                               | [Docs](./src/components/Pega_Extensions_CardGallery/Docs.mdx)             |
| **Pega_Extensions_CaseLauncher**            | Launches Pega cases or tasks from the UI.                                                    | [Docs](./src/components/Pega_Extensions_CaseLauncher/Docs.mdx)            |
| **Pega_Extensions_CaseReference**           | References a Pega case, showing key details.                                                 | [Docs](./src/components/Pega_Extensions_CaseReference/Docs.mdx)           |
| **Pega_Extensions_ChatGenAI**               | Integrates generative AI chat into the application.                                          | [Docs](./src/components/Pega_Extensions_ChatGenAI/Docs.mdx)               |
| **Pega_Extensions_CheckboxRow**             | A row of checkboxes with optional triggers.                                                  | [Docs](./src/components/Pega_Extensions_CheckboxRow/Docs.mdx)             |
| **Pega_Extensions_CheckboxTrigger**         | Checkbox that triggers actions on change.                                                    | [Docs](./src/components/Pega_Extensions_CheckboxTrigger/Docs.mdx)         |
| **Pega_Extensions_CompareTableLayout**      | Displays data in a comparison table format.                                                  | [Docs](./src/components/Pega_Extensions_CompareTableLayout/Docs.mdx)      |
| **Pega_Extensions_CPQTree**                 | Reads the CPQ Tree structure and displays it in Constellation.                               | [Docs](./src/components/Pega_Extensions_CPQTree/Docs.mdx)                 |
| **Pega_Extensions_DisplayAttachments**      | Renders file attachments with download links.                                                | [Docs](./src/components/Pega_Extensions_DisplayAttachments/Docs.mdx)      |
| **Pega_Extensions_DisplayPDF**              | Shows PDF documents inline.                                                                  | [Docs](./src/components/Pega_Extensions_DisplayPDF/Docs.mdx)              |
| **Pega_Extensions_DynamicHierarchicalForm** | Dynamically builds a hierarchical form based on data.                                        | [Docs](./src/components/Pega_Extensions_DynamicHierarchicalForm/Docs.mdx) |
| **Pega_Extensions_EditableTableLayout**     | Table layout with inline editing capabilities.                                               | [Docs](./src/components/Pega_Extensions_EditableTableLayout/Docs.mdx)     |
| **Pega_Extensions_FieldGroupAsRow**         | Groups multiple fields into a single row layout.                                             | [Docs](./src/components/Pega_Extensions_FieldGroupAsRow/Docs.mdx)         |
| **Pega_Extensions_FormFullWidth**           | Expands a form to full width of container.                                                   | [Docs](./src/components/Pega_Extensions_FormFullWidth/Docs.mdx)           |
| **Pega_Extensions_FormWithVerticalStepper** | Vertical Screen flow with navigation                                                         | [Docs](./src/components/Pega_Extensions_FormWithVerticalStepper/Docs.mdx) |
| **Pega_Extensions_GanttChart**              | Visualizes tasks or events in a Gantt chart.                                                 | [Docs](./src/components/Pega_Extensions_GanttChart/Docs.mdx)              |
| **Pega_Extensions_HierarchicalFormAsTasks** | Presents hierarchical forms in a task‑list style.                                            | [Docs](./src/components/Pega_Extensions_HierarchicalFormAsTasks/Docs.mdx) |
| **Pega_Extensions_IframeWrapper**           | Embeds external content within an iframe.                                                    | [Docs](./src/components/Pega_Extensions_IframeWrapper/Docs.mdx)           |
| **Pega_Extensions_ImageCarousel**           | Carousel for images with navigation controls.                                                | [Docs](./src/components/Pega_Extensions_ImageCarousel/Docs.mdx)           |
| **Pega_Extensions_ImageMagnify**            | Magnifies images on hover or click.                                                          | [Docs](./src/components/Pega_Extensions_ImageMagnify/Docs.mdx)            |
| **Pega_Extensions_JapaneseInput**           | Provides Japanese language input support.                                                    | [Docs](./src/components/Pega_Extensions_JapaneseInput/Docs.mdx)           |
| **Pega_Extensions_JawLayout**               | Displays an interactive jaw like structure.                                                  | [Docs](./src/components/Pega_Extensions_JawLayout/Docs.mdx)               |
| **Pega_Extensions_KanbanBoard**             | Kanban board layout for task management.                                                     | [Docs](./src/components/Pega_Extensions_KanbanBoard/Docs.mdx)             |
| **Pega_Extensions_Map**                     | Displays maps with markers and overlays.                                                     | [Docs](./src/components/Pega_Extensions_Map/Docs.mdx)                     |
| **Pega_Extensions_MarkdownInput**           | Text area that supports Markdown formatting.                                                 | [Docs](./src/components/Pega_Extensions_MarkdownInput/Docs.mdx)           |
| **Pega_Extensions_MaskedInput**             | Input field with masking (e.g., phone, SSN).                                                 | [Docs](./src/components/Pega_Extensions_MaskedInput/Docs.mdx)             |
| **Pega_Extensions_Meter**                   | Visual meter for displaying progress or value ranges.                                        | [Docs](./src/components/Pega_Extensions_Meter/Docs.mdx)                   |
| **Pega_Extensions_NetworkDiagram**          | Graphical network diagram with nodes and links.                                              | [Docs](./src/components/Pega_Extensions_NetworkDiagram/Docs.mdx)          |
| **Pega_Extensions_OAuthConnect**            | Handles OAuth authentication flows.                                                          | [Docs](./src/components/Pega_Extensions_OAuthConnect/Docs.mdx)            |
| **Pega_Extensions_PasswordInput**           | Secure password input with strength indicator.                                               | [Docs](./src/components/Pega_Extensions_PasswordInput/Docs.mdx)           |
| **Pega_Extensions_QRCode**                  | Generates and scans QR codes.                                                                | [Docs](./src/components/Pega_Extensions_QRCode/Docs.mdx)                  |
| **Pega_Extensions_RangeSlider**             | Slider for selecting a numeric range.                                                        | [Docs](./src/components/Pega_Extensions_RangeSlider/Docs.mdx)             |
| **Pega_Extensions_RatingLayout**            | Star or numeric rating component.                                                            | [Docs](./src/components/Pega_Extensions_RatingLayout/Docs.mdx)            |
| **Pega_Extensions_Scheduler**               | Scheduling UI for events and appointments.                                                   | [Docs](./src/components/Pega_Extensions_Scheduler/Docs.mdx)               |
| **Pega_Extensions_SecureRichText**          | Rich‑text editor with security controls.                                                     | [Docs](./src/components/Pega_Extensions_SecureRichText/Docs.mdx)          |
| **Pega_Extensions_Shortcuts**               | Provides keyboard shortcuts for quick actions.                                               | [Docs](./src/components/Pega_Extensions_Shortcuts/Docs.mdx)               |
| **Pega_Extensions_SignatureCapture**        | Capture user signatures via touch or mouse.                                                  | [Docs](./src/components/Pega_Extensions_SignatureCapture/Docs.mdx)        |
| **Pega_Extensions_StarRatingInput**         | Input for star‑based ratings.                                                                | [Docs](./src/components/Pega_Extensions_StarRatingInput/Docs.mdx)         |
| **Pega_Extensions_StatusBadge**             | Badge showing status with color coding.                                                      | [Docs](./src/components/Pega_Extensions_StatusBadge/Docs.mdx)             |
| **Pega_Extensions_TaskList**                | Displays a list of tasks with actions.                                                       | [Docs](./src/components/Pega_Extensions_TaskList/Docs.mdx)                |
| **Pega_Extensions_TrendDisplay**            | Shows trends over time (charts, graphs).                                                     | [Docs](./src/components/Pega_Extensions_TrendDisplay/Docs.mdx)            |
| **Pega_Extensions_UtilityList**             | Generic list component for utilities.                                                        | [Docs](./src/components/Pega_Extensions_UtilityList/Docs.mdx)             |
| **shared**                                  | Shared utilities and hooks used by multiple components.                                      | N/A                                                                       |

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

> **Tip:** The folder name _must_ match the `name` and `componentKey` fields in `config.json`.

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
import { useEffect, useRef, useState } from 'react';
import StyledWrapper from './styles';
import '../shared/create-nonce';

export enum MyComponentProps {
  /* Define any enum‑style props if needed */
}

type MyComponentExtProps = {
  /* Custom props that will be exposed to Designer */
  label: string;
  value: string;
  getPConnect: any;
  readOnly?: boolean;
  testId?: string;
};

export const PegaExtensionsMyComponent = (props: MyComponentExtProps) => {
  const { label, value, getPConnect, readOnly, testId } = props;
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const [internal, setInternal] = useState(value);

  useEffect(() => {
    if (!readOnly) {
      actions.updateFieldValue('myField', internal);
    }
  }, [internal, readOnly, actions]);

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

const Template: StoryObj<PegaExtensionsMyComponentProps> = (args) => <PegaExtensionsMyComponent {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: 'Demo Label',
  value: 'Initial value',
  getPConnect: () => ({
    /* Mocked PConnect */
  }),
};
```

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

- [Pega Cosmos React Core Docs](https://docs.pega.com)
- [Storybook MDX Docs](https://storybook.js.org/docs/react/essentials/docs)
- [Styled‑Components](https://styled-components.com/docs)
- [Jest](https://jestjs.io/docs/getting-started)

---

**Happy building!**
