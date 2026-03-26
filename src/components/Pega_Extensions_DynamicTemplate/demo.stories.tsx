import type { StoryObj } from '@storybook/react-webpack5';
import { Input } from '@pega/cosmos-react-core';
import { PegaExtensionsDynamicTemplate } from './index';

export default {
  title: 'Templates/Dynamic Template',
  argTypes: {
    getPConnect: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    a11y: {
      context: '#storybook-root',
      config: {
        rules: [
          {
            id: 'autocomplete-valid',
            enabled: false,
          },
        ],
      },
    },
  },
  component: PegaExtensionsDynamicTemplate,
};

const generateChildren = (count: number, prefix: string) => {
  return Array.from({ length: count }, (_, index) => ({
    type: 'Text',
    config: {
      value: '',
      label: `@L ${prefix} Field ${index + 1}`,
    },
    key: `${prefix}-${index}`,
  }));
};

const mainResponse = {
  name: 'pyReview',
  type: 'View',
  config: {
    template: 'Details',
    ruleClass: 'Work-MyComponents',
    showLabel: true,
    label: '@L Details',
    localeReference: '@LR Details',
    inheritedProps: [],
  },
  children: [
    { name: 'A', type: 'Region', children: generateChildren(2, 'Region A') },
    { name: 'B', type: 'Region', children: generateChildren(1, 'Region B') },
    { name: 'C', type: 'Region', children: generateChildren(2, 'Region C') },
    { name: 'D', type: 'Region', children: generateChildren(1, 'Region D') },
    { name: 'E', type: 'Region', children: generateChildren(2, 'Region E') },
    { name: 'F', type: 'Region', children: generateChildren(1, 'Region F') },
  ],
  classID: 'Work-MyComponents',
};

const createComponent = (config: { label?: string }, key: string) => {
  const label = config?.label?.replace('@L ', '') ?? 'Field';
  return <Input key={key} label={label} />;
};

/** Regions with children already rendered (as in FormFullWidth / FieldGroupAsRow). */
const getRegionChildren = () =>
  mainResponse.children.map(
    (region: { name?: string; children?: Array<{ config?: { label?: string }; key?: string }> }) => ({
      name: region.name,
      children: (region.children ?? []).map((child, i) =>
        createComponent(child?.config ?? {}, child?.key ?? `region-${region.name}-${i}`),
      ),
    }),
  );

const getPConnect = () => ({
  getChildren: getRegionChildren,
  getRawMetadata: () => mainResponse,
  getInheritedProps: () => mainResponse.config.inheritedProps,
  setInheritedProp: () => {},
  resolveConfigProps: () => ({}),
});

const DEFAULT_HTML_CONTENT = `
<style>
  .dt-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; padding: 1rem; }
  .dt-slot { border: 1px solid #ddd; border-radius: 8px; padding: 0.75rem; min-height: 2.5rem; }
  .dt-slot[data-region="A"] { background: #f0f9ff; }
  .dt-slot[data-region="B"] { background: #fefce8; }
  .dt-slot[data-region="C"] { background: #f0fdf4; }
  .dt-slot[data-region="D"] { background: #fef2f2; }
  .dt-slot[data-region="E"] { background: #faf5ff; }
  .dt-slot[data-region="F"] { background: #ecfeff; }
</style>
<div class="dt-grid">
  <div class="dt-slot" data-region="A">region A</div>
  <div class="dt-slot" data-region="B">region B</div>
  <div class="dt-slot" data-region="C">region C</div>
  <div class="dt-slot" data-region="D">region D</div>
  <div class="dt-slot" data-region="E">region E</div>
  <div class="dt-slot" data-region="F">region F</div>
</div>
`;

const CUSTOM_LAYOUT_HTML = `
<style>
  .dt-custom { display: grid; grid-template-columns: 200px 1fr; grid-template-rows: auto 1fr auto; gap: 0.5rem; padding: 1rem; min-height: 200px; }
  .dt-header { grid-column: 1 / -1; padding: 0.5rem; background: #e0e7ff; border-radius: 4px; }
  .dt-sidebar { grid-row: 2 / 4; padding: 0.5rem; background: #f3f4f6; border-radius: 4px; }
  .dt-main { padding: 0.5rem; background: #fef3c7; border-radius: 4px; }
  .dt-footer { grid-column: 1 / -1; padding: 0.5rem; background: #d1fae5; border-radius: 4px; }
</style>
<div class="dt-custom">
  <header class="dt-header" data-region="A">Header (Region A)</header>
  <aside class="dt-sidebar" data-region="B"></aside>
  <main class="dt-main" data-region="C"></main>
  <footer class="dt-footer" data-region="D"></footer>
</div>
`;

/** Tab layout: horizontal, tabs at start (top). No JS required – component wires tab switching. */
const TAB_LAYOUT_HORIZONTAL_HTML = `
<style>
  .dt-tabs-wrap {
    --dt-border: #d7dce5;
    --dt-surface: #ffffff;
    --dt-subtle: #5b6472;
    --dt-text: #1d2733;
    --dt-accent: #0f6cbd;
    padding: 1.25rem;
    border: 1px solid var(--dt-border);
    border-radius: 18px;
    background: linear-gradient(180deg, #f7f9fc 0%, #eef3f8 100%);
    box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
  }
  .dt-tabs-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .dt-tabs-eyebrow {
    margin: 0 0 0.25rem;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #52606d;
  }
  .dt-tabs-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--dt-text);
  }
  .dt-tabs-meta {
    display: inline-flex;
    align-items: center;
    padding: 0.35rem 0.7rem;
    border-radius: 999px;
    background: rgba(15, 108, 189, 0.1);
    color: var(--dt-accent);
    font-size: 0.8rem;
    font-weight: 700;
  }
  .dt-tab-headers {
    display: inline-flex;
    padding: 0.35rem;
    border: 1px solid #d8e1ec;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.88);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }
  .dt-tab-headers .dt-tab {
    padding: 0.65rem 1rem;
    border: 0;
    border-radius: 9px;
    background: transparent;
    color: var(--dt-subtle);
    font-weight: 700;
  }
  .dt-tab-headers .dt-tab[aria-selected="true"] {
    background: var(--dt-surface);
    color: var(--dt-accent);
    box-shadow: 0 8px 18px rgba(15, 108, 189, 0.14);
  }
  .dt-tab-panel {
    margin-top: 1rem;
    border: 1px solid var(--dt-border);
    border-radius: 16px;
    padding: 1.1rem;
    min-height: 160px;
    background: var(--dt-surface);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }
  .dt-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.9rem;
  }
  .dt-panel-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: var(--dt-text);
  }
  .dt-panel-copy {
    margin: 0.3rem 0 0;
    font-size: 0.9rem;
    color: var(--dt-subtle);
  }
  .dt-panel-status {
    padding: 0.3rem 0.65rem;
    border-radius: 999px;
    background: #e8f3ff;
    color: var(--dt-accent);
    font-size: 0.78rem;
    font-weight: 700;
  }
  .dt-region-surface {
    padding: 1rem;
    border: 1px dashed #c3d1e3;
    border-radius: 12px;
    background: linear-gradient(180deg, #fcfdff 0%, #f5f8fc 100%);
  }
</style>
<div class="dt-tabs-wrap" data-dynamic-template-tabs data-tabs-orientation="horizontal" data-tabs-position="start">
  <div class="dt-tabs-topbar">
    <div>
      <p class="dt-tabs-eyebrow">Account Workspace</p>
      <h3 class="dt-tabs-title">Customer Portfolio Overview</h3>
    </div>
    <span class="dt-tabs-meta">Updated 5 min ago</span>
  </div>
  <div class="dt-tab-headers" data-tab-list>
    <button type="button" class="dt-tab" data-tab data-tab-id="details">Profile</button>
    <button type="button" class="dt-tab" data-tab data-tab-id="history">Timeline</button>
    <button type="button" class="dt-tab" data-tab data-tab-id="attachments">Documents</button>
  </div>
  <section class="dt-tab-panel" data-tab-panel data-tab-id="details">
    <div class="dt-panel-header">
      <div>
        <h4 class="dt-panel-title">Relationship Summary</h4>
        <p class="dt-panel-copy">Key customer information presented in a clean review surface.</p>
      </div>
      <span class="dt-panel-status">Healthy</span>
    </div>
    <div class="dt-region-surface" data-region="A"></div>
  </section>
  <section class="dt-tab-panel" data-tab-panel data-tab-id="history">
    <div class="dt-panel-header">
      <div>
        <h4 class="dt-panel-title">Recent Activity</h4>
        <p class="dt-panel-copy">Operational events and servicing touchpoints for the account.</p>
      </div>
      <span class="dt-panel-status">13 events</span>
    </div>
    <div class="dt-region-surface" data-region="B"></div>
  </section>
  <section class="dt-tab-panel" data-tab-panel data-tab-id="attachments">
    <div class="dt-panel-header">
      <div>
        <h4 class="dt-panel-title">Supporting Files</h4>
        <p class="dt-panel-copy">Reference documents grouped into a dedicated, audit-friendly panel.</p>
      </div>
      <span class="dt-panel-status">Secure</span>
    </div>
    <div class="dt-region-surface" data-region="C"></div>
  </section>
</div>
`;

/** Tab layout: vertical, tabs at start (left). */
const TAB_LAYOUT_VERTICAL_HTML = `
<style>
  .dt-tabs-vertical {
    --dt-rail: #16324f;
    --dt-rail-accent: #8bd3ff;
    --dt-panel: #ffffff;
    --dt-border: #d6dde8;
    display: flex;
    min-height: 280px;
    border: 1px solid #c9d5e4;
    border-radius: 20px;
    overflow: hidden;
    background: #edf3f9;
    box-shadow: 0 20px 44px rgba(15, 23, 42, 0.08);
  }
  .dt-tabs-vertical .dt-rail {
    width: 220px;
    padding: 1.1rem;
    background: linear-gradient(180deg, #183754 0%, #10253b 100%);
    color: #e8f1fa;
  }
  .dt-rail-label {
    margin: 0 0 0.25rem;
    font-size: 0.74rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(232, 241, 250, 0.72);
  }
  .dt-rail-title {
    margin: 0 0 1rem;
    font-size: 1.1rem;
    font-weight: 700;
    color: #ffffff;
  }
  .dt-tabs-vertical [data-tab-list] {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }
  .dt-tabs-vertical [data-tab-list] .dt-tab {
    min-width: 120px;
    padding: 0.85rem 0.95rem;
    text-align: left;
    border: 1px solid rgba(139, 211, 255, 0.18);
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.05);
    color: #d7e5f2;
    font-weight: 700;
  }
  .dt-tabs-vertical [data-tab-list] .dt-tab[aria-selected="true"] {
    background: rgba(139, 211, 255, 0.18);
    color: #ffffff;
    border-color: rgba(139, 211, 255, 0.4);
    box-shadow: inset 3px 0 0 var(--dt-rail-accent);
  }
  .dt-rail-note {
    margin: 1rem 0 0;
    font-size: 0.82rem;
    line-height: 1.45;
    color: rgba(232, 241, 250, 0.72);
  }
  .dt-tab-panel-v {
    flex: 1;
    margin: 0;
    padding: 1.25rem;
    background: linear-gradient(180deg, #f7fafd 0%, #eff4f9 100%);
  }
  .dt-panel-shell {
    height: 100%;
    padding: 1.1rem;
    border: 1px solid var(--dt-border);
    border-radius: 16px;
    background: var(--dt-panel);
  }
  .dt-panel-shell h4 {
    margin: 0 0 0.35rem;
    font-size: 1rem;
    color: #1f2937;
  }
  .dt-panel-shell p {
    margin: 0 0 1rem;
    color: #5b6472;
    font-size: 0.9rem;
  }
  .dt-panel-shell [data-region] {
    padding: 1rem;
    border-radius: 12px;
    border: 1px dashed #bfd0e0;
    background: #fbfdff;
  }
</style>
<div class="dt-tabs-vertical" data-dynamic-template-tabs data-tabs-orientation="vertical" data-tabs-position="start">
  <aside class="dt-rail">
    <p class="dt-rail-label">Operations Console</p>
    <h3 class="dt-rail-title">Case Workspace</h3>
    <div data-tab-list>
      <button type="button" class="dt-tab" data-tab data-tab-id="v-details">Overview</button>
      <button type="button" class="dt-tab" data-tab data-tab-id="v-history">Approvals</button>
      <button type="button" class="dt-tab" data-tab data-tab-id="v-attachments">Supporting Data</button>
    </div>
    <p class="dt-rail-note">A left navigation pattern for analyst or operations-heavy workflows.</p>
  </aside>
  <section class="dt-tab-panel-v" data-tab-panel data-tab-id="v-details">
    <div class="dt-panel-shell">
      <h4>Case Overview</h4>
      <p>High-signal details are surfaced in a spacious content area to reduce scanning effort.</p>
      <div data-region="A"></div>
    </div>
  </section>
  <section class="dt-tab-panel-v" data-tab-panel data-tab-id="v-history">
    <div class="dt-panel-shell">
      <h4>Approval Trail</h4>
      <p>Designed for step review, sign-off context, and downstream decisions.</p>
      <div data-region="B"></div>
    </div>
  </section>
  <section class="dt-tab-panel-v" data-tab-panel data-tab-id="v-attachments">
    <div class="dt-panel-shell">
      <h4>Reference Data</h4>
      <p>Secondary information remains available without competing with the main workspace.</p>
      <div data-region="C"></div>
    </div>
  </section>
</div>
`;

/** Tab layout: horizontal with tabs at end (bottom). */
const TAB_LAYOUT_HORIZONTAL_END_HTML = `
<style>
  .dt-tabs-end {
    --dt-border: #d8dee8;
    --dt-surface: #ffffff;
    --dt-muted: #5f6b7a;
    min-height: 240px;
    padding: 1.25rem;
    border: 1px solid var(--dt-border);
    border-radius: 20px;
    background: linear-gradient(180deg, #fffdf8 0%, #f5f1e6 100%);
    box-shadow: 0 18px 40px rgba(65, 39, 7, 0.08);
  }
  .dt-review-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .dt-review-header h3 {
    margin: 0;
    font-size: 1.15rem;
    color: #2f2418;
  }
  .dt-review-header p {
    margin: 0.35rem 0 0;
    color: var(--dt-muted);
    font-size: 0.9rem;
  }
  .dt-review-badge {
    padding: 0.4rem 0.7rem;
    border-radius: 999px;
    background: #e9dcc3;
    color: #6f4e1e;
    font-size: 0.78rem;
    font-weight: 700;
  }
  .dt-tab-panel-e {
    border: 1px solid var(--dt-border);
    border-radius: 16px;
    padding: 1.15rem;
    background: var(--dt-surface);
    min-height: 140px;
  }
  .dt-tab-panel-e h4 {
    margin: 0 0 0.3rem;
    font-size: 1rem;
    color: #2f2418;
  }
  .dt-tab-panel-e p {
    margin: 0 0 0.9rem;
    color: var(--dt-muted);
    font-size: 0.9rem;
  }
  .dt-tab-panel-e [data-region] {
    padding: 1rem;
    border-radius: 12px;
    background: #fcfaf5;
    border: 1px dashed #d8c9ae;
  }
  .dt-tabs-end [data-tab-list] {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
    margin-top: 1rem;
  }
  .dt-tabs-end [data-tab] {
    position: relative;
    padding: 0.85rem 1rem;
    border: 1px solid #d9cfbf;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.72);
    color: #6b5a43;
    font-weight: 700;
    text-align: left;
  }
  .dt-tabs-end [data-tab][aria-selected="true"] {
    background: #fffdf9;
    color: #2f2418;
    border-color: #b9935a;
    box-shadow: 0 10px 20px rgba(111, 78, 30, 0.12);
  }
  .dt-tabs-end [data-tab][aria-selected="true"]::before {
    content: '';
    position: absolute;
    left: 1rem;
    right: 1rem;
    top: -1px;
    height: 3px;
    border-radius: 999px;
    background: linear-gradient(90deg, #c7a56b 0%, #8f6a37 100%);
  }
</style>
<div class="dt-tabs-end" data-dynamic-template-tabs data-tabs-orientation="horizontal" data-tabs-position="end">
  <div class="dt-review-header">
    <div>
      <h3>Review Workspace</h3>
      <p>Content-first layout with the navigation anchored at the bottom like a decision tray.</p>
    </div>
    <span class="dt-review-badge">Pending decision</span>
  </div>
  <div data-tab-list>
    <button type="button" data-tab data-tab-id="e1">Executive Summary</button>
    <button type="button" data-tab data-tab-id="e2">Reviewer Notes</button>
  </div>
  <section class="dt-tab-panel-e" data-tab-panel data-tab-id="e1">
    <h4>Summary Brief</h4>
    <p>The primary review content sits above the navigation for a report-like reading flow.</p>
    <div data-region="A"></div>
  </section>
  <section class="dt-tab-panel-e" data-tab-panel data-tab-id="e2">
    <h4>Decision Notes</h4>
    <p>Secondary commentary remains close to the action area without dominating the screen.</p>
    <div data-region="B"></div>
  </section>
</div>
`;

/** Tab layout: vertical with tabs at end (right). */
const TAB_LAYOUT_VERTICAL_END_HTML = `
<style>
  .dt-tabs-ve {
    min-height: 260px;
    border: 1px solid #d6dfeb;
    border-radius: 20px;
    overflow: hidden;
    background: #f4f7fb;
    box-shadow: 0 18px 40px rgba(12, 32, 58, 0.09);
  }
  .dt-tabs-ve [data-tab-panel] {
    margin: 0;
    padding: 1.25rem;
    background: linear-gradient(180deg, #f8fbff 0%, #eef4fb 100%);
  }
  .dt-inspector-shell {
    height: 100%;
    padding: 1.15rem;
    border: 1px solid #d2ddea;
    border-radius: 16px;
    background: #ffffff;
  }
  .dt-inspector-shell h4 {
    margin: 0 0 0.3rem;
    font-size: 1rem;
    color: #14324a;
  }
  .dt-inspector-shell p {
    margin: 0 0 1rem;
    font-size: 0.9rem;
    color: #5a6674;
  }
  .dt-inspector-shell [data-region] {
    padding: 1rem;
    border-radius: 12px;
    border: 1px dashed #bdd0e2;
    background: #fbfdff;
  }
  .dt-tabs-ve [data-tab-list] {
    width: 220px;
    padding: 1rem;
    background: linear-gradient(180deg, #ffffff 0%, #edf3fb 100%);
    border-left: 1px solid #d6dfeb;
  }
  .dt-inspector-title {
    margin: 0 0 0.9rem;
    font-size: 0.9rem;
    font-weight: 700;
    color: #36506a;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .dt-tabs-ve [data-tab] {
    width: 100%;
    margin-bottom: 0.6rem;
    padding: 0.85rem 0.95rem;
    border: 1px solid #d4e0ee;
    border-radius: 14px;
    background: #ffffff;
    color: #435465;
    font-weight: 700;
    text-align: left;
  }
  .dt-tabs-ve [data-tab][aria-selected="true"] {
    background: linear-gradient(180deg, #eff7ff 0%, #dfeeff 100%);
    color: #0f5ea8;
    border-color: #9ec3e8;
    box-shadow: 0 10px 20px rgba(15, 94, 168, 0.12);
  }
</style>
<div class="dt-tabs-ve" data-dynamic-template-tabs data-tabs-orientation="vertical" data-tabs-position="end">
  <div data-tab-list>
    <p class="dt-inspector-title">Inspector Panel</p>
    <button type="button" data-tab data-tab-id="ve1">Account Details</button>
    <button type="button" data-tab data-tab-id="ve2">Next Actions</button>
  </div>
  <section data-tab-panel data-tab-id="ve1">
    <div class="dt-inspector-shell">
      <h4>Primary Record Context</h4>
      <p>A right-hand inspector pattern that keeps the main workspace unobstructed.</p>
      <div data-region="A"></div>
    </div>
  </section>
  <section data-tab-panel data-tab-id="ve2">
    <div class="dt-inspector-shell">
      <h4>Action Checklist</h4>
      <p>Follow-up steps and controls live in a dedicated side panel treatment.</p>
      <div data-region="B"></div>
    </div>
  </section>
</div>
`;
type Story = StoryObj<typeof PegaExtensionsDynamicTemplate>;

export const Default: Story = {
  args: {
    HTMLContent: DEFAULT_HTML_CONTENT,
  },
  render: (args) => <PegaExtensionsDynamicTemplate {...args} getPConnect={getPConnect} />,
};

export const WithCustomLayout: Story = {
  args: {
    HTMLContent: CUSTOM_LAYOUT_HTML,
  },
  render: (args) => <PegaExtensionsDynamicTemplate {...args} getPConnect={getPConnect} />,
};

export const EmptyHTMLUsesDefaultSlots: Story = {
  args: {
    HTMLContent: '',
  },
  render: (args) => <PegaExtensionsDynamicTemplate {...args} getPConnect={getPConnect} />,
};

export const TabLayoutHorizontal: Story = {
  args: {
    HTMLContent: TAB_LAYOUT_HORIZONTAL_HTML,
  },
  render: (args) => <PegaExtensionsDynamicTemplate {...args} getPConnect={getPConnect} />,
};

export const TabLayoutVertical: Story = {
  args: {
    HTMLContent: TAB_LAYOUT_VERTICAL_HTML,
  },
  render: (args) => <PegaExtensionsDynamicTemplate {...args} getPConnect={getPConnect} />,
};

export const TabLayoutHorizontalEnd: Story = {
  args: {
    HTMLContent: TAB_LAYOUT_HORIZONTAL_END_HTML,
  },
  render: (args) => <PegaExtensionsDynamicTemplate {...args} getPConnect={getPConnect} />,
};

export const TabLayoutVerticalEnd: Story = {
  args: {
    HTMLContent: TAB_LAYOUT_VERTICAL_END_HTML,
  },
  render: (args) => <PegaExtensionsDynamicTemplate {...args} getPConnect={getPConnect} />,
};
