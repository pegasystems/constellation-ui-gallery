# HijriCalendar

A Pega Cosmos React component that provides a Hijri (Islamic) date picker with full support for both Arabic (RTL) and English (LTR) locales. Built on top of `@pega/cosmos-react-core` and powered by the browser's native `Intl` API using the **Umm al-Qura** calendar.

---

## Features

- 📅 Hijri date picker with a portal-based calendar dropdown
- 🌍 Bilingual support — English and Arabic month/weekday labels
- ↔️ RTL/LTR layout auto-detection
- 💾 Flexible storage — save dates as Hijri (`DD/MM/YYYY`) or Gregorian ISO (`YYYY-MM-DD`)
- ✍️ Manual text input with auto-formatting and validation
- 🎯 Today's date highlighting and selected date marking
- 📆 Configurable min/max Hijri year range
- ♿ Accessible — ARIA labels, roles, and keyboard support
- 🎨 Fully themed using Pega Cosmos design tokens

---

## Installation

This component is intended to be used within a **Pega Infinity** application via the Constellation DX framework. Ensure the following peer dependencies are available in your project:

```bash
npm install @pega/cosmos-react-core styled-components
```

---

## Usage

```tsx
import HijriCalendar from './HijriCalendar';

<HijriCalendar
  getPConnect={() => pConn}
  label="Date of Birth"
  minYear={1400}
  maxYear={1460}
  storeAsHijri={true}
  required
/>
```

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `getPConnect` | `() => any` | **required** | PConnect object provided by Pega |
| `value` | `string` | `undefined` | Current field value (ISO string or `DD/MM/YYYY`) |
| `label` | `string` | `undefined` | Label for the input field |
| `testId` | `string` | `undefined` | Test ID for automated testing |
| `hideLabel` | `boolean` | `false` | Visually hides the label |
| `minYear` | `number` | `1400` | Minimum selectable Hijri year |
| `maxYear` | `number` | `1500` | Maximum selectable Hijri year |
| `disabled` | `boolean` | `false` | Disables the field |
| `readOnly` | `boolean` | `false` | Sets the field to read-only |
| `required` | `boolean` | `false` | Marks the field as required |
| `validatemessage` | `string` | `undefined` | Error message to display |
| `helperText` | `string` | `undefined` | Helper text shown below the field |
| `storeAsHijri` | `boolean` | `true` | If `true`, stores as `DD/MM/YYYY`. If `false`, stores as Gregorian ISO. |

---

## Date Formats

| Mode | Format | Example |
|---|---|---|
| Hijri storage (`storeAsHijri: true`) | `DD/MM/YYYY` | `15/09/1446` |
| Gregorian storage (`storeAsHijri: false`) | `YYYY-MM-DD` | `2025-03-15` |

The component accepts both formats as input via the `value` prop and will automatically convert and display the correct Hijri date.

---

## Localization

The component automatically detects the page direction using `window.getComputedStyle(document.body).direction`:

- **LTR** — English month names (e.g., `Ramadan`, `Muharram`) and English weekday initials
- **RTL** — Arabic month names (e.g., `رمضان`, `محرم`) and Arabic weekday initials

The calendar layout and navigation arrows also flip automatically for RTL.

---

## Calendar Navigation

- Use the **◀ / ▶** arrow buttons to navigate between months
- Use the **month dropdown** to jump directly to any Hijri month
- Use the **year dropdown** to jump to any year within the configured `minYear`–`maxYear` range
- Click any day to select it and close the calendar

---

## Validation

- Typing in the input field auto-formats to `DD/MM/YYYY`
- Day is capped at `30`, month at `12`
- If the typed year is outside the `minYear`–`maxYear` range, an inline error is shown
- The `validatemessage` prop can be used to pass server-side or external validation errors

---

## Dependencies

| Package | Purpose |
|---|---|
| `@pega/cosmos-react-core` | UI components, theming, icons |
| `styled-components` | Component-level CSS-in-JS styling |
| `react-dom` (`createPortal`) | Renders calendar outside the DOM hierarchy |
| `Intl.DateTimeFormat` | Native Hijri (Umm al-Qura) date conversion |

---

## Notes

- Hijri-to-Gregorian conversion uses an **approximation algorithm** for calendar grid rendering. The `Intl` API is used for accurate Hijri date parts.
- The calendar portal is appended to `document.body` to avoid overflow/clipping issues inside scrollable containers.
- Clicking outside the calendar automatically closes it.

---

## License

This component is part of the [Pega Constellation UI Gallery](https://pegasystems.github.io/constellation-ui-gallery/) — an open-source collection of customizable Constellation DX components.
