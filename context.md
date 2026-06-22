# Session Context — Pega_Extensions_PageListSwiper

## What was built

A new custom Cosmos UI component called **`Pega_Extensions_PageListSwiper`** was added to the
`constellation-ui-gallery` project. It renders a pagelist property (a list of Pega page objects)
one profile at a time, allowing a user to Accept or Reject each entry — the primary use-case being
a doctor/provider selection workflow.

---

## Files created / modified

| File | Status | Description |
|------|--------|-------------|
| `src/components/Pega_Extensions_PageListSwiper/index.tsx` | Created | Main component logic |
| `src/components/Pega_Extensions_PageListSwiper/demo.stories.tsx` | Created | Storybook story with 5 doctor profiles |
| `src/components/Pega_Extensions_PageListSwiper/styles.ts` | Created | Styled-components CSS |
| `src/components/Pega_Extensions_PageListSwiper/config.json` | Created | Pega Designer metadata |
| `src/components/Pega_Extensions_PageListSwiper/Docs.mdx` | Created | Storybook documentation |
| `src/components/Pega_Extensions_Map/demo.stories.tsx` | Modified | Offline guard — skips ArcGIS CDN when no API key |
| `OVERVIEW.md` | Created | Repo-level documentation overview |

---

## Component architecture

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `getPConnect` | `any` | — | Pega connector (required) |
| `heading` | `string` | `'Review Profiles'` | Card heading |
| `acceptLabel` | `string` | `'Accept'` | Accept button label |
| `rejectLabel` | `string` | `'Reject'` | Reject button label |
| `completionMessage` | `string` | `'All profiles reviewed'` | Banner when all rejected |
| `acceptProperty` | `string` | `'acceptProvider'` | Property name on each page object to write the yes/no decision |

### State

| State | Type | Purpose |
|-------|------|---------|
| `fields` | `FieldDef[]` | Parallel arrays of field values extracted from the region metadata |
| `embedDataRef` | `string` | Page list name (e.g. `Doctors`) used in `pageReference` for PCore calls |
| `currentIndex` | `number` | Index of the doctor card currently displayed |
| `decisions` | `Record<number, 'accepted'\|'rejected'>` | Per-index decision map |
| `acceptedIndex` | `number \| null` | Index of the currently accepted doctor; drives nav cap |
| `loading` | `boolean` | True while metadata is being parsed |

### Key derived values

- `maxNavIndex` — navigation cannot go past the accepted doctor. If `acceptedIndex !== null`, `maxNavIndex = acceptedIndex`, otherwise `totalRows - 1`.
- `hasAccepted` — `acceptedIndex !== null`
- `allRejected` — no acceptance and every explored index is `'rejected'`

---

## Business rules implemented

### 1. Navigation
- **Previous / Next** buttons navigate between doctor profiles.
- Navigation is **capped** at the accepted doctor's index — you cannot view profiles beyond the accepted one.
- Pills beyond the cap are rendered with a `pill--locked` style (grey, faded, non-clickable).
- Progress pills are clickable to jump directly to any navigable profile.

### 2. Single accepted doctor
- Pressing **Accept** on doctor X:
  - All other doctors that already have a decision are automatically set to `'rejected'` and their `acceptProperty` is written `false`.
  - Doctor X is set to `'accepted'` and its `acceptProperty` is written `true`.
  - Navigation cap is moved to X.
- Pressing **Reject** on the currently accepted doctor:
  - Clears `acceptedIndex` → removes the navigation cap.
  - All doctors become navigable again.

### 3. Decision persistence via PCore
- Every Accept/Reject writes directly onto the Pega page object:
  ```ts
  PCore.createPConnect({
    options: {
      pageReference: `caseInfo.content.${embedDataRef}[${index}]`,
      referenceList: `.${embedDataRef}`,
    }
  }).getPConnect().getActionsApi().updateFieldValue(`.acceptProvider`, 'true' | 'false');
  ```
- In Storybook (offline), the `try/catch` swallows the call gracefully.

### 4. Visual status
- A `Status` badge (`Accepted` / `Rejected`) appears in the card header for any profile that has been decided.
- A summary banner appears at the top once all navigable profiles are decided:
  - Green `Provider Accepted` if any doctor was accepted.
  - Red `completionMessage` if all were rejected.

---

## Storybook demo data

Five mock doctors with fields: Name, Specialization, Experience, Hospital, Consultation Fee, Availability, Rating.

The story renders the component alongside an `acceptProvider` log table showing the decision state for each doctor in real time.

---

## How to run locally

```bash
cd constellation-ui-gallery
npm install
npm run start        # starts Storybook on http://localhost:6006
```

Navigate to **Templates → Page List Swiper** in Storybook.

No external services are required. The Map component has an offline guard that displays a placeholder when no ArcGIS API key is provided.

---

## External connections in this repo (for reference)

| Component | Service | Required? |
|-----------|---------|-----------|
| `Pega_Extensions_Map` | ArcGIS CDN | No — guarded with offline placeholder |
| `Pega_Extensions_ChatGenAI` | `localhost:8000` GenAI backend | No — only active in a live Pega environment |
| `Pega_Extensions_OAuthConnect` | OAuth provider | No — only active in a live Pega environment |
| All components | Pega Platform server | No — mocked via `window.PCore` in Storybook stories |
