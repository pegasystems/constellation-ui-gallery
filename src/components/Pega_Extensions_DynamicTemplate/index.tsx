import { Children, useRef, useLayoutEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import DOMPurify from 'dompurify';
import styled from 'styled-components';
import { withConfiguration } from '@pega/cosmos-react-core';
import { wireTemplateLayout } from './constellation-template-runtime';
import '../shared/create-nonce';

const REGION_NAMES = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

const DEFAULT_LAYOUT_HTML = `
<div class="dynamic-template-default-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
  <div data-region="A" style="min-height: 2rem;">Region A</div>
  <div data-region="B" style="min-height: 2rem;">Region B</div>
  <div data-region="C" style="min-height: 2rem;">Region C</div>
  <div data-region="D" style="min-height: 2rem;">Region D</div>
  <div data-region="E" style="min-height: 2rem;">Region E</div>
  <div data-region="F" style="min-height: 2rem;">Region F</div>
</div>
`;

/** Extract all <style> tag contents and HTML without style tags (for full doc: body inner HTML). */
function extractCssAndHtml(html: string): { css: string; html: string } {
  const trimmed = html.trim();
  const isFullDoc = /^\s*<!DOCTYPE\s/i.test(trimmed) || /^\s*<html[\s>]/i.test(trimmed);

  const styleRe = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  const cssParts: string[] = [];
  let match = styleRe.exec(trimmed);
  while (match) {
    cssParts.push(match[1].trim());
    match = styleRe.exec(trimmed);
  }
  const css = cssParts.join('\n\n');

  let htmlOnly: string;
  if (isFullDoc) {
    const bodyMatch = trimmed.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    htmlOnly = bodyMatch ? bodyMatch[1].trim() : trimmed;
  } else {
    htmlOnly = trimmed;
  }

  if (typeof DOMParser !== 'undefined') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlOnly, 'text/html');
    doc.querySelectorAll('style').forEach((styleEl) => {
      styleEl.remove();
    });
    htmlOnly = doc.body ? doc.body.innerHTML.trim() : htmlOnly;
  } else {
    if (typeof DOMPurify !== 'undefined' && DOMPurify.sanitize) {
      htmlOnly = DOMPurify.sanitize(htmlOnly, { FORBID_TAGS: ['style'] });
    }
    htmlOnly = htmlOnly.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').trim();
  }

  return { css, html: htmlOnly };
}

/**
 * Clears the inner content of every element with data-region in the HTML string.
 * Placeholder text in the template is removed so that at runtime only the portaled
 * region children (from view JSON) are shown.
 */
function clearRegionPlaceholderContent(html: string): string {
  if (typeof DOMParser === 'undefined') return html;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  doc.querySelectorAll('[data-region]').forEach((el) => {
    el.innerHTML = '';
  });
  return doc.body.innerHTML;
}

/** Scope template CSS: apply body rules to the wrapper so they take effect inside the component. */
function scopeTemplateCss(css: string): string {
  if (!css.trim()) return '';
  return css.replace(/\bbody\s*\{/gi, '& {');
}

function sanitizeHtml(html: string): string {
  if (typeof DOMPurify === 'undefined' || !DOMPurify.sanitize) {
    return html;
  }
  return DOMPurify.sanitize(html, {
    ADD_ATTR: ['data-region'],
    ALLOWED_TAGS: [
      'div',
      'span',
      'section',
      'aside',
      'main',
      'header',
      'footer',
      'article',
      'nav',
      'p',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'a',
      'ul',
      'ol',
      'li',
      'strong',
      'em',
      'template',
      'button',
    ],
    ALLOWED_ATTR: [
      'class',
      'id',
      'style',
      'data-region',
      'href',
      'target',
      'rel',
      'data-dynamic-template-tabs',
      'data-tabs-orientation',
      'data-tabs-position',
      'data-tab-list',
      'data-tab',
      'data-tab-id',
      'data-tab-panel',
      'data-active-tab',
      'data-dynamic-template-accordion',
      'data-accordion-type',
      'data-accordion-open',
      'data-accordion-item',
      'data-accordion-id',
      'data-accordion-trigger',
      'data-accordion-content',
      'data-state',
      'data-dynamic-template-split',
      'data-split-orientation',
      'data-split-initial',
      'data-split-panel',
      'data-split-handle',
      'role',
      'aria-selected',
      'aria-controls',
      'aria-labelledby',
      'aria-expanded',
      'aria-orientation',
      'tabindex',
    ],
  });
}

const TAB_LAYOUT_CSS = `
  [data-dynamic-template-tabs] {
    display: flex;
    gap: 0.5rem;
    min-height: 120px;
  }
  [data-dynamic-template-tabs][data-tabs-orientation="horizontal"][data-tabs-position="start"] {
    flex-direction: column;
  }
  [data-dynamic-template-tabs][data-tabs-orientation="horizontal"][data-tabs-position="end"] {
    flex-direction: column-reverse;
  }
  [data-dynamic-template-tabs][data-tabs-orientation="vertical"][data-tabs-position="start"] {
    flex-direction: row;
  }
  [data-dynamic-template-tabs][data-tabs-orientation="vertical"][data-tabs-position="end"] {
    flex-direction: row-reverse;
  }
  [data-tab-list] {
    display: flex;
    gap: 0.25rem;
    flex-shrink: 0;
  }
  [data-dynamic-template-tabs][data-tabs-orientation="vertical"] [data-tab-list] {
    flex-direction: column;
  }
  [data-tab][role="tab"] {
    padding: 0.5rem 0.75rem;
    border: 1px solid #e5e7eb;
    background: #f9fafb;
    border-radius: 4px;
    cursor: pointer;
    font: inherit;
  }
  [data-tab][role="tab"]:hover {
    background: #f3f4f6;
  }
  [data-tab][role="tab"][aria-selected="true"] {
    background: #fff;
    border-color: #3b82f6;
    font-weight: 500;
  }
  [data-tab-panel] {
    flex: 1;
    min-width: 0;
    min-height: 0;
  }
  [data-tab-panel][hidden] {
    display: none !important;
  }
`;

const StyledTemplateWrapper = styled.div<{ $injectedCss?: string }>`
  ${TAB_LAYOUT_CSS}
  ${(props) => props.$injectedCss ?? ''}
`;

type PortalTarget = { name: string; element: HTMLElement };

type RegionChild = React.ReactNode;
type Region = { name?: string; children?: RegionChild[] };

type DynamicTemplateProps = {
  HTMLContent?: string;
  getPConnect?: () => {
    getRawMetadata?: () => { children?: Array<{ name?: string; children?: unknown[] }> };
    getChildren?: () => Region[];
  };
  children?: React.ReactNode;
};

export const PegaExtensionsDynamicTemplate = (props: DynamicTemplateProps) => {
  const { HTMLContent = '', getPConnect } = props;
  const layoutRef = useRef<HTMLDivElement>(null);
  const [portalTargets, setPortalTargets] = useState<PortalTarget[]>([]);

  const regionMap = useMemo(() => {
    const map: Record<string, React.ReactNode> = {};
    if (!getPConnect) return map;

    const pConnect = getPConnect();
    const rawMetadata = pConnect?.getRawMetadata?.();
    const regionsFromConnect = pConnect?.getChildren?.() ?? [];
    if (!Array.isArray(regionsFromConnect)) return map;

    const childArray = Children.toArray(props.children ?? []);

    // Constellation passes one React child per region (aligned with metadata). Storybook/tests
    // often mock regions only via getChildren() with no props.children.
    if (childArray.length === 0) {
      for (let i = 0; i < regionsFromConnect.length; i++) {
        const region = regionsFromConnect[i] as Region;
        const name = region?.name ?? rawMetadata?.children?.[i]?.name ?? '';
        if (!name || !REGION_NAMES.includes(name as (typeof REGION_NAMES)[number])) continue;
        map[name] = <>{region?.children}</>;
      }
      return map;
    }

    for (let i = 0; i < regionsFromConnect.length; i++) {
      const name = rawMetadata?.children?.[i]?.name || '';
      if (!name || !REGION_NAMES.includes(name as (typeof REGION_NAMES)[number])) continue;
      map[name] = <>{childArray[i]}</>;
    }

    return map;
  }, [getPConnect, props.children]);

  const { sanitizedHtml, scopedCss } = useMemo(() => {
    const raw = (HTMLContent || '').trim();
    if (!raw) {
      return {
        sanitizedHtml: sanitizeHtml(DEFAULT_LAYOUT_HTML),
        scopedCss: '',
      };
    }
    const { css, html } = extractCssAndHtml(raw);
    const htmlToRender = html || DEFAULT_LAYOUT_HTML;
    const htmlWithEmptyRegions = clearRegionPlaceholderContent(htmlToRender);
    return {
      sanitizedHtml: sanitizeHtml(htmlWithEmptyRegions),
      scopedCss: scopeTemplateCss(css),
    };
  }, [HTMLContent]);

  useLayoutEffect(() => {
    const container = layoutRef.current;
    if (!container) return;

    const slots = container.querySelectorAll('[data-region]');
    const targets: PortalTarget[] = [];
    slots.forEach((element) => {
      const regionName = element.getAttribute('data-region');
      if (regionName && regionMap[regionName] != null) {
        targets.push({ name: regionName, element: element as HTMLElement });
      }
    });
    setPortalTargets(targets);
  }, [sanitizedHtml, regionMap]);

  useLayoutEffect(() => {
    const layoutEl = layoutRef.current;
    if (!layoutEl) return;
    wireTemplateLayout(layoutEl);
  }, [sanitizedHtml, portalTargets]);

  return (
    <StyledTemplateWrapper className='pega-extensions-dynamic-template' $injectedCss={scopedCss}>
      <div
        ref={layoutRef}
        className='pega-extensions-dynamic-template-layout'
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
      {portalTargets.map((target) => createPortal(regionMap[target.name], target.element))}
    </StyledTemplateWrapper>
  );
};

export default withConfiguration(PegaExtensionsDynamicTemplate);
