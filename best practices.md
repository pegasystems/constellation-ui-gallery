# Constellation DX Component Best Practices

Below is a distilled “cheat‑sheet” of the Pega **best‑practice guidelines** for writing Constellation DX (Custom DX) components, pulled from the official Pega docs, design guidelines, and the README/Getting‑Started pages in this repository.

---

## 1. What is a Constellation DX Component?

| Term             | Meaning                                                                                                                                                                       |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **DX Component** | A reusable, front‑end React component that is built with the Constellation UI library and can be dropped into a Pega app via the **DX API** (Pega‑specific helper functions). |
| **DX API**       | A set of functions exposed by the Pega platform (via `getPConnect` and `PCore`) that let the component interact with Pega data, actions, and lifecycle events.                |
| **Constituents** | _Design Tokens_, _presentational components_, _Pega Core APIs_, _Typescript_, _Storybook_, _Accessibility_, _Testing_ – all part of the “best‑practice” stack.                |

---

## 2. Design & Development Principles

| #      | Practice                                                   | Why It Matters                                                                    | How To Do It                                                                                                                   |
| ------ | ---------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **1**  | **Use the Constellation Presentational Component Library** | Keeps UI consistent with the rest of the platform.                                | Import from `@pega/cosmos-react-core` (e.g., `<Flex>`, `<Banner>`, `<Button>`).                                                |
| **2**  | **Leverage Pega’s public APIs**                            | Guarantees platform‑level integration (data binding, actions, navigation).        | Use `getPConnect()` for state, actions, and `PCore` for global services.                                                       |
| **3**  | **Use Styled‑Components + Design Tokens**                  | Enables theme‑aware styling while keeping style scoped.                           | Create a `styles.ts` that imports `styled-components` and references tokens (`theme.color.primary`, `theme.spacing.xl`, etc.). |
| **4**  | **Write in TypeScript**                                    | Strong typing catches errors early, generates PropDocs, and improves IDE support. | Add a `.tsx` file with `type Props = { … }` and export the component as `React.FC<Props>` or similar.                          |
| **5**  | **Prefer Functional Components**                           | Easier to read, test, and hook into Pega’s React‑based lifecycle.                 | Use hooks (`useEffect`, `useState`, `useCallback`) rather than class components.                                               |
| **6**  | **Use `rem` units over `px`**                              | Guarantees accessibility (zoom, font‑size changes) and consistency across themes. | In your styled components use `font-size: 1rem; padding: 0.5rem;` etc.                                                         |
| **7**  | **Avoid Direct DOM Manipulation**                          | Keeps React’s virtual DOM in sync.                                                | Use React refs only for third‑party libraries that require it; otherwise stay declarative.                                     |
| **8**  | **Provide a Storybook Story & Docs.mdx**                   | Gives designers and developers a live preview and a documentation source.         | Create `demo.stories.tsx` and `Docs.mdx` that use the same props as the component.                                             |
| **9**  | **Add Unit & Accessibility Tests**                         | Ensures reliability across Pega releases and meets WCAG 2.1.                      | Use `@testing-library/react` and `jest` for unit tests; run `npm test` and `npm run e2e` (if applicable).                      |
| **10** | **No 3rd‑party UI Libraries**                              | Keeps the component lightweight and compatible with the Constellation library.    | Do **not** import Material‑UI, Ant‑Design, etc. – rely on Constellation’s built‑in components.                                 |
| **11** | **Use Only Open‑Source, Pega‑Compatible Packages**         | Avoid licensing or compatibility issues.                                          | Verify the package’s license and React version compatibility.                                                                  |
| **12** | **Follow the Constellation Design Tokens & Style Guide**   | Guarantees brand consistency.                                                     | Use `theme` tokens and `styled-components` helpers from the Constellation library.                                             |
| **13** | **Support Right‑to‑Left (RTL) and Themes**                 | Enables global usage.                                                             | In Storybook, enable the toolbar to switch themes; use `theme.direction` to adapt layout.                                      |
| **14** | **Document Props with Types & Default Values**             | Generates a property table in Storybook and in the Pega Designer.                 | Define `interface Props` with JSDoc comments and default values.                                                               |
| **15** | **Lint & Format Consistently**                             | Prevents merge conflicts and code drift.                                          | Run `npm run lint` and `npm run fix` before commits.                                                                           |
| **16** | **Provide a Demo RAP**                                     | Enables quick import into a Pega app for testing.                                 | Build and publish a RAP (ZIP) that contains the compiled JS/CSS.                                                               |

---

## 3. Step‑by‑Step Creation Flow

1. **Create the folder**

   ```bash
   mkdir src/components/Pega_Extensions_<Name>
   cd src/components/Pega_Extensions_<Name>
   ```

2. **Add boilerplate files**

   ```text
   index.tsx          # component implementation
   styles.ts          # optional styled‑components
   config.json        # Pega metadata
   Docs.mdx           # MDX docs
   demo.stories.tsx   # Storybook story
   demo.test.tsx      # Jest tests
   localizations.json # optional i18n strings
   ```

3. **Fill `config.json`** – use the pattern from existing components.

   ```json
   {
     "name": "Pega_Extensions_<Name>",
     "label": "<Human‑Readable Label>",
     "description": "Brief description of the component",
     "organization": "Pega",
     "version": "4.0.0",
     "library": "Extensions",
     "allowedApplications": [],
     "componentKey": "Pega_Extensions_<Name>",
     "type": "Field",
     "subtype": "Text",
     "properties": [ … ],
     "defaultConfig": { … },
     "buildDate": "2025‑09‑29T17:46:21.831Z",
     "infinityVersion": "25.1.0-95",
     "packageCosmosVersion": "8.4.1"
   }
   ```

4. **Write the component** (`index.tsx`) using the skeleton from the guide above, ensuring:
   - `withConfiguration` wrapper
   - `getPConnect` usage
   - `useEffect` for Pega lifecycle
   - Styled‑components for theming
   - Typescript interface for props

5. **Add Storybook and Docs**
   - `demo.stories.tsx` – expose the same props as the component.
   - `Docs.mdx` – import `Meta`, `Canvas`, `ArgsTable`.

6. **Add tests**
   - Unit test the core logic.
   - Accessibility test using `axe` (if available).

7. **Lint & format**

   ```bash
   npm run lint
   npm run fix
   ```

8. **Build the component bundle**

   ```bash
   npm run build
   ```

9. **Package as a RAP** (ZIP) and import into your Pega app for testing.

10. **Create a PR** – follow the repo’s PR template, add the component, run CI, and send an email to **DXComponents@pega.com** with the PR link.

---

## 4. Quick Reference – Checklist

| Item                                                   | Done? | Notes |
| ------------------------------------------------------ | ----- | ----- |
| Folder name follows `Pega_Extensions_<Name>`           |       |       |
| `config.json` matches folder name                      |       |       |
| `index.tsx` uses `withConfiguration` and `getPConnect` |       |       |
| Typescript props & JSDoc                               |       |       |
| Uses Constellation presentational components           |       |       |
| Styled‑components + design tokens                      |       |       |
| No `px`, no hard‑coded colors                          |       |       |
| Functional component                                   |       |       |
| Storybook story + Docs.mdx                             |       |       |
| Unit tests + accessibility tests                       |       |       |
| Lint & format pass                                     |       |       |
| Supports RTL & themes                                  |       |       |
| No 3rd‑party UI libs                                   |       |       |
| Export as a RAP for import                             |       |       |
| PR follows repository guidelines                       |       |       |

---

## 5. Useful Links

| Resource                                                                                                                                                                                                              | Purpose                     |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| [Design Requirements – Constellation DX Components](https://docs.pega.com/bundle/constellation-dx-components/page/constellation-dx-components/custom-components/design-requirements-constellation-dx-components.html) | Core design rules.          |
| [Governance & Best Practices](https://community.pega.com/event/clsa-community-extension-dx-components-responsible-lsas-guide?)                                                                                        | Governance framework.       |
| [Using PCore & PConnect Public APIs](https://docs.pega.com/bundle/pcore-pconnect/page/pcore-pconnect-public-apis/api/using-pcore-pconnect-public-apis.html)                                                           | API reference.              |
| [Design Tokens & Styled‑Components](https://design.pega.com/develop)                                                                                                                                                  | Theme & styling guidelines. |
| [Accessibility – WCAG 2.1](https://www.w3.org/TR/WCAG21/)                                                                                                                                                             | Accessibility compliance.   |
| [Storybook Docs](https://storybook.js.org/docs/react/essentials/docs)                                                                                                                                                 | Docs.mdx usage.             |
| [Testing – Jest & React Testing Library](https://jestjs.io/docs/getting-started)                                                                                                                                      | Unit testing guide.         |

---

### Bottom line

- **Follow the Constellation design token stack** (`@pega/cosmos-react-core`, `styled-components`, `theme`).
- **Use Typescript + functional components** for safety and clarity.
- **Leverage Pega APIs** (`getPConnect`, `PCore`) for data & actions.
- **Provide Storybook stories and Docs.mdx** for live preview and documentation.
- **Test for accessibility, RTL, and theming**.
- **Lint, format, and package** before publishing.

Adhering to the above guidelines will keep your components consistent, maintainable, and ready for integration into any Pega platform release.
