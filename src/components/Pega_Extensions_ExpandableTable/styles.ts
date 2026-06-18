import styled, { css } from 'styled-components';

export default styled.div(() => {
  return css`
    overflow: auto;

    & > table {
      border-collapse: collapse;
      border: 0.0625rem solid rgb(207, 207, 207);
      width: 100%;
    }

    & th {
      outline: 0.0625rem solid rgb(207, 207, 207);
      border: none;
      padding: 0.25rem 0.5rem;
      min-width: 20ch;
      background: #ffffff;
    }

    & th:first-child {
      min-width: 0;
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

    & tr > th:first-child {
      position: sticky;
      top: 0;
      left: 0;
      z-index: 20;
    }

    & tr > td:first-child {
      position: sticky;
      left: 0;
      z-index: 10;
    }

    & td {
      outline: 0.0625rem solid rgb(207, 207, 207);
      background: #ffffff;
      padding: 0.25rem 0.5rem;
      vertical-align: middle;
    }

    & tr.expandable-detail-row > td {
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
