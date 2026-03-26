/**
 * Template Runtime
 * Wires data-dynamic-template-tabs, data-dynamic-template-accordion, and
 * data-dynamic-template-split in the document.
 */
/* global document, sessionStorage */

const HANDLE_SIZE = 4;
const STORAGE_KEY_PREFIX = 'constellation-split-';

function wireTabs(root: Element | Document = document) {
  const wrappers = root.querySelectorAll('[data-dynamic-template-tabs]');
  wrappers.forEach(function (wrapper) {
    if (!wrapper.getAttribute('data-tabs-orientation')) wrapper.setAttribute('data-tabs-orientation', 'horizontal');
    if (!wrapper.getAttribute('data-tabs-position')) wrapper.setAttribute('data-tabs-position', 'start');
    const triggers = wrapper.querySelectorAll('[data-tab]');
    const panels = wrapper.querySelectorAll('[data-tab-panel]');
    if (triggers.length === 0 || panels.length === 0) return;
    const initialActive =
      wrapper.getAttribute('data-active-tab') || (triggers[0] && triggers[0].getAttribute('data-tab-id')) || '';
    let activeId = initialActive;
    const tabList = wrapper.querySelector('[data-tab-list]') || wrapper;
    if (!tabList.getAttribute('role')) tabList.setAttribute('role', 'tablist');
    function applyActive() {
      triggers.forEach(function (t) {
        const id = t.getAttribute('data-tab-id');
        const isSelected = id === activeId;
        t.setAttribute('role', 'tab');
        t.setAttribute('aria-selected', String(isSelected));
        const panel = Array.prototype.find.call(wrapper.querySelectorAll('[data-tab-panel]'), function (p) {
          return p.getAttribute('data-tab-id') === id;
        });
        if (panel) {
          const panelEl = panel as HTMLElement;
          const panelId = panelEl.id || 'dt-tabpanel-' + id + '-' + Math.random().toString(36).slice(2, 9);
          panelEl.id = panelId;
          t.setAttribute('aria-controls', panelId);
          panelEl.hidden = !isSelected;
        }
      });
    }
    applyActive();
    wrapper.addEventListener('click', function (e) {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const t = target.closest('[data-tab]');
      if (!t) return;
      const id = t.getAttribute('data-tab-id');
      if (id) {
        activeId = id;
        applyActive();
      }
    });
  });
}

function wireAccordion(root: Element | Document = document) {
  const wrappers = root.querySelectorAll('[data-dynamic-template-accordion]');
  wrappers.forEach(function (wrapper) {
    const type = wrapper.getAttribute('data-accordion-type') || 'single';
    const items = wrapper.querySelectorAll('[data-accordion-item]');
    const firstOpenId = wrapper.getAttribute('data-accordion-open') || null;
    items.forEach(function (item, idx) {
      const id = item.getAttribute('data-accordion-id') || 'acc-' + Math.random().toString(36).slice(2, 9);
      item.setAttribute('data-accordion-id', id);
      const trigger = item.querySelector('[data-accordion-trigger]');
      const content = item.querySelector('[data-accordion-content]') as HTMLElement | null;
      if (!trigger || !content) return;
      const panelId = 'dt-accordion-panel-' + id;
      if (!content.id) content.id = panelId;
      const isInitiallyOpen = firstOpenId === id || (!firstOpenId && idx === 0);
      content.hidden = !isInitiallyOpen;
      content.setAttribute('data-state', isInitiallyOpen ? 'open' : 'closed');
      trigger.setAttribute('aria-expanded', String(isInitiallyOpen));
      trigger.setAttribute('aria-controls', content.id);
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('tabindex', '0');
      trigger.addEventListener('click', function () {
        if (type === 'single') {
          wrapper.querySelectorAll('[data-accordion-content]').forEach(function (c) {
            (c as HTMLElement).hidden = true;
            c.setAttribute('data-state', 'closed');
          });
          wrapper.querySelectorAll('[data-accordion-trigger]').forEach(function (t) {
            t.setAttribute('aria-expanded', 'false');
          });
          content.hidden = false;
          content.setAttribute('data-state', 'open');
          trigger.setAttribute('aria-expanded', 'true');
        } else {
          const isOpen = !content.hidden;
          content.hidden = isOpen;
          content.setAttribute('data-state', content.hidden ? 'closed' : 'open');
          trigger.setAttribute('aria-expanded', String(!content.hidden));
        }
      });
    });
  });
}

function wireSplit(root: Element | Document = document) {
  const wrappers = root.querySelectorAll('[data-dynamic-template-split]');
  wrappers.forEach(function (wrapper) {
    const orientation = wrapper.getAttribute('data-split-orientation') || 'horizontal';
    const initialStr = wrapper.getAttribute('data-split-initial') || '280px 1fr 200px';
    const initial = initialStr.trim().split(/\s+/);
    const panels = Array.prototype.filter.call(wrapper.children, function (c) {
      return c.hasAttribute && c.hasAttribute('data-split-panel');
    });
    const handles = Array.prototype.filter.call(wrapper.children, function (c) {
      return c.hasAttribute && c.hasAttribute('data-split-handle');
    });
    if (panels.length < 2 || handles.length !== panels.length - 1) return;
    while (initial.length < panels.length) initial.push('1fr');
    const id = wrapper.id || 'split-' + Math.random().toString(36).slice(2, 11);
    wrapper.id = id;
    const storageKey = STORAGE_KEY_PREFIX + id;
    const isVertical = orientation === 'vertical';
    const buildTemplate = function (sizes: (string | number)[]) {
      const parts: string[] = [];
      sizes.forEach(function (s: string | number, i: number) {
        if (i > 0) parts.push(HANDLE_SIZE + 'px');
        parts.push(typeof s === 'number' ? s + 'px' : s);
      });
      return parts.join(' ');
    };
    const wrapperEl = wrapper as HTMLElement;
    wrapperEl.style.display = 'grid';
    wrapperEl.style.minHeight = '0';
    let saved = null;
    try {
      saved = sessionStorage.getItem(storageKey);
    } catch {
      /* sessionStorage unavailable (e.g. private mode) */
    }
    const sizes = saved ? JSON.parse(saved) : null;
    let template;
    if (sizes && sizes.length === panels.length) {
      template = buildTemplate(sizes);
    } else {
      template = buildTemplate(
        initial.map(function (s) {
          return s === '1fr' ? '1fr' : s;
        }),
      );
    }
    if (isVertical) wrapperEl.style.gridTemplateRows = template;
    else wrapperEl.style.gridTemplateColumns = template;
    handles.forEach(function (handle, hi) {
      const handleEl = handle as HTMLElement;
      handleEl.style.cursor = isVertical ? 'ns-resize' : 'ew-resize';
      handleEl.style.background = 'transparent';
      handle.setAttribute('role', 'separator');
      handle.setAttribute('aria-orientation', isVertical ? 'vertical' : 'horizontal');
      function getCurrentSizes(): number[] {
        const arr: number[] = [];
        for (let i = 0; i < panels.length; i++) {
          const r = panels[i].getBoundingClientRect();
          arr.push(isVertical ? r.height : r.width);
        }
        return arr;
      }
      function setSizes(newSizes: number[]) {
        const gridTemplate = buildTemplate(newSizes);
        if (isVertical) wrapperEl.style.gridTemplateRows = gridTemplate;
        else wrapperEl.style.gridTemplateColumns = gridTemplate;
        try {
          sessionStorage.setItem(storageKey, JSON.stringify(newSizes));
        } catch {
          /* sessionStorage unavailable */
        }
      }
      handle.addEventListener('mousedown', function (e: MouseEvent) {
        e.preventDefault();
        const startPos = isVertical ? e.clientY : e.clientX;
        const startSizes = getCurrentSizes();
        function onMove(e: MouseEvent) {
          const pos = isVertical ? e.clientY : e.clientX;
          const delta = pos - startPos;
          const leftIdx = hi;
          const rightIdx = hi + 1;
          const leftSize = startSizes[leftIdx];
          const rightSize = startSizes[rightIdx];
          const min = 120;
          const newLeft = Math.min(Math.max(leftSize + delta, min), leftSize + rightSize - min);
          const newRight = leftSize + rightSize - newLeft;
          const next = startSizes.slice();
          next[leftIdx] = newLeft;
          next[rightIdx] = newRight;
          setSizes(next);
        }
        function onUp() {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
        }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });
    });
  });
}

/**
 * Wires tabs, accordion, and split layout behavior within the given root (default: document).
 */
export function wireTemplateLayout(root: Element | Document = document): void {
  wireTabs(root);
  wireAccordion(root);
  wireSplit(root);
}
