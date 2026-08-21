import styled, { css } from 'styled-components';

export default styled.div(() => {
  return css`
    overflow: auto;

    /* Scope to direct child table so nested ExpandableTables are not affected by this wrapper */
    & > table {
      border-collapse: collapse;
      border: 0.0625rem solid rgb(207, 207, 207);
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
      outline: 0.0625rem solid rgb(207, 207, 207);
      border: none;
      padding: 0.25rem 0.5rem;
      background: #ffffff;
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

    /* stylelint-disable unit-allowed-list */
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
    }

    & > table td:first-child button {
      padding: 0;
    }

    & > table td {
      outline: 0.0625rem solid rgb(207, 207, 207);
      background: #ffffff;
      padding: 0.25rem 0.5rem;
      vertical-align: middle;
    }

    & > table tr.expandable-detail-row > td {
      background: #f5f7fa;
      padding: 1rem;
      border-top: 0.125rem solid rgb(207, 207, 207);
    }

    & > table > caption {
      padding: 0.5rem;
      text-align: start;
    }
  `;
});
