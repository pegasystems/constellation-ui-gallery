# Constellation UI Gallery — Overview

## Overview

The **Constellation DX Components UI Gallery** is an open-source collection of ready-to-use, customizable UI components built for the **Pega Platform** using its **Constellation architecture**.

Constellation's flexible architecture empowers advanced front-end developers (with ReactJS and web technology expertise) to extend the platform by programmatically combining core Constellation presentational components and leveraging the Constellation DX API. The components built this way are called **"Constellation DX Components"**.

This gallery serves as:
- A **reference library** of community-built, production-ready custom components.
- A **learning resource** offering source code, best practices, and a solid foundation for building your own components.
- A **starting point** you can fork, adapt, and extend for your specific business needs.

A live demo is available at [pegasystems.github.io/constellation-ui-gallery](https://pegasystems.github.io/constellation-ui-gallery/).

### How It Works

Each Constellation DX Component is built using a standard front-end development process (TypeScript + React). The compiled component is uploaded to the Pega Platform and stored as a **Rule-UI-Component**, which can then be authored in App Studio and configured into a view.

### Pega Platform Compatibility

| Gallery Version | Branch         | Pega Platform |
|-----------------|----------------|---------------|
| 1.x             | release/1.x.x  | Pega '23      |
| 2.x             | release/2.0    | Pega '24.1    |
| 3.x             | release/3.0    | Pega '24.2    |
| 4.x             | master         | Pega '25.1    |

### Deployment Options

Pre-built components are distributed as RAP files (importable into Pega):
- **ConstellationUIGallery_x_x_x.zip** — Full standalone demo app ("Computerland") showcasing all components.
- **ConstellationUIGallery_x_x_x_COMPONENTS_ONLY.zip** — Only the Rule-UI-Component rules, without the demo app.

### Tech Stack

- **React** (functional components)
- **TypeScript**
- **Storybook** (component development and preview)
- **Jest** (unit testing)
- **Playwright** (end-to-end testing)
- **ESLint** (linting)

---

## Components

The gallery contains **53 custom components** organized under `src/components/`. Each component follows the `Pega_Extensions_` naming convention and is self-contained with its own source, stories, and tests.

### Input Components

| Component | Description |
|-----------|-------------|
| `Pega_Extensions_BannerInput` | Displays an editable banner with input support |
| `Pega_Extensions_CheckboxRow` | Renders a checkbox as a styled row item |
| `Pega_Extensions_CheckboxTrigger` | Checkbox that triggers conditional logic |
| `Pega_Extensions_DateInput` | Custom date picker input field |
| `Pega_Extensions_JapaneseInput` | Input field with Japanese IME support |
| `Pega_Extensions_MarkdownInput` | Rich-text input using Markdown syntax |
| `Pega_Extensions_MaskedInput` | Input field with masked/formatted entry (e.g. phone, SSN) |
| `Pega_Extensions_PasswordInput` | Secure password entry with visibility toggle |
| `Pega_Extensions_RangeSlider` | Dual-handle range slider input |
| `Pega_Extensions_StarRatingInput` | Star-based rating input |
| `Pega_Extensions_Toggle` | Toggle switch input |

### Display / Visualization Components

| Component | Description |
|-----------|-------------|
| `Pega_Extensions_Banner` | Static informational banner display |
| `Pega_Extensions_BarCode` | Renders a scannable barcode |
| `Pega_Extensions_GanttChart` | Project timeline Gantt chart |
| `Pega_Extensions_ImageCarousel` | Slideshow carousel for images |
| `Pega_Extensions_ImageMagnify` | Zoomable image magnifier |
| `Pega_Extensions_Map` | Embedded map view |
| `Pega_Extensions_Meter` | Visual meter/progress indicator |
| `Pega_Extensions_NetworkDiagram` | Interactive network/graph diagram |
| `Pega_Extensions_QRCode` | QR code generator |
| `Pega_Extensions_StatusBadge` | Color-coded status badge |
| `Pega_Extensions_TrendDisplay` | Trend line or sparkline visualization |

### Layout Components

| Component | Description |
|-----------|-------------|
| `Pega_Extensions_CompareTableLayout` | Side-by-side comparison table layout |
| `Pega_Extensions_DynamicTemplate` | Dynamically renders configurable templates |
| `Pega_Extensions_EditableTableLayout` | Inline-editable data table layout |
| `Pega_Extensions_FieldGroupAsRow` | Renders a field group horizontally as a row |
| `Pega_Extensions_FormFullWidth` | Full-width form layout container |
| `Pega_Extensions_FormWithVerticalStepper` | Multi-step form with a vertical stepper |
| `Pega_Extensions_JawLayout` | Custom JAW (Just-Another-Widget) layout |
| `Pega_Extensions_RatingLayout` | Layout optimized for rating/review display |
| `Pega_Extensions_DynamicHierarchicalForm` | Hierarchical form with dynamic nesting |
| `Pega_Extensions_HierarchicalFormAsTasks` | Renders a hierarchical form as a task list |

### Productivity / Workflow Components

| Component | Description |
|-----------|-------------|
| `Pega_Extensions_ActionableButton` | Button with configurable action triggers |
| `Pega_Extensions_AutoSave` | Automatically saves form data at intervals |
| `Pega_Extensions_CaseLauncher` | Launches a new Pega case from within a view |
| `Pega_Extensions_CaseReference` | Displays and links to a referenced case |
| `Pega_Extensions_KanbanBoard` | Drag-and-drop Kanban board |
| `Pega_Extensions_OrgBuilder` | Interactive organizational chart builder |
| `Pega_Extensions_Scheduler` | Calendar-based scheduler/event planner |
| `Pega_Extensions_Shortcuts` | Keyboard shortcut manager |
| `Pega_Extensions_TaskList` | Checklist-style task manager |
| `Pega_Extensions_CPQTree` | Configure-Price-Quote tree selector |

### Media & Capture Components

| Component | Description |
|-----------|-------------|
| `Pega_Extensions_CameraCapture` | Captures photos from device camera |
| `Pega_Extensions_DisplayAttachments` | Displays file attachments inline |
| `Pega_Extensions_DisplayPDF` | Embeds and renders PDF documents |
| `Pega_Extensions_SignatureCapture` | Canvas-based handwritten signature input |

### Utility / Integration Components

| Component | Description |
|-----------|-------------|
| `Pega_Extensions_CardGallery` | Card grid gallery layout |
| `Pega_Extensions_ChatGenAI` | Conversational GenAI chat interface |
| `Pega_Extensions_IframeWrapper` | Embeds external content in an iframe |
| `Pega_Extensions_LangSwitch` | Language/locale switcher |
| `Pega_Extensions_OAuthConnect` | OAuth 2.0 connection helper |
| `Pega_Extensions_SecureRichText` | Sanitized rich-text display (prevents XSS) |
| `Pega_Extensions_Calendar` | Full calendar view integration |
| `Pega_Extensions_UtilityList` | Utility menu/list component |

---

> **Note:** Some components require additional setup in your Pega application (e.g., data pages, activities, or classes) to function fully at runtime. If using the Components Only RAP, these supporting rules must be recreated manually.
