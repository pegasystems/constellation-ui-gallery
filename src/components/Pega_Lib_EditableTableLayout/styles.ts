import styled, { css } from 'styled-components';

export default styled.div(() => {
  return css`
    overflow: auto;
    & table {
      border-collapse: collapse;
      border: 0.0625rem solid rgb(207, 207, 207);
    }

    & th {
      outline: 0.0625rem solid rgb(207, 207, 207);
      border: none;
      padding: 0.25rem 0.5rem;
      min-width: 30ch;
      background: #ffffff;
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
      z-index: 20;
    }

    & td {
      outline: 0.0625rem solid rgb(207, 207, 207);
      background: #ffffff;
      padding: 0.25rem 0.5rem;
    }

    & caption {
      padding: 0.5rem;
      text-align: start;
      height: 2rem;
    }

    & caption > h3 {
      position: absolute;
      left: 1rem;
      top: 1rem;
    }
  `;
});
