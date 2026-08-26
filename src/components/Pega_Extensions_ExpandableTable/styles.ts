import { type themeDefinition } from '@pega/cosmos-react-core';
import styled, { css } from 'styled-components';

export default styled.div(({ theme }: { theme: typeof themeDefinition }) => {
  const borderColor = theme.base.palette['border-line'];
  const surface = theme.base.palette['primary-background'];
  const mutedSurface = theme.base.palette['secondary-background'];
  const interactive = theme.base.palette.interactive;
  const foreground = theme.base.palette['foreground-color'];
  const spacing = theme.base.spacing;

  return css`
    /* stylelint-disable unit-allowed-list */
    overflow: auto;

    /* Scope to direct child table so nested ExpandableTables are not affected by this wrapper */
    & > table {
      border-collapse: collapse;
      border: 0.0625rem solid ${borderColor};
      width: 100%;
      table-layout: fixed;
    }

    & > table > colgroup > col.expand-col {
      width: 3rem;
    }

    & > table > colgroup > col.checkbox-col {
      width: 2.5rem;
    }

    & > table th {
      outline: 0.0625rem solid ${borderColor};
      border: none;
      padding: 0.25rem 0.5rem;
      background: ${surface};
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    & > table th.checkbox-col,
    & > table td.checkbox-col {
      padding: 0.25rem;
      text-align: center;
      overflow: hidden;
    }

    /* Hide caption text only — keep label font-size so Cosmos checkmark (em borders) still renders */
    & > table td.checkbox-col .checkbox-col-caption {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    & > table td.checkbox-col label {
      min-height: 0;
      gap: 0;
      width: fit-content;
      max-width: 100%;
    }

    & > table td.checkbox-col label > div {
      margin-inline-end: 0;
      flex: none;
      aspect-ratio: 1;
    }

    & > table td.checkbox-col > div {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0;
      min-height: 0;
      width: fit-content;
      max-width: 100%;
    }

    & > table td.checkbox-col [data-testid=':form-field:info'] {
      display: none;
    }

    & .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    & > table tr > th:first-child {
      position: sticky;
      top: 0;
      left: 0;
      z-index: 20;
    }

    & > table tr > td:first-child {
      position: sticky;
      left: 0;
      z-index: 10;
      background: ${surface};
    }

    & > table td:first-child button {
      padding: 0;
    }

    & > table td {
      outline: 0.0625rem solid ${borderColor};
      background: ${surface};
      padding: 0.25rem 0.5rem;
      vertical-align: middle;
    }

    & > table tr.expandable-detail-row > td {
      background: ${mutedSurface};
      padding: 1rem;
      border-top: 0.125rem solid ${borderColor};
    }

    & > table > caption {
      padding: 0.5rem;
      text-align: start;
    }

    /* List / tabs expandable row layout (screenshot-style accordion) */
    & .expandable-list {
      display: flex;
      flex-direction: column;
      gap: calc(0.5 * ${spacing});
      width: 100%;
    }

    & .expandable-list-item {
      border: 0.0625rem solid ${borderColor};
      background: ${mutedSurface};
      border-radius: ${theme.base['border-radius']};
    }

    & .expandable-list-item__toolbar {
      display: flex;
      align-items: center;
      gap: calc(0.25 * ${spacing});
      padding-inline-end: calc(0.5 * ${spacing});
    }

    & .expandable-list-item__header {
      display: flex;
      align-items: center;
      gap: ${spacing};
      width: 100%;
      padding: calc(0.75 * ${spacing}) ${spacing};
      background: transparent;
      border: none;
      text-align: start;
      cursor: pointer;
      color: ${foreground};
      font: inherit;
    }

    & .expandable-list-item__header:focus-visible {
      outline: 0.125rem solid ${interactive};
      outline-offset: -0.125rem;
    }

    & .expandable-list-item__title {
      flex: 1;
      font-weight: ${theme.base['font-weight']['semi-bold']};
      color: ${foreground};
    }

    & .expandable-list-item__help {
      flex: none;
      color: ${interactive};
    }

    & .expandable-list-item__body {
      padding: 0 ${spacing} ${spacing};
      border-top: 0.0625rem solid ${borderColor};
      background: ${surface};
    }

    /* Tabs variant: filled active tab matching category checklist design */
    &.variant-tabs {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    &.variant-tabs .tabs-heading {
      margin-block-end: ${spacing};
    }

    &.variant-tabs [role='tablist'] {
      gap: calc(0.25 * ${spacing});
      border-block-end: none;
    }

    &.variant-tabs [role='tab'] {
      text-transform: uppercase;
      letter-spacing: 0.02em;
      border: 0.0625rem solid ${borderColor};
      border-block-end: none;
      border-start-start-radius: ${theme.base['border-radius']};
      border-start-end-radius: ${theme.base['border-radius']};
      background: ${mutedSurface};
      color: ${foreground};
      height: auto;
      min-height: calc(3 * ${spacing});
      padding: calc(0.75 * ${spacing}) calc(1.25 * ${spacing});
    }

    &.variant-tabs [role='tab']::after,
    &.variant-tabs [role='tab']::before {
      display: none !important;
    }

    &.variant-tabs [role='tab'][aria-selected='true'] {
      background: ${interactive};
      border-color: ${interactive};
      color: ${surface};
    }

    &.variant-tabs [role='tab'][aria-selected='true'] span {
      color: ${surface};
    }

    &.variant-tabs .tabs-panel-container {
      border: 0.0625rem solid ${borderColor};
      background: ${theme.base.palette['app-background']};
      padding: ${spacing};
      border-end-start-radius: ${theme.base['border-radius']};
      border-end-end-radius: ${theme.base['border-radius']};
    }
  `;
});
